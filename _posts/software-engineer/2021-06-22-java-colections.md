---
layout: post
title: Java 集合
date: 2021-06-22 09:00:00
tags:
- 关键能力
- 编码实现
- 编程语言
- Java语言
keywords: 编程语言,Java语言,集合框架,集合
description: Java 集合框架及分类描述
background: '/img/posts/default.jpg'
---

## 内容

施工中

### 队列

#### 优先队列 PriorityQueue

`PriorityQueue`实现了优先队列的功能，保证每次取出的元素都是按照自定义的优先级排列的。其中优先级的值越小，优先级越高（小顶堆）。

优先级可以通过自然顺序或者自定义的`Comparator`来定义。其中`Comparator`定义的比较方法，只有在队列中元素的数量发生了变化的时候才会被调用，比如入队和出队操作。由此也不难推断，优先队列不允许存放`null`元素。

【常用方法】

- `offer()` - 向队列中插入元素。
- `peek()` - 获取队列中首元素，但不删除。
- `poll()` - 获取并删除队列中首元素。

【遍历】

不要尝试使用`Iterator`来遍历队列元素，因为它无法保证遍历的顺序是按照优先级输出的，请使用`Arrays.sort()`方法进行处理。

**示例：**

```java
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(3);
pq.offer(2);
pq.offer(6);
pq.offer(5);
pq.offer(1);
// 尝试顺序遍历
for (int i : pq) {
    System.out.print(i + " ");
}
// 输入结果为 1 2 6 5 3

// 转换后再遍历
Integer[] arr = pq.toArray(new Integer[0]);
Arrays.sort(arr, pq.comparator());
System.out.println(Arrays.toString(arr));
// 输出为 [1, 2, 3, 5, 6]

// 按优先级顺序取出元素
while (!pq.isEmpty()) {
    System.out.print(pq.poll() + " ");
}
// 输出为 1 2 3 5 6
```

【并发】

由于`PriorityQueue`是非线程安全的，对于在并发环境的优先队列，请使用`PriorityBlockingQueue`
