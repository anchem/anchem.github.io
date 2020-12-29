---
layout: post
title: 【经验总结】C语言调用Python
date: 2020-03-01 23:18:40
categories: 软件工程师系列
tags:
- C语言
- 经验总结
keywords: C语言,python
description: 近日项目上要用C调用Python，于是记录下整个过程以便回顾总结。
background: '/img/posts/default.jpg'
---

近日项目上要用C调用Python，于是记录下整个过程以便大家可以复用我的经验：

## python安装

**第一步**：下载python的源码，我用的是3.7.3的版本，所以下载下来用的是这个：Python-3.7.3.tgz


**第二步**：然后在linux环境上创建个目录，把源码包上传上去，执行以下命令解压：
```
tar -zxvf Python-3.7.3.tgz
```

**第三步**：然后进入到解压开的目录，执行以下命令进行配置（这一步是为了生成makefile文件）
```
./configure --enable-shared --enable-optimizations
```
其中`--enable-shared`是为了给C代码留着动态库用的，`--enable-optimizations`就是个优化，不加也没问题。
此外，还可以指定`--prefix=/usr`表示编译好之后，要把python安装到哪个目录下，不指定的话，默认就是/usr/local目录了。

**第四步**：之后，执行make命令进行编译
```
make
```
执行结束后，注意一下中间的报错信息，尤其是`Failed to build these modules: **`

如果有以下组件没有构建成功，则需要解决一下：

1. _ctypes ：说明操作系统缺少libffi*，请执行以下命令进行安装
```
yum install libffi libffi_devel
```
2. openssl ：说明操作系统缺少openssl，请执行以下命令进行安装
```
yum install libssl* openssl openssl-devel
```

如果发现yum无法安装，请在`/etc/yum.repos.d`目录下添加一个`.repo`文件，把操作系统的安装盘或者yum源地址给配置进去即可。

**第五步**：编译成功之后，在python目录下应该就能看到.so文件了，下一步就是安装，执行以下命令：
```
make install
```
完事儿之后，在命令行里直接执行`python3`就能看到生效的回显了。

当然，如果你不幸地看到了这样的报错：

> python3: error while loading shared libraries: libpython3.7m.so.1.0: cannot open shared object file: No such file or directory

先查看一下python3在哪里
```
which python3
```
然后找到对应的文件，用ldd看下
```
ldd /usr/local/bin/python3
```
发现`libpython3.7m.so.1.0 => not found`
然后用命令找一下这个so安装在哪里了
```
find / -name "libpython3.7m.so.1.0"
```
好家伙，这玩意儿就在`/usr/local/lib/libpython3.7m.so.1.0`这儿。那我就给它加进去呗，找到`/etc/ld.so.conf.d`目录，创建文件`python3.conf`，加入这个库所在的路径即可`/usr/local/lib`，之后执行
```
ldconfig
```
就完事儿了。

当然你也可以创建个软连接，把`python3`放到`/usr/bin`下面
```
ln -s /usr/local/bin/python3 /usr/bin/python3
```

——完毕

## 编写C调用python的代码

C语言调用python很简单，只需要引入`Python.h`文件就可以了，Python的对象都可以用`PyObject`对象来声明，废话不多说，直接show you the code (python_test.c)

```
#include <stdio.h>
#include <Python.h>
 
int call_pyfunc(PyObject *func, const char *str)
{
    PyObject *result = 0;
    PyObject *arg = NULL;
    int ret = -1;
     
    if (!PyCallable_Check(func)) {
        printf("function can't be called.\n");
        goto fail;
    }
    arg = PyTuple_New(1);
    PyTuple_SetItem(arg, 0, Py_BuildValue("s", str));
    result = PyObject_CallObject(func, arg);
    Py_DECREF(arg);
 
    if (PyErr_Occurred()) {
        PyErr_Print();
        goto fail;
    }
    ret = PyObject_IsTrue(result);
    Py_DECREF(result);
    return ret;
     
fail:
    Py_XDECREF(result);
}
 
PyObject *import_name(const char *modname, const char *funcname)
{
    PyObject *u_name = NULL;
    PyObject *module = NULL;
    u_name = PyUnicode_FromString(modname);
    if (NULL == u_name) {
        printf("get u_name from modname failed.\r\n");
        return NULL;
    }
    module = PyImport_Import(u_name);
    if (NULL == module) {
        printf("get module from u_name failed.\r\n");
        return NULL;
    }
    Py_DECREF(u_name);
    return PyObject_GetAttrString(module, funcname);
}
 
int main()
{
    PyObject *func = NULL;
    int ret = 0;
    Py_Initialize();
    if (!Py_IsInitialized()) {
        printf("py failed to initialzed.\r\n");
        return -1;
    }
    func = import_name("hello", "main");
    printf("import func succeed.\n");
     
    ret = call_pyfunc(func, "go through!");
    printf("with ret = [%d]\n", ret);
    /*
    PyRun_SimpleString("import sys");
    PyRun_SimpleString("sys.path.append('./')";
    */
    Py_Finalize();
    return 0;
}
```
其中`main()`函数展示了C调用python的大体流程：
其中`import_name()`函数是为了初始化要调用的python脚本以及对应的函数，传了2个参数，第一个是用来指明调用哪个python脚本，也就是python脚本的文件名；第二个指明调用里面的哪个函数；
而`call_pyfunc()`函数就是实际的函数调用和得到返回值的过程：其中，参数的传入要使用`Tuple`，哪怕只有一个参数；`PyObject_CallObject()`是实际的调用方法。

下来我们再来看看python文件（hello.py）是怎么写的：
```
# -*- coding: utf-8 -*-
 
import io
 
def main(str):
    print("hello "+str)
    return False
 
if __name__ == "__main__":
    main()
```
很简单，就一个`main()`函数，把传入的字符串打印出来，再返回个`bool`类型的结果。

——完毕

## 编译构建

写完之后，就可以编译了。不过在这之前，我们得知道编译的参数怎么写。因为C代码里引用了`Python.h`，链接的时候得能链接过去才行。这时候我们需要使用一个python配置的命令查一下
```
python3-config --includes
```
回显是`-I/usr/local/include/python3.7m`，好，留着。

再来看下库
```
python3-config --libs
```
回显是`-lpython3.7m -lcrypt -lpthread -ldl -lutil -lm`，我们用`-lpython3.7m`就够了。

现在，我们的编译命令就有了：
```
gcc -l/usr/local/include/python3.7m python_test.c -o pyt lpython3.7m
```
编译OK之后，就得到了我们的可执行文件pyt，来跑一把吧！

> ./pyt: error while loading shared libraries:libpython3.7m.so.1.0: cannot open shared object file: No such file or directory”

噢，我们需要把python的so库添加到`LD_PIBRARY_PATH`环境变量里去，这样才能找到它，执行以下命令或者把它写到shell脚本里去都可以：
```
LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH; export LD_LIBRARY_PATH
```
再来跑一把：

> get module from u_name failed.
function can't be called.
with ret = [0]

嗯？没有调用成功，咋回事儿，找python的时候没找到，为啥呢？

噢，人家是从`sys.path`里去找的，得把python文件所在的路径要么通过`sys.path.append`加进去，要么添加到`PYTHONPATH`环境变量里去，那就加环境变量吧：
```
PYTHONPATH=/home/test/pyTest/:$PYTHONPATH; export PYTHONPATH
```

再跑：

> hello go through!
with ret = [0]

成功！

——完结，撒花