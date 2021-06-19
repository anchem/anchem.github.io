# Java 数组

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

### 进阶操作

Java SE 提供了原生的`java.util.Arrays`工具类库用来对数组做一些常见的操作，包括：

- 二分查找 - `binarySearch`
- 比较 - `equals`
- 填充 - `fill`
- 排序 - `sort`和`parallelSort`
- 创建流 - `stream`
- 转String - `toString`

#### 【排序】

`Arrays.sort`方法提供了为数组排序的功能，顺序默认是从小到大排列的。该排序方法使用单线程顺序排序，适合小规模的数组。

对于较大的数组，建议使用`Arrays.parallelSort`方法并行排序，速度更快，且可以充分利用多核处理器的能力。但是对于小数组，就不建议使用该方法了，因为拆分数组的开销要大于并行排序的效率。实际上`parallelSort`也会判断数组的长度，如果小于8192，则不会采用并行排序的。

如果想要逆序排序，或者自定义顺序排序，就要用到`Arrays.sort(T[] a, Comparator<? super T> c)`方法了。

**例子1：**

```java
Integer[] a = new Integer[]{1,4,2,3,5};
Arrays.sort(a, (t0, t1)-> t1-t0);
System.out.println(Arrays.toString(a));  // 打印 [5, 4, 3, 2, 1]
```

#### 【二分查找】

**在数组已经充分排好序的情况下**，`Arrays.binarySearch`提供了二分查找数组元素的功能，函数包含多个重载形式，返回值含义如下：

1. \[0-length-1\] - 找到寻找的值，返回其索引；
2. -1 - 未找到，且待寻找的值比数组最小的元素还小；
3. -(length) - 未找到，且寻找的值比数组最大元素还大。

如果待寻找的值在数组中有多个，则返回任意一个元素的索引。

值得关注的是`Arrays.binarySearch(T[] a, T key, Comparator<? super T> c)`这个重载方法，其中`Comparator`指明了数组的排序方式。

**例子1：**

```java
Integer[] a = new Integer[]{5,4,3,2,1};

System.out.println(Arrays.binarySearch(a,2);  // 结果打印 -1, 表示未找到，因为二分查找默认数组是按照从小到大排好序的
System.out.println(Arrays.binarySearch(a,2, null);  // 同上，null表示默认按照数组从小到大排列

System.out.println(Arrays.binarySearch(a,2, (t0, t1) -> t1-t0));  // 结果打印 3，其中 Comparator 指明了数组的排序方式，也决定了二分查找的方向
```

#### 【比较】

#### 【填充】

#### 【创建流】

#### 【转String】

```java
int[] a = new int[]{1,2,3};
```

如果使用`System.out.print`之类的函数打印数组时，打印出来的内容是数组的**地址**，而非数组的**内容**，就像这样`[I@2d98a335`。

如果想打印数组中元素的内容，则需要使用`Arrays.toString()`方法将数组转成`String`类型，再使用"print"函数打印即可：`[1,2,3]`。

#### 【数组拷贝】

使用`System.arraycopy(Object src, int srcPos, Object dest, int destPos, int length)`方法可以将`src`数组拷贝到`dest`数组，需指定拷贝的起始位置（即索引）和拷贝元素的长度。

3个int类型的变量，只要有一个不满足拷贝的条件，都会抛出异常。

### Array vs. ArrayList

转换方法

拼接，泛型

## 相关算法

### 排序

### 搜索

### 矩阵算法
