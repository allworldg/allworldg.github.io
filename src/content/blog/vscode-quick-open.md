---
title: 资源管理器地址栏快速打开VSCode
excerpt: 记得以前的VSCode版本，是可以在资源管理器地址栏输入`code .`来快速打开，但是最近的版本我只能在控制终端里这样用。前几天再次尝试，突发奇想后解决了这个问题。
publishDate: 2024-12-03T14:37:25+8:00
tags:
  - Guide
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

记得以前的VSCode版本，是可以在资源管理器地址栏输入`code .`来快速打开，但是最近的版本我只能在控制终端里这样用。前几天再次尝试，突发奇想后解决了这个问题。

## 解决

在地址栏输入`code .`后，报错提示为`在xxx\Microsoft VS Code\bin\code`下找不到应用程序，进入到对应bin目录下发现只有一个`code.cmd`为可执行脚本，尝试在资源管理器下输入`code.cmd .`，发现竟然可以以当前目录为路径打开VSCode，那么我就尝试创建一个`code.bat`在该目录下，同时将`code.cmd`里的内容复制过去。然后重新打开资源管理器，输入`code .`后发现成功了。

## 最后

只是一次不知原理的胡乱尝试，没想到直接成功了，简单分享一下。
