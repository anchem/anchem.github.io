---
layout: post
title: 注意由双大括号匿名类引起的serialVersionUID编译告警
date: 2020-10-27 20:33:00 +0800
categories: 软件工程师系列
tags:
- 静态检查与修复
- 代码审查
- 编码实现
- 编程语言
- Java语言
keywords: 编译告警,serialVersionUID,Java,匿名类
description: 最近版本组织清理编译告警，其中有这么一条比较有意思，之前没见过，拿出来说一说。
background: '/img/posts/default.jpg'
---

## 问题描述

最近版本组织清理编译告警，其中有这么一条比较有意思，之前没见过，拿出来说一说：

“**serializable class anonymous com.demo.Main$1 has no definition of serialVersionUID**”

编译告警指向了这段代码：

```java
private static List<String> defaultAttrList = new ArrayList<String>() {
    {
        add(ResourceConsts.RES_NAME);
        add(ResourceConsts.RES_TYPE);
        add(ResourceConsts.RES_IP);
        add(ResourceConsts.RES_VERSION);
    }
};
```

乍一看好像没什么问题，我用双大括号的方式定义并初始化了一个`ArrayList`，往里面塞了几个值，代码简洁易懂。

但问题并没有看起来那么简单，原因就在**双大括号**。

## 探究

**双大括号**的写法实际上创建了一个匿名类，我们将源文件编译后也会发现，生成了一个`Main$1.class`的文件，它就对应这个匿名类。反编译后的代码如下：

```java
class Main$1 extends ArrayList<String> {
    Main$1() {
        this.add("1");// 10
    }// 11
}
```

可以看到，我们创建了一个名为`Main$1`的匿名类，继承自`ArrayList`，而`ArrayList`的类定义如下：

```java
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess, Cloneable, Serializable {
    // ......
}
```

正是因为`ArrayList`实现了`Serializable`接口，所以`Main$1`也需要定义`serialVersionUID`。

## 解决方法

既然是由于匿名类引起的编译告警，我们可以干掉匿名类，用静态域来初始化`List`，像下面这样即可消除告警：

```java
private static List<String> defaultAttrList = new ArrayList<>();
static {
    defaultAttrList.add(ResourceConsts.RES_NAME);
    defaultAttrList.add(ResourceConsts.RES_TYPE);
    defaultAttrList.add(ResourceConsts.RES_IP);
    defaultAttrList.add(ResourceConsts.RES_VERSION);
}
```

## 参考资料

1. [永远不要使用双花括号初始化实例，否则就会OOM！](https://segmentfault.com/a/1190000022717457)
