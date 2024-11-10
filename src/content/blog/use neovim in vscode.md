---
title: title
excerpt: 结合neovim和vscode
publishDate: 2024-11-10
tags:
  - Guide
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

回看第一次我发布记录初步配置好neovim的[帖子](https://www.reddit.com/r/neovim/comments/11wlrca/noob_finish_config_for_the_first_time/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)已经过去了两年。说实话，我并没有用neovim提高我的工作效率，不如说配置它倒是花费了我很多时间。刚开始遇见neovim，我觉得它很酷炫，丰富的插件生态，使用lua而不是“难懂”的viml，结合tmux等终端工具，我感觉我也可以像大神那样，用纯键盘流灵活的切换界面，写代码写到飞起。

但是在经历了一波三折、东拼西凑的配置历程后，我发现neovim还是有一些致命的痛点影响了我。

- 很多插件依赖linux环境，在windows下体验并不好（或者无法使用），同时windows的终端界面工具不算太契合neovim（我用的alacritty，非常好，但是例如windows平台下neovim报错下划线显示异常等情况无法修复，是windows平台的问题。）
- windows平台下使用插件有些异常，所以我是在wsl2下使用neovim的，同时还可以使用tmux等终端工具。但是依旧有影响体验的问题，比如粘贴复制，想要将neovim和宿主机的粘贴板共享需要额外的设置步骤，而且我找到的方法在复制粘贴操作后会有延迟。
- 最后，我觉得最关键的痛点在于LSP，虽然很多LSP是开源的，例如python有pyright，但是VSCode的pylance是pyright的“高级版”，而且没有开源。这就导致我在neovim写python时，很多代码感知，补全并没有比在VSCode上强。

用回VSCode+VSCodeVim后，虽然这个vim插件性能不好，很多vim操作因为是模拟实现的原因，对比原vim来说差别过大，但是我用起来还可以接受。本周周末，我又想简单折腾一下，所以我把目光又放在了'vscode-neovim'这个插件上。'vscode-neovim'原理是以neovim为后端，vscode作为界面显示，该插件将neovim实例嵌入到vscode，同步文本编辑操，获得几乎完整的vim体验。

所以我的目的就很明确了：以VSCode作为编辑前端，主要用于界面的显示和编辑，同时还能继续享受VSCode各类插件以及LSP。而Neovim则作为编辑的后端，尽可能只配置基础功能和自定义快捷键，不在配置各种复杂插件，从而简化配置，减少冲突和性能损失。最后分享我的[配置](https://github.com/allworldg/nvim/tree)。

现在这个模式应该最契合我的日常工作流，可以同时享受VSCode和Neovim各自的优点，并且方便维护我的配置。或许在以后的空闲时间里，我会继续回去尝试折腾Neovim。
