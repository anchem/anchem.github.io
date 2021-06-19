---
layout: post
title: Java--数据类型
date: 2021-06-19 15:10:00
tags:
- 关键能力
- 编码实现
- 编程语言
- Java语言
keywords: 编程语言,Java语言,数据类型
description: Java的数据类型详解
background: '/img/posts/default.jpg'
---

Java是**静态类型语言**，也就是说，变量或表达式的类型在编译期就已经明确了。

## 1. 基本类型

- 数值型
  - 整数类型，`byte`,`short`,`int`,`long`
  - 浮点类型，`float`,`double`
- 字符型，关键字`char`
- 布尔型，关键字`boolean`

|      | 占用字节 | 默认值 | 取值范围 |
| :--: |   :--:   |  :--:  |  :--:  |
| byte | 1 | 0 | -128 ~ 127（正负120左右） |
| short | 2 | 0 | -32768 ~ 32767（正负3万2左右） |
| int | 4 | 0 | -2,147,483,648 ~ 2,147,483,647（正负21亿左右） |
| long | 8 | 0L | -9,223,372,036,854,775,808  ~ 9,223,372,036,854,775,807（正负9百万亿亿左右） |
| float | 4 | 0.0f | 十进制7位小数精度 |
| double | 8 | 0.0 | 十进制15位小数精度 |
| char | 2 | '\u0000' | '\u0000' ~ '\uffff'（65535） |
| boolean | 由虚拟机决定 | false | -128 ~ 127 |

**【说明】**

1. `unsigned`关键字修饰的类型只取正值，这使得变量的取值范围在数轴上向右移动了一半的距离。
2. 对精度要求较高的科学运算，建议使用`BigDecimal`来取代`float`和`double`。
3. `char`采用Unicode（UTF-16）字符集，能够表示世界上足够多的语言字符。
4. Java7及之后的版本，允许使用`_`分隔数值型的变量以增加可读性，比如`long creditCardNumber = 1234_5678_9012_3456L;`。
5. 整数类型可以有多种进制的表达方式，比如表达26，十进制：`int decVal = 26;`，十六进制：`int hexVal = 0x1a;`，二进制：`int binVal = 0b11010;`。
6. 基本类型之间可以自动转换，原则是小转大；如果大转小，由于长度不同会被截取，从而导致结果失去精度。其中`long`可转`double`。如果需要四舍五入，可以使用`java.lang.Math.round()`方法。
7. 类型转换顺序：(byte,short,char)-—>int-—>long-—>float-—>double
8. 数值相加相乘时要注意结果的取值范围，避免溢出。
9. `char`和`int`类型相加时，会将字符根据ascii转换成数字再相加，结果是一个数字。如果想要达到字符拼接数字的目的，则使用`String`类型的字符串相加。（区别在于单引号还是双引号）。

【参考】

1. https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html
2. https://www.geeksforgeeks.org/data-types-in-java/

### 基本类型包装类

基本类型都有其引用类型的包装类，可以通过自动的装箱和拆箱进行转化。包装类型的对象一经创建，其内容（所封装的基本类型数据的值）不可改变，也就是说，它是不可变对象。

**装箱与拆箱**：

装箱过程是通过调用包装器的valueOf方法实现的，而拆箱过程是通过调用包装器的xxxValue方法实现的。

```java
Integer i = 10; // 自动装箱
Integer im = Integer.valueOf(10); // 手动装箱
int index = i;  // 自动拆箱
int indexm = im.intValue(); // 手动拆箱
```

**缓存**：

对于`Integer`类型的变量，当取值范围在-128~127之间时，`Integer`对象是在`IntegerCache.cache`中产生的，会复用已有的对象，这个区间的值可以用`==`比较；在区间之外的，都是在堆上产生的，需要用`eqauls()`方法比较。

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

类似的，`Byte`、`Short`和`Long`型也缓存了-128~127的数据；`Character`缓存了0-127的数据；`Boolean`缓存了`TRUE`和`FALSE`。当调用`valueOf()`方法时，就会用到缓存，而`new`方法不会调用缓存。

**使用场景**：

使用包装类型合理的场景：

- 作为集合中的元素，值或者键；
- 泛型，必须使用包装类型；
- 反射方法调用需要使用包装类型，比如`Method.invoke()`；
- POJO类的字段、RPC方法的返回值和参数等可能要序列化的且可能缺失值的场景。

**比较**：

```java
double i0 = 0.1;
Double i1 = new Double(0.1);
Double i2 = new Double(0.1);
System.out.println(i1.equals(i2)); // true 2个包装类比较，比较的是包装的基本数据类型的值
System.out.println(i1.equals(i0)); // true 基本数据类型和包装类型比较时，会先把基本数据类型包装后再比较
```

```java
double i0 = 0.1;
Double i1 = new Double(0.1);
Double i2 = new Double(0.1);
System.out.println(i1 == i2);  // false new 出来的都是新的对象
System.out.println(i1 == i0);  // true 基本数据类型和包装类比较，会先把包装类拆箱
```

## 2. 引用类型

引用类型实际上保存的是一块内存地址，默认初始化为`null`，它所指向的空间保存了实际对象的值，这些对象可以是字符串、对象、数组、接口、函数等。引用类型的变量本身在栈上保存，而其指向的对象是在堆上保存的。

```java
// 字符串
String str;
// 对象
Object obj;
// 数组
String[] strArr;
// 接口
List<String> list;
// 函数
Function<String, int> func;
```

## 3. 编码规范

**1. 不能使用浮点数作为循环变量。由于精度问题，会导致边界条件判断不准。**

**2. 精确计算时不要使用`float`和`double`，建议使用`BigDecimal`。**

```java
BigDecimal income = new BigDecimal("1.03");
BigDecimal expense = new BigDecimal("0.42");
System.out.println(income.subtract(expense));
```

**3. 浮点型数据判断相等不能使用`==`。**

```java
// 建议使用方式
float foo = ...;
float bar = ...;
if (Math.abs(foo - bar) < 1e-6f) {
// ...
}
```

**4. 禁止尝试与NaN进行比较运算，相等操作可以使用`isNaN()`方法。**

由于`NaN`是无序的，常常会导致意外的结果。

```java
// 建议使用isNaN方法
Double.isNaN(result)
```

**5. 不要在单个表达式中对相同的变量赋值超过一次。**

```java
// 不好的用法
int count = 0;
for (int i = 0; i < 100; i++) {
    count = count++;
}
System.out.println(count);


// 建议的用法
int count = 0;
for (int i = 0; i < 100; i++) {
    count++;
}
System.out.println(count);
```

**6. 基本类型优于包装类型，合理使用包装类型。**

因为不恰当地使用基本类型和包装类型，可能会带来大量隐含的装箱和拆箱操作。比如`for`循环中的循环变量不要使用包装类型。

整数型包装类型应该使用`eqauls()`方法做比较；浮点包装类型不应使用`eqauls()`或`flt.compareTo(another) == 0`做**相等判断**的比较，而`compareTo`做**大小的比较**是可以的。


**7. 明确地进行类型转换，不要依赖隐式类型转换。**

在运算符右边，要小心地使用更宽的操作数类型。

```java
// 不好的例子
int big = 1999999999;
float one = 1.0f;
System.out.println(big * one);

// 推荐的例子
int big = 1999999999;
double one = 1.0d; // Double instead of float
System.out.println((double) big * one); // 更宽
```

做浮点运算前，把整数转换为浮点数。

```java
// 不好的例子
short ns = 533;
int ni = 6789;
long nl = 4664382371590123456L;
float f1 = ns / 7; // f1 is 76.0 (truncated)
double d1 = ni / 30; // d1 is 226.0 (truncated)
double d2 = nl * 2; // d2 is -9.1179793305293046E18

// 推荐的例子
short ns = 533;
int ni = 6789;
long nl = 4664382371590123456L;
float f1 = ns / 7.0f; // f1 is 76.14286
double d1 = ni / 30.; // d1 is 226.3
double d2 = (double) nl * 2; // d2 is 9.328764743180247E18
```
