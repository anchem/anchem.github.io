# Arrays in Java

## Content

- **基本用法**
- **进阶用法**
- **相关算法**

## 基本用法

### 基本概念及操作

**【概念】**

**数组**是一个容器，里面保存了固定数目的相同类型的对象，它们在内存空间的存储是连续的。

数组有几个关键的概念：

- **类型** - 一个数组里保存的都是同一类型的元素，不同类型的元素不能保存在一个数组里。
- **长度** - 数组是固定长度的，一旦定义了数组，那么长度也就明确了。
- **元素** - 数组中保存的每一个对象都被称为元素。
- **索引** - 数组中每一个元素都有一个索引值，标识它在数组中的位置。对于长度为 N 的数组，其索引值取值范围为 \[0, N-1\]；若索引值超出了范围，会抛出`java.lang.ArrayIndexOutOfBoundsException`异常

**【基本操作】**

```java
// 1. 声明一个数组
int[] arr;

// 2. 初始化数组
long[] arrLong = new long[10];  // 初始化了一个长度为10，保存了 long 类型的数组，每个元素初始化为该元素类型的默认值
int[] arrInt = new int[]{1,2};  // 初始化了一个长度为2，保存了 int 类型的数组，并定义了各元素的值为 1 和 2
Person[] person = new Person[5];  // 初始化了一个长度为5，保存了 Person 类型的数组，每个元素初始化为 null

// 3. 赋值
arrInt[1] = 3;  // 为数组的第 2 个元素赋值为 3

// 4. 访问数组元素
long value = arrLong[0];  // 通过索引直接访问数组的元素，效率很高
long value = arrLong[-1];  // 数组越界访问，会抛出异常

// 5. 遍历数组
for (int i = 0; i < arr.length; i++) {
    System.out.print(arr[i]);
}

for (int i : arr) {
    System.out.print(i);
}
```

### 二维数组

当数组中的元素也为数组时，我们就得到了一个二维数组：

```java
int[][] matrix = new int[][]{{1, 2 ,3}, {4, 5, 6}, {7, 8, 9}};
String[][] names = new String[][]{{"hello", "world"}, {"good", "morning"}};
```

二维数组初始化时，若不定义每个元素的值，则必须定义最外层数组的长度，这样程序才知道如何分配内存的大小：

```java
long[][] matrixLong = new long[5][];  // 二维数组初始化时，必须指定外层数组的长度；此时 matrixLong 长度为5， 每个元素的值初始化为 null
```

## 进阶用法

多维数组，矩阵，

数组拷贝，拼接，与List转换，转成stream，泛型

## 相关算法

排序，搜索

### 相关库

arrays，apache common等
