---
title: 使用vscode写博客
excerpt: short description
publishDate: 2024-10-02
tags:
  - Guide
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

之前写博客用的是Hugo+Obsidian，Obsidian作为一个markdown所见即所得的笔记软件，配置好相关插件后写博客还是很舒服的，比如我用的最多的就是粘贴截图并且自动保存图片，快速创建博客模板。但是我发现用它写博客还是不太得劲，除了我懒以外，问题出在Obsidian(0.14.15)不能像vscode等编辑器一样，支持在当前文件夹或者任务栏右键直接打开对应文件夹的操作。我的Obsidian仓库有两个，每次使用都必须先打开一个仓库再进行切换，下一次又得切换回来，实在是嫌麻烦。所以这次我尝试配置VSCode，并且用该配置写下这篇文章。

## 图片和模板

直到今天我都还记得，当初最开始接触Markdown时，文章里要添加图片对我来说是一件很麻烦的事情，保存截图，手动在文章里引入，实在是不如word文档里直接粘贴来得方便，所以我想实现类似的效果。与此同时，我现在在使用Astro写博客，每篇文章开头需要加入一些元字段，例如:title,publishDate等，这样可以在构建静态页面时提供相关信息。而我不想每次都手动根据格式填入，所以需要一个能快速填入模板的功能。

## 图片

VSCode有个插件[Paste Image](https://marketplace.visualstudio.com/items?itemName=mushan.vscode-paste-image)完美满足我的需要：可以直接粘贴截图，自动保存截图文件，可以自定义图片命名以及存放位置。这是我的插件相关配置：

```Json
  "pasteImage.defaultName": "${currentFileName}-${HH-mm-ss}",
  "pasteImage.basePath": "${projectRoot}",
  "pasteImage.prefix": "/",
  "pasteImage.path": "${projectRoot}/public/${currentFileName}",
```

## 模板

VSCode本身支持Snippet，所以可以用这个功能来实现快速生成元数据。在我的Blog项目文件夹下的`.vscode`目录下新建`xx.code-snippets`,这个文件的作用是该文件里snippet只会作用于本文件夹。接下来在文件里面添加相关`Snippet`

```Json
{
    "template": {
        "prefix": "template",
        "body": [
            "---",
            "title: title",
            "excerpt: short description",
            "publishDate: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
            "tags:",
            "  - Guide",
            "# seo:",
            "# image:",
            "#   src: '/post-11.jpg'",
            "#   alt: A person standing at the window",
            "---",
            "",
            "${0:text}"
        ],
        "description": "astro template"
    }
}
```

最后在VSCode的`setting.json`里启用Markdown的补全功能即可。

```Json
"[markdown]": {
    "editor.quickSuggestions": {
      "comments": "on",
      "strings": "on",
      "other": "on"
    }
  }
```

之前一直追求写博客时“应该”需要的功能，比如所见即所得，可拖动块，支持图片上传存储桶等。如今我觉得只要能让我最平滑快速的进入写博客的状态就行，所以写下了这篇简单配置的水文。之前配置的Obsidian也不算复杂，功能我觉得依旧好用，并且优点是所有的插件和配置都是和文章在一个文件夹，相当于完全不依赖于网络，也是很不错的。也许以后我又会切换回去。
