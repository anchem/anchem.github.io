---
layout: post
title: Java 数组
date: 2021-07-31 09:10:00
tags:
- 关键能力
- 编码实现
- 编程语言
- Java语言
keywords: 编程语言,Java语言,数组,Arrays
description: Java数组详解
background: '/img/posts/default.jpg'
---

## 内容

- **基本用法**
- **进阶用法**
- **相关算法**

## 基本用法

### 基本概念及操作

#### 【概念】

**数组**是一个容器，里面保存了固定数目的相同类型的对象，它们在内存空间的存储是连续的。

数组有几个关键的概念：

- **类型** - 一个数组里保存的都是同一类型的元素，不同类型的元素不能保存在一个数组里。
- **长度** - 数组是固定长度的，一旦定义了数组，那么长度也就明确了。
- **元素** - 数组中保存的每一个对象都被称为元素。
- **索引** - 数组中每一个元素都有一个索引值，标识它在数组中的位置。对于长度为 N 的数组，其索引值取值范围为 \[0, N-1\]；若索引值超出了范围，会抛出`java.lang.ArrayIndexOutOfBoundsException`异常

#### 【基本操作】

1. 声明一个数组

```Java
int[] arr;
```

2. 初始化数组

```Java
long[] arrLong = new long[10];  // 初始化了一个长度为10，保存了 long 类型的数组，每个元素初始化为该元素类型的默认值
int[] arrInt = new int[]{1,2};  // 初始化了一个长度为2，保存了 int 类型的数组，并定义了各元素的值为 1 和 2
Person[] person = new Person[5];  // 初始化了一个长度为5，保存了 Person 类型的数组，每个元素初始化为 null
```

3. 赋值

```Java
arrInt[1] = 3;  // 为数组的第 2 个元素赋值为 3
```

4. 访问数组元素

```Java
long value = arrLong[0];  // 通过索引直接访问数组的元素，效率很高
long value = arrLong[-1];  // 数组越界访问，会抛出异常
```

5. 遍历数组

```Java
for (int i : arr) {
    System.out.print(i);
}
```

