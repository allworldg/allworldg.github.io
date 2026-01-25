---
title: element-plus基础学习一
excerpt: 比较浅的学习一下element-plus的组件是如何实现的
publishDate: 2024-12-09T22:31:36+08:00
tags:
  - Guide
  - Element-plus
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

[Element-Plus](https://element-plus.org/)是一个很出名的前端组件库项目，使用起来十分简单，文档也很清楚。这次想重拾前端，所以我打算简单的学习一下Element-Plus的组件是如何实现的，以及最终自己可以自定义一个组件。

## 组件结构

在github上clone该项目后，进入到项目根目录，然后可以看到`packages/components/`的目录下，全都是我们常用的组件文件夹。所以我打算以其中的组件`Avatar`来作为学习入口。查看这些子文件路径，可以推测大概的内容：

- `Avatar/_test_`:应该用作单元测试，先不学习。
- `Avatar/src`:重点要学习的部分
  - `Avatar/src/avatar.ts`：提供一些主要代码，学的时候关注。
  - `Avatar/src/avatar.vue`：子组件主要部分
  - `Avatar/src/instance.ts`：暴露一个`InstanceType<type of Avatar>`,用于在需要的地方获取该`InstanceType`，方便调用组件的公用方法。
- `Avatar/style`:样式
- `index.ts`:主要是将`avatar.vue`组件封装后进行`export`，用于实际使用。

## 对应文件粗浅学习

`avatar.ts`:主要是定义组件所需要的props，和emits。

```typescript
export const avatarProps = buildProps({
  size: {xxx},
  shape:{xxx},
  icon:{xxx},
  ...
```
`buildProps`为element-plus的一个自定义方法，主要用于传入一个对象，并且将对象的属性的值进行转换，符合element-plus组件props的要求。
`emits`就比较简单了，这里只定义了一个发生错误时需要向外抛出的`emit`。

`avatar.vue`: 主要使用的组件，主要是将样式，template，以及`avatar.ts`暴露出的props和emits通过buildProps和buildEmits进行组合。最终变成我们平时调用的avatar组件。

## 最后
很粗浅的第一篇文章，写出来主要是加深自己的印象，慢慢深入。
