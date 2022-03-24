---
layout: post
title: Java单元测试
date: 2021-08-11 09:40:00 +0800
tags:
- 关键能力
- 开发者测试
- Java单元测试
keywords: 开发者测试,Java单元测试
description: 单元测试作为代码防护网的第一道屏障，能够有效地检验程序最小功能块的正确性，尽早发现bug，提高代码质量，减少返工成本，让你能够早点下班。
background: '/img/posts/default.jpg'
---
单元测试作为代码防护网的第一道屏障，能够有效地检验程序最小功能块的正确性，尽早发现bug，提高代码质量，减少返工成本，让你能够早点下班。

## 一、概述

**单元测试（Unit Test, UT）是针对程序的最小功能模块进行正确性检验的测试活动**。对于Java程序来说，最小的功能单元是方法，因此Java的单元测试就是针对单个方法的测试。

### 1.1. 何谓良好的单元测试

要写出良好的、有效的单元测试，我们首先要知道好的UT应该长什么样。

#### 1. 简短

虽然一个方法可能包含很多逻辑分支，但一个UT应当目的明确，只检验一个分支。这样的UT一定是简短的，简短意味着好读、好懂、好维护。

#### 2.  快速。

一个UT的执行速度应该快到忽略不计，这样才能保证单元测试的效率。当UT随着代码的增加而增长时，如果执行UT会消耗大量的时间，那么开发人员很可能会选择跳过耗时长的UT，毕竟谁不想早点下班呢。

#### 3. 独立。

独立意味着无依赖，虽然方法中免不了要依赖其他的对象或系统，但UT应当去除依赖，专心校验方法的正确性。

同时，独立也意味着隔离，每个UT可以单独运行，相互之间不影响。

#### 4. 可重复。

你可以放心地一遍又一遍地执行同一个UT而不用担心每次的结果会不同，这就是可重复。如果每次执行的结果不同，要么是方法有bug，要么是UT有bug，而你将陷入追逐幻影的泥潭之中。

#### 5. 自检查。

成年人要为自己的行为负责，良好的UT也应当能够自行判断测试是否通过，无需任何人工交互。

#### 6. 及时。

编码5分钟，UT两小时？编码一时爽，补UT火葬场？或许你应当考虑下编程习惯和代码设计了

良好的UT应当和被测代码一起编写，并且不应占用过多的时间，否则你应该考虑重新设计测试，或者重新设计代码。

#### 7. 好读好懂

UT虽然是机器执行的，但是它是给人看的，因此良好的UT必须好读、好懂。

同时，UT也应当和被测代码一样，是符合CleanCode规范的。

#### 8. 易于维护

如果因为匆忙写UT而糊了一堆“屎”上去，当函数功能变更后，维护UT的变更将带来更多的工作量。因此，UT本身也应当是易于维护的，毕竟谁也不能保证被测方法永远不会变。

#### 9. 值得信赖

UT作为校验方法正确性的屏障，如果是不可信的，那写UT还有什么意义？像注释的UT、含有歧义的UT、有条件的UT等，都属于不可信的UT。

## 二、基本：如何写UT

> Talk is cheap, show me the code.

废话不多说，下面进入实操环节。

### 2.1. 通用流程

我们来看这样的代码：

```java
public class Foo {
    private static final String INVALID_NAME_ADMIN = "admin";
    
    public boolean isValidName(String name) {
        if (StringUtils.isEmpty(name)) {
            return false;
        }
        return !name.contains(INVALID_NAME_ADMIN);
    }
}
```

要为`Foo`类的`isValidName`方法编写UT，我们要做哪些动作呢？

**首先，我们要分析函数逻辑，看看有几个流程分支，哪些流程分支需要覆盖UT。**

在这段代码里，逻辑分支比较简单，先是做了判空，再拿`name`和`INVALID_NAME_ADMIN`做比较，看下是否合法。因此总共包含3个分支，这3个分支都需要覆盖UT。由此，我们给出UT函数框架，每个函数覆盖一个逻辑分支，用函数名表达含义：

```java
public class FooTest {

    @Test
    public void isValidName_emptyNameInvalid() {
    }

    @Test
    public void isValidName_invalidName() {
    }

    @Test
    public void isValidName_validName() {
    }
}
```

**有了UT函数框架之后，我们使用三步法来编写UT代码：1. 设置数据；2. 执行；3. 验证。**

```java
public class FooTest {

    private Foo foo;

    @Before
    public void setUp() {
        foo = new Foo();
    }

    @Test
    public void isValidName_emptyNameInvalid() {
        // 1. 设置数据
        String emptyName = null;
        // 2. 执行
        boolean result = foo.isValidName(emptyName);
        // 3. 验证
        Assert.assertEquals(false, result);
    }

    @Test
    public void isValidName_invalidName() {
        // 1. 设置数据
        String invalidName = "admin";
        // 2. 执行
        boolean result = foo.isValidName(invalidName);
        // 3. 验证
        Assert.assertFalse(result);
    }

    @Test
    public void isValidName_validName() {
        // 1. 设置数据
        String validName = "name";
        // 2. 执行
        boolean result = foo.isValidName(validName);
        // 3. 验证
        Assert.assertTrue(result);
    }
}
```

执行UT，全部Pass！

到此为止，我们完成了一个最简单的UT编写，并且介绍了编写UT的通用流程：

1. 分析函数逻辑分支，确定UT覆盖范围；
2. 为每个逻辑分支编写一个单独的UT函数；
3. 采用三步法编写UT代码。

当然，我们也可以采用TDD的理念，先写测试用例，然后再写业务代码，直到所有的UT都能通过。

### 2.2. JUnit

在上述介绍的方法中，我们用到了JUnit，它是一个开源的Java语言单元测试框架，是事实上的Java语言单元测试的标准框架。详细的官方文档请参考->[这里](https://junit.org/junit5/docs/current/user-guide/) | 这里我们简要介绍一下常用的能力。

- 提供了丰富的注解来定义测试方法。比如上例中我们最常用的`@Test`，表示一个单元测试用例函数。
- 可以通过Assert进行丰富的断言校验。比如上例中的`Assert.assertEquals()`方法。
- 可以通过注解来控制方法的执行过程。比如，`@before`表示在每个测试用例执行前，都会先执行一次。
- 可以对执行时间进行测试。比如，使用`@Test(timeout = 1000)`来表示，如果测试用例的耗时超过了1000毫秒，则标记其为失败。
- 可以对异常进行测试。比如，使用`@Test(expected = ArithmeticException.class)`表示该测试用例期望抛出一个`ArithmeticException.class`类型的异常。
- 支持参数化测试。允许开发人员使用不同的值反复运行同一个测试。

## 三、进阶：破除依赖

在实际开发中，我们很少会遇到一个无外部依赖的函数，大多数情况下，要测试的函数都会依赖一个或多个你无法直接控制的对象。这些对象可能是其他的类、文件系统、Web服务、数据库、系统时间等等，甚至是一些还未实现的对象。在这种情况下要对单个方法进行测试，我们就要上一点不一样的东西了——**测试替身**。

### 3.1. 概念框架

既然外部依赖不可控，那么我们能不能模拟一个外部依赖，让这个模拟对象可控。测试替身就是这样的一个对象，它是一个可控的外部依赖替代物。

实际上，当你有以下诉求的时候，都可以使用测试替身：

- **隔离被测代码**
- **加速执行测试**
- **使执行变得确定**
- **模拟特殊情况**
- **访问隐藏信息**

测试替身也有很多不同的种类，我们了解即可，实际上知道他们本质上是个替代物就够了。

- **测试桩Stub**：短小简洁，用最简单的可能实现（甚至是空实现）来代替真实实现。
- **伪造对象Fake**：真实事物的简单版本，同时没有副作用或使用真实事务的其他后果。
- **测试间谍Spy**：用于记录过去发生的情况，在测试后能够知道所发生的事情。
- **模拟对象Mock**：是一个在特定情景下课配置行为的对象，适合在关心交互的场景下使用。

### 3.2. Mock测试框架

#### 3.2.1. Mockito

Mockito是一个非常好用的模拟测试框架。详细使用说明请参考官网链接->[这里](https://site.mockito.org/)，这里仅介绍一些常用的方法。

**====【使用测试桩模拟验证】====**

```java
// 创建mock对象
LinkedList mockedList = mock(LinkedList.class);

// 测试桩
when(mockedList.get(0)).thenReturn("first");
when(mockedList.get(1)).thenThrow(new RuntimeException());

// 输出“first”
System.out.println(mockedList.get(0));

// 抛出异常
System.out.println(mockedList.get(1));

// 因为 get(999) 没有打桩，因此输出 null
System.out.println(mockedList.get(999));

// 验证 get(0) 被调用的次数
verify(mockedList).get(0);
```

**====【使用参数匹配器】====**

```java
// 使用内置的 anyInt() 参数匹配器
when(mockedList.get(anyInt())).thenReturn("element");

// 使用自定义的参数匹配器( 在isValid() 函数中返回你自己的匹配器实现 )
when(mockedList.contains(argThat(isValid()))).thenReturn("element");

// 输出 element
System.out.println(mockedList.get(999));

// 你也可以验证参数匹配器
verify(mockedList).get(anyInt());
```

**====【doXXX方法的使用】====**

Mockito提供了一系列`doXXX`方法，比如`doThrow()`、`doReturn()`等，它们后面往往会跟着`when()`函数的调用。适用于以下场景：

- 为void函数打桩；
- 在受监控的对象（spy）上设置打桩方法；
- 会调用打桩方法多次，并且希望在中途改变其行为。

```java
doThrow(new RuntimeException()).when(mockedList).clear();

// 下面的代码会抛出异常
mockedList.clear();
```

**====【监控对象spy】====**

当你使用一个监控对象Spy时，其真实对象的方法也会被调用，除非它的方法被打桩了。换句话讲，Spy对象是一个部分被模拟的对象。

```java
List list = new LinkedList();
List spy = spy(list);

// 你可以为某些方法打桩
when(spy.size()).thenReturn(100);

// 通过spy对象调用真实对象的函数
spy.add("one");
spy.add("two");

// 输出真实的第一个元素
System.out.println(spy.get(0));

// 因为size()函数被打桩了,因此这里返回的是100
System.out.println(spy.size());

// 交互验证
verify(spy).add("one");
verify(spy).add("two");
```

#### 3.2.2. PowerMock & PowerMockito

**PowerMock** 是一种扩展的测试框架，支持 EasyMock 和 Mockito。PowerMock 扩展提供了对**静态方法、final方法、private方法、系统方法等**方法的测试能力。[官网](https://github.com/powermock/powermock)

**PowerMockito** 是 PowerMock 对 Mockito的扩展支持，我们只需要使用`PowerMockito`类即可创建需要 mock 的对象并进行测试验证。

所有用到 PowerMockito 的地方，均需要在测试类前面加上`@RunWith(PowerMockRunner.class)` 和 `@PrepareForTest` 注解。

示例：

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest( { YourClassWithEgStaticMethod.class })
// @PrepareForTest( { fullyQualifiedNames = "com.xxx.xxx.*" })  使用该注解表示fullyQualifiedNames指明的包下的所有类都是要mock的
public class YourTestCase {
    // ...
}
```

通过`PrepareForTest`注解的类，会在加载时修改其对应的字节码，以便实现对静态方法、final方法、private方法或系统类的替换；与此同时，需要通过`RunWith`注解指定测试执行器。

注意 `PowerMockito` 也有 `spy` 方法，它和 `Mockito` 的 `spy` 方法的区别在于，如果你要mock类的私有方法或`final`方法，需要使用`PowerMockito.spy`方法，而不能使用`Mockito.spy`方法。

### 3.3. Mock测试框架的应用

#### 3.3.1. 测试普通方法

上面的例子已经介绍过了，这里就不赘述了。

#### 3.3.2. 测试静态方法

**====【测试静态类的静态方法】====**

我们有时想要测试静态类的静态方法，而该方法又依赖该类的其他静态方法。

```java
class StaticClass {
    public static String staticFunc1(String str) {
        // some code
    }
    public static void staticFunc2() {
        // some code
        String str = staticFunc1(inStr)
        // some code
    }
}
```

此时，若我们需要对`staticFunc2`写UT，就要破除对`staticFund1`的依赖，也就是说，对于`StaticClass`，我们需要部分mock，那就可以使用`spy`方法了：

```java
@Test
public void staticFunc2Test() {
    spy(StaticClass.class);
    PowerMockito.doReturn("someString").when(StaticClass.class, "staticFunc1", anyString());
}
```

通过`spy`方法，我们仅mock静态类的部分方法，并通过`doXXX`和`when`方法设置mock的方法即可。注意，这里不要使用`mockito.when()`方法，也就是不要写成`when(StaticClass.staticFunc1(anyString))`，这种是无法执行成功的。

#### 3.3.3. 测试私有方法

当我们想要测试一个`private`方法时，可以使用PowerMock的`Whitebox`类提供的`invokeMethod`方法来进行私有方法的调用，这种方式相对于反射更加简洁易懂。

比如，想要对`Foo`类的`func`方法编写UT：

```java
class Foo {
    private int func(int a, int b) {
        return a + b;
    }
}
```

可以使用以下方法进行私有方法调用：

```java
@Test
public void funcTest() {
    Foo foo = new Foo();
    int result = Whitebox.invokeMethod(foo, "func", 1, 2);
    Assert.assertEquals(3, result);
}
```

#### 3.3.4. 依赖私有方法的测试

**====【依赖私有方法的返回值】====**

有如下场景， `foo`函数调用了私有方法`func1`，并根据其返回值进行分支处理。

```java
public void foo() {
    boolean result = func1("test");
    if (result) {
        // ......
    } else {
        // ......
    }
}

private boolean func1(String str) {
    // ......
}
```

对`foo`函数的单元测试，依赖`func1`这个私有方法的返回值，这种情况，可以采用如下方式破除依赖：

```java
PowerMockito.doReturn(true).when(testObject, "func1", anyString());
```

通过控制`doReturn`方法中的返回值，即可覆盖测试`foo`函数的不同分支。

**====【测试私有方法是否被调用】====**

有如下场景，需要对`foo`函数写UT，其中它调用了一个私有方法。

```java
public void foo() {
    func1("test");
}

private boolean func1(String str) {
    // .....
}
```

可以用如下方式验证对私有方法的调用 ：

```java
PowerMockito.verifyPrivate(object, Mockito.times(1)).invoke("func1", "test");
```

该方法验证了私有方法`func1`被调用了一次（也可以验证多次），且入参为`test`。注意，后面的`invoke`方法的第一个参数表示被调的私有方法名称，后面的参数为该私有方法的入参，这个入参必须是具体的值，而不能用`anyXXX`代替。

#### 3.3.5. 依赖静态方法的测试

被测函数使用了静态方法，是一种很常见的情况，例如：

```java
public boolean func(String param) {
    if (Static.firstStaticMethod(param)) {
        return false;
    }
    // do something else ...
    return true;
}
```

函数`func`依赖了静态类的`Static.firstStaticMethod`方法，对于这类函数，可以使用如下方式进行mock测试。

【基本步骤】

1. 添加 `@PrepareForTest` 注解，指明要 mock 的静态方法所在的类。

```java
@PrepareForTest(Static.class) // Static.class 包含要测试的静态方法
```

2. 调用 `PowerMockito.mockStatic()` 方法来 mock 一个静态类；如果仅需要 mock 静态类中的指定的方法，其他方法不 mock，则使用`PowerMockito.spy(class)`函数。

```java
PowerMockito.mockStatic(Static.class); // 会 mock 该类的所有静态函数
PowerMockito.spy(Static.class); // 仅需要 mock 个别的静态函数，其他函数不 mock
```

若该静态类还依赖了其他静态类，也同时需要mock。

3. 通过 `Mockito.when()` 方法设置期望值。

```java
Mockito.when(Static.firstStaticMethod(param)).thenReturn(value); // param 也可以通过 anyXXX() 方法填充

// 也可以通过以下方法测试抛异常的场景
doThrow(new RuntimeException()).when(Static.class);
Static.secondStaticMethod(); 
```

4. 观察验证

```java
// 可以对结果验证
assertEquals(value, Static.firstStaticMethod(param));

// 也可以验证mock方法的行为，比如被调用多少次
verifyStatic(Static.class, times(2));
Static.firstStaticMethod(anyString());

// 每验证一个静态方法，都需要调用一次 verifyStatic() 方法
verifyStatic(Static.class, times(0));
Static.secondStaticMethod();
```
