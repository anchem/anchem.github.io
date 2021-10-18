---
layout: post
title: Linux安全
date: 2021-09-13 09:10:00
tags:
- ICT理论基础
- 操作系统
- Linux
keywords: Linux,Linux安全
description: Linux安全基础知识
background: '/img/posts/default.jpg'
---

（建设中）

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

### 本地攻击
