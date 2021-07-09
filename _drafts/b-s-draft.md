## 二分查找

### 概念

二分查找是一种在有序数组中查找指定元素的算法，算法时间复杂度O(logN)，是一种高效的查找算法。

### 适用范围

二分查找要求待查找的数组必须是有序的，不管是升序还是降序，所以在使用二分前，先确保数组有序。

### 算法思路与框架

二分的每一次查找都中搜索范围的中间元素开始，对于升序数组，如果待查找的元素比中间元素大，则下一次查找数组的后半部分，否则查找前半部分。由于内次搜索区间都会减半，所以往往很快就能找到答案。

二分查找的算法思路不复杂，但实现起来存在很多细节，想要写出正确高效的算法并不是一件容易的事情。

以下是几种查找的实现分析

#### 基本二分

最基本的二分查找是假设数组中没有重复元素，待查找的元素要么存在，要么不存在。

我们首先要确定的就是查找区间，查找区间有2种，一种是左闭右开，一种是两边都闭的。

区间影响了2个处理细节，一个是循环结束条件，一个是端点如何移动。

如果是左开右闭区间，即`[left, right)`，那么只有当 left 严格小于 right 时，这个区间才是一个有效的区间；同时，当本次查找的中间元素大于待查找的元素时，下次查找的区间要取`[left, middle)`，即 right 仅需取 middle即可。以下是代码实现：

```java
public static int binarySearch(int[] arr, int key) {
    int left = 0;
    int right = arr.length;
    while (left < right) {
        int middle = left + (right - left) / 2;
        if (arr[middle] < key) {
            left = middle + 1;
        } else if (arr[middle] > key) {
            right = middle;
        } else {
            return middle;
        }
    }
    return -1;
}
```

如果是两边都闭区间，即`[left, right]`，那么只有当left 小于等于 right 时，这个区间才是一个有效的区间；同时，当本次查找的中间元素大于待查找的元素时，下次查找的区间要取`[left, middle - 1]`，即 right 要取 middle - 1， 因为 middle 已经在这一轮查找过了。以下是代码实现：

```java
public static int binarySearch(int[] arr, int key) {
    int left = 0;
    int right = arr.length - 1;
    while (left <= right) {
        int middle = left + (right - left) / 2;
        if (arr[middle] < key) {
            left = middle + 1;
        } else if (arr[middle] > key) {
            right = middle - 1;
        } else {
            return middle;
        }
    }
    return -1;
}
```

#### 查找左边界

#### 查找右边界

### 典型题目

- [1482. 制作 m 束花所需的最少天数](https://leetcode-cn.com/problems/minimum-number-of-days-to-make-m-bouquets/)
- [LCP 08. 剧情触发时间](https://leetcode-cn.com/problems/ju-qing-hong-fa-shi-jian/)
