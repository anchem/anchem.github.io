---
layout: post
title: Java 安全
date: 2021-06-19 15:18:00 +0800
tags:
- 关键能力
- 编码实现
- 编程语言
- Java语言
keywords: 编程语言,Java语言,安全
description: Java的安全机制
background: '/img/posts/default.jpg'
---

参考：https://juejin.cn/post/6844903657775824910

## 语言能力

总的来说，Java安全包含2方面内容，一是Java平台的安全性，二是Java语言开发的应用程序的安全性。其中第二个安全性是开发者需要重点考虑的问题。

### 安全管理器

安全管理器是安全的实施者，可对此类进行扩展，它提供了加在应用程序上的安全措施，通过配置**安全策略文件**达到对网络、本地文件和程序其他部分的访问限制的效果。

安全管理器会在运行阶段检查需要保护的资源的访问权限及其它规定的操作权限，保护系统免受恶意操作攻击，以达到系统的安全策略。

#### 应用场景

当运行未知的Java程序的时候，该程序可能有恶意代码（删除系统文件、重启系统等），为了防止运行恶意代码对系统产生影响，需要对运行的代码的权限进行控制，这时候就要启用Java安全管理器。

比如当你是某个平台的开发者，提供SDK给其他人使用，其中涉及到文件读写操作，并只希望用这个SDK读取特定目录下的文件而不要动其他的位置，这时就可以给SDK代码封装一层权限。

#### 启动安全管理器

1. 隐式（推荐），直接在启动命令中添加`-Djava.security.manager`
2. 显式，实例化一个`java.lang.SecurityManager`或者继承它的子类的对象，然后通过`System.setSecurityManager()`来设置并启动一个安全管理器。

#### 安全策略文件

可以通过`-Djava.security.policy`选项来指定安全策略文件。若未指定，默认使用`%JAVA_HOME%/jre/lib/security`目录下的java.policy文件。

policy文件包含了多个grant语句，每一个grant描述某些代码拥有某些操作的权限：

```java
// 授权基于路径在"file:${{java.ext.dirs}}/*"的class和jar包，所有权限
grant codeBase "file:${{java.ext.dirs}}/*" {
    permission java.security.AllPermission;
};
// 对某些资源的操作进行授权
grant {
        permission java.util.PropertyPermission "java.version", "read";
        permission java.util.PropertyPermission "java.vendor", "read";
};
```

**【配置原则】（白名单机制）**：

- 没有配置的权限表示没有；
- 只能配置有什么权限，不能配置禁止做什么；
- 同一种权限可多次配置，取并集；
- 统一资源的多种权限可用逗号分割。

#### 机制

如果 JVM 开启了 SecurityManager，ClassLoader 在加载类的时候会调用`Policy.getPerissions`获取代码权限集，并将代码来源和权限集封装到保护域。

安全策略不允许的任何操作都会抛出`SecurityException`异常。

## [安全编程规范]({% post_url /software-engineer/2021-08-20-java-secure-coding-guidelines %})
