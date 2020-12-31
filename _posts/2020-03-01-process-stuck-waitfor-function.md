---
layout: post
title: Process的waitFor()为何会阻塞
date: 2020-03-01 23:42:08
categories: 软件工程师系列
tags:
- Java语言
- 编程语言
- 编码规范
keywords: Java,waitFor,编码规范
description: Process的waitFor()为啥会阻塞呢？
background: '/img/posts/default.jpg'
---

## 背景

我们想要通过Java调用外部命令行，常常会使用`Runtime.getRuntime().exec(command)`方法，它会返回一个`Process`对象，而当我们想要等待这个命令执行结果时，我们可以调用它的`waitFor()`方法，像这样：

```
Process p = Runtime.getRuntime().exec(command);
p.waitFor();
```

本来这段函数运行好好的，但是突然有一次，我发现程序挂死在这里了； 

为了了解到底发生了什么，我先查阅了一下JavaDoc，看到这个函数的描述是这样的：

> Causes the current thread to wait, if necessary, until the process represented by this Process object has terminated. This method returns immediately if the subprocess has already terminated. If the subprocess has not yet terminated, the calling thread will be blocked until the subprocess exits.

从描述里可以看出，“blocked”意味着这个方法存在被阻塞的可能，那会是什么原因造成的呢？

## 探索

在网上搜了一把发现，`Process`进程对象有两个输出流，分别可以通过`getOutputStream()`和`getErrorStream()`获取，如果没有及时处理它们输出的内容，那么缓冲区很快就会被消耗完，此时进程就会阻塞在这里。如果在其父进程里调用了`wairFor()`方法，就会被阻塞。

> Output from an external process can exhaust the available buffer reserved for its output or error stream. When this occurs, the Java program can block the external process as well, preventing any forward progress for both the Java program and the external process. Note that many platforms limit the buffer size available for output streams. Consequently, when invoking an external process, if the process sends any data to its output stream, the output stream must be emptied. Similarly, if the process sends any data to its error stream, the error stream must also be emptied.

看来我们的问题很可能就是因为这个原因导致的。

## 改进

知道了原因之后，修改方法就清楚了。我们可以启动另外启动两个线程消耗掉输出流的内容（或把错误流重定向到输出流，这样就只用清理一个了）： 

```
class StreamGobbler implements Runnable {
  private final InputStream is;
  private final PrintStream os;
  
  StreamGobbler(InputStream is, PrintStream os) {
    this.is = is;
    this.os = os;
  }
  
  public void run() {
    try {
      int c;
      while ((c = is.read()) != -1)
          os.print((char) c);
    } catch (IOException x) {
      // Handle error
    }
  }
}
  
public class Exec {
  public static void main(String[] args)
    throws IOException, InterruptedException {
  
    Runtime rt = Runtime.getRuntime();
    Process proc = rt.exec("notemaker");
  
    // Any error message?
    Thread errorGobbler
      = new Thread(new StreamGobbler(proc.getErrorStream(), System.err));
  
    // Any output?
    Thread outputGobbler
      = new Thread(new StreamGobbler(proc.getInputStream(), System.out));
  
    errorGobbler.start();
    outputGobbler.start();
  
    // Any error?
    int exitVal = proc.waitFor();
    errorGobbler.join();   // Handle condition where the
    outputGobbler.join();  // process ends before the threads finish
  }
}
```

同时Java 8则对`waitFor()`方法做了优化重载，我们也可以设置超时时间来避免进程阻塞：

```
public boolean waitFor(long timeout,
                       TimeUnit unit)
                throws InterruptedException
```

## 参考

1.[Do not let external processes block on IO buffers][1]
2.[Java doc - Process][2]

  [1]: https://wiki.sei.cmu.edu/confluence/display/java/FIO07-J.+Do+not+let+external+processes+block+on+IO+buffers
  [2]: https://docs.oracle.com/javase/8/docs/api/java/lang/Process.html#waitFor--
