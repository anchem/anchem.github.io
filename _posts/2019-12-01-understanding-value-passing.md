---
layout: post
title: 深入理解C语言的值传递
date: 2019-12-01 +0800
categories: 软件工程师系列
tags: 
- 编程语言
- C语言
keywords: 软件工程师,C语言,值传递
description: 本以为C语言的值传递很好掌握，直到我遇到了一些bug。
background: '/img/posts/default.jpg'
---

## 一、函数调用与参数传递

C语言的函数提供了一种过程的抽象，函数的调用离不开参数的传递与返回值接收，而你真的理解这个过程吗？

为了说明这个问题，让我们先来统一一下几个概念。

### 实际参数 (argument)

实际参数指的是出现在函数调用中参数，比如有以下函数定义：

```
int max(int x, int y)  // x和y为形式参数
{
    return x > y ? x : y;
}

int main()
{
    int a = 1;  // a和b为实际参数
    int b = 2;
    printf("max is %d\n", max(a, b));
    return 0;
}
```

在main函数里调用了max函数，其中传入的2个参数a和b就是实际参数。

### 形式参数 (parameter)

相对的，形式参数就是出现在函数定义中参数列表上的值，比如上例中max函数里的x和y。

### 值传递

在C语言中，实际参数是通过值传递的方式传给被调用的函数的。换句话说，形式参数会拿到实际参数的一个拷贝的副本，而不是实际参数本身。

在上例中，在main函数里通过表达式max(a,b)进行函数调用时，会将a和b的值拷贝给x和y。在max函数里对x和y做任何操作都不会影响a和b的值，因为他们标识的值保存在内存上不同的位置。

我们通过gdb的`disassemble main`来看下汇编的代码也能够确认这一点：

```
0x0000000000400546 <+0>:     push   %rbp
0x0000000000400547 <+1>:     mov    %rsp,%rbp
0x000000000040054a <+4>:     sub    $0x10,%rsp
0x000000000040054e <+8>:     movl   $0x1,-0x4(%rbp)  // int a = 1;
0x0000000000400555 <+15>:    movl   $0x2,-0x8(%rbp)  // int b = 2;
0x000000000040055c <+22>:    mov    -0x8(%rbp),%edx
0x000000000040055f <+25>:    mov    -0x4(%rbp),%eax
0x0000000000400562 <+28>:    mov    %edx,%esi        // 将b的值复制给y（%esi保存被调函数的第2个参数）
0x0000000000400564 <+30>:    mov    %eax,%edi        // 将a的值复制给x（%edi保存被调函数的第1个参数）
0x0000000000400566 <+32>:    callq  0x400530 <max>   // 调用max(a, b)
0x000000000040056b <+37>:    mov    %eax,%esi
0x000000000040056d <+39>:    mov    $0x400620,%edi
0x0000000000400572 <+44>:    mov    $0x0,%eax
0x0000000000400577 <+49>:    callq  0x400410 <printf@plt>
0x000000000040057c <+54>:    mov    $0x0,%eax
0x0000000000400581 <+59>:    leaveq
0x0000000000400582 <+60>:    retq
```

其中汇编代码和原始代码的对应关系已标注，我们可以看到，在调用max函数时，是a和b的值是通过拷贝的方式给到x和y的，而他们的值都保存在不同的寄存器里。

## 二、例子

概念明确了之后，下面我们以几个典型的例子来深入理解一下。

### 1. 整型指针

了解了值传递，你可能会想到一个问题，既然形参不会影响实参的值，那么如果我想在被调函数里修改实参的值怎么办呢？

我们以一个经典的数字交换的例子来看这个问题：

【源码1-1】
```
void Swap(int x, int y)  
{
    int tmp = y;
    y = x;
    x = tmp;
    printf("x = %d, y = %d\n", x, y);
}

int main()
{
    int a = 1;
    int b = 2;
    Swap(a, b);
    printf("a = %d, b = %d\n", a, b);
    return 0;
}
```

【输出】
> x = 2, y = 1
a = 1, b = 2

我们希望通过调用Swap(a, b)来交换a和b的值，但是失败了。因为在Swap函数里，x、y和a、b实际都指向不同的内存块，x和y只是将自己的值从a和b那里拷贝了一份，对x和y的修改不会影响到a和b。
那么我们怎么改变a和b的值呢？用指针。

指针表示一块内存的地址，地址也是一个值。通过`&a`可以获取到变量a的地址，而通过`*x`则可以拿到指针x所指向的那块内存的值。因此，我们可以通过传递地址来达到修改该地址所标识的值的目的。

【源码1-2】
```
void Swap(int *x, int *y)  
{
    int tmp = *y;
    *y = *x;
    *x = tmp;
    printf("x = %d, y = %d\n", *x, *y);
}

int main()
{
    int a = 1;
    int b = 2;
    Swap(&a, &b);
    printf("a = %d, b = %d\n", a, b);
    return 0;
}
```

【输出】
> x = 2, y = 1
a = 2, b = 1

这样才能成功地交换a和b的值，这是因为，我们在调用Swap函数时，将a和b的地址，也就是门牌号给传了进去，而Swap里的x和y就可以根据门牌号来找到保存a和b的值的地方，进而对他们进行修改。

### 2. 字符指针

字符指针常用来表示字符串，比如

```
char *str = "abc";
```

那么str实际指向了一个长度为4个char型的内存块的第一个元素，该内存块依次保存了'a','b','c','\0'。
如果我想在另一个函数中改变str里的值，那么我就需要把字符指针str传递给那个函数：

【源码2-1】
```
void ChangeStr(char *strc)
{
    strcat(strc, "dc");
}

int main()
{
    char *str = (char*)malloc(sizeof(char) * 10);
    memset(str, 0, sizeof(char)*10);
    strncpy(str, "abc", 2);
    printf("str 1 = %s\n", str);
    ChangeStr(str);
    printf("str 2 = %s\n", str);
    return 0;
}
```

【输出】
> str 1 = ab
str 2 = abdc

如果你理解了上面的整型指针，那么这段代码就很好理解了。在调用ChangeStr函数时，传递的就是指针str，这时在ChangeStr内部就可以通过strc找到str所指向的内存块了，自然就能够修改实参str所指向的字符串了。

但是这种场景也可能会出现问题，比如下面这样：

【源码2-2】
```
void ChangeStr(char *strc)
{
    if (strc == NULL) {
        strc = (char*)malloc(sizeof(char) * 10);
        memset(strc, 0, sizeof(char)*10);
    }
    strncpy(strc, "abc", 2);
    strcat(strc, "dc");
    printf("str 1 = %s\n", strc);
}

int main()
{
    char *str = NULL;
    ChangeStr(str);
    if (str == NULL) {
        printf("str is null\n");
        return 0;
    }
    printf("str 2 = %s\n", str);
    return 0;
}
```

【输出】
> str 1 = abdc
str is null

虽然我给ChangeStr传递的也是char类型的指针，在ChangeStr里的确也分配了内存，成功地修改了形参strc指向的字符串的值，为什么在main函数里，实参str指向的还是空的呢？

让我们回到值传递这个概念，在main函数里调用ChangeStr的时候，str的值是空值，而在ChangeStr函数里，形参strc刚开始拿到的是实参str的一份拷贝，也就是一个空值。之后通过malloc函数所在的那一行修改了strc的值，这时strc指向了另一块内存，和实参str所指向的地方已经不同了。当ChangeStr函数返回时，strc是strc，str是str，两个变量的值已经不一样了，所以str还是一个空值。

同时，在ChangeStr函数返回后，形参strc就失效了，而它所指向的那块内存因为没有指针可以索引到，既用不了，也不能分配给别人，所以自然就内存泄露了。

这个问题修改起来也简单，只需要把ChangeStr的形参作为返回值再传递给实参str就可以了，像下面这样：

【源码2-3】
```
char *ChangeStr(char *strc)
{
    if (strc == NULL) {
        strc = (char*)malloc(sizeof(char) * 10);
        memset(strc, 0, sizeof(char)*10);
    }
    strncpy(strc, "abc", 2);
    strcat(strc, "dc");
    printf("str 1 = %s\n", strc);
    return strc;
}

int main()
{
    char *str = NULL;
    str = ChangeStr(str);
    if (str == NULL) {
        printf("str is null\n");
        return 0;
    }
    printf("str 2 = %s\n", str);
    return 0;
}
```

【输出】
> str 1 = abdc
str 2 = abdc

我们通过`str = ChangeStr(str);`表达式，将形参strc的值赋值给了实参str，这样str就能够索引到strc所指向的那个字符串了。

当然，如果你对指针有足够的理解的话，也可以通过传递二级指针的方式解决这个问题，像下面这样：

【源码2-4】
```
char *ChangeStr(char **strc)
{
    if (*strc == NULL) {
        *strc = (char*)malloc(sizeof(char) * 10);
        memset(*strc, 0, sizeof(char)*10);
    }
    strncpy(*strc, "abc", 2);
    strcat(*strc, "dc");
    printf("str 1 = %s\n", *strc);
    return *strc;
}

int main()
{
    char *str = NULL;
    ChangeStr(&str);
    if (str == NULL) {
        printf("str is null\n");
        return 0;
    }
    printf("str 2 = %s\n", str);
    return 0;
}
```

【输出】
> str 1 = abdc
str 2 = abdc

指针就是变量的地址，那么指针自己本身也有地址，通过传递指针的指针，我们就可以在其他函数里修改指针的值了。

当然，我个人比较建议用2-3的方式来解决这个问题，毕竟返回值一读即懂，而通过形参来修改实参的方式读起来稍微费劲儿一些。

### 3. free()函数

在上面的例子里我们用到了`malloc`函数，下面我们再来看一个由`free`函数引发的血案：

【源码3-1】
```
void SafeFree(void *p)
{
    if(p != NULL){
        free(p);
        p = NULL;
    }
}

char *InitStr()
{
    char *str = (char*)malloc(sizeof(char)*10);
    memset(str, 0, sizeof(char)*10);
    strncpy(str, "abc", 3);
    return str;
}

int main()
{
    char *str;
    str = InitStr();
    printf("str = %s\n", str);
    SafeFree(str);
    if(str != NULL){
        printf("str is %s", str);
    }
}
```

【输出】
> str = abc
str is h?y

通过上面的例子，很容易理解`InitStr()`初始化str没有问题。在这之后，调用了`SafeFree(str)`来释放这块内存，在该函数里，free函数把str指向的内存块释放掉了，而形参p拿到的是实参str的拷贝，把p修改成NULL并不会影响实参str的值，str指向的还是这块内存。这时我们再打印str，就会把str当前指向的这块内存的内容给打印出来了。如果这段代码出现在了一个复杂的大型程序中，很容易引发进程复位。

要修复这个问题，我们需要在SafeFree函数之后，把NULL再赋值给str，让它不要再指向一块已不属于它的内存了。

这也提醒了我们，在使用free函数之后，要注意所有指向这块内存的指针，一定要赋空，否则不管是再次使用还是二次free，都会引发血案

```
SafeFree(str);
str = NULL;
```

### 4. 局部变量的指针

由上面的几个例子我们可以看到，函数可以返回指向外部变量的指针，也可以返回局部指针变量，那么如果我们返回了指向局部变量的指针会发生什么情况呢？

【源码4-1】
```
int *TempTest()
{
    int temp = 100;
    return &temp;
}

int main()
{
    int *num;
    num = TempTest();
    printf("num = %d", *num);
}
```

【输出】
> 警告：函数返回局部变量的地址 [-Wreturn-local-addr]
     return &temp;

在TempTest函数里定义了一个局部变量temp，一旦TempTest函数返回了，变量temp的生命周期就结束了，而指向temp的指针将指向一块无效的内存，也许这个指针就成NULL的了。这段代码在编译的时候会触发编译告警，提示函数返回了局部变量的地址，运行时很可能就会触发段错误。

如果把temp修改成全局变量或者局部静态变量`static`，由于其生命周期不再局限于TempTest函数，而是整个程序级别的，这样就不会出现其内存无效的情况了。

## 三、总结

C语言的函数调用和参数传递是初学者常常容易轻视而栽跟头的地方，其实只要记住C语言的参数传递是值传递，是拷贝传递，同时注意参数的生命周期，就能够掌握它了。
