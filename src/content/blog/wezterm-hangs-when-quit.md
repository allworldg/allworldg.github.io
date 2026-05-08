---
title: Solve hang problem when wezterm quit
excerpt: when I try to quit the wezterm, it will hang randomly. I just found a way which mentioned in github issue.
publishDate: 2026-05-08T16:12:16+08:00
tags:
  - Guide
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

Quoted from github:
On Windows 10 I fixed the issues by using Microsoft's fixed conpty.dll and OpenConsole.exe.
They are distributed with windows terminal...
Copied to the wezterm.exe I have no issues for half a year daily use...
Looks like windows itself will not be updated.