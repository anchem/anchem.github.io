---
layout: post
title: 圈复杂度重构技术（C语言篇）
date: 2020-01-23
categories: 软件工程师系列
tags: 
- 软件设计与重构
- C语言
keywords: C语言,软件工程师,圈复杂度,重构
description: 近期在搞圈复杂度的整改，遇到了不少奇奇怪怪的问题，不妨记录下来，以免你也遇到一样的坑。
background: '/img/posts/default.jpg'
---

## 圈复杂度

### 什么是圈复杂度

**圈复杂度（CC，Cyclomatic complexity）**是一种代码复杂度的衡量标准，由托马斯·J·麦凯布（Thomas J. McCabe, Sr.）于1976年提出，目的是为了度量代码的复杂程度。
<!-- more -->
代码复杂度简单说是由独立的**执行路径**的条数决定，而执行路径的条数取决于**判定节点**的结构。

什么是判定节点呢，判定节点就是会根据逻辑表达式来选择后续执行哪条执行路径的节点，比如if语句，while语句，case语句，and和or语句，?:三元运算符等。

例1：
```
if (i < 0) {
    // do something
} else {
    // do other
}
```
代码执行的流程如下：
```
(1)---->(2)---->(4)---->(5)
 |               |
 |----->(3)----->|
```
从例1中可以看到，if语句作为一个判定节点（1），会带来2条独立的执行路径，一条执行判定结果为成立的（2），一条执行判定结果为不成立的（3），它们执行完毕后都会继续执行（4）

### 为什么需要圈复杂度

之所以要度量代码的复杂程度是因为它和软件质量息息相关，主要表现在以下几个方面：

1. **圈复杂度高的代码容易出现缺陷**
2. **圈复杂度高的代码不容易进行测试**
3. **圈复杂度过高往往其内聚性比较低**
4. **圈复杂度高的代码难以维护**

所以我们往往会在持续集成的时候监控圈复杂度的大小，并且在必要的时候进行圈复杂度的清理，把它降到一个合适的范围。一般来说，圈复杂度在1-10是比较好的范围。

### 如何计算圈复杂度

计算公式
> V(G) = E - N + 2

其中V(G)表示圈复杂度，E表示控制流图中边的数量，N表示节点的数量。

例2：
```
while (i < len) {
    if (a[i] == 1) {
        printf("matched");
    }
    ++i;
}
```
控制流图简化如下：
```
(1)---->(2)---->(3)---->(5)---->(7)---->(8)
 |       |               |       |
 |       |----->(4)----->|       |
 |                               |
 |<------------(6)<--------------|
```
例2对应的这个控制流图里，边的数量有9条，节点8个，带入公式，V(G)=9-8+2=3

## 降低圈复杂度--C语言

### 识别

除了通过工具扫描之外，圈复杂度比较高的代码往往有一些明显的特征，它不像代码味道那样因人而异，所以比较容易识别。以下是一些常见的特征：

- 在一个函数内部使用了很多if，while，for等判断语句；
- 嵌套了多层的条件判断或者循环语句；
- 函数内部的局部变量数量过多；
- 代码行数较长，比如超过了50行；

### 主要方法：提炼函数

**提炼函数**是最常用也是最主要的降圈方法，也是一种重要的重构方法，我们直接通过例子来说明：

例3：
```
int ProcessData(Context context, int sid, Param param)
{
    Data data = NULL;
    if (context == NULL) {
        return -1;
    }
    if (sid <= 0) {
        return -1;
    }
    if (param == NULL || param.errCode != 0) {
        return -1;
    }
    
    data = GetDataFromParam(param);
    if (data->flag != null) {
        // some process ...
    } else {
        // other process ...
    }
    
    Log(INFO, "the name of data is %s", data->name);
    Log(INFO, "the value of data is %s", data->value);
    return 0;
}
```
提炼之后：
```
Bool IsParamValid(Context context, int sid, Param param)
{
    if (context == NULL) {
        return FALSE;
    }
    if (sid <= 0) {
        return FALSE;
    }
    if (param == NULL || param.errCode != 0) {
        return FALSE;
    }
    return TRUE;
}

void HandleDataProcess(Data data)
{
    if (data->flag != null) {
        // some process ...
    } else {
        // other process ...
    }
}

void PrintDataDetail(Data data)
{
    Log(INFO, "the name of data is %s", data->name);
    Log(INFO, "the value of data is %s", data->value);
}

int ProcessData(Context context, int sid, Param param)
{
    Data data = NULL;
    if (IsParamValid(context, sid, param) != TRUE) {
        return -1;
    }
    data = GetDataFromParam(param);
    if (data == NULL) {
        return -1;
    }
    HandleDataProcess(data);
    PrintDataDetail(data);
    return 0;
}
```
在例3所示原始的**ProcessData**函数里，我们看到圈复杂度较高，且整个函数做的事情有点多；在提炼之后，我们将功能相关的部分单独提炼出来了3个独立的函数，分别是**IsParamValid**，**HandleDataProcess**和**PrintDataDetail**，这样不仅每个函数的圈复杂度都不高，而且提炼后的代码逻辑更加清晰了。对于像**PrintDataDetail**之类的函数，还可以在其他函数里达到复用的效果。

对于提炼函数以及其他几种能够帮助降圈的方法，在《重构》这本书里你能找到更多更详尽解释和用法说明，我在这里就不再赘述了。

但我认为有两个关键点值得重复强调一下，那就是函数的命名和局部变量的修改。

**【函数命名】**
既然要提炼函数，那么提炼出来的函数肯定要有一个名字，而这个名字很重要，因为它会影响其他人怎么理解它。一个最普遍的做法就是按照它做了什么来命名，见名知意，达到自注释的效果。这样，上层函数读起来就跟读注释一样简单明了。

**【局部变量的修改】**
提炼函数往往伴随着局部变量的修改，这是该方法的难点，也是容易引入bug的地方，尤其是以下几个地方：

**====》**如果存在仅用于被提炼出的函数的局部变量，那么就在提炼出的函数中声明并使用它，在原函数中移除掉；

**====》**将被提炼代码中需要读取的局部变量作为参数传递进去；

**====》**如果在被提炼代码中修改了声明在原函数中的局部变量，那么如果在被提炼的代码之后还在使用这个变量，要么通过返回值传递出来，要么传递变量的地址进去，利用语言出参数的特性带出来；如果之后不再使用这个变量，那么直接在提炼出的函数中使用即可；

**====》**对于指向动态内存的局部变量，尽量在同一个函数内分配和释放，换句话说，如果在原函数中有这样的变量，那么建议不要在被提炼的函数中释放它，而应该在原函数中释放，这样有利于维护它的声明周期，避免内存泄露或重复释放等错误；

下面以一个例子来说明上述问题：
例4：
```
int CountMatchedParam(Context context, Param param)
{
    Session session = NULL;
    Connection conn = NULL;
    unsigned int i = 0;
    unsigned int count = 0;
    Data* data = NULL;
    if (IsParamValid(context, prarm) != TRUE) {
        return -1;
    }
    conn = GetConnection(context);
    if (conn == NULL) {
        return -1;
    }
    session = GetSessionFromConnection(conn);
    if (session == NULL) {
        return -1;
    }
    data = (Data*)MALLOC(sizeof(Data));
    if (data == NULL) {
        return NULL;
    }
    HandleExceptionMatch(session, param, &count);
    for (i = 0; i < param->len; i++) {
        if (param->arr[i] == MATCH_FLAG) {
            ++count;
        }
    }
    if (count == 0) {
        SAFE_FREE(data);
        return -1
    }
    HandleMatchedCount(param, data, count);
    return 0;
}
```
提炼后：
```
Session GetSession(Context context) // context作为入参传递进来
{
    Connection conn = NULL; // 修改了声明的位置
    Session session = NULL;
    conn = GetConnection(context);
    if (conn == NULL) {
        return -1;
    }
    session = GetSessionFromConnection(conn);
    return session; // 作为返回值传递出来
}
ErrCode MatchProcess(Param param, Data data, unsigned int count)
{
    unsigned int i = 0; // 修改了声明的位置
    for (i = 0; i < param->len; i++) {
        if (param->arr[i] == MATCH_FLAG) {
            ++count;
        }
    }
    if (count == 0) {
        return ERROR;
    }
    HandleMatchedCount(param, data, count);
    return OK;
}
int CountMatchedParam(Context context, Param param)
{
    Session session = NULL;
    unsigned int count = 0;
    Data* data = NULL;
    if (IsParamValid(context, prarm) != TRUE) {
        return -1;
    }
    session = GetSession(context); // session通过函数返回值获取
    if (session == NULL) {
        return -1;
    }
    data = (Data*)MALLOC(sizeof(Data));
    if (data == NULL) {
        return NULL;
    }
    HandleExceptionMatch(session, param, &count); // 这里用到了session；同时由于修改了count的值，且在后续用到了，所以这里传递了它的地址
    if (MatchProcess(param, data, count) != OK) { // count后续不再使用，所以直接传递即可
        SAFE_FREE(data);  // data在哪个函数里申请，就在哪个函数里释放，方便统一维护
        return -1;
    }
    return 0;
}
```

首先，我们关注下原**CountMatchedParam**函数中的**i**和**conn**，由于他们只在提炼后的函数中使用，所以修改了其声明的位置；

其次，对于**GetSession**函数中用到的**context**，直接通过入参传递了进去；

同时，在**GetSession**函数中，由于修改了**session**的值，且在后面会继续用到它，所以通过返回值将其传递了出来；

而**count**变量有2处值得注意的地方：首先，在**HandleExceptionMatch**中修改了它的值，且后续会继续使用它，所以传入的是它的地址；其次，在**MatchProcess**之后不再使用**count**，所以直接传递进去就行了；

最后，**data**这个局部变量是在**CountMatchedParam**函数内申请的，那么在**MatchProcess**内部处理的时候，就需要把释放的方法放到被调函数里，也就是**CountMatchedParam**里。


### 注意事项

#### 1. 小心宏定义

如果宏定义里有return之类的跳转或返回语句，一定要小心，不要因为提取函数而误改了原有的流程。

例：
```
#define PRE_CHECK(a) \
    if (a == NULL) { \
        return -1;   \ // 要小心这里有个return
    }
    
int foo(Param param)
{
    PRE_CHECK(param);
    if (param->flag == ERR_FLAG) {
        return -1;
    }
    
    // ... other process
}
```

在PRE_CHECK这个宏定义的代码段里，有一个return语句，如果不小心提了出去，则很容易破坏原有函数的逻辑。不过在宏定义里写return语句也的确不是一个好的编程习惯。

#### 2. 数组形参要传长度

将数组作为入参时，如果在函数内要使用它的长度，那么一定要通过入参传进去，否则你不仅会得到一个编译告警，还会发现根本得不到入参数组的实际长度。

> warning: 'sizeof' on array function parameter 'arr' will return size of 'char *' [-Wsizeof-array-argument]


#### 3. 指针传参问题

指针传参问题是新手最容易遇到的问题，当然理解了之后也比较容易解决。我们还是用例子来说明。
例：
```
ErrCode GetRequiredInfo(Context context, Session* session, char* sid)
{
    Connection *conn = NULL;
    conn = GetConnection(context);
    if (conn == NULL) {
        return ERROR;
    }
    session = GetSessionFromConn(conn);
    if (session == NULL) {
        return ERROR;
    }
    sid = GetSidFromSession(session);
    if (sid == NULL) {
        return ERROR;
    }
    return OK;
}
ErrCode GetReport(Context context, char *sid, Report **report)
{
    *report = ParseReport(context, sid);
    if (report == NULL) {
        return ERROR;
    }
    return OK;
}
int HandleData(Context context, Param param)
{
    Session *session = NULL;
    char *sid = NULL;
    Report *report = NULL;
    ErrCode ret = ERROR;
    ret = GetRequiredInfo(context, session, sid);
    if (ret != OK) {
        return -1;
    }
    ret = GetReport(context, sid, &report);
    if (ret != OK) {
        return -1;
    }
    // ... other process
    return 0;
}
```

这个例子里有3处新手常常容易犯的错误：
1. 在**GetRequiredInfo**函数里，**session**被重新赋值了，而如果在**HandleData**里要继续使用它，那么就一定会拿到一个空的值；因为C语言的函数是值传递的，指针也是拷贝复制的，对形参的修改不会影响实参；所以这里应该传递二级指针。
2. 同样在**GetRequiredInfo**函数里，**sid**也犯了同样的错误，也要传二级指针。
3. 第3个错误发生在**GetReport**函数里，因为修改了**report**的值，所以传递了二级指针，并通过解引用来赋值，这是正确的；但是在第21行发生了一个错误，本意应该是要判断**\*report**是否为空，却误判成了**report**，它本身虽然是NULL，但是空指针的指针却不是NULL，所以这个逻辑判断永远都会返回成立，起不到实际想要的效果。

正确的修改应该是这样的：
```
ErrCode GetRequiredInfo(Context context, Session** session, char** sid)
{
    Connection *conn = NULL;
    conn = GetConnection(context);
    if (conn == NULL) {
        return ERROR;
    }
    *session = GetSessionFromConn(conn);
    if (*session == NULL) {
        return ERROR;
    }
    *sid = GetSidFromSession(*session);
    if (*sid == NULL) {
        return ERROR;
    }
    return OK;
}
ErrCode GetReport(Context context, char *sid, Report **report)
{
    *report = ParseReport(context, sid);
    if (*report == NULL) {
        return ERROR;
    }
    return OK;
}
int HandleData(Context context, Param param)
{
    Session *session = NULL;
    char *sid = NULL;
    Report *report = NULL;
    ErrCode ret = ERROR;
    ret = GetRequiredInfo(context, &session, &sid);
    if (ret != OK) {
        return -1;
    }
    ret = GetReport(context, sid, &report);
    if (ret != OK) {
        return -1;
    }
    // ... other process
    return 0;
}
```

#### 4. free之后的赋空

释放动态分配的内存后，指向这块内存的指针一定要赋空，否则会引入一些意想不到的问题。

例：
```
void Deinit()
{
    if (g_session_data->report_list != NULL) {
        free(g_session_data->report_list);
        g_session_data->report_list = NULL; // 这句不能少
    }
}
```

例子中的函数释放了全局变量中的**report_list**，并在释放后将其赋空。如果这里缺少了赋空的操作，那么在程序的其他地方如果使用到了这个变量，则很容易访问非法内存，篡改数据，带来意想不到的问题。

#### 5. 注意返回值

返回值会影响代码的执行逻辑，在提炼函数时，如果被提炼出来的函数包含了返回值，则一定要确保提炼出去之后，原函数的逻辑不能改变。

同时，也要小心在提炼出来的函数里当你想要自定义一个返回值的时候，不要和原返回值所定义的宏相重复了，否则就会篡改原来的逻辑。

例：
```
#define RET_ERROR -1
#define RET_ERROR_SEC -2
void foo(Status status)
{
    if (status == LASTING) {
        // process...
        return RET_ERROR;
    } else if (status == PENDING) {
        // process...
        return RET_ERROR_SEC;
    } else {
        // process...
        return -2; // 本想返回一个其他类型的错误码，却与RET_ERROR_SEC重复了
    }
}
```

## 一点思考

圈复杂度作为一个衡量软件复杂度的指标，它的确提供了一个可以度量代码质量的方法，便于监控和管理，但是圈复杂度高的代码就一定是不好的吗？

例：
```
void TimerHandler(Msg msg)
{
    switch (msg) {
        case RESTART:
            ProcessRestart();
            break;
        case UPDATE_CFG:
            ProcessUpdateCfg();
            break;
        case NEW_BACKUP:
            ProcessNewPackup();
            break;
        case OPEN_FLAG:
            ProcessOpenFlag();
            break;
        // ....other cases but not too many
        default:
            Log(ERROR, "unknown message");
    }
}
```

其实这样的代码不管是从可读性还是可维护性的角度来讲都是可以接受的，当然你也可以按照表驱动的方式去重构它，但是如果不动它，也没有什么问题，反而如果表驱动用的不好，到是会引入其他的问题。

类似的例子还有不少，我就不一一举例了，我想说的是，圈复杂度其实只能代表圈复杂度本身，并不能完全描述代码的质量和可维护性等特性，只能作为一个侧面的参考。代码是给人看的，是人来维护的，关键在于在功能正确的前提下，怎么把代码写的让人容易看懂，容易维护。圈复杂度低的代码往往逻辑简洁，好读、好测、可控，同时，一些圈复杂度高的代码也可能拥有同样的特点，反而你想尽办法把它的圈复杂度降下去了之后却发现更难维护了。所以，当我们在讨论圈复杂度的时候，一定要清楚我们到底在讨论什么。
