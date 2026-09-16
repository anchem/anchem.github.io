---
sidebar_position: 3
title: 文件描述符运维指南
description: 面向服务器运维的 Linux 文件描述符（句柄）专题：fd 的核心概念与三层限制，ulimit、lsof、/proc、ss 等常用命令与输出解读，句柄耗尽的成因、排查流程，以及系统级与进程级限制的查看与调整和预防措施。
tags:
  - '运维'
  - 'Linux 服务器维护'
keywords: [linux, 文件描述符, 句柄, fd, file descriptor, ulimit, nofile, lsof, /proc, too many open files, 句柄泄漏]
---

# Linux 文件描述符运维指南

## 开始之前

### 三大模块，按需学习

站点内容围绕「文件描述符（句柄）耗尽」这一主题，分为三个循序渐进的部分。基础薄弱可以直接按顺序学，有经验的朋友可以跳过概念直接看命令或排查。

| 模块 | 内容 | 章节入口 |
| --- | --- | --- |
| 01 · 基础入门 | 句柄是什么、fd 的分配规则、限制的三层结构、泄漏是怎么发生的、常见误区 | [句柄核心概念](#fd-concepts) |
| 02 · 命令实战 | ulimit、prlimit、/proc、lsof、ss、systemd 逐命令拆解：怎么用、输出每列代表什么 | [命令总览](#commands) |
| 03 · 排查与解决 | 从「Too many open files」到「找到根因」的完整排查流程、成因特征对照表、限制调整与预防 | [句柄耗尽排查流程](#diagnosis) · [限制调整](#solutions) |
| 04 · 实战提升 | 四个真实案例走完「报警 → 定位 → 处置」全流程；系统间交互案例专章；进阶工具与监控对接 | [典型案例库](#cases) · [交互型案例](#cases-interaction) · [进阶工具与实践](#advanced) |

### 新手学习路线

如果完全没接触过服务器排查，建议按下面的顺序走一遍，大半天就能掌握核心思路：

1. **先懂概念，不背命令** — 花一小时读「句柄核心概念」。重点是理解「**fd 只是一个编号**」「**一切资源都占用 fd**」「**限制有系统级和进程级两层**」这三件事。概念不懂，`ulimit -n` 后面的数字只是天书。
2. **学 lsof，先会看全局** — lsof 是这个领域最常用的命令。学会用它回答「这个进程打开了什么」，日常 80% 的场景就够了。
3. **再学 ulimit / prlimit / /proc** — 这些命令回答「上限是多少、现在用了多少、改在哪里生效」。**句柄问题十有八九是「上限没配对」，不是「真的泄漏」**，所以这一课必须补。
4. **套用排查流程，动手解决** — 按「句柄耗尽排查流程」里的步骤，拿一台测试机动手改一遍 `ulimit`，观察 `ulimit -n` 的变化，把「改了不生效」这个坑亲手踩一次。
5. **把「速查表」收藏起来** — 上手后不需要整本翻阅，出问题时直接翻「速查表」，场景 → 命令 → 关注指标，一分钟找到下一步。

:::warning 阅读提醒

文中给出的指标参考值（如「fd 使用率超过 80% 关注」）都是**经验阈值**，不同业务差异极大——一个 Nginx 网关和一批定时脚本的 fd 规模完全不是一个量级。真正可靠的判断依据是**和你这台机器自己的历史基线对比**，以及**看增长趋势是平稳还是单调向上**。

:::

## 第一部分 基础入门 {#part-basics}

### 句柄核心概念 {#fd-concepts}

这一章解决「看不懂」的问题。我们会把 `ulimit`、`lsof`、`/proc/PID/limits` 里那些名词——文件描述符、软限制、硬限制、nofile——用大白话讲清楚，最后澄清几个新手最容易犯的认知误区。

#### 文件描述符是干什么的

延续 CPU 的比喻：服务器是一家**工厂**，内存是仓库、磁盘是货架、网络是物流、**CPU 是工人**。那么进程要干活，就得**从仓库里取东西**——取文件、取网络连接、取管道。

问题的关键是：进程不能直接伸手去仓库里乱翻。它必须先在**内核那里登记领一张「取料单」**，单子上印着一个编号。之后它每次要操作这个资源，都只说这个编号，内核按编号去把真正的东西递给它。

**这个编号，就是文件描述符（File Descriptor，简称 fd）**。中文语境里常说的「**句柄**」，在 Linux 上基本就是它（Windows 叫 handle，概念相通）。

:::tip 运维关心什么

运维关心的问题就三个：**这台机器/这个进程领了多少张单子**（fd 用量）、**单子总共能领多少张**（限制）、**单子有没有还回去**（是否泄漏）。本章后面就围绕这三点展开。

:::

#### 一切皆文件：fd 到底指向哪些东西

在 Linux 里，「资源」远不止磁盘上的文件。**套接字、管道、终端、设备、目录、以及内核提供的各种事件通知对象，统统都用 fd 表示**——这就是那句著名的「一切皆文件」。

这一点极其重要，因为它决定了**排查思路**：很多人一看「句柄耗尽」就以为是日志文件没关，实际上绝大多数线上事故是**网络连接泄漏**导致的。

| 类型 | 在 lsof 里的 TYPE | 常见来源 |
| --- | --- | --- |
| 普通文件 | `REG` | 配置文件、日志文件、上传的文件 |
| 目录 | `DIR` | 遍历目录时打开 |
| 套接字 | `IPv4` / `IPv6` / `unix` | HTTP 请求、数据库连接、Redis、连接池 |
| 管道 | `FIFO` | 进程间通信、`|` 管道、JVM 内部通信 |
| 字符/块设备 | `CHR` / `BLK` | 终端、磁盘、`/dev/null` |
| eventpoll | `anon_inode:[eventpoll]` | epoll 实例（NIO、Nginx、Redis 均大量使用） |
| eventfd / timerfd | `anon_inode:[eventfd]` | 事件通知、定时器 |
| inotify | `anon_inode:inotify` | 文件变更监听（配置热加载、代码热部署） |

:::info 通俗理解

对内核来说，读文件、读网络、读管道**是同一件事**——都是「按编号读一个流」。所以 fd 用完了，**文件和网络会一起崩**：日志写不进去、数据库连不上、请求接不进来，全都报同一个错。

:::

#### fd 的编号规则

fd 是一个**小小的非负整数**（不用想成很大的数，一个进程开到几千就已经很夸张了）。编号是**按最小可用原则**分配的：内核从 0 开始找，找到第一个没被占用的号就发出去。

这里有几个必须记住的事实：

- **0、1、2 永远被占用**：分别对应标准输入（stdin）、标准输出（stdout）、标准错误（stderr）。任何进程一启动就带着这三个。
- **编号会被回收复用**：一个 fd 被关闭后，它的编号会被下一个新打开的资源拿去用。所以「**编号小不代表打开得早**」，也**不能**靠编号大小判断先后顺序。
- **正因为会复用，泄漏才隐蔽**：如果程序在某个分支上忘了关，编号会不断被新资源占用又「看起来正常」，直到某一刻数量顶到上限才暴露。

```bash
$ ls -l /proc/self/fd
lrwx------ 1 root root 64 Sep 16 10:20 0 -> /dev/pts/0
lrwx------ 1 root root 64 Sep 16 10:20 1 -> /dev/pts/0
lrwx------ 1 root root 64 Sep 16 10:20 2 -> /dev/pts/0
lr-x------ 1 root root 64 Sep 16 10:20 3 -> /proc/...</dev>

# 最后那一行 3 号 fd，就是 ls 自己打开目录时领的单子（顺带印证：连读目录都占 fd）
```

#### 三张表：fd 背后的内核结构

这是理解「为什么 `dup` 和 `fork` 会共享文件偏移量」的关键，也是排查中判断「fd 是不是同一个资源」的依据。内核里有三张表：

| 层次 | 名字 | 存什么 | 范围 |
| --- | --- | --- | --- |
| 第 1 层 | 进程级 fd 表 | fd 编号 → 指向第 2 层某一条目 | 每个进程一张 |
| 第 2 层 | 系统级打开文件表 | 文件偏移量、打开模式（读/写）、状态标志 | 整个系统共享 |
| 第 3 层 | inode 表 | 文件元信息、**引用计数** | 整个系统共享 |

由此可以推出两个实用结论：

1. **`fork` 出来的子进程会继承父进程的所有 fd**（两层表都指向同一批条目）。所以一次 `fork` 不是多一个 fd，而是**子进程原本就有多少个，就复制多少个引用**。
2. **`lsof` 里同一个文件出现多次是正常的**：同一个 inode 被多个 fd 指向，引用计数就大于 1。看到「重复」不要急着当泄漏。

:::warning 一个容易被误判的场景

`fork` 风暴（比如 shell 脚本里疯狂起子进程）会让**系统级** fd 数量暴涨，但**任何一个进程自己的 fd 数都不高**。这时如果只看单个进程的 `ulimit`，会完全找不到原因——必须看系统级总量（见[查看用量](#usage)）。

:::

#### 限制的三层结构

这是本篇最核心的一节。**「句柄耗尽」在动手改之前，必须先分清是哪一层限制了它**——改错层，改完不生效，白折腾半天。

| 层级 | 名字 | 作用范围 | 查看方式 | 默认值（视版本而定） |
| --- | --- | --- | --- | --- |
| 第 1 层 | `fs.file-max` | **整台机器**所有进程可打开的 fd 总数 | `sysctl fs.file-max` | 开机按内存自动计算，通常很大 |
| 第 2 层 | `fs.nr_open` | **单个进程**能领取 fd 的**硬天花板** | `sysctl fs.nr_open` | 通常是 1048576 |
| 第 3 层 | `nofile`（RLIMIT_NOFILE） | **单个进程**的软限制与硬限制 | `ulimit -Sn` / `ulimit -Hn` | 视发行版，常见 1024 |

三层的关系是「**从外到内逐层收紧**」：

```
fs.file-max          ← 整机总量（最大）
  └─ fs.nr_open      ← 单进程理论天花板
       └─ nofile 硬限制  ← 单进程实际能到的最大值（软限制不能超过它）
            └─ nofile 软限制  ← 进程当前实际生效的限制
```

其中**软限制（soft）和硬限制（hard）**是日常最容易搞混的一对：

| | 软限制 soft | 硬限制 hard |
| --- | --- | --- |
| 是什么 | **当前生效**的限制 | 软限制的**天花板** |
| 谁能改 | **普通用户自己**就能改，但只能改到不超过硬限制 | 只有 **root**（或用 `CAP_SYS_RESOURCE`）能提高 |
| 典型操作 | `ulimit -n 65535` | `ulimit -Hn 65535` |
| 报错 | 超过硬限制时报 `Invalid argument` | 超过 `fs.nr_open` 时报 `Invalid argument` |

:::danger 头号误区：改了就生效？分三种情况

这是新手最容易踩的坑。**`ulimit` 的作用范围极其有限**，改之前一定要想清楚改的是谁：

1. **`ulimit` 只影响当前 shell 以及它之后启动的子进程**，对**已经跑起来的进程完全无效**（要改运行中的进程得用 `prlimit`）。
2. **`limits.conf` 通过 PAM 生效，只对「登录会话」有效**。**systemd 服务、cron 任务不读它**——这是绝大多数「我明明改了 limits.conf 却没生效」的原因。systemd 服务要用 `LimitNOFILE=`。
3. **容器里的限制由容器运行时决定**，宿主机改了 `limits.conf` 与容器无关。

详情见[限制调整](#solutions)。

:::

#### fd 泄漏是怎么发生的

「泄漏」听起来玄乎，本质只有一句话：**领了单子没还回去**。

一个健康的进程，fd 数量应该表现为「**有开有关、总量绕着某个水平波动**」——业务高峰多开一些，峰谷关掉一些。而泄漏的进程表现为「**只增不减的单调上升阶梯**」，最终撞上限制，然后整个服务不可用。

```bash
# 每 5 秒采一次 fd 数量，观察趋势（这是判断泄漏最快的方法）
$ while true; do date '+%T'; ls /proc/12345/fd | wc -l; sleep 5; done
10:20:01
318
10:20:06
342
10:20:11
366        ← 每 5 秒涨 24 个，只增不减 → 基本可以断定泄漏
```

:::tip 判读要诀

**看趋势，不看绝对值。** 一个进程有 5000 个 fd 但长期稳定，通常没事；一个进程只有 800 个 fd 却在持续上涨，那就是定时炸弹。所以「**有无泄漏**」比「用了多少」更值得监控。

:::

#### 新手常见误区速查

| 误区说法 | 真相 |
| --- | --- |
| 句柄耗尽就是日志文件没关 | 线上绝大多数是**网络连接**（socket）泄漏，文件只占少数 |
| `lsof -p PID \| wc -l` 就是这个进程的 fd 数 | **会偏大**。lsof 还会列出 `cwd`、`txt`、`mem`、`rtd` 等条目，那些不是 fd。准确计数用 `ls /proc/PID/fd \| wc -l` |
| fd 编号小说明打开得早 | 编号按最小可用分配且会被回收复用，编号大小和时间无关 |
| 改了 `limits.conf` 就生效了 | 只对 PAM 登录会话生效；systemd 服务、cron、容器都不走这条路 |
| 把 `ulimit -n` 调到 100 万就万事大吉 | 这往往只是**把泄漏藏得更深**。上限该配，但 **80% 的功夫应该花在找出为什么只增不减** |
| 硬限制不够，普通用户自己调大就行 | 提高硬限制必须 root；普通用户只能把软限制提到不超过硬限制 |
| `ulimit -n` 设成 100 万就一定能到 100 万 | 还受 `fs.nr_open` 压制，超过它会直接报 `Invalid argument` |
| 一个连接就是一个 fd | 基本成立，但注意**监听套接字、epoll 实例、连接池心跳**也各占 fd，实际会略高于连接数 |
| 进程 fd 数不高，说明系统 fd 没压力 | 可能是 `fork` 风暴——子进程分摊了，要看系统级总量 |
| 重启服务就解决了 | 只是**把计时器归零**。泄漏没修，N 天后必然复发，而且往往还是在同一个时刻 |

:::note 本章小结

记住三句话：**fd 是进程向内核领的取料单编号**，**限制有系统级、单进程硬顶、进程软硬限制三层**，**泄漏的本质是只增不减**。下一章开始，把这些概念和真实命令对上号。

:::

## 第二部分 命令实战 {#part-commands}

### 命令总览 {#commands}

排查句柄问题不需要背一堆命令。真正的思路只有一条：**先看上限，再看用量，然后看增长趋势，最后定位到具体是什么资源**。这一章给你一张「地图」，后面几节逐个拆解。

#### 排查工具的分层

把命令按「回答什么问题」分层，用的时候就知道下一步该上什么工具：

| 层级 | 要回答的问题 | 主力命令 |
| --- | --- | --- |
| **第 1 层 · 上限** | 这台机器 / 这个进程最多能开多少？ | `ulimit`、`prlimit`、`sysctl`、`/proc/PID/limits` |
| **第 2 层 · 用量** | 现在用了多少？占上限的百分比？ | `/proc/sys/fs/file-nr`、`ls /proc/PID/fd`、`lsof` |
| **第 3 层 · 构成** | 这些 fd 分别是什么资源？ | `lsof` 按 TYPE/FD 统计、`ss`、`/proc/PID/net` |
| **第 4 层 · 行为** | 是谁在不停地开、又是哪个没关？ | 趋势采样、`strace`、`bpftrace`、应用侧堆栈 |

:::tip 记忆口诀

「先看 **ulimit** 定上限，再用 **/proc** 数用量，**lsof** 分类看构成，**ss** 锁定对端，最后用 **strace / bpftrace** 抓现行。」

:::

#### 命令一览表

| 命令 | 一句话作用 | 最常看什么 | 安装/自带 |
| --- | --- | --- | --- |
| `ulimit -Sn / -Hn` | 看当前 shell 的软/硬限制 | 两个数字本身 | 内置（bash） |
| `prlimit` | 查看**并修改运行中进程**的限制 | `--pid`、`--nofile` | util-linux 包 |
| `cat /proc/PID/limits` | 看某进程实际生效的限制（**最权威**） | `Max open files` 两列 | 自带 |
| `sysctl fs.file-max fs.nr_open` | 看系统级总量与单进程硬顶 | 两个数值 | 自带 |
| `cat /proc/sys/fs/file-nr` | 看**整机**已用/上限 | 已分配数 vs 最大值 | 自带 |
| `ls /proc/PID/fd` | **最准确的**进程 fd 计数与指向 | 条目数量、符号链接目标 | 自带 |
| `lsof` | 列出进程/系统打开的资源 | TYPE、FD、NAME | lsof 包 |
| `ss` | 看套接字与连接状态 | `-s` 汇总、`-tnp` 连接与进程 | iproute2 包 |
| `cat /proc/PID/net/sockstat` | 内核视角的套接字统计 | `sockets: used` | 自带 |
| `fuser` / `lsof +D` | 反向查「谁占用了这个文件」 | 占用者 PID | psmisc / lsof 包 |
| `strace` | 跟踪 `open`/`close`/`accept` 是否配对 | 调用计数与返回 | strace 包 |
| `bpftrace` | 生产环境低开销追踪（进阶） | 自定义聚合统计 | bpftrace 包 |
| `systemctl show` | 看服务的限制设置 | `LimitNOFILE` | systemd |

:::warning 缺命令怎么办

`prlimit` 属于 **util-linux** 包（现代发行版基本都自带）。`lsof` 需要单独安装：`yum install -y lsof`（CentOS 系）或 `apt install -y lsof`（Ubuntu 系）。`ss` 属于 **iproute2**，现在几乎所有发行版都自带（老机器可能只有 `netstat`）。`bpftrace` 需要较新内核，`yum/apt install bpftrace`。

**特别提醒**：容器镜像（尤其精简镜像如 `alpine`、`distroless`）里往往**没有 lsof 也没有 ss**。排查前先确认工具有没有，别到现场才发现——这是很常见的尴尬。

:::

### 查看限制 {#limits-cmd}

这一节解决「上限到底是多少」。顺序很重要：**先看进程实际生效的值，再回头看配置写没写对**。

#### ulimit：当前 shell 的限制

```bash
$ ulimit -n            # 软限制（最常看这个）
1024

$ ulimit -Sn           # 同上，显式指定 soft
1024

$ ulimit -Hn           # 硬限制（软限制的天花板）
4096

$ ulimit -a            # 一次性看所有限制
core file size          (blocks, -c) 0
open files                      (-n) 1024
max user processes              (-u) 63455
...
```

| 参数 | 含义 |
| --- | --- |
| `-Sn` | 软限制（soft），当前实际生效 |
| `-Hn` | 硬限制（hard），只有 root 能抬高 |
| `-n` | 不带 S/H 时默认显示软限制 |
| `-u` | 最大进程/线程数（**和 fd 常被一起配错**，见[成因](#cause-config)） |

:::warning ulimit 对已经运行的进程无效

`ulimit` 改的是**当前 shell 及其后续派生进程**的默认值。**已经在跑的进程不受任何影响**——所以「服务重启了吗」是排查限制类问题时要问的第一句话。

要改运行中的进程，用下面的 `prlimit`。

:::

#### /proc/PID/limits：最权威的答案

上面看的是「shell 的环境」，而这里看的是「**某个进程此刻真正生效的限制**」。排查时**以这个为准**。

```bash
$ cat /proc/12345/limits
Limit                     Soft Limit           Hard Limit           Units
Max cpu time              unlimited            unlimited            seconds
Max file size             unlimited            unlimited            bytes
Max open files            65535                65535                files   ← 就看这一行
Max locked memory         65536                65536                bytes
Max processes             63455                63455                processes
```

:::tip 遇到「改了不生效」，第一件事就是看这里

`cat /proc/PID/limits` 是**唯一能证明「生效了没有」**的地方。配置改了、服务也重启了，就再看一眼这里——两列都变成了 65535，才算真的生效。

:::

#### prlimit：查看并修改运行中的进程

`prlimit` 属于 util-linux，是**不改配置、不重启服务**就能调整限制的工具，应急时非常有用。

```bash
$ prlimit --pid 12345                      # 查看某进程的全部限制
RESOURCE   DESCRIPTION                             SOFT      HARD UNITS
NOFILE     max number of open files               65535     65535 files

$ prlimit --pid 12345 --nofile              # 只看 nofile
RESOURCE   DESCRIPTION                             SOFT      HARD UNITS
NOFILE     max number of open files               65535     65535 files

$ prlimit --pid 12345 --nofile=131072:131072   # 临时改大（需 root；重启后失效）
```

| 用法 | 说明 |
| --- | --- |
| `prlimit --pid PID` | 查看该进程所有限制 |
| `prlimit --pid PID --nofile` | 只查看 nofile |
| `prlimit --pid PID --nofile=软:硬` | 同时设置软、硬限制 |
| `prlimit --nofile=65535 -- 命令` | **以指定限制启动一个新进程**（比先 ulimit 再启动更干净） |

:::danger 应急手段，不是解决方案

`prlimit` **只能提高上限，不能让已经泄漏的 fd 被释放**。它买来的是「服务多撑几小时」的时间，用来安排重启和修复——**不能当成修好了**。而且它重启即失效，必须同步把配置改对，否则下次重启又回到原点。

:::

#### 系统级：fs.file-max 与 fs.nr_open

```bash
$ sysctl fs.file-max fs.nr_open
fs.file-max = 1631499        # 整机可打开的 fd 总数（按内存自动计算）
fs.nr_open = 1048576         # 单进程硬天花板

$ cat /proc/sys/fs/file-nr
12800    0    1631499
#  ↑已分配  ↑已废弃(恒为0)  ↑最大值
```

`/proc/sys/fs/file-nr` 的三个字段是**整机视角**的用量。判断「是不是全局资源紧张」就看第一列和第三列的比例。

:::info 实际配置文件在哪

`sysctl` 看到的值来自这些位置（按加载顺序）：

```bash
$ sysctl --system -a | grep -E "file-max|nr_open"   # 确认最终生效值
$ cat /etc/sysctl.conf                              # 老式位置
$ ls /etc/sysctl.d/                                 # 现代位置（推荐放这里）
```

修改时**推荐写进 `/etc/sysctl.d/99-fd.conf`**，而不是直接改 `/etc/sysctl.conf`——后者常被包管理器和云平台镜像覆盖。

:::

### 查看用量与 lsof {#usage}

这一节解决「用了多少、都是什么」。**先数对数，再分好类**，这两步做对了，方向基本就定了。

#### 准确计数：/proc/PID/fd

```bash
$ ls /proc/12345/fd | wc -l
1024

$ ls -l /proc/12345/fd | head -8
lrwx------ 1 app app 64 Sep 16 10:20 0 -> /dev/null
lrwx------ 1 app app 64 Sep 16 10:20 1 -> /var/log/app/app.log
lrwx------ 1 app app 64 Sep 16 10:20 2 -> /var/log/app/app.err
lrwx------ 1 app app 64 Sep 16 10:20 3 -> socket:[38291024]
lrwx------ 1 app app 64 Sep 16 10:20 4 -> anon_inode:[eventpoll]
lrwx------ 1 app app 64 Sep 16 10:20 5 -> /tmp/app/cache.dat
lrwx------ 1 app app 64 Sep 16 10:20 6 -> pipe:[38291025]
```

**这是最可靠的 fd 计数方式**，因为它直接来自内核。注意符号链接指向的内容直接暴露了资源类型：

| 指向 | 是什么 |
| --- | --- |
| `/path/to/file` | 普通文件或目录 |
| `socket:[数字]` | 套接字（连接、监听、Unix socket） |
| `pipe:[数字]` | 管道 |
| `anon_inode:[eventpoll]` | epoll 实例 |
| `anon_inode:[eventfd]` | 事件通知对象 |
| `anon_inode:inotify` | 文件监听 |
| `/dev/pts/N`、`/dev/null` | 终端、空设备 |

:::warning 一个非常隐蔽的坑

上面 `1 ->` 和 `2 ->` 指向的是**日志文件**。日志轮转（logrotate）时如果程序持有旧 fd 不放，磁盘空间不会释放——`df` 显示满了但 `du` 找不出大文件。排查方法：

```bash
$ lsof +L1 | grep -i deleted        # 找出「已被删除但仍被打开」的文件
$ lsof | grep /var/log/app/app.log  # 看谁还攥着旧日志
```

**注意区分**：这是「日志 fd 未随轮转重开」的问题，**不违反 fd 上限**（顶多占几个 fd），但会伪装成磁盘满。别把它和句柄耗尽搞混。

:::

#### lsof：最常用的排查入口

lsof 直译就是「list open files」。它的输出列固定，先认列再看数：

```bash
$ lsof -p 12345 | head -6
COMMAND   PID USER   FD      TYPE    DEVICE    SIZE/OFF     NODE NAME
java    12345  app  cwd       DIR     253,0        4096        2 /opt/app
java    12345  app  rtd       DIR     253,0        4096        2 /
java    12345  app  txt       REG     253,0        8192  1048578 /usr/bin/java
java    12345  app  mem       REG     253,0     1048576  1048579 /usr/lib/libz.so.1
java    12345  app    0u      CHR       1,3         0t0     1026 /dev/null
java    12345  app    3u     IPv4 38291024       0t0      TCP web01:54321->db01:3306 (ESTABLISHED)
```

| 列 | 含义 | 排查要点 |
| --- | --- | --- |
| `COMMAND / PID / USER` | 进程名、PID、属主 | 锁定对象 |
| `FD` | **fd 编号 + 访问模式**：`u` 读写、`r` 只读、`w` 只写 | 数字才是真 fd；`cwd`/`rtd`/`txt`/`mem` 不是 |
| `TYPE` | 资源类型：`REG`/`DIR`/`IPv4`/`unix`/`FIFO`/`CHR` | **分类统计就看这一列** |
| `DEVICE / SIZE/OFF / NODE` | 设备号、大小或偏移、inode 号 | inode 号可用来判断是否为同一文件 |
| `NAME` | 具体路径或连接五元组 | socket 会显示双向地址与状态 |

:::danger 纠正一个流传很广的错误做法

网上到处在传 `lsof -p PID | wc -l` 来数 fd 数量——**这是错的**。

lsof 会把 `cwd`、`rtd`、`txt`、`mem` 这些**不是 fd 的条目**也列出来（`mem` 是动态库映射，一个 Java 进程能有上百条）。实测能偏大 10%~100%，数量级小的时候足以让你误判。

**准确计数请用 `ls /proc/PID/fd | wc -l`**；想用 lsof 数，也必须先过滤掉非数字 fd：

```bash
$ lsof -p 12345 | awk '$4 ~ /^[0-9]/' | wc -l     # 只统计 FD 列以数字开头的行
```

:::

**按类型统计——这一步最能出结论**：

```bash
$ lsof -p 12345 | awk '$4 ~ /^[0-9]/ {print $5}' | sort | uniq -c | sort -rn
    842 IPv4                              ← 842 个网络连接，占了绝大多数
     12 REG
      4 anon_inode:[eventpoll]
      3 FIFO
      2 unix
      1 CHR
```

:::tip 一眼定性

这张表直接把方向定死了：**如果 `IPv4`/`IPv6`/`unix` 占绝对多数，就是连接问题**（连接池、下游慢、没设超时）；**如果 `REG` 一路增长，就是文件没关**（流没 close、目录没关）。两种情况的解法完全不同，先分类再动手，能省掉大量瞎猜。

:::

**看连接都连向了谁**（配合 `ss` 更快，见下节）：

```bash
$ lsof -p 12345 -a -i | awk '{print $9}' | sed 's/.*->//' | cut -d: -f1 | sort | uniq -c | sort -rn
    620 db01
    180 redis01
     42 api.partner.com
# 结论：绝大多数连接堆在 db01 上，先查数据库侧和连接池配置
```

**经典泄漏特征：`can't identify protocol`**

```bash
$ lsof -p 12345 | grep -c "can't identify protocol"
137
```

这个提示表示**内核里还留着一个 socket，但进程侧已经没有任何东西引用它了**——典型的手续没办完（连接对象被丢弃却没关闭）。**看到它基本可以直接判定为连接泄漏**，是最有价值的一条线索。

**反向查：谁占用了这个文件 / 端口**

```bash
$ lsof /var/log/app/app.log        # 谁在写这个文件
$ lsof -i :8080                    # 谁占用了 8080 端口
$ lsof +D /data/uploads            # 谁打开了这个目录下的文件（目录大时很慢）
$ fuser -v /data/uploads/*         # 轻量替代方案
```

:::warning lsof 自身的代价与权限

`lsof` 在连接数很多时开销明显（要遍历 `/proc` 下所有进程），**生产高峰慎用 `lsof` 全量扫描**（不带 `-p`/`-i` 的那种）。优先带上过滤条件。

另外**普通用户看不到别人的进程**，排查别人的服务要 root 或 `CAP_SYS_PTRACE`。容器里则受 PID namespace 限制。

:::

#### ss：网络视角的补充

既然绝大多数泄漏是连接，`ss` 往往比 lsof 更快更直接：

```bash
$ ss -s
Total: 1243
TCP:   1102 (estab 980, closed 96, orphaned 4, timewait 92)
...
# 一眼看清套接字总量与状态分布

$ ss -tnp | grep 12345 | wc -l            # 某进程的 TCP 连接数
$ ss -tnp state established '( dport = :3306 )' | wc -l   # 到数据库的已建立连接数
$ ss -tn state time-wait | wc -l          # TIME_WAIT 数量（短连接风暴特征）
$ ss -tnlp | grep :8080                   # 谁在监听 8080
```

以及内核侧的权威统计：

```bash
$ cat /proc/net/sockstat
sockets: used 1243
TCP: inuse 1102 orphan 4 tw 92 alloc 1180 mem 210
UDP: inuse 12 mem 3
```

| 字段 | 含义 | 异常指向 |
| --- | --- | --- |
| `sockets: used` | 当前内核分配的套接字总数 | 和 `fs.file-nr` 交叉验证 |
| `TCP: inuse` | 使用中的 TCP 套接字 | 连接泄漏 |
| `tw` | TIME_WAIT 数量 | 短连接风暴（大量 new/close） |
| `orphan` | 已无进程引用的孤立套接字 | 与 `can't identify protocol` 对应 |

:::tip ss 与 lsof 怎么选

**看数量、看状态分布、看对端 → 用 `ss`**（快，开销小）；**看具体是哪个进程的哪个 fd、以及 fd 编号 → 用 `lsof`**。两者配合，前者定性后者定位。

:::

### systemd 与容器视角 {#systemd}

这一节专门对付「**配置改了却不生效**」——这是句柄问题里最高频、也最浪费时间的一类。

#### systemd 服务的限制不来自 limits.conf

**systemd 服务不经过 PAM，所以 `/etc/security/limits.conf` 对它完全无效。** 这是无数人踩过的坑。

```bash
$ systemctl show myapp.service | grep -i limit
LimitNOFILE=1024:524288        ← 服务实际生效的限制，看这里
LimitNPROC=63455
```

调整方式有三种，推荐第一种：

```bash
# 方式一（推荐）：给单个服务加 override，不影响其他服务
$ systemctl edit myapp.service
# 在打开的编辑器里写入：
# [Service]
# LimitNOFILE=65535

$ systemctl daemon-reload
$ systemctl restart myapp.service
$ systemctl show myapp.service | grep LimitNOFILE      # 验证
```

```bash
# 方式二：直接改 unit 文件（会被包管理器升级覆盖，谨慎）
$ vi /etc/systemd/system/myapp.service
# [Service] 段下加 LimitNOFILE=65535

# 方式三：改全局默认值（影响所有服务，慎用）
$ vi /etc/systemd/system.conf
# DefaultLimitNOFILE=65535
$ systemctl daemon-reexec        # 注意：改 system.conf 要 daemon-reexec 而不是 daemon-reload
```

:::danger 顺序错一步，白改半小时

`systemctl daemon-reload` 之后**必须 restart 服务**才会生效；改 `/etc/systemd/system.conf` 则需要 `daemon-reexec`。改完**务必用 `cat /proc/PID/limits` 做最终确认**——不要只看配置文件，配置文件写对了不等于进程读到了。

:::

#### cron 任务

cron 同样不走 PAM 的 login 流程（部分发行版有 `pam_limits` 但行为不一致，**不要依赖它**）。可靠做法是在脚本里显式抬升：

```bash
# /opt/scripts/batch.sh 开头
ulimit -n 65535 || echo "set nofile failed" >&2
```

#### 容器：三处都要看

容器的限制由**容器运行时**决定，和宿主机 `limits.conf` 无关，且**容器内看到的值未必是真的**：

```bash
# 1. 容器内看实际生效值
$ cat /proc/1/limits | grep "Max open files"

# 2. 启动时显式指定（Docker）
$ docker run --ulimit nofile=65535:65535 myapp:latest

# 3. docker-compose
# services:
#   myapp:
#     ulimits:
#       nofile: { soft: 65535, hard: 65535 }
```

:::warning Kubernetes 没有 pod 级的 nofile 字段

K8s 的 Pod spec 里**没有**直接设置 `ulimit` 的标准字段（受热议多年仍未普遍可用）。实践中靠三种办法：

1. **kubelet 层统一配置**（`/var/lib/kubelet/config.yaml` 里的 `defaultLimits`，取决于版本与平台）；
2. **容器运行时配置**（containerd / dockershim 的默认 ulimit）；
3. **平台侧规范**：多数公司由 SRE 在基础镜像或准入控制器里统一抬高。

**排查时不要想当然**：直接 `kubectl exec` 进去 `cat /proc/1/limits`，以实测为准。很多「容器里 fd 不够」的根因其实在 kubelet 配置，而不在应用。

:::

### 追踪：抓现行 {#trace}

前面都是「看状态」，这一节是「看行为」——**找出是谁在不停地开、又是哪个没关**。

#### strace：验证 open/close 是否配对

```bash
$ strace -f -c -p 12345 --timeout 10
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 62.10    0.421000          12     35100           accept4     ← 开连接多
 21.30    0.144000           8     18000           close       ← 关得不够多！
 12.40    0.084000          14      6000           openat
  ...
```

**判读方法：把「开」和「关」的调用次数对上**。

| 配对的调用 | 应该满足 |
| --- | --- |
| `open` / `openat` ↔ `close` | 次数大致相当 |
| `socket` / `accept` / `accept4` ↔ `close` | 次数大致相当 |
| `dup` / `dup2` ↔ `close` | 每 dup 一次都要多关一次 |
| `epoll_create` ↔ `close` | 大致相当 |

```bash
# 只看某个进程 10 秒内的开/关配对（-f 跟踪子进程，很关键）
$ strace -f -e trace=openat,close -p 12345 2>&1 | tail -50

# 抓「打开了什么」而不看关闭
$ strace -f -e trace=openat -p 12345 2>&1 | grep -c "openat"
```

:::danger strace 的代价非常大

`strace` 会让目标进程**慢 10 倍以上**，而且 `-f` 跟踪多线程进程时开销更高。**绝对不要在业务高峰期对生产核心进程使用**。它的正确用法是：低峰期、短时间（`--timeout`）、并且**优先在预发或复现环境用**。

如果必须在生产用，改用下面的 `bpftrace`。

:::

#### bpftrace：低开销的生产级追踪

内核 4.9+ 可用，开销远低于 strace，适合生产短时采样：

```bash
# 统计每个进程的 open 调用次数（5 秒后 Ctrl-C）
$ bpftrace -e '
kprobe:do_sys_open { @[comm] = count(); }
interval:s:5 { exit(); }'

# 统计指定进程的 fd 分配与释放是否平衡
$ bpftrace -e '
tracepoint:syscalls:sys_enter_openat  /pid == 12345/ { @open = count(); }
tracepoint:syscalls:sys_enter_close   /pid == 12345/ { @close = count(); }
interval:s:10 { print(@open); print(@close); exit(); }'

# 揪出「只开不关」的调用栈（最有价值——直接指向代码位置）
$ bpftrace -e '
kprobe:do_sys_open  /pid == 12345/ { @[ustack()] = count(); }
interval:s:30 { print(@); exit(); }'
```

:::info 为什么 bpftrace 值得学

它的杀手锏是 `ustack()` —— **能直接打印出「是代码里的哪一行在不停打开文件」**。这等于把「发现问题」和「定位到代码」一步做完，比在几千行 lsof 输出里猜要高效得多。生产环境中它是 strace 的安全替代品。

:::

:::note 本章小结

命令家族到此齐了：**ulimit 看 shell 上限 → /proc/PID/limits 看真实生效值 → /proc/sys/fs/file-nr 看整机 → ls /proc/PID/fd 准确计数 → lsof 分类构成 → ss 锁定对端 → strace/bpftrace 抓现行**。下一章把这套工具串成一条完整的排查流程。

:::

## 第三部分 排查与解决 {#part-troubleshooting}

### 句柄耗尽排查流程 {#diagnosis}

前面学的所有命令，在这一章串成一条可以照做的流程。核心原则：**先确认是「真的泄漏」还是「上限太低」，再动手**——这个判断错了，后面全是白费功夫。

#### 第 0 步：先确认现象与影响面

动手之前先搞清楚三个问题：

- **报错是什么**？`Too many open files`（EMFILE）？还是业务超时但没报错？还是监控指标告警？
- **业务受影响了吗**？接口报错、连接不上数据库、还是只是指标高但业务正常？
- **最近有变更吗**？发布、配置、连接池参数、流量上涨、下游变慢？**变更与 fd 开始上涨的时间点对得上，往往就是答案**。

:::tip 先分清「配置问题」还是「泄漏问题」

这是整条流程里最重要的一次分叉，用两个问题就能判断：

| 观察 | 结论 | 方向 |
| --- | --- | --- |
| fd 数**长期稳定**，但一接近上限就报错 | **上限配低了**（或业务量真的涨了） | 去[限制调整](#solutions)，配置问题 |
| fd 数**只增不减**，重启后从零开始爬 | **确实泄漏** | 继续往下排查，调上限只是拖延 |

**一个反复重启、每次都能撑几天再挂的服务，几乎可以断定是泄漏**——调大上限只会让周期变长，不会消失。

:::

#### 第 1 步：看上限——当前能开多少

```bash
$ cat /proc/12345/limits | grep "Max open files"
Max open files            1024                 4096                 files
#                         ↑软限制到了  ↑硬顶也只有 4096——上限明显偏低

$ ulimit -n
1024
```

**如果发现软硬限制都很小（如 1024/4096），先别急着查代码**——这很可能就是根因。但仍要继续确认，因为「把上限调大」和「泄漏修掉」是两回事。

#### 第 2 步：看用量与趋势——是泄漏还是配置低

```bash
$ ls /proc/12345/fd | wc -l
1024                     ← 已经顶到软限制，坐实耗尽

# 关键一步：采样看趋势（决定后续方向）
$ while true; do date '+%T'; ls /proc/12345/fd | wc -l; sleep 5; done
10:20:01
1024
10:20:06
1024
10:20:11
1024                     ← 卡在上限不动 → 已耗尽，无法判断是否泄漏
```

:::warning 顶到上限时趋势会被掩盖

一旦 fd 顶到上限，数量就「卡住不动」了——此时**看不到趋势**，得先做两件事之一：

1. **临时抬高上限**（`prlimit`），让它重新有空间增长，再观察趋势；
2. **直接看重启以来的增长曲线**——监控系统里 `process_open_fds` 的历史数据最有说服力。

**只看现场的一个数字，是判断不出泄漏的。** 这是很多人卡住的原因。

:::

#### 第 3 步：分类构成——是连接还是文件

```bash
$ lsof -p 12345 | awk '$4 ~ /^[0-9]/ {print $5}' | sort | uniq -c | sort -rn
    980 IPv4                  ← 连接占了 96%，方向明确
     24 REG
     12 anon_inode:[eventpoll]
```

```bash
# 若日志文件持有旧 fd，顺便查一下
$ lsof +L1 | grep -i deleted
```

**结论直接指向下一步**：`IPv4` 占多数 → 查连接（第 4 步）；`REG` 占多数 → 查文件流。

#### 第 4 步：定位对端——连接都去哪了

```bash
$ lsof -p 12345 -a -i | awk '{print $9}' | sed 's/.*->//' | cut -d: -f1 | sort | uniq -c | sort -rn
    842 db01
     96 redis01
     42 api.partner.com

$ ss -tnp state established '( dport = :3306 )' | wc -l
842
# 842 条到数据库的连接 —— 远超连接池应该有的规模
```

#### 第 5 步：看连接状态与生命周期

```bash
# 连接是不是长期不释放？（CLOSE_WAIT 堆积是很强的信号）
$ ss -tn state close-wait | wc -l
412                 ← CLOSE_WAIT 大量堆积 = 对端关了，本端没关
```

| 状态 | 含义 | 指向 |
| --- | --- | --- |
| `ESTABLISHED` 大量且稳定 | 连接池正常工作 | 可能是池上限配置过大 |
| `CLOSE_WAIT` 大量堆积 | **对端已关闭，本端没有 close** | **应用侧没关连接，典型泄漏** |
| `TIME_WAIT` 大量 | 短连接频繁开关 | 没用连接池，或短连接风暴 |
| `can't identify protocol` | 内核有 socket 但进程无引用 | 连接对象被丢弃却没关闭 |

```bash
$ lsof -p 12345 | grep -c "can't identify protocol"
137                 ← 基本可以直接判定为连接泄漏
```

#### 第 6 步：抓到代码——是谁在不停地开

```bash
# 低峰期短时采样，看 open/socket 与 close 是否配对
$ strace -f -c -p 12345 --timeout 10
calls  syscall
35100  accept4
18000  close        ← 开 35100 次、只关 18000 次，缺口一半

# 生产环境改用 bpftrace，直接打出调用栈
$ bpftrace -e '
kprobe:do_sys_open /pid == 12345/ { @[ustack()] = count(); }
interval:s:30 { print(@); exit(); }'
```

到这一步，问题已经具体到**代码里的哪一行**。剩下的交给代码评审和修复。

#### 现场信息采集：一屏命令 {#snapshot}

问题处理完前，先把现场证据留下来：

```bash
$ date '+%F %T'                                        # 1. 时间戳
$ cat /proc/<PID>/limits | grep "Max open files"       # 2. 限制（软/硬）
$ ls /proc/<PID>/fd | wc -l                            # 3. 准确 fd 数
$ lsof -p <PID> | awk '$4 ~ /^[0-9]/ {print $5}' | sort | uniq -c | sort -rn   # 4. 类型构成
$ lsof -p <PID> > lsof_$(date +%s).txt                 # 5. 完整清单（留证）
$ ss -tnp | grep <PID> | wc -l                         # 6. 连接数
$ ss -tn state close-wait | wc -l                      # 7. CLOSE_WAIT 数量
$ cat /proc/sys/fs/file-nr                             # 8. 整机用量
$ systemctl show <svc> | grep LimitNOFILE              # 9. 服务限制配置
```

把这些输出保存成文件，连同告警截图、变更记录一起归档。

#### 排查结果记录清单

| 项目 | 内容 |
| --- | --- |
| 现象 | 报错内容、数值、开始时间、业务影响 |
| 变更 | 最近的发布 / 配置 / 连接池 / 下游变化 |
| 限制 | 软限制、硬限制、`fs.nr_open`、是否容器 |
| 趋势 | 平稳还是单调上升（有无泄漏） |
| 构成 | 按 TYPE 分类的占比 |
| 根因 | 一句话说清（如：下游变慢导致连接堆积且无超时） |
| 处置 | 应急措施 + 根治措施 + 预防措施 |

:::note 流程记忆口诀

**确认现象 → 看清上限 → 采样看趋势 → 分类看构成 → 定位对端 → 抓到代码。** 其中「**趋势**」这一步最关键，它决定了你是在查泄漏还是在改配置。

:::

### 常见成因分析 {#causes}

这一章把高频的「句柄耗尽」原因整理成一张张「病例卡」：每个成因给出**现象特征**、**排查手段**、**对应解法**。先对照特征，再动手排查，命中率会高很多。

#### 先看一张总览表

| 成因 | 最典型的现象特征 | 定位命令 |
| --- | --- | --- |
| [连接对象未关闭](#cause-conn-leak) | fd 单调上升，`IPv4` 占绝大多数，`CLOSE_WAIT` 堆积 | lsof / ss |
| [下游变慢导致连接堆积](#cause-downstream) | fd 随下游延迟同步上涨，大量 `ESTABLISHED` | ss / 下游监控 |
| [连接池配置不当](#cause-pool) | fd 高但稳定，连接数远超池上限 | 连接池指标 / `ss` |
| [短连接风暴 / 重试](#cause-shortconn) | `TIME_WAIT` 暴涨，fd 与 QPS 同步 | `ss -tn state time-wait` |
| [文件流未关闭](#cause-file-leak) | `REG` 一路增长；`lsof +L1` 有 deleted 文件 | lsof / `+L1` |
| [目录遍历未关闭](#cause-dir) | `DIR` 类型增长，常见于批量脚本 | lsof |
| [epoll / NIO 对象泄漏](#cause-epoll) | `anon_inode:[eventpoll]` 持续增长 | lsof / jstack |
| [inotify 监听泄漏](#cause-inotify) | `anon_inode:inotify` 增长，触及内核 inotify 上限 | lsof / 内核参数 |
| [fork 风暴](#cause-fork) | **单进程 fd 不高，但整机 fd 暴涨** | `/proc/sys/fs/file-nr` |
| [nofile 配置过低](#cause-config) | fd 长期稳定但一到某个数就报错 | `cat /proc/PID/limits` |
| [监控 / 健康检查高频短连](#cause-healthcheck) | 固定周期脉冲，来自 LB / 探针 IP | `ss -tnp` / 抓包 |
| [挖矿 / 恶意进程](#cause-malware) | 陌生进程大量外联 socket，CPU 也高 | ps / lsof / ss |

#### 1. 连接对象未关闭（最常见） {#cause-conn-leak}

**特征**：fd 数**单调上升**（重启后归零重爬）；按类型统计 `IPv4` / `unix` 占 90% 以上；`CLOSE_WAIT` 堆积；`can't identify protocol` 有值。

**确认**：

```bash
$ while true; do ls /proc/12345/fd | wc -l; sleep 5; done     # 只增不减
$ lsof -p 12345 | grep -c "can't identify protocol"
137
$ ss -tn state close-wait | wc -l
412
```

**根因**：代码在某个分支（尤其是异常分支）上提前返回，跳过了 `close()`；或用了连接对象却没放进 try-with-resources / `using` / `defer`。

**解法**：见[代码层根治](#code)。**应急**：重启服务（治标）+ `prlimit` 抬上限（争取时间）。

:::tip 为什么多数泄漏发生在异常分支

正常路径上开发者会认真地关连接，**但抛异常时那条路径往往没人测**。所以查泄漏时优先看：**异常处理块、超时分支、提前 return 的分支**。这比通读全部代码快得多。

:::

#### 2. 下游变慢导致连接堆积 {#cause-downstream}

**特征**：fd 与下游延迟**同步上涨**；连接都是 `ESTABLISHED`（不是 `CLOSE_WAIT`）；应用内存/线程数也在涨；CPU 可能不高（在等）。

**确认**：

```bash
$ ss -tnp state established '( dport = :8081 )' | wc -l
340                    ← 到下游 8081 的连接堆了 340 条
$ lsof -p 12345 -a -i | awk '{print $9}' | sed 's/.*->//' | cut -d: -f1 | sort | uniq -c | sort -rn
    340 api.partner.com
# 再看下游监控：14:02 起延迟从 50ms 涨到 5s —— 时间线完全吻合
```

**根因**：调用下游**没有设读超时**（或超时设得极长），请求都挂在那儿等；加上重试，连接数被迅速放大。

**解法**：**必设超时（连接 + 读）**、重试改「限次 + 指数退避 + 仅幂等」、加熔断快速失败、连接池设上限与获取超时。详见[系统间交互案例](#cases-interaction)。

#### 3. 连接池配置不当 {#cause-pool}

**特征**：fd 数**高但稳定**（不单调上涨）；连接数远超业务并发；大量连接处于空闲但没被回收。

**确认**：

```bash
$ ss -tn state established '( dport = :3306 )' | wc -l
900                    ← 16 核机器上 900 个数据库连接明显过多
# 数据库侧看是否大量空闲连接
mysql> SHOW GLOBAL STATUS LIKE 'Threads_connected';
mysql> SHOW PROCESSLIST;        -- 大量 Sleep 状态 = 占着不用
```

**根因**：`maxPoolSize` 拍脑袋设得很大；缺 `idleTimeout` / `maxLifetime`；每实例连接数 × 实例数 超过数据库承受能力。

**解法**：池上限按业务并发峰值定（经验量级：`核数 × 2~4`）、设 `connectionTimeout`、配 `idleTimeout` 与 `maxLifetime`（小于数据库 `wait_timeout`）。**注意这是「配置过高」而非泄漏——不需要改代码，改配置即可。**

#### 4. 短连接风暴 / 重试放大 {#cause-shortconn}

**特征**：`TIME_WAIT` 数量暴涨；fd 与 QPS 同步波动而非单调上升；本地端口有耗尽风险。

**确认**：

```bash
$ ss -tn state time-wait | wc -l
28000
$ ss -s
TCP:  total 29000 (estab 800, timewait 28000)   ← 绝大多数是 TIME_WAIT
$ cat /proc/net/sockstat | grep TCP
TCP: inuse 900 orphan 20 tw 28000 alloc 30000 mem 210
```

**根因**：没用连接池 / Keep-Alive（每次请求新建连接）；或重试风暴把连接数放大数倍。

**解法**：**开启连接复用（Keep-Alive + 连接池）**，这是最根本的一条；重试限次 + 退避；必要时调整 `net.ipv4.tcp_tw_reuse`（**不建议动 `tcp_tw_recycle`，已在新内核移除且有 NAT 兼容问题**）。

:::warning TIME_WAIT 大多不是故障

`TIME_WAIT` 是 TCP 正常挥手后的**保护状态**，本身不是错误。**要关注的是它的增长速率和是否有本地端口耗尽风险**，而不是「TIME_WAIT 多就是有问题」。真正的解法是**复用连接**，不是去调内核参数把它消掉。

:::

#### 5. 文件流未关闭 {#cause-file-leak}

**特征**：按类型统计 `REG` 一路增长；`lsof +L1` 能看到已删除但仍被占用的文件。

**确认**：

```bash
$ lsof -p 12345 | awk '$4 ~ /^[0-9]/ {print $5}' | sort | uniq -c | sort -rn
    820 REG                 ← 大量普通文件
    204 IPv4
$ lsof -p 12345 | grep "\.log\|\.tmp\|\.dat" | head -10
```

**根因**：`FileInputStream` / `BufferedReader` / `InputStream` 没在 `finally` 或 try-with-resources 中关闭；批量任务每次循环开一个文件却忘关。

**解法**：强制使用 try-with-resources（Java）/ `using`（C#）/ `defer f.Close()`（Go）；批量任务改成「开一个关一个」，不要攒着。

#### 6. 目录遍历未关闭 {#cause-dir}

**特征**：`DIR` 类型 fd 增长，常见于扫描目录的批量程序。

**确认**：

```bash
$ lsof -p 12345 | awk '$5 == "DIR" && $4 ~ /^[0-9]/' | head
```

**根因**：`opendir` 之后没 `closedir`（Java 里 `Files.list()` / `Files.walk()` 返回的 Stream **必须显式 close**，这是极易忽略的一处）。

**解法**：Stream 也放进 try-with-resources：

```java
// Files.list / Files.walk 返回的 Stream 持有目录 fd，必须关闭
try (Stream<Path> paths = Files.list(dir)) {
    paths.forEach(this::process);
}
```

:::tip 一个高频遗漏点

Java 的 `Files.list()` / `Files.walk()` / `Files.find()` 返回的 `Stream` **底层持有目录 fd**，不 close 就泄漏——而且它在**非空目录**下才会真正打开 fd，测试环境目录为空时完全测不出来。这类问题往往会「上线才炸」。

:::

#### 7. epoll / NIO 对象泄漏 {#cause-epoll}

**特征**：`anon_inode:[eventpoll]` 或 `anon_inode:[eventfd]` 持续增长；常见于自建 NIO / Netty 场景。

**确认**：

```bash
$ lsof -p 12345 | grep -c "eventpoll"
1420
$ lsof -p 12345 | awk '$4 ~ /^[0-9]/ {print $5}' | sort | uniq -c | sort -rn | head -3
```

**根因**：`Selector` 用完没 `close()`；连接池/客户端每次创建新的 `Selector`；Netty 的 `EventLoopGroup` 未 `shutdownGracefully()`。

**解法**：`Selector` 复用而不是每次新建；在生命周期结束时统一关闭；通过 jstack 确认线程与事件循环数量是否失控。

#### 8. inotify 监听泄漏 {#cause-inotify}

**特征**：`anon_inode:inotify` 增长；报错可能是 `Too many open files`，也可能是内核 inotify 上限报错（`No space left on device`）。

**确认**：

```bash
$ lsof -p 12345 | grep -c inotify
230
$ sysctl fs.inotify.max_user_instances fs.inotify.max_user_watches
fs.inotify.max_user_instances = 128
fs.inotify.max_user_watches = 8192
```

**根因**：反复创建 `WatchService` 不关闭；配置热加载/热部署框架每次刷新都新建一个监听器。

**解法**：监听器复用；用 `fs.inotify.max_user_instances` 抬高上限（**同时也要修泄漏**）。

:::warning 一个容易误判的报错

inotify 上限被撞时，报错常常是 **`No space left on device`**，但 `df` 显示磁盘空着——这会把人带偏到磁盘排查上。遇到「磁盘没满却说 no space」时，顺手查一下 inotify 上限。

:::

#### 9. fork 风暴 {#cause-fork}

**特征**：**单个进程的 fd 都不高，但整机 fd 暴涨**；`/proc/sys/fs/file-nr` 第一列快速上涨。

**确认**：

```bash
$ cat /proc/sys/fs/file-nr
1280000    0    1631499        ← 已用接近上限
$ ls /proc/*/fd 2>/dev/null | wc -l     # 全系统 fd 总数（会较慢）
$ ps -eLf | wc -l                        # 线程/进程总数也一起看
```

**根因**：脚本疯狂起子进程（循环里调外部命令、`xargs` 未限并发）；`fork` 时子进程继承父进程全部 fd 引用。

**解法**：给并发加限制（`xargs -P`、`flock` 防重入）、脚本里显式 `ulimit`、避免在循环内调用外部命令。

#### 10. nofile 配置过低 {#cause-config}

**特征**：fd 数**长期稳定**，但一到某个数（如 1024）就报错；重启后从零平稳爬到该数然后报错。

**确认**：

```bash
$ cat /proc/12345/limits | grep "Max open files"
Max open files            1024                 4096                 files
# 注意：当前 fd 数 1024 恰好等于软限制 —— 配置问题，不是泄漏
$ systemctl show myapp.service | grep LimitNOFILE
LimitNOFILE=1024:524288          ← 硬限制很大，但软限制卡在 1024
```

**解法**：见[限制调整](#solutions)。**这类问题的特征很明确：数值卡在一个「整数」上（1024、4096、65535），而不是慢慢爬到一个不规则的值。** 看到整数就要怀疑限制。

#### 11. 监控 / 健康检查高频短连 {#cause-healthcheck}

**特征**：fd 呈**固定周期脉冲**（每 1s / 5s 一个尖峰）；来源 IP 是负载均衡或监控探针；连接生命周期极短。

**确认**：

```bash
$ ss -tnp | grep -v "^State" | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head
   860 10.0.0.5          ← 大量来自 LB
$ grep -c "session opened" /var/log/secure
```

**解法**：健康检查间隔与业务需求匹配（通常 5~30s 足够）；开启 Keep-Alive 复用；把探针收敛到统一入口。

#### 12. 挖矿 / 恶意进程 {#cause-malware}

**特征**：陌生进程大量外联 socket；fd 与 CPU 同时高；用户名可疑、进程名伪装。

**确认**：

```bash
$ ps aux --sort=-%cpu | head -5
$ ls -l /proc/<PID>/exe                  # 可执行文件路径是否可疑
$ lsof -p <PID> -a -i | grep ESTABLISHED # 外联到陌生 IP
$ ss -tnp | grep <PID>
```

**处置**：先隔离（断网/停进程），保留现场（`lsof` 输出、`/proc/PID`、`ss -tnp`），再溯源漏洞并修复。

:::info 怎么用这一章

排查时先看总览表，对照「你最像哪一行」，再用对应的确认命令验证。**特别提醒：第 12 行（恶意进程）值得优先排除**——它只需要一条 `ps` 就能否掉，否则可能白查半天。

:::

### 解决方案 {#solutions}

上一章认识了「病因」，这一章给出「药方」。处理思路分三层：**先应急止损**（让业务先恢复）→ **再对症根治**（修泄漏或调配置）→ **最后建立预防**（监控与基线）。

#### 1. 应急止损：业务优先 {#emergency}

业务已经受损时，先恢复服务，再谈根治：

| 手段 | 做法 | 适用场景 |
| --- | --- | --- |
| 临时抬高限制 | `prlimit --pid PID --nofile=131072:131072` | 确认是配置过低，或为修复争取时间 |
| 摘流量 / 限流 | 网关限流、把节点从负载均衡摘掉 | 保护剩余节点，避免雪崩 |
| 重启服务 | `systemctl restart myapp` | 泄漏无法立即修复时的快速止血 |
| 滚动重启 | 集群分批重启，保证整体可用 | 多实例服务，避免同时重启 |
| 重启容器 | `docker restart` / 删 Pod 重建 | 容器场景 |

:::danger 应急的纪律

1. **先抓现场再重启**——重启后 fd 和连接状态全没了，证据也没了（用[现场采集命令](#snapshot)）；
2. **`prlimit` 只是买时间**，别当解决方案，必须同步推进修复；
3. **重启只是把计时器归零**——如果不修泄漏，故障周期只会变短（因为业务量在涨）；
4. 滚动重启时要**确认限制配置已经改对**，否则重启后的新实例仍然是小限制。

:::

#### 2. 系统级与进程级限制的查看与调整 {#limits-adjust}

**这是本篇最需要实操掌握的一节。** 调整前先明确：你要调的是哪一层？

##### 2.1 系统级（整机）调整

```bash
# 查看当前值
$ sysctl fs.file-max fs.nr_open
fs.file-max = 1631499
fs.nr_open = 1048576

# 临时调整（重启失效）
$ sysctl -w fs.file-max=2097152

# 永久调整（推荐写入 /etc/sysctl.d/ 而非 /etc/sysctl.conf）
$ echo "fs.file-max = 2097152" > /etc/sysctl.d/99-fd.conf
$ sysctl --system          # 重新加载全部配置
$ sysctl fs.file-max       # 确认生效

# 验证整机用量
$ cat /proc/sys/fs/file-nr
```

| 参数 | 含义 | 建议 |
| --- | --- | --- |
| `fs.file-max` | 整机 fd 总数上限 | 现代内核按内存自动算得很大，**通常不用动**。要动说明有问题 |
| `fs.nr_open` | 单进程 fd 硬天花板 | 需要 `ulimit -Hn` 超过 1048576 时才要一起调。**先改它，再改硬限制** |
| `fs.inotify.max_user_instances` | 每用户 inotify 实例上限 | 热加载类应用大量使用时需要调大 |
| `fs.inotify.max_user_watches` | 每用户监听项上限 | 同上 |

:::warning 调系统级之前先想清楚

`fs.file-max` 在主流发行版上**默认值通常非常宽松**（百万级）。如果你发现整机 fd 快满了，那几乎一定是**有进程在泄漏或 fork 风暴**——**去调这个参数等于把警报器拆掉**。

正确顺序永远是：**先查是谁在泄漏，再决定要不要调上限。**

:::

##### 2.2 进程级：临时调整（当前 shell）

```bash
$ ulimit -n 65535              # 把软限制提到 65535（需不超过硬限制）
$ ulimit -Hn 65535             # 提高硬限制（需 root）
$ ulimit -n                    # 确认
65535

# 只对某一条命令生效，不影响当前 shell
$ bash -c 'ulimit -n 65535 && exec ./myservice'
```

:::warning 普通用户改不了硬限制

普通用户执行 `ulimit -Hn 65535` 会失败；`ulimit -n` 也只能在**硬限制范围内**提高软限制。这是内核的安全设计，不是 bug。

另外，**提高硬限制不能超过 `fs.nr_open`**，否则报 `Invalid argument`。

:::

##### 2.3 进程级：永久调整（登录会话）

对**通过 SSH 等登录方式启动**的进程，用 limits.conf 体系：

```bash
# 推荐：单独放一个文件，避免与其他配置混在一起
$ vi /etc/security/limits.d/99-nofile.conf

*      soft    nofile    65535
*      hard    nofile    65535
root   soft    nofile    65535
root   hard    nofile    65535
app    soft    nofile    131072
app    hard    nofile    131072
```

```bash
# 老式位置（功能相同，但不推荐，容易被覆盖）
# /etc/security/limits.conf
```

| 列 | 含义 |
| --- | --- |
| 第 1 列 | 生效对象：用户名 / 组名（`@组名`）/ `*` 通配 |
| 第 2 列 | `soft` 或 `hard`（也可以是 `-` 表示同时设置两者） |
| 第 3 列 | 资源名：`nofile`（打开文件数）、`nproc`（进程数） |
| 第 4 列 | 数值 |

:::danger 三个必踩的坑

1. **limits.conf 只对 PAM 登录会话生效**——systemd 服务、cron、容器全都**不读它**。这是「改了不生效」的头号原因。
2. **多条规则命中同一进程时，后出现的生效**。所以把**具体用户**的条目写在 `*` 通配**之后**，否则会被通配规则覆盖。
3. **`*` 不一定包含 root**（部分发行版的 PAM 配置会排除 root），所以 root 通常要单独写一行。

**验证方式**：重新登录（`logout` 后再 `ssh` 进来，`su - ` 也可以），然后 `ulimit -n`。**不要在同一个 shell 里验证**——那个 shell 的限制早就固定了。

:::

##### 2.4 进程级：systemd 服务（最重要的一种）

**生产服务绝大多数由 systemd 托管，这一类必须用 `LimitNOFILE=`。**

```bash
# 1. 查看当前设置
$ systemctl show myapp.service | grep -i limit
LimitNOFILE=1024:524288

# 2. 用 override 覆盖（推荐，不会被包升级覆盖）
$ systemctl edit myapp.service
```

在打开的编辑器里写入：

```ini
[Service]
LimitNOFILE=65535
```

```bash
# 3. 生效
$ systemctl daemon-reload
$ systemctl restart myapp.service

# 4. 最终验证（必须看这里，不能只看配置文件）
$ cat /proc/$(systemctl show -p MainPID --value myapp.service)/limits | grep "Max open files"
Max open files            65535                65535                files
```

| 写法 | 位置 | 影响范围 | 生效方式 |
| --- | --- | --- | --- |
| `[Service] LimitNOFILE=` | `systemctl edit <svc>` | 单个服务 | `daemon-reload` + `restart` |
| `[Service] LimitNOFILE=` | unit 文件 | 单个服务（易被升级覆盖） | `daemon-reload` + `restart` |
| `DefaultLimitNOFILE=` | `/etc/systemd/system.conf` | 所有服务 | `daemon-reexec` + `restart` |

:::tip 为什么不用 DefaultLimitNOFILE

改全局默认值影响面太大，而且容易和其他团队的配置互相打架。**给单个服务写 override 才是正解**——这也符合「变更最小化」的原则。

:::

##### 2.5 进程级：容器

```bash
# Docker：启动时指定
$ docker run --ulimit nofile=65535:65535 myapp:latest

# docker-compose
# services:
#   myapp:
#     ulimits:
#       nofile:
#         soft: 65535
#         hard: 65535

# 验证（容器内）
$ docker exec myapp cat /proc/1/limits | grep "Max open files"
```

Kubernetes **没有**标准的 pod 级 ulimit 字段，实践中靠 kubelet 配置（`defaultLimits`）、容器运行时配置或平台侧统一规范。**排查时直接进容器 `cat /proc/1/limits` 以实测为准**，不要假设。

##### 2.6 已经跑起来的进程：prlimit

```bash
# 查看
$ prlimit --pid 12345 --nofile

# 调整（root）
$ prlimit --pid 12345 --nofile=131072:131072

# 验证
$ cat /proc/12345/limits | grep "Max open files"
```

:::danger 注意 prlimit 的边界

- 提高**硬限制**需要 root 或 `CAP_SYS_RESOURCE`；
- **它不会让泄漏的 fd 被释放**，只是把天花板抬高；
- **重启即失效**，必须同步改配置，否则重启后打回原形；
- 在容器里受容器 runtime 与 seccomp 限制，可能不允许。

:::

#### 3. 代码层根治（真正的解法） {#code}

配置调整能让服务多撑，**但只有修代码才能让它不再复发**。

##### 3.1 保证「有开必有关」

用语言提供的自动资源管理，**不要手工在多个分支上写 close**：

```java
// Java：try-with-resources —— 异常路径也会关闭
try (InputStream in = new FileInputStream(src);
     OutputStream out = new FileOutputStream(dst)) {
    in.transferTo(out);
}   // 自动关闭，无需 finally

// 目录流也必须关（Files.list / walk / find 持有目录 fd）
try (Stream<Path> paths = Files.list(dir)) {
    paths.forEach(this::process);
}
```

```go
// Go：defer 紧跟资源获取之后
f, err := os.Open(path)
if err != nil { return err }
defer f.Close()

// 循环里注意：不要在 for 中 defer 累计
for _, p := range paths {
    func() error {
        f, err := os.Open(p)
        if err != nil { return err }
        defer f.Close()      // 放在内层函数里，每轮都关
        return use(f)
    }()
}
```

```python
# Python：with 语句
with open(path) as f:
    data = f.read()
# 连接同理：with closing(conn) / 用上下文管理器
```

##### 3.2 连接必须「连接池 + 上限 + 超时 + 复用」

| 要点 | 具体做法 |
| --- | --- |
| 复用 | 开启 HTTP Keep-Alive，用连接池而不是每次新建 |
| 上限 | `maxPoolSize` 按业务并发定（经验量级 `核数 × 2~4`） |
| 获取超时 | `connectionTimeout`（如 3s），**宁可快速失败也不无限排队** |
| 空闲回收 | `idleTimeout`、`maxLifetime`（**小于数据库 `wait_timeout`**） |
| 调用超时 | **连接超时 + 读超时都要设**，这是防堆积最关键的一条 |
| 重试 | 限次（1~2 次）+ 指数退避 + 仅幂等操作 |

##### 3.3 消除「异常路径泄漏」

- 用 try-with-resources / `defer` / `with`，而不是手工 `close()`；
- 代码评审**重点看异常分支和提前 return 的分支**——泄漏高发区；
- 有 `Selector`、`WatchService`、`EventLoopGroup` 的地方，确认生命周期结束时统一关闭并复用。

##### 3.4 加一道保险：泄漏自检

在应用内加一个轻量的 fd 计数埋点，**超过基线一定比例就报警甚至自愈**：

```bash
# 最简单的自检：把 fd 数接入监控（见预防体系）
$ ls /proc/$$/fd | wc -l
```

很多成熟的网关/中间件都有「连接数超阈值自动重启」的保命机制——**它不优雅，但能避免半夜被叫起来**。

#### 4. 预防体系：让问题不再裸奔 {#prevent}

比「会修」更重要的是「**在耗尽的几小时前就知道**」。fd 是一个**缓慢增长、可预测**的资源，因此它比 CPU 更好防。

| 指标 | 建议监控项 | 经验告警线（仅供参考） |
| --- | --- | --- |
| 进程 fd 使用率 | `process_open_fds / process_max_fds` | 超过 70% 预警，85% 告警 |
| 进程 fd 增长趋势 | 与 1 天前同期对比 | 持续单调增长即预警（**比绝对值更有价值**） |
| 整机 fd 使用率 | `node_filefd_allocated / node_filefd_maximum` | 超过 70% 预警 |
| 连接数 | 按下游维度统计的 established | 相对基线翻倍 |
| `CLOSE_WAIT` | 数量 | 持续大于 0 且增长——**这是泄漏的早期信号** |
| `TIME_WAIT` 增速 | 每秒新增 | 快速增长说明短连接激增 |
| 连接池 | 使用率、等待数 | 使用率 ≥ 80% 报警 |

同时建议做三件事：

1. **所有服务器开启连接数与 fd 的历史采集**（node_exporter 自带 `node_filefd_*`），保留 30 天以上，这样出事时能回溯「什么时候开始涨的」；
2. **把 `cat /proc/PID/limits` 的输出纳入发布检查清单**——每次发布后确认新实例的限制符合预期（这条能提前拦掉一大类问题）；
3. **定期做一次泄漏压测**：用接近峰值的并发持续跑 1~2 小时，观察 fd 是否回到基线。**能回到基线才算健康**。

:::tip 最有效的单条预防措施

如果只能做一件事，就监控「**fd 增长趋势**」而不是「fd 绝对值」。绝对值高但平稳的系统是健康的；绝对值低但单调上升的系统正在走向故障。**趋势是唯一能提前几小时预警的指标。**

:::

:::note 本章小结

**应急保业务 → 分清是配置还是泄漏 → 分别根治 → 监控防复发**，四步走完才算真正「解决」。最后附上[速查表](#cheatsheet)，把常用命令和指标浓缩成一页。

:::

### 典型案例库 {#cases}

把前面学的方法落到真实场景里。本章收录 4 个高频问题案例，每个案例都按「现象 → 排查过程（完整命令链）→ 判断依据 → 处置 → 复盘要点」展开，覆盖连接泄漏、文件泄漏、配置不生效与安全事件四类。如果你的问题是「别的系统拖累」——下游慢、被高频轮询、连接池不匹配等，直接去看[系统间交互案例](#cases-interaction)。

#### 案例一：Java 服务每 3 天准时挂掉

**现象**：订单服务 `order-service` 上线后每隔 3 天左右必然报错 `Too many open files`，接口 500，重启后立刻恢复正常，3 天后又复发。运维已经习惯了「定时重启」，但周期从最初的 5 天逐渐缩短到 3 天。

**排查过程**：

```bash
$ cat /proc/12345/limits | grep "Max open files"
Max open files            65535                65535                files
# 上限已经调到 65535，不是配置问题 —— 排除配置方向

$ ls /proc/12345/fd | wc -l
65482                    ← 已经顶到上限

$ lsof -p 12345 | awk '$4 ~ /^[0-9]/ {print $5}' | sort | uniq -c | sort -rn
    61240 IPv4           ← 94% 都是网络连接，方向锁定
     3120 REG
      842 anon_inode:[eventpoll]
      280 FIFO

$ ss -tn state close-wait | wc -l
48210                    ← 巨量 CLOSE_WAIT，典型的本端未关闭

$ lsof -p 12345 | grep -c "can't identify protocol"
3120                     ← 进一步坐实连接泄漏

$ lsof -p 12345 -a -i | awk '{print $9}' | sed 's/.*->//' | cut -d: -f1 | sort | uniq -c | sort -rn | head -3
    52100 db01           ← 绝大多数堆在数据库连接上
     8900 redis01
     2400 api.partner.com
```

再看趋势（重启后立刻开始采样）：

```bash
$ while true; do printf '%s ' "$(date '+%T')"; ls /proc/12345/fd | wc -l; sleep 60; done
10:00:01 1240
10:01:02 1258
10:02:03 1276
10:03:04 1294     ← 每分钟涨 18 个，只增不减，且几乎全是数据库连接
```

**判断依据**：

- fd 数单调上升、重启后归零重爬 → **确定是泄漏**，不是配置问题；
- `CLOSE_WAIT` 巨量堆积 → 对端（数据库）已关闭，应用侧没有 close；
- `can't identify protocol` 有值 → 连接对象被丢弃却没关闭；
- 增长集中在 `db01` → 泄漏点在数据库访问代码。

进一步用 strace 确认为异常分支泄漏：

```bash
$ strace -f -c -p 12345 --timeout 10
calls  syscall
 4200  connect        ← 建连
 4200  close          ← 关闭次数居然对得上？
```

:::warning 为什么 strace 看着「配对」却仍然泄漏

因为**泄漏发生在低频的异常分支上**——比如「数据库返回超时错误」时忘记 close，这种分支 10 秒采样窗口里可能一次都没触发。**`-c` 的汇总统计会把偶发分支稀释掉**。

这时要看**明细**而不是汇总：

```bash
$ strace -f -e trace=connect,close -p 12345 2>&1 | grep -B2 -A2 "ETIMEDOUT" | head -40
```

最终在代码里定位到：`OrderDao.queryWithRetry()` 在捕获 `SQLTimeoutException` 后直接返回，**漏掉了 `conn.close()`**（连接由方法内部创建，没有用连接池）。

**处置与复盘**：

1. **应急**：滚动重启 + `prlimit` 临时抬到 131072，争取修复时间；
2. **根因**：`queryWithRetry` 的超时异常分支提前 return，跳过了 close；该路径由「下游偶发超时」触发，因此是低频、难复现的泄漏；
3. **预防**：改成连接池 + try-with-resources；把 `CLOSE_WAIT` 数量纳入监控（**它比 fd 总数更早暴露问题**）；发布检查清单里增加「确认 `/proc/PID/limits`」。

:::info 案例一的关键教训

**「能撑 N 天」是泄漏的标志性特征。** 如果服务在重启后能稳定运行一段时间再挂，几乎不可能是配置问题——配置问题会立刻、稳定地复现。

另外注意：**故障周期从 5 天缩短到 3 天**，说明泄漏速率在变快（或业务量在涨）。把它当成「习惯性重启」来对待，只是把炸弹的引信变短。

:::

#### 案例二：凌晨批处理任务跑着跑着就崩

**现象**：一台文件处理服务器，每晚 1 点启动批处理任务扫描 `/data/incoming` 目录并处理每个文件。任务运行 2~3 小时后报 `Too many open files` 中断，导致早上的报表缺数据。白天没有任何问题。

**排查过程**：

```bash
$ cat /proc/12345/limits | grep "Max open files"
Max open files            1024                 4096                 files
# 软限制只有 1024 —— 但先别急着调，看看是否还泄漏

$ ls /proc/12345/fd | wc -l
1024                     ← 顶到上限

$ lsof -p 12345 | awk '$4 ~ /^[0-9]/ {print $5}' | sort | uniq -c | sort -rn
     960 REG               ← 96% 是普通文件，不是连接！
      42 DIR
      12 IPv4

$ lsof -p 12345 | grep "\.tmp" | head -5
java  12345 app 812r REG 253,0 4096 1048601 /data/incoming/report_003.csv

$ lsof +L1 | grep -i deleted | head -5
java  12345 app 913u REG 253,0 0 1048712 /data/tmp/work.tmp (deleted)
```

**判断依据**：

- `REG` 占 96% → 是**文件句柄泄漏**，不是连接；
- `DIR` 有 42 个 → 目录遍历也没关（`Files.list` 的典型症状）；
- `+L1` 能看到 `(deleted)` 文件被占着 → 说明有 fd 没释放，文件删了引用还在；
- 任务只在晚上跑 → 泄漏随处理文件数线性增长。

定位代码：

```bash
# 用 bpftrace 直接打出「谁在不停打开文件」的调用栈（低峰期/预发环境）
$ bpftrace -e '
kprobe:do_sys_open /pid == 12345/ { @[ustack()] = count(); }
interval:s:30 { print(@); exit(); }'
```

栈顶指向 `BatchProcessor.processDir(BatchProcessor.java:64)`。

**根因**：

```java
// 问题代码
public void processDir(Path dir) throws IOException {
    Stream<Path> paths = Files.list(dir);          // ① 持有目录 fd，从未关闭
    List<String> names = paths.map(...).collect(...);
    for (String name : names) {
        InputStream in = new FileInputStream(dir.resolve(name));   // ② 循环里开，从不关
        handle(in);
    }
}
```

两个问题叠加：目录流未关闭（每次调用泄漏 1 个 DIR fd），以及循环内文件流从不关闭（每处理一个文件泄漏 1 个 REG fd）。

**处置与复盘**：

1. **应急**：`prlimit --pid 12345 --nofile=65535:65535` 让当晚任务跑完（**注意：只是买时间**）；
2. **根因**：`Files.list` 未用 try-with-resources；循环内 `FileInputStream` 从未关闭；
3. **修复**：

```java
public void processDir(Path dir) throws IOException {
    try (Stream<Path> paths = Files.list(dir)) {        // 目录流自动关闭
        paths.filter(Files::isRegularFile).forEach(p -> {
            try (InputStream in = new FileInputStream(p.toFile())) {  // 每个文件流自动关闭
                handle(in);
            } catch (IOException e) {
                log.warn("处理失败: {}", p, e);
            }
        });
    }
}
```

4. **预防**：`/etc/security/limits.d/` 与 systemd 里把 nofile 提到 65535（因为批处理任务确实需要更多）；批量任务增加「每处理 N 个文件自检 fd 数」的埋点；把「处理完的 fd 数应回到基线」作为定时任务的健康检查。

:::tip 案例二的通用教训

**循环里的资源必须逐个关闭。** 无论是文件、连接还是目录流，只要在 `for` 里 `open`，就必须保证每轮都 `close`——用 `try-with-resources` 放在循环体内，而不是在循环外关一次。

另一个信号：**`DIR` 类型的 fd 增长**是 Java 应用里极易被忽略的一类泄漏，因为 `Files.list()` 返回的是 `Stream`，看起来「不像需要关闭的东西」。

:::

#### 案例三：改了 limits.conf，服务重启后依然报错

**现象**：某服务报 `Too many open files`。运维查了资料，在 `/etc/security/limits.conf` 里加了 `* soft nofile 65535` 和 `* hard nofile 65535`，`reboot` 都做了，但服务重启后**依然报同样的错**。

**排查过程**：

```bash
# 1. 确认配置确实写了
$ grep nofile /etc/security/limits.conf
*      soft    nofile    65535
*      hard    nofile    65535

# 2. 登录 shell 里看 —— 生效了！
$ ulimit -n
65535                       ← 说明 limits.conf 配置本身没问题

# 3. 但服务进程的限制呢？（关键一步）
$ cat /proc/8888/limits | grep "Max open files"
Max open files            1024                 524288               files
#                         ↑ 软限制仍然是 1024！配置完全没作用到服务上

# 4. 服务是谁启的？
$ systemctl status myapp.service | grep "Main PID"
   Main PID: 8888 (java)

# 5. 看 systemd 给它的限制
$ systemctl show myapp.service | grep -i limit
LimitNOFILE=1024:524288
```

**判断依据**：

- 登录 shell 的 `ulimit -n` 是 65535 → **limits.conf 生效了**，配置写法没错；
- 服务进程的软限制仍是 1024 → **说明服务和登录会话走的是两条完全不同的路径**；
- 服务由 systemd 启动 → **systemd 不经过 PAM，不读 limits.conf**。

这是「改了不生效」里最经典的一种：**配置改了、也重启了、`ulimit` 也验证了，但改的是错的对象。**

**处置**：

```bash
# 用 override 给服务单独设置（推荐做法）
$ systemctl edit myapp.service
```

```ini
[Service]
LimitNOFILE=65535
```

```bash
$ systemctl daemon-reload
$ systemctl restart myapp.service

# 最终验证 —— 必须看 /proc/PID/limits
$ cat /proc/$(systemctl show -p MainPID --value myapp.service)/limits | grep "Max open files"
Max open files            65535                65535                files   ← 现在才真的生效
```

**复盘要点**：

1. **认证「生效」的唯一标准是 `cat /proc/PID/limits`**，不是配置文件内容、也不是 shell 里的 `ulimit`；
2. 记住生效路径的分歧：

| 启动方式 | 限制来自 | 改哪里 |
| --- | --- | --- |
| SSH 登录后手动启动 | PAM → limits.conf | `/etc/security/limits.d/*.conf` |
| **systemd 服务** | **unit 文件的 `LimitNOFILE=`** | **`systemctl edit`** |
| cron 任务 | 不可靠（视发行版） | **脚本内显式 `ulimit -n`** |
| 容器 | 容器运行时 | `--ulimit` / 平台配置 |

3. 把「确认 `/proc/PID/limits`」写进发布检查清单——这一条能提前拦掉本案例这类问题。

:::danger 本案例最值得记住的一点

`ulimit -n` 显示 65535 却仍然报错，会让人怀疑「是不是有别的限制」，从而浪费大量时间去查 `fs.file-max`、`fs.nr_open`、`/proc/sys/fs/file-nr`——**但那些都不是问题所在**。

**排查限制类问题，第一步永远是对目标进程执行 `cat /proc/PID/limits`**。它绕过所有配置层面的猜测，直接告诉你内核眼里这个进程的真实限制。

:::

#### 案例四：句柄告警揪出挖矿进程

**现象**：一台边缘节点服务器 fd 使用率告警（`node_filefd_allocated` 达 85%），同时 CPU 也偏高。初判为「某个服务连接泄漏」。

**排查过程**：

```bash
$ cat /proc/sys/fs/file-nr
1420000    0    1631499        ← 整机 fd 接近上限，问题在全局

# 关键：找出 fd 数最多的进程，而不是只看单个服务的 fd
$ for p in /proc/[0-9]*; do
    n=$(ls $p/fd 2>/dev/null | wc -l)
    [ "$n" -gt 500 ] && echo "$n $(cat $p/comm 2>/dev/null) ${p#/proc/}"
  done | sort -rn | head -10
 48000 systemd-network    3731
  8200 java               2104
  6200 java               3188
```

```bash
$ ps -p 3731 -o pid,user,etime,cmd
  PID USER     ELAPSED CMD
 3731 root       12-03:44 [systemd-network]      ← 进程名仿系统组件，TIME 长达 12 天
```

```bash
$ ls -l /proc/3731/exe
lrwxrwxrwx ... /proc/3731/exe -> /tmp/.X11-unix/kworker   ← 可执行文件在 /tmp 隐藏目录

$ lsof -p 3731 -a -i | head -5
COMMAND  PID USER   FD   TYPE  ...  NAME
systemd-network 3731 root  8123u IPv4 ... TCP node07:54321->203.0.113.7:4444 (ESTABLISHED)
systemd-network 3731 root  8124u IPv4 ... TCP node07:54322->203.0.113.7:4444 (ESTABLISHED)
# 48000 个 socket 全部外联到同一个陌生 IP 的 4444 端口

$ ss -tnp | grep 3731 | wc -l
47960
```

**判断依据**：

- 进程名伪装成系统组件（`systemd-network`，真身叫 `systemd-networkd`）；
- `/proc/PID/exe` 指向 `/tmp/.X11-unix/` 隐藏目录 → 强恶意软件特征；
- **48000 个 socket 全部外联同一个陌生 IP** → 不是业务连接泄漏，是矿池连接；
- 累计运行 12 天 → 长期潜伏。

**处置与复盘**：

1. **隔离**：防火墙阻断 `203.0.113.7`，停进程；
2. **取证**：保存 `ls -l /proc/PID/exe cwd`、`lsof -p PID`、`ss -tnp`、`crontab -l`、`~/.ssh/authorized_keys`、`/var/log/secure` 之后再清理；
3. **溯源**：`/var/log/secure` 显示该机器 SSH 弱口令被爆破成功，攻击者留下持久化后门；
4. **加固**：禁密码登录改密钥、部署 fail2ban、最小化暴露端口，并把「**单进程 fd 数异常且集中于单一外部 IP**」加入安全告警规则。

:::tip 用「fd 排名」快速排除安全事件

案例 12（恶意进程）值得**优先排除**，因为成本极低——一条命令就能否掉：

```bash
$ for p in /proc/[0-9]*; do
    n=$(ls $p/fd 2>/dev/null | wc -l)
    [ "$n" -gt 1000 ] && echo "$n $(cat $p/comm 2>/dev/null) ${p#/proc/}"
  done | sort -rn | head
```

如果 fd 最多的那个进程是你不认识的，后面的业务排查就不用做了。

:::

:::note 四个案例的共同主线

都逃不出同一套路：**先看上限（`/proc/PID/limits`）→ 采样看趋势（是否泄漏）→ 分类看构成（`lsof` 按 TYPE）→ 定位对端或文件 → 抓代码**。

案例一是**连接泄漏**，案例二是**文件泄漏**，案例三是**配置改了不生效**，案例四是**安全事件**。前三者都以「调大上限」为应急手段，但**只有找到并修掉泄漏或配对正确路径才算真正解决**。如果排查一圈发现「本机 fd 构成正常、却是被下游拖死的」——下游慢、被高频轮询、连接池与数据库不匹配——请看[系统间交互案例](#cases-interaction)。

:::

### 系统间交互案例 {#cases-interaction}

上一章的案例都是「机器内部自己出问题」，本章换个视角：**句柄耗尽是别的系统「牵连」出来的**。应用在等下游、被上游高频短连、被探针轮询、和数据库的连接策略不匹配——这些场景的共同特征是：**fd 数随下游状态或上游行为同步变化，服务自身代码没有明显 bug**。

排查这类问题的关键思路一句话：**先看 fd 是什么类型（`lsof` 的 TYPE），再看它连向谁（`lsof`/`ss` 的对端），最后看对端状态**。

#### 案例一：下游接口变慢，上游连接被拖爆

**现象**：订单服务调用库存服务，下午库存服务抖动 5 分钟，订单服务 fd 冲高报警：从 800 涨到 65000，接口大量超时。库存恢复后，订单服务的 fd 仍然没有回落。

**排查思路**：

```bash
$ ls /proc/12345/fd | wc -l
64820                    ← 接近上限

$ lsof -p 12345 | awk '$4 ~ /^[0-9]/ {print $5}' | sort | uniq -c | sort -rn | head -3
    63100 IPv4
     1240 REG
      480 anon_inode:[eventpoll]

$ lsof -p 12345 -a -i | awk '{print $9}' | sed 's/.*->//' | cut -d: -f1 | sort | uniq -c | sort -rn | head
    62100 stock-svc        ← 绝大多数堆积在库存服务上
      800 api.partner.com

$ ss -tnp state established '( dport = :8081 )' | wc -l
62100                    ← 6 万条到库存服务的连接

$ ss -tn state close-wait | wc -l
0                        ← 注意：这里是 0，说明不是「没 close」的泄漏
$ ss -tn state time-wait | wc -l
4820
```

:::warning 关键分叉：CLOSE_WAIT 为 0，说明不是代码泄漏

案例一（第三章）里 `CLOSE_WAIT` 堆积如山，是**代码没关连接**；而这里 `CLOSE_WAIT` 为 **0**，连接都是 `ESTABLISHED`——说明连接**还活着**，只是**一直没结束**。

**这两种情况的解法完全不同**：前者要改代码，后者要改超时和熔断。**`CLOSE_WAIT` 是区分二者的最关键指标。**

:::

```bash
$ jstack 12345 | grep -c "java.lang.Thread.State: WAITING"
712                       ← 800 个线程里 712 个在等
$ jstack 12345 | grep -A 8 "http-nio-8080-exec-123"
"http-nio-8080-exec-123" ... java.lang.Thread.State: WAITING (parking)
        at java.util.concurrent.FutureTask.awaitDone(FutureTask.java:...)
        at com.example.order.client.StockClient.deduct(StockClient.java:52)
$ jstack 12345 | grep -B2 -A4 "socketRead" | head -12
        at sun.nio.ch.SocketDispatcher.read0(Native Method)   ← 卡在读下游回包，不是在死循环
```

再确认时间线：库存服务延迟从 `14:02` 开始上升，订单服务 fd 从 `14:03` 开始涨、`14:08` 冲顶——典型的**下游故障被调用方放大**。

**解决方法**：

1. **必设超时，且分级**：连接超时 1s、读超时按下游 SLA 设 2~5s。**没有读超时是这类问题的头号原因**——请求会无限挂起，连接永不释放；
2. **重试限次 + 指数退避 + 仅幂等**：最多 1~2 次，100ms→500ms 递增，写操作重试要防重复；
3. **熔断快速失败**：下游错误率超阈值（如 50%）后直接失败，不再发起调用，防止把连接数继续推高；
4. **连接池必须有上限和获取超时**：`maxPoolSize` + `connectionTimeout=3s`，要让「取不到连接」快速失败，而不是无限排队（否则线程也跟着堆）；
5. **隔离资源池**：给不同下游配独立的连接池/线程池，避免一个慢下游把所有 fd 吃掉；
6. **监控下游**：把下游延迟与错误率单独接入告警——**在 fd 报警之前就先发现**，而不是等自己被拖爆。

#### 案例二：上游高频短连，被压垮的是我

**现象**：某内部 API 服务 fd 缓慢报警、`TIME_WAIT` 数量持续数万，但自身业务量并不大。排查发现请求来自上游的定时任务。

**排查思路**：

```bash
$ ss -s
TCP:  total 31200 (estab 1200, timewait 29800)     ← 绝大多数是 TIME_WAIT

$ cat /proc/net/sockstat | grep TCP
TCP: inuse 1250 orphan 12 tw 29800 alloc 31200 mem 210

# 谁在连我？按来源 IP 统计
$ ss -tn state time-wait | awk '{print $4}' | cut -d: -f1 | sort | uniq -c | sort -rn | head
   28400 10.20.1.33          ← 单一来源，占了 95%
$ ss -tn state time-wait '( sport = :8080 )' | wc -l
28400

# 本机可用端口范围（判断是否有耗尽风险）
$ sysctl net.ipv4.ip_local_port_range
net.ipv4.ip_local_port_range = 32768	60999    ← 只有 28232 个端口，放不下 28400 个 TIME_WAIT
```

再配合抓包确认是「每次新建连接」而不是复用：

```bash
$ tcpdump -n -i eth0 'tcp port 8080 and tcp[tcpflags] & tcp-syn != 0' -c 20
14:00:01.001 IP 10.20.1.33.51234 > 10.20.0.7.8080: Flags [S]   ← 每次都是新的 SYN
14:00:01.052 IP 10.20.1.33.51235 > 10.20.0.7.8080: Flags [S]
14:00:01.103 IP 10.20.1.33.51236 > 10.20.0.7.8080: Flags [S]
# 每 ~50ms 一个新连接，源端口递增 → 完全没有复用
```

**判断依据**：

- `TIME_WAIT` 占 TCP 总量 95%，且集中在单一来源 IP；
- 抓包显示每个请求都新建连接（源端口递增）→ **上游没有使用连接池 / Keep-Alive**；
- 本机 `ip_local_port_range` 只有 2.8 万个端口，已经接近耗尽风险。

**解决方法**：

1. **推动上游复用连接**（治本）：HTTP 客户端开启 Keep-Alive + 连接池，把「每次新建」改成「复用长连接」，`TIME_WAIT` 会直接降一到两个数量级；
2. **上游降频 + 批量**：定时任务改为 30s~5min 一次，或把多次小请求合并为一次批量请求；
3. **服务端支持长连接**：确认 Nginx / 网关的 `keepalive_timeout` 配置合理（如 65s），不要在服务端主动关闭导致连接无法复用；
4. **调整本地端口范围**（缓解）：`net.ipv4.ip_local_port_range` 扩到 `10000 65000`，但**这只是缓解，不是解决**；
5. **谨慎对待 `tcp_tw_reuse`**：它只在特定条件下允许复用 TIME_WAIT 端口，**对「连入」的连接无效**（只影响本机主动发起的连接）。而且**绝不要用 `tcp_tw_recycle`**——它在 NAT 环境下会导致连接失败，且已从新内核中移除。

:::warning 「TIME_WAIT 太多」几乎从来不是本机该调内核参数就能解决的

`TIME_WAIT` 是 TCP 的正常保护状态，**它是「症状」不是「病因」**。真正的病因是**短连接**。把精力花在调 `tcp_tw_*` 参数上，通常只能获得很有限的缓解，而让上游开启连接复用的收益是数量级的差别。

:::

#### 案例三：连接池与数据库 wait_timeout 不匹配

**现象**：应用 fd 数在每天上午出现一批「死连接」——服务运行一夜后，早高峰第一批请求大量报 `Communications link failure`；同时 fd 数偏高，数据库侧 `Threads_connected` 顶到上限。

**排查思路**：

```bash
$ ss -tn state established '( dport = :3306 )' | wc -l
880                       ← 应用侧看到 880 条连接

# 数据库侧视角（关键：两边对不上）
mysql> SHOW GLOBAL STATUS LIKE 'Threads_connected';
+-------------------+-------+
| Threads_connected |   420 |     ← 数据库只认 420 条
+-------------------+-------+

mysql> SHOW VARIABLES LIKE 'wait_timeout';
+---------------+-------+
| wait_timeout  | 28800 |          ← 8 小时
+---------------+-------+

mysql> SHOW PROCESSLIST;
# 大量 Sleep 状态的连接，且部分是应用侧已认为「可用」的
```

应用侧连接池配置：

```bash
# 检查连接池的 maxLifetime 设置（以 HikariCP 为例）
$ grep -i "maxLifetime\|idleTimeout\|maximumPoolSize" /opt/app/config/application.yml
maximumPoolSize: 200
maxLifetime: 1800000        # 30 分钟
idleTimeout: 600000         # 10 分钟
```

再看应用侧的连接状态分布：

```bash
$ ss -tnp | grep 12345 | awk '{print $NF}' | sort | uniq -c | sort -rn | head
    520 ESTABLISHED
    360 CLOSE-WAIT      ← 关键：存在 CLOSE-WAIT，说明数据库先关了，应用没感知

$ lsof -p 12345 | grep -c "can't identify protocol"
280                       ← 有大量「已死但未回收」的 socket
```

**判断依据**：

- 应用侧 880 条 vs 数据库侧 420 条 → **两边视图不一致**，应用手里有大量「数据库已经不认」的死连接；
- 存在 `CLOSE_WAIT` 与 `can't identify protocol` → 应用没有及时清理失效连接；
- `wait_timeout=28800`（8 小时）却在早高峰出问题 → 说明有连接的闲置时间超过了数据库侧的回收阈值（可能是数据库侧另有 `interactive_timeout` 或网络设备/NAT 空闲超时先掐断了）；
- **`maxLifetime` 30 分钟理论上小于 8 小时，但如果有连接长期空闲未被 `idleTimeout` 回收，或存在中间网络设备（如 5 分钟空闲就断的防火墙），实际断链时机就提前了。**

:::tip 一个常被忽略的中间层：网络设备

`wait_timeout` 对不上只是原因之一。**很多 RDS / 云数据库前面的负载均衡或防火墙有空闲超时（常见 5~15 分钟）**，会先于数据库把空闲连接掐断，而应用完全不知道。此时无论怎么调 `wait_timeout` 都没用。

**判断方法**：抓包看连接是被谁断的（收到 FIN 的一方是谁），或直接看中间设备的空闲超时配置。

:::

**解决方法**：

1. **`maxLifetime` 必须小于所有「可能中断连接」的超时中的最小值**——不只是数据库 `wait_timeout`，还要考虑中间网络设备的空闲超时。经验做法是取「最小值 × 0.8」左右，例如最小中断阈值是 5 分钟，则 `maxLifetime=4m`;
2. **`idleTimeout` 用来回收长期空闲连接**：设一个合理的值（如 10 分钟），避免闲置连接被中间设备静默掐死；
3. **开启连接有效性检测**：`SELECT 1` 心跳或 JDBC 的 `isValid()`，在借出连接前验证（注意**不要每次 checkout 都验证**，成本高；用空闲验证即可）;
4. **`maximumPoolSize` 按真实并发定**：200 在多实例部署下可能已经是 200 × N，需与数据库 `max_connections` 统筹；经验量级 `核数 × 2~4`;
5. **设连接获取超时**：`connectionTimeout=3s` 快速失败，避免线程和 fd 一起堆;
6. **监控两端一致性**：把「应用侧连接数」与「数据库 `Threads_connected`」放在同一个看板对比——**两者长期偏离就是死连接在堆积**。

#### 案例四：健康检查与监控探针的隐性开销

**现象**：4 核网关服务器 fd 呈规律性脉冲增长，每 2~5 秒一个尖峰，`sshd` 与 TCP 连接数不高但始终有波动。业务量很小，但 `TIME_WAIT` 数以万计。

**排查思路**：

```bash
$ ss -tn state time-wait | awk '{print $4}' | cut -d: -f1 | sort | uniq -c | sort -rn | head
   8200 10.0.0.5           ← LB 的健康检查
   6400 10.0.0.9           ← 监控系统
   3100 10.0.0.11          ← 另一套监控

$ ss -tnp state time-wait '( sport = :8080 )' | wc -l
17700

# 抓包看频率
$ tcpdump -n -i eth0 'tcp port 8080 and tcp[tcpflags] & tcp-syn != 0' -c 10 -ttt
 00:00:00.000001 IP 10.0.0.5.51234 > 10.0.0.7.8080: Flags [S]
 00:00:02.001234 IP 10.0.0.5.51235 > 10.0.0.7.8080: Flags [S]   ← LB 每 2 秒一次
 00:00:02.102345 IP 10.0.0.9.51236 > 10.0.0.7.8080: Flags [S]   ← 监控也在打
 00:00:05.003456 IP 10.0.0.11.51237 > 10.0.0.7.8080: Flags [S]
```

```bash
# 看探针请求的是哪个路径、是否走了重量级逻辑
$ grep "GET /health" /var/log/nginx/access.log | tail -5
10.0.0.5 - - [16/Sep/2026:14:00:00 +0800] "GET /health HTTP/1.1" 200 12 "-" "LB-HealthCheck/1.0"
# 如果 /health 里连了数据库、Redis，那就更糟了
```

**判断依据**：

- 脉冲周期固定（2~5 秒），来源是多套系统；
- 探针**每次都用新连接**（源端口递增），没有复用；
- 多套监控并存，同一台机器被打了好几遍。

**解决方法**：

1. **降低检查频率**：健康检查 5~30 秒足够，只有故障期间的快速摘除才需要更密；
2. **收敛监控入口**：多套监控并存时收敛到一套主采集，或给不同系统错峰；
3. **让健康检查轻量化**：`/health` 只做进程存活判断，**不要在里面连数据库/Redis/下游**（这会让探针变成业务流量，还会在依赖抖动时误摘节点）；
4. **开启 Keep-Alive**：让 LB 与监控的探测连接可复用（LB 侧配置 `keepalive` 即可显著降低 `TIME_WAIT`）；
5. **用主动推送替代轮询**：能装 Agent 的机器优先用 node_exporter 之类的推送式采集，比外部轮询开销低一个数量级；
6. **网络隔离**：管理网与业务网分离，限制探针来源 IP。

#### 交互型问题的共性排查与预防 {#interaction-common}

**三步排查法（记住这个顺序）**：

1. **先看 fd 是什么类型** — `lsof -p PID | awk '$4 ~ /^[0-9]/ {print $5}'` 分类。`IPv4`/`unix` 占多数 → 连接问题；`REG` 占多数 → 文件问题。**这一步就能排除一半的可能性**。
2. **再判断是「没关」还是「没结束」** — 这是本类问题的关键分叉：

| 指标 | 含义 | 解法方向 |
| --- | --- | --- |
| `CLOSE_WAIT` 大量堆积 | 对端关了，**本端没 close** | **改代码**（连接泄漏） |
| 全是 `ESTABLISHED`，`CLOSE_WAIT`=0 | 连接活着但**永不结束** | **改超时/熔断**（下游慢） |
| `TIME_WAIT` 大量 | 短连接频繁开关 | **改连接复用**（上游行为） |
| `can't identify protocol` 有值 | 内核有 socket 但进程无引用 | **改代码** |

3. **最后看对端** — `lsof -a -i` 看连接连向谁、`ss -tnp` 数出每个对端的连接数，然后去看对端状态（下游延迟、LB 配置、数据库 `Threads_connected`、中间设备空闲超时）。

**共性预防清单（每条都对应一个案例）**：

| 预防措施 | 防的是 | 对应案例 |
| --- | --- | --- |
| 所有外部调用**必设超时**（连接 + 读），分级设置 | 连接永挂、fd 单调上涨 | 案例一 |
| 重试**限次 + 指数退避 + 仅幂等** | 重试风暴放大连接数 | 案例一 |
| 连接**复用（Keep-Alive + 连接池）** | TIME_WAIT 暴涨、连接数放大 | 案例二、四 |
| `maxLifetime` **小于所有中断阈值的最小值** | 死连接堆积、两边视图不一致 | 案例三 |
| 资源池**隔离 + 上限 + 获取超时** | 单个慢下游吃掉全部 fd | 案例一、三 |
| 探针频率**匹配业务需要**，`/health` 保持轻量 | 监控把业务打爆 | 案例四 |
| **两端一致性与趋势**纳入监控 | 问题被「看不出变化」掩盖 | 全部案例 |

:::info 一句话总结本章

交互型句柄耗尽十有八九不是「没关连接」，而是**「连接没完没了」——下游慢却不设超时、上游短连却不复用、连接池与数据库各自为政**。

**用 `CLOSE_WAIT` 区分「谁的问题」**：堆积说明是自己的代码没关；为 0 说明是外部的节奏或超时配置。把「超时、退避、连接复用、池上限与生命周期、探针频率」这五件事做对，这类问题能消灭一大半。

:::

## 附录 {#appendix}

### 进阶工具与实践 {#advanced}

前面的章节解决「能不能用」，这一章解决「用得专业」。内容分四块：**方法论**（USE 框架）、**深挖工具**（fd 追踪、泄漏定位）、**限制管理**（配置即代码）、**监控对接**（Prometheus 指标与告警）。按需选读。

#### USE 方法论：排查的思维框架 {#use}

Brendan Gregg 提出的 USE 方法，是所有资源排查的通用框架。对文件描述符这个资源：

| 问题 | 含义 | fd 上的落地指标 |
| --- | --- | --- |
| **U**tilization（利用率） | 资源有多忙？ | `已分配 fd / 上限`（进程级 + 整机级） |
| **S**aturation（饱和度） | 有没有排队、排队多长？ | 连接池等待数、`accept` 队列溢出、`EMFILE` 报错次数 |
| **E**rrors（错误） | 有没有报错？ | `Too many open files`、`No space left on device`（inotify）、`dmesg` 相关错误 |

对照我们的[排查流程](#diagnosis)：第 1~2 步查的是 U（用量）+ S（趋势），第 5、6 步回答的是 S（谁在排队）与 E（报错）。

:::tip 错误检查别忘

查 fd 问题时顺手看一眼：

```bash
$ dmesg | grep -iE "too many open files|file-max|inotify|EMFILE"
```

内核层面的拒绝（比如撞到 `fs.file-max`）会在这里留痕，能帮你区分「应用的限制」和「系统的限制」。

:::

#### fd 泄漏定位：从「可疑」到「代码行」

这是本篇最实用的进阶技能。三个层次，按侵入性从小到大：

**第 1 层：趋势 + 分类（零侵入）**

```bash
# 后台采样，观察增长与构成变化
$ for i in $(seq 1 60); do
    printf '%s fd=%s ' "$(date '+%T')" "$(ls /proc/12345/fd | wc -l)"
    ls -l /proc/12345/fd | grep -c socket
    sleep 10
  done
```

**第 2 层：bpftrace 打出调用栈（低开销，推荐）**

```bash
# 谁在不停地打开文件？直接给出代码调用栈
$ bpftrace -e '
kprobe:do_sys_open /pid == 12345/ { @[ustack()] = count(); }
interval:s:60 { print(@); exit(); }'

# 谁在不停地建连接？
$ bpftrace -e '
kprobe:tcp_connect /pid == 12345/ { @[ustack()] = count(); }
interval:s:60 { print(@); exit(); }'

# 统计 fd 分配与释放，用差值确认「开多关少」
$ bpftrace -e '
tracepoint:syscalls:sys_enter_openat /pid == 12345/ { @open = count(); }
tracepoint:syscalls:sys_enter_close  /pid == 12345/ { @close = count(); }
interval:s:30 { printf("open=%d close=%d\n", @open, @close); exit(); }'
```

**第 3 层：应用侧指标（需要代码配合，最精准）**

在应用里暴露 fd 数、连接池活跃数等指标（Micrometer / Prometheus client），并配合线程栈分析。

**Java 场景的辅助手段**：

```bash
# 看线程与事件循环数量是否失控（epoll 泄漏常伴随线程数异常）
$ jstack 12345 | grep -c "^\""
$ jstack 12345 | grep -c "epollWait"
$ jstat -gcutil 12345 1000 3
```

| 现象 | 可能位置 |
| --- | --- |
| `epollWait` 线程数远多于预期 | Selector / EventLoopGroup 未复用 |
| 大量 `socketRead` 线程卡住 | 下游无超时（见[交互案例](#cases-interaction)） |
| 线程总数持续增长 | 线程池无界 + 每个任务持有连接 |

#### 配置即代码：把限制管起来 {#config-as-code}

「限制没配对」是一类可以**批量消灭**的问题。建议：

1. **systemd 服务统一模板**：在基础 unit 模板里写死 `LimitNOFILE=`，所有服务继承；
2. **容器基础镜像统一 ulimit**：在 Dockerfile / compose 模板 / K8s 准入策略里统一；
3. **发布检查清单加入 `cat /proc/PID/limits`**：让它在每次发布时被看见；
4. **限制类配置纳入代码评审**：`limits.conf`、sysctl、unit 文件都进 Git。

```bash
# 批量核查所有 systemd 服务的 nofile 设置（找出「忘了配」的服务）
$ systemctl list-units --type=service --state=running --no-legend | awk '{print $1}' | while read s; do
    v=$(systemctl show "$s" -p LimitNOFILE --value)
    echo "$v  $s"
  done | sort -n | head -20
```

:::tip 上面这条命令很值得存下来

它能在几分钟内找出**所有限制偏低的服务**——在事故发生前就把配置补齐。这比出事后再逐个排查要划算得多。

:::

#### 监控对接：Prometheus 指标与告警 {#monitor}

命令行解决「当下」，监控解决「一直」。与句柄相关的关键指标：

| 指标 | 含义 | 对应命令行 |
| --- | --- | --- |
| `node_filefd_allocated` | 整机已分配的 fd 数 | `cat /proc/sys/fs/file-nr` 第一列 |
| `node_filefd_maximum` | 整机 fd 上限 | `sysctl fs.file-max` |
| `process_open_fds` | 单进程打开的 fd 数 | `ls /proc/PID/fd \| wc -l` |
| `process_max_fds` | 单进程 fd 上限 | `cat /proc/PID/limits` |
| `node_sockstat_TCP_inuse` | 使用中的 TCP 套接字 | `cat /proc/net/sockstat` |
| `node_sockstat_TCP_tw` | TIME_WAIT 数量 | `ss -tn state time-wait` |
| `node_nf_conntrack_entries` | 连接跟踪表条目（也常被耗尽） | `sysctl net.netfilter.nf_conntrack_count` |
| `node_inotify_max_user_instances` 等 | inotify 上限 | `sysctl fs.inotify.*` |

一条可直接用的告警规则（PromQL）：

```yaml
# 示例：单进程 fd 使用率持续 10 分钟超过 80%
- alert: ProcessFdUsageHigh
  expr: |
    (process_open_fds / process_max_fds) > 0.8
  for: 10m
  labels: { severity: warning }
  annotations:
    summary: "{{ $labels.instance }} 进程 fd 使用率超 80%"

# 示例：整机 fd 使用率超过 80%
- alert: NodeFdUsageHigh
  expr: |
    (node_filefd_allocated / node_filefd_maximum) > 0.8
  for: 10m
  labels: { severity: warning }

# 最重要的一条：fd 增长趋势（与 1 天前同期对比，涨 50% 就预警）
- alert: FdGrowthTrend
  expr: |
    process_open_fds
    / clamp_min(process_open_fds offset 1d, 1) > 1.5
  for: 30m
  labels: { severity: warning }
  annotations:
    summary: "{{ $labels.instance }} fd 数较昨日同期增长超过 50%，疑似泄漏"
```

:::tip 监控的正确姿势

- **绝对值告警 + 趋势告警都要有**：绝对值防「突然撞顶」，趋势防「慢慢泄漏」；
- 趋势告警用**「与昨日同期对比」**比固定值可靠得多，能自动适应业务量的日周期波动；
- **`CLOSE_WAIT` 数量值得单独加一条告警**——它是连接泄漏最早的信号，比 fd 总数更灵敏；
- 把 fd 指标和业务指标（错误率、响应时间）放一起看，避免「指标告警但业务无恙」的空警；
- 容器环境注意 `process_open_fds` 的采集口径（要采集容器内 PID 1 的，而不是宿主机的）。

:::

:::note 进阶路线建议

先掌握 USE 框架让排查不漏项；用「趋势 + 分类」快速定性；再用 bpftrace 把问题直接定位到代码行；最后把「限制配置」和「趋势监控」固化下来，让这类问题**在耗尽前几小时就被发现**。

:::

### 速查表 {#cheatsheet}

把全站内容浓缩成一页。出问题时不用翻整本，按「场景 → 命令 → 关注指标」的顺序找到下一步。

#### 1. 场景 → 命令速查 {#scenario}

| 我想知道… | 命令 | 看什么 |
| --- | --- | --- |
| 当前 shell 的限制 | `ulimit -Sn; ulimit -Hn` | 软限制、硬限制 |
| **某进程实际生效的限制** | `cat /proc/PID/limits` | `Max open files` 两列 |
| 运行中进程的限制（不用重启） | `prlimit --pid PID --nofile` | SOFT / HARD |
| 整机 fd 上限与已用 | `cat /proc/sys/fs/file-nr` | 第 1 列 vs 第 3 列 |
| 系统级上限参数 | `sysctl fs.file-max fs.nr_open` | 两个值 |
| **进程准确的 fd 数** | `ls /proc/PID/fd \| wc -l` | 数字本身 |
| fd 都指向什么 | `ls -l /proc/PID/fd` | 符号链接目标 |
| fd 按类型分类统计 | `lsof -p PID \| awk '$4 ~ /^[0-9]/ {print $5}' \| sort \| uniq -c \| sort -rn` | IPv4 / REG / DIR 占比 |
| 连接连向了谁 | `lsof -p PID -a -i \| awk '{print $9}' \| sed 's/.*->//' \| cut -d: -f1 \| sort \| uniq -c \| sort -rn` | 对端 IP 分布 |
| 是否有连接泄漏特征 | `lsof -p PID \| grep -c "can't identify protocol"` | 大于 0 即高度可疑 |
| 是否有人攥着已删除的文件 | `lsof +L1` | `(deleted)` 条目 |
| 谁占用了某文件/端口 | `lsof /path/file`、`lsof -i :8080` | 占用者 PID |
| 套接字总量与状态分布 | `ss -s` | estab / timewait / orphaned |
| CLOSE_WAIT 数量 | `ss -tn state close-wait \| wc -l` | **泄漏 vs 超时配置的分水岭** |
| TIME_WAIT 数量 | `ss -tn state time-wait \| wc -l` | 短连接风暴 |
| 内核套接字统计 | `cat /proc/net/sockstat` | inuse / tw / orphan |
| 服务的限制设置 | `systemctl show <svc> \| grep LimitNOFILE` | 配置值（≠生效值） |
| 谁在不停打开文件 | `bpftrace -e 'kprobe:do_sys_open /pid==PID/ { @[ustack()]=count(); }'` | **调用栈直接指向代码行** |
| open/close 是否配对 | `strace -f -c -p PID --timeout 10` | 调用次数差 |
| fd 增长趋势 | `while true; do ls /proc/PID/fd \| wc -l; sleep 5; done` | **只增不减 = 泄漏** |
| fd 数最多的进程 | `for p in /proc/[0-9]*; do n=$(ls $p/fd 2>/dev/null \| wc -l); [ "$n" -gt 1000 ] && echo "$n $(cat $p/comm) ${p#/proc/}"; done \| sort -rn` | 异常进程（含恶意） |

#### 2. 限制查看与调整速查 {#limits-quick}

| 目标 | 操作 | 生效方式 |
| --- | --- | --- |
| 当前 shell 临时抬高 | `ulimit -n 65535`（软）/ `ulimit -Hn 65535`（硬，需 root） | 当前 shell 及子进程 |
| 只对一条命令生效 | `bash -c 'ulimit -n 65535 && exec ./svc'` | 该命令 |
| **登录会话永久生效** | `/etc/security/limits.d/99-nofile.conf` 写 `用户 soft/hard nofile` | **重新登录**（非当前 shell） |
| **systemd 服务生效** | `systemctl edit <svc>` → `[Service]` `LimitNOFILE=65535` | `daemon-reload` + **`restart`** |
| 全部服务默认值 | `/etc/systemd/system.conf` 的 `DefaultLimitNOFILE=` | `daemon-reexec` + restart |
| 运行中进程临时抬高 | `prlimit --pid PID --nofile=131072:131072`（需 root） | **立即，但重启失效** |
| cron 任务 | **脚本内**首行 `ulimit -n 65535` | 每次执行 |
| 容器 | `docker run --ulimit nofile=65535:65535` | 启动时 |
| 系统级参数 | `/etc/sysctl.d/99-fd.conf` 写 `fs.file-max=` `fs.nr_open=` | `sysctl --system` |
| **验证是否真的生效** | `cat /proc/PID/limits \| grep "Max open files"` | **唯一可信的验收方式** |

#### 3. 指标异常参考值 {#metrics}

以下均为**经验参考**，请以自己机器的历史基线为准：

| 指标 | 参考正常 | 值得关注 | 典型指向 |
| --- | --- | --- | --- |
| 进程 fd 使用率 | &lt; 70% | 持续 ≥ 80% | 接近耗尽，需排查 |
| 进程 fd **增长趋势** | 围绕基线波动 | **只增不减** | **泄漏（比绝对值重要）** |
| 整机 fd 使用率 | &lt; 70% | 持续 ≥ 80% | 泄漏或 fork 风暴 |
| `CLOSE_WAIT` | ≈ 0 | 持续 &gt; 0 且增长 | **本端未关闭连接（泄漏）** |
| `TIME_WAIT` | 数千 | 数万且增长快 | 短连接风暴 |
| `can't identify protocol` | 0 | &gt; 0 | 连接对象被丢弃未关闭 |
| `orphan`（sockstat） | 接近 0 | 持续偏高 | 孤立套接字堆积 |
| 连接数 vs 下游基线 | 与业务同步 | 相对基线翻倍 | 下游变慢导致堆积 |
| 应用侧 vs DB 侧连接数 | 基本一致 | 长期偏离 | 死连接堆积 |
| `fs.file-nr` 第 1 列 | 远小于第 3 列 | 接近第 3 列 | 整机告急 |

#### 4. 排查流程速览 {#flow}

1. **确认现象**：报错内容（`Too many open files`？）、影响面、最近变更；
2. **看清上限**：`cat /proc/PID/limits`（**以进程为准，不是以配置文件为准**）；
3. **采样看趋势**：只增不减 → 泄漏；稳定波动 → 配置/容量问题；**顶到上限时先用 `prlimit` 抬高再观察**；
4. **分类看构成**：`lsof -p PID | awk '$4 ~ /^[0-9]/ {print $5}' | sort | uniq -c | sort -rn`；
5. **定位对端/文件**：`lsof -a -i` 看连向谁；`lsof +L1` 看已删除文件；
6. **区分「没关」还是「没结束」**：`CLOSE_WAIT` 堆积 → 改代码；全 `ESTABLISHED` → 改超时；
7. **抓到代码**：`bpftrace` 打 `ustack()`（生产）或 `strace`（预发）；
8. **处置**：应急（`prlimit` / 重启 / 摘流量）→ 根治（修泄漏或调对配置）→ 监控防复发。

#### 5. 成因特征速记 {#cause-quick}

| 现象 | 最可能成因 |
| --- | --- |
| fd 单调上升 + `IPv4` 占多数 + `CLOSE_WAIT` 堆积 | 连接对象未关闭（代码泄漏） |
| fd 随下游延迟同步上涨 + 全是 `ESTABLISHED` | 下游变慢且无读超时 |
| fd 高但稳定 + 连接数远超并发 | 连接池上限配置过大 |
| `TIME_WAIT` 暴涨 | 没用连接池 / 短连接风暴 |
| `REG` 一路增长 | 文件流未关闭 |
| `DIR` 增长 | 目录遍历未关闭（`Files.list` 等） |
| `anon_inode:[eventpoll]` 增长 | Selector / NIO 对象未复用 |
| `anon_inode:inotify` 增长 + `No space left` | inotify 实例泄漏（**别误判成磁盘满**） |
| 单进程 fd 不高但整机 fd 暴涨 | `fork` 风暴 |
| fd 稳定卡在整数（1024/4096/65535） | nofile 配置过低 |
| fd 呈固定周期脉冲 + 来源是 LB/监控 | 高频健康检查 / 探针 |
| 陌生进程大量 socket 外联同一陌生 IP | 挖矿 / 恶意进程 |
| `ulimit -n` 是 65535 但进程限制仍是 1024 | systemd 服务没配 `LimitNOFILE` |
| `df` 满了但 `du` 找不出大文件 | 日志 fd 未随轮转重开（**不是 fd 耗尽**） |

:::info 最后一句

全站内容到此结束。把「**概念 → 命令 → 排查 → 解决 → 预防**」这条线记住，文件描述符运维就不再是黑盒。

最需要带走的两句话：**一是「先分清是配置低还是真泄漏」**（这决定了后面所有工作方向）；**二是「看趋势比看绝对值重要」**（这是唯一能提前几小时预警的方法）。想看真实排查过程去[典型案例库](#cases)，想深入系统交互去[系统间交互案例](#cases-interaction)，想进阶深挖去[进阶工具与实践](#advanced)。

:::
