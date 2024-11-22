---
title: 配置giscus博客评论功能
excerpt: 给自己的个人博客文章添加评论功能
publishDate: 2024-11-22
tags:
  - Guide
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

给自己的个人博客添加评论功能，插件选的是[giscus](https://giscus.app/),这个可以用github的discussion作为文章的评论载体。虽然不一定会有人来评论，但万一呢？

## 步骤

其实主要跟着[giscus](https://giscus.app/)的Configuration部分做即可。[安装插件](https://github.com/apps/giscus)到指定仓库，然后在对应仓库的Setting下启用Discussion。

然后继续跟着giscus的引导步骤继续做，在repository中输入`username/reponame`（刚安装好插件需要一段时间后才会生效。![](/public/add-giscus.md/add-giscus.md-${21-09-10}.png)然后接下来的选项根据自己的喜好选择即可，我基本上选的都是默认值。最后就自动生成了一个script!

```javascript
<script
  src="https://giscus.app/client.js"
  data-repo="allworldg/allworldg.github.io"
  data-repo-id="R_kgDOMZX2hw"
  data-category="Announcements"
  data-category-id="DIC_kwDOMZX2h84CkemW"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="en"
  crossorigin="anonymous"
  async
></script>
```

最后将这段代码放到对应的Astro组件里即可。

## 最后

希望各位走过路过的看官能留下你们的脚印，谢谢。
