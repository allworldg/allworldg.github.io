---
title: Why Method Breakpoint Slow
excerpt: 一些IDE提供“方法断点”的功能，可以让断点调试看起来非常简洁，然而在调试过程中我们会发现调试反应时间很长，调试器的性能大大降低。在本文中，我会简单解释方法断点的实现原理，以及为何导致性能变差的原因。
publishDate: 2022-10-21T11:37:51+8:00
tags:
	- Guide
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

一些IDE提供“方法断点”的功能，可以让断点调试看起来非常简洁，然而在调试过程中我们会发现调试反应时间很长，调试器的性能大大降低。在本文中，我会简单解释方法断点的实现原理，以及为何导致性能变差的原因。

为了更好的理解，我先简单说明一下断点是如何实现的，以及调试器的工作原理。

## JPDA(Java Platform Debugger Architecture)
JPDA是JAVA调试框架，主要用于debugger(调试器)和debuggee(调试程序或进程)之间的通信。JPDA主要由三个主要API构成。
1. JVM TI(JVM Tool Interface) :  一个native接口，定义了VM提供debug的函数。
2. Java Debug Wire Protocol(JDWP):JDWP是一个定义debugger和debuggee通信的Api。
3. Java Debug Interface(JDI): Java接口，用于前端和后端的通信交互，JDI内部实现了JDWP接口。
4. 下图和文章中的前后端(back-end and font-end)分别指的是运行在VM上的调试程序(进程)和编辑器。![](/public/why-method-breakpoint-slow.md/why-method-breakpoint-slow.md-${23-27-27}.png)
5. 调试链：相关事件发生时（比如打断点，单步调试，调试时修改参数值），VM通过回调（JNI: java Native Interface，VM通过JNI来调用Native Interface）调用JVM TI，然后back-end发送event给font-end。debugger通过JDI和JDWP与后端通信。

## 为何要用方法断点
如果调用的方法无法访问源码，或者方法内有多个if出口，此时用方法断点很简洁。
## JAVA断点原理
在编辑器打一个断点，往往内部会进行三步
1. 允许断点事件：VM允许debugger激活各种事件。font-end调用 `SetEventNotificationMode()` 方法启用 `can_generate_breakpoint_events`  ，当运行到断点处，VM会触发事件通过debugger链返回值。
2. 注册断点：通过 `SetBreakpoint` 方法设置断点，当线程运行到断点处，VM会将所有active线程暂停，并且触发断点事件。
	```Java
	SetBreakpoint(jvmtiEnv* env,

	              jmethodID method, //注意一下此变量，下文会再次提到。

	              jlocation location)
	```
3. 断点事件：VM触发的事件叫断点事件，用于通知debugger。事件： `Breakpoint(xxx)`
## 方法断点
实际上JDPA不提供方法断点的功能，方法断点是编辑器提供的。

debugger调用上文说的 `SetEventNotificationMode()`，
启用 `can_generate_method_entry_events` 和 `can_generate_method_exit_events`，当VM运行进入和退出方法时，会向debugger发送 方法进入退出事件：
```Java
MethodEntry(....,JmethodID method)
MethodExit(....,JmethodID method)
```
断点实现流程：
1. IDE将断点添加到编辑器内置维护的一个断点list里。
2. debugger调用上文说的SetEventNotificationMode(),启用entry events和exit events，当VM运行代码进入和退出方法时，会向debugger发送事件。
3. 每当进入和退出方法时，VM会向font-end发送MethodEntry或MethodExit。
4. IDE根据事件中的jmethodID，来检索该id是否存在于断点list中。
5. 如果存在，debugger则调用 `SetBreakPoint` 方法，将请求发送到VM。
6. VM运行代码到断点处，停止活动线程，并且将event返回debugger

和普通断点的区别在于：方法断点在流程中需要先判断该方法是否被前端标记为应该要打上断点，然后才是注册断点。
## 调试方法断点为何很慢
1. JmethodID：JmethodID是正在运行方法的标识符。每次VM需要返回MethodEntry和MethodExit时都需要携带JmethodID，然而VM查找获取JmethodID需要较长时间。
2. communication：methodEntry和MethodExit导致前端和后端之间进行大量的通信往返。
3. VM callback is synchronization：VM触发事件使用回调时，经过以下几个步骤（都是同步操作）：
	1. 将context切换到back-end，back-end通知font-end
	2. font-end根据返回的jmethodID，查找是否存在于断点list中。
	在此期间代码执行是暂停的。
## 总结
1. 尽量减少方法断点的使用。
2. 如果不必要，可以只使用methodEntry，不激活methodExit，减少查找以及通信次数。
