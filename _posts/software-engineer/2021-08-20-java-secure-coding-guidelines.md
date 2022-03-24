---
layout: post
title: Java 安全编程规范
date: 2021-08-20 09:00:00 +0800
tags:
- 关键能力
- 编码实现
- 编程语言
- Java语言
keywords: 编程语言,Java语言,安全,安全编程规范
description: Java安全编程规范
background: '/img/posts/default.jpg'
---

## 1. 敏感信息

### 1.1. 清除异常中的敏感信息

如果在传递异常时未对其中的敏感信息做过滤，则易导致信息泄露，可能帮助攻击者尝试发起进一步的攻击。即使将异常封装或净化之后，原始异常里仍然包含大量有用的信息。

JDK里包含如下敏感异常（有些三方件里也存在）：

- java.io.FileNotFoundException - 泄露文件系统结构和文件名列举
- java.util.jar.JarException - 泄露文件系统结构。读取或写入 JAR 文件时，如果发生某种错误，则抛出此异常。
- java.util.MissingResourceException - 资源列举
- java.security.acl.NotOwnerException - 所有人列举。当只允许对象（如访问控制列表）的所有者修改对象，但是试图进行修改的 Principal 不是所有者时，抛出此异常。
- java.util.ConcurrentModificationException - 可能提供线程不安全的代码信息。比如对集合进行遍历的同时，修改了集合的元素，不论是单线程还是多线程，都会抛出此异常（若使用迭代器的remove方法是没问题的）。
- javax.naming.InsufficientResourcesException - 服务器资源不足（可能有利于DoS攻击）。当无法使用资源完成所请求的操作时，抛出此异常。这可能是因为服务器或客户端上的资源缺乏。
- java.net.BindException - 当不信任客户端能够选择服务器端口时造成开放端口列举。
- java.lang.OutOfMemoryError - DoS
- java.lang.StackOverflowError - DoS
- java.sql.SQLException - 数据库结构，用户名列举。

**【处理策略】**：

1. 使用安全策略。当请求资源不合法时，仅返回简洁的错误信息，将任何有用的信息都隐藏起来。
2. 限制输入。

### 1.2. 禁止记录/打印敏感信息

### 1.3. 使用完毕后清理内存中的敏感信息

## 2. IO操作

### 2.1. Buffer对象的处理

`java.nio`包中的 Buffer 类里定义了一系列方法如`wrap()`、`slice()`、`duplicate()`，这些方法会创建一个新的 buffer 对象，但是修改这个新 buffer 对象会导致原始的封装数据也被修改，反之亦然。

为了防止这种问题，新建的 buffer 应该以只读视图或者拷贝的方式返回。

- 可以使用`asReadOnlyBuffer()`方法返回只读视图。

## 3. 平台安全

### 3.1. 进行安全检查的方法必须声明为private和final

子类可以覆写实现安全检查的成员方法，从而忽略这些安全检查，使预期的安全检查功能失效。所以安全检查相关的方法必须被声明为`private`或`final`，放置被覆写。`final`类的成员函数本身就不能被覆写，所以无此风险。

安全检查主要指的是调用`SecurityManager`执行的安全检查。

### 3.2. 自定义类加载器

当自定义类装载器要覆写`getPermission()`方法时，必须要在给源代码赋予任何权限之前，先调用基类的`getPermission()`来获取默认的系统规则。否则会带来提权问题。

```java
PermissionCollection pc = super.getPermission(cs);
```

## 4. 序列化和反序列化

### 4.1. 签名与加密处理

敏感数据在传输过程中要防止被窃取和恶意篡改。**签名**可以防止对象被非法篡改，**加密**可以保护数据对象被窃取。

在以下场景需要对数据对象进行签名加密处理：

1. 序列化或传输敏感数据。
2. 没有使用类似于SSL传输通道。
3. 敏感数据需要长久保存（如在硬盘上）。

正确的处理方式是：**先签名，后加密**。

在信任域边界内的对象传输可以不用签名或加密；在某些特定场景，如果只是验证加密对象的真实性，也可以对加密对象进行签名。

## 参考

安全编程规范指导 -> [Secure Coding Guidelines for Java SE](https://www.oracle.com/java/technologies/javase/seccodeguide.html)
