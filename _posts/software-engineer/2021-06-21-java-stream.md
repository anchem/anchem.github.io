---
layout: post
title: Java Stream
date: 2021-06-21 11:10:00
tags:
- 关键能力
- 编码实现
- 编程语言
- Java语言
keywords: 编程语言,Java语言,Java Stream
description: Java 8 Stream 用法
background: '/img/posts/default.jpg'
---

## 概述

## 用法详解

### 筛选

使用`filter(Predicate<? super T> var)`方法可以对集合进行筛选，挑选出符合条件的元素。

```java
persons.stream().filter(person -> person.age < 18)  // 筛选年龄小于18岁的人
```

### 排序

使用`sorted(Comparator<? super T> var)`方法可以对集合进行排序，其中 `Comparator` 定义了排序规则。

#### 自定义多条件排序

如果需要对集合对象的多个属性按照自定义的顺序进行排序，该如何处理呢？

比如，有一个房子类 `Room` 有如下定义：

```java
class Room {
    int id;  // id
    int area;  // 面积
    int price;  // 价格
    int[] address;  // 位置
}
```

我希望可以按照面积、价格或者位置进行正序或者逆序排序，并且我能够自由组合排序的方式，比如定义一个二维数组 `int[][] orderBy`，数组中每个元素为 `int[] orderPair`，其中`orderBy`保存了排序的优先级，`orderPair`包含2个元素，第1个元素定义了排序的方式，第2个元素定义了正逆序。

排序方式定义：

1. 面积；
2. 价格；
3. 位置。

正逆序： 1表示正序，-1表示逆序。

例如：`[[2, 1], [1, -1], [3, 1]]`表示先按照价格正序排序；对于价格相同的，再按照面积逆序排序；对于面积再相同的，按照位置的远近再进行排序。最后如果还有相同的，则按照id正序排序即可。

对于这种自定义的优先级排序方式，我们就要善用`Comparator`了：

```java
allRooms.stream()
      .sorted((o1, o2) -> {
          int order = 0;
          // 使用for循环进行优先级选择
          for (int[] orderPair : orderBy) {
              switch (orderPair[0]) {
                  case 1:  // 按照面积比较
                      order = orderPair[1] == 1 ? o1.area - o2.area : o2.area - o1.area;  // 正逆序选择，下同
                      break;
                  case 2:  // 按照价格比较
                      order = orderPair[1] == 1 ? o1.price - o2.price : o2.price - o1.price;
                      break;
                  case 3:  // 按照距离比较
                      int dst1 = o1.calculateAddress(address);  // address是入参，表示一个位置，calculateAddress函数计算这个房间与指定address的举例
                      int dst2 = o2.calculateAddress(address);
                      order = orderPair[1] == 1 ? dst1 - dst2 : dst2 - dst1;
                      break;
              }
              // ！关键：如果某一个属性值相同，则order的值为0，会继续遍历下一个优先级进行排序，直到遍历完orderBy或者order不为0
              if (order != 0) {
                  break;
              }
          }
          // 默认按照id正序排序
          return order == 0 ? o1.id - o2.id : order;
      })
```

### 映射
