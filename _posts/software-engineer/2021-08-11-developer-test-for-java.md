---
layout: post
title: Java测试框架
date: 2021-08-11 09:40:00
tags:
- 关键能力
- 开发者测试
- Java测试框架
keywords: 开发者测试,Java测试框架
description: Java测试框架详解
background: '/img/posts/default.jpg'
---

（建设中）

## JUnit

## Mockito

## PowerMock

PowerMock 是一种扩展的测试框架，支持 EasyMock 和 Mockito。PowerMock 扩展提供了对静态方法、final方法、private方法、系统方法等方法的测试能力。

### PowerMockito

PowerMockito 是 PowerMock 对 Mockito的扩展支持，我们只需要使用`PowerMockito`类即可创建需要 mock 的对象并进行测试验证。

所有用到 PowerMockito 的地方，均需要在测试类前面加上`@RunWith(PowerMockRunner.class)` 和 `@PrepareForTest` 注解。

示例：

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest( { YourClassWithEgStaticMethod.class })
public class YourTestCase {
...
}
```

#### Mock 静态方法

【基本步骤】

1. 添加 `@PrepareForTest` 注解，指明要 mock 的静态方法所在的类。

```java
@PrepareForTest(Static.class) // Static.class 包含要测试的静态方法
```

2. 调用 `PowerMockito.mockStatic()` 方法来 mock 一个静态类；如果仅需要 mock 静态类中的指定的方法，其他方法不 mock，则使用`PowerMockito.spy(class)`函数。

```java
PowerMockito.mockStatic(Static.class); // 会 mock 该类的所有静态函数
Static staticObj = PowerMockito.spy(new Static()); // 仅需要 mock 个别的静态函数，其他函数不 mock
```

3. 通过 `Mockito.when()` 方法进行 mock 规则设置。

```java
Mockito.when(Static.firstStaticMethod(param)).thenReturn(value);
```
