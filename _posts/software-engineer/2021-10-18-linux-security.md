---
layout: post
title: Linux安全
date: 2021-10-18 09:10:00 +0800
tags:
- ICT理论基础
- 操作系统
- Linux
keywords: Linux,Linux安全
description: Linux安全基础知识
background: '/img/posts/default.jpg'
---

## Linux安全风险

Linux系统常见的安全威胁包括以下几个方面：

- **远程网络攻击**
  - 用户仿冒登录：伪造用户的ID，破解用户密码。
  - 网络Dos攻击：被远程用户执行拒绝服务攻击。
  - 网络服务攻击：利用对外监听了网络端口的进程的漏洞进行攻击。
- **本地进程攻击**
  - 内核被攻击：内核运行在特权态，攻击者利用内核漏洞进行攻击，从而提权。
  - 系统服务被攻击：攻击者利用系统服务的缺陷进行提权，进而获取系统关键数据、篡改文件等。
  - 业务进程攻击：攻击者利用业务进程的缺陷进行攻击。
- **近端物理攻击**
  - 镜像篡改攻击：设备加载的固件被篡改，导致运行恶意系统。
  - 物理端口攻击：利用系统的串口等物理端口进行攻击，饶过登录，可导致系统无法正常工作，泄露系统关键信息等。

### 系统信息泄露

攻击者利用Linux系统信息可以获知该系统版本存在的漏洞，或通过端口扫描工具获取系统对外提供的网络服务，从而进行有针对性地攻击。

【系统信息泄露途径】

- 网络服务暴露；
- 网络协议栈暴露；
- 系统配置文件默认提供内核版本信息；
- 通过搜索引擎获取目标系统的版本信息；
- 内核接口泄露地址布局等信息；
- 通过端口扫描工具获取网络服务或系统版本信息；

#### 防御方法1：修改登录Banner隐藏系统信息

通过修改以下3个文件来隐藏系统信息：

- `/etc/issue`：当一个网络用户登录到系统时，会在login提示符之前提示打印的信息；
- `/etc/issue.net`：提供给telnet远程登录程序使用；
- `/etc/ssh/sshd_connfig`：OpenSSH的Banner信息。

此外，Linux还有一个相关的文件`/etc/motd`，它是在登录成功之后显示的信息。

#### 防御方法2：隐藏系统网络协议栈信息

通过ICMP报文可以获取子网、目标系统时间戳等信息，可以通过配置iptables来屏蔽。

```bash
iptables -A INPUT -p icmp --icmp-type timestamp-request -j DROP
iptables -A OUTPUT -p icmp --icmp-type timestamp-reply -j DROP

iptables -A INPUT -p icmp --icmp-type address-mask-request -j DROP
iptables -A OUTPUT -p icmp --icmp-type address-mask-reply -j DROP
```

#### 防御方法4：隐藏内核地址布局信息

系统中的普通用户通过查看内核导出的接口，可以获取内核地址分布信息。因此，需要对内核地址信息进行保护，防止普通用户通过`dmesg`、串口打印等手段获取，进而饶过内核地址随机化。

使用`sysctl`将`kernal.kptr_restrict`的值设置为1（或修改`/proc/sys/kernel/kptr_restrict`文件），即可禁止普通用户查看内核打印的地址。

Linux提供了控制变量`/proc/sys/kernel/kptr_restrict`来控制内核输出的打印，其权限的描述如下：

| 取值 | 描述 |
| :--: |:--: |
| 0 | root和普通用户都可以读取 |
| 1 | root用户有权限读取, 普通用户没有权限 |
| 2 | 内核将符号地址打印为全0, root和普通用户都没有权限 |

### 远程攻击

#### 服务安全

减小攻击面可以有效提高系统服务的安全。

**【关闭非必要端口】**

每个对外监听的网络端口，都是一个攻击入口。可以使用端口查询命令（如`netstat`、`lsof`）来检查系统端口监听的合理性，并使用`iptables`来对系统中不对外暴露的端口进行过滤。

```bash
iptables -A INPUT -p tcp --dport XXX -j DROP
iptables -A INPUT -p udp --dport XXX -j DROP
```

**【对网络进行隔离】**

- 当系统同时 连接多个网段时，应对网段进行隔离，以减小攻击面；
- 业务进程必须绑定固定的IP地址，防止监听所有IP地址（0.0.0.0）；
- 不对外提供服务的端口，仅在本地监听（127.0.0.1）；
- 对于第三方组件监听的端口，使用iptables进行过滤。

**【使用安全协议】**

应使用安全的协议对传输进行加密。

| 不安全的协议 | 存在的问题 | 替代协议 |
| :--: | :-- | :--: |
| SSL V2.0、V3.0, TLS v1.0 | BEAST漏洞，密钥采用MD5生成，消息认证和加密共享密钥，MAC算法长度扩展攻击，握手协议中间人攻击，SSL会话阶段攻击等 | TLS v1.2、v1.3 |
| SNMP v1/v2c | 明文传输团体字 | SNMP v3 |
| FTP、TFTP | 明文传输账号口令和数据 | SFTP/FTPS |
| Telnet | 明文传输账号口令和数据 | SSH v2 |
| SSH v1 | 采用CRC算法保证完整性 | SSH v2 |

#### 系统漏洞防御

**【栈保护】**

攻击者可以利用栈溢出漏洞，对函数的返回地址进行覆盖，从而达到控制程序执行流的目的。

可以使用gcc编译选项来对缓冲区溢出做保护`-fstack-protector-strong`。（金丝雀守护）

**【地址随机化ASLR】**

通过将进程地址空间进行随机化来更加攻击者预测目的地址的难度。

- 通过`sysctl`对`kernel.randomize_va_space`设置为2，获得最大的随机化能力；
- gcc编译选项添加`-fPIE -pie`开启PIE，实现代码段和数据段的随机化
- 将内核镜像的基址进行随机化偏移；
- 每次启动后的内核地址随机化；

**【NX(DEP)】**

攻击者发现目标系统的漏洞后，常常会将恶意代码注入到可控的数据区。通过将数据所在的内存页标识为不可执行（No-eXucute），可以防御该攻击，即对程序执行DEP保护。

gcc 安全选项`-z noexecstack` 开启NX保护。

**【CFI】**

CFI（Control Flow Integrity）的核心思想是对所有程序跳转做校验，以防御代码重用攻击（ROP，Return-oriented Programming）。

**【最小化安装】**

系统中安装的冗余软件包、开发调试工具、网络嗅探工具等，都会扩大系统的攻击面，给攻击者提供极大的便利。因此，生产环境的系统应当只保留环境运行所必要的最小软件集合，其他的都应当被删除掉。

**【保持系统更新】**

保持系统更新，可以及时修复漏洞。

#### 认证与鉴权

**【避免root直接用于远程登录】**

root拥有最高权限，如果可用于远程登录，将会被攻击者作为暴力破解的首选目标。

禁止root账号远程直接登录：

```bash
vi /etc/ssh/sshd_config
PermitRootLogin No
```

**【PAM机制】**

PAM（Pluggable Authentication Modules）可动态加载验证模块，将系统提供的服务和该服务的认证方式分开，使得系统管理员可以灵活地给不同的服务配置不同的认证方式，而无需修改服务程序。

它有四种验证类别：

| 管理方式 | 说明 |
| :--: | :-- |
| auth | 用于对用户的身份进行识别。比如，提示用户输入密码，判断用户是否为root等 |
| account | 对账号的各项属性进行检查。比如，是否允许登录，是否达到最大登录数等 |
| password | 使用用户信息来更新。比如，修改密码 |
| session | 用来定义用户登录前以及用户退出后所要进行的操作。比如，记录连接信息，挂载文件系统等 |

常用举例：

```bash
# 在/etc/pam.d/common-password中添加：
auth required pam_tally2.so deny=3  unlock_time=120
# 表示当连续3次登录失败时，锁定用户，锁定时长为120秒

# 在/etc/pam.d/common-password中添加：
password  required pam_cracklib.so  dcredit=-1 ucredit=-1 lcredit=-1  minlen=8
# 表示口令的最小长度为8位，至少需要包含一个大写字母，一个小写字母，一个数字

# 在/etc/pam.d/common-password中添加：
password  required pam_pwhistory.so  remember=5
# 表示修改口令时，禁止使用历史用过的5个口令
```

**【设置口令有效期】**

长时间使用同一个口令会增加其被破解的可能，因此需要设置口令有效期。

```bash
cat /etc/login.defs
PASS_MAX_DAYS   90
PASS_MIN_DAYS   0
PASS_WARN_AGE   30
PASS_MIN_LEN   6
```

用户口令遗忘后，管理员可以为其重置口令，用户第一次登录系统后必须修改口令：

```bash
# 管理员修改用户口令后，执行以下命令即可
passwd -e <username>
```

### 本地攻击

（待完善）
