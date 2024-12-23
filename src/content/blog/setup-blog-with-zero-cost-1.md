---
title: 零成本搭建个人博客搭建篇
excerpt: 尽管已经有很多成型的在线博客平台供大家使用（csdn，博客园，掘金等），但是它们都有一些很明显的弊端，例如账号以及博客内容受到监管，所有权不属于作者本人，对于博客平台的功能diy自由度很低。
publishDate: 2022-05-16T22:08:57+08:00
tags:
	- Guide
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

## 为什么要搭建个人博客
尽管已经有很多成型的在线博客平台供大家使用（csdn，博客园，掘金等），但是它们都有一些很明显的弊端，例如账号以及博客内容受到监管，所有权不属于作者本人，对于博客平台的功能diy自由度很低。

所以为了尽可能自由写作，我们还是简单搭建一个博客平台吧。除了独立自由以外，自建个人博客还有以下好处：
1.  个人名片打造
2. 文章归档分类
3. 广告被动收入
## 博客平台选型
网上流行的博客平台主要分为两大类：动态博客平台以及静态博客平台。动态博客中最强大的当属WordPress，该平台作为cms（内容提供系统）拥有庞大的用户基数，各种网站和论坛都可以直接使用它来搭建。静态博客中个人认为很有名的则是Hexo以及Hugo，这两者本身大同小异，我之前用的就是Hexo，现在则切换到本篇写作的主题：Hugo。
| 比较     | wordpress  | hexo & hugo  |
| -------- | ------- | ------------------------------------------------------- |
| 搭建要求 | 一台服务器以及运行环境 | 静态生成页面，无需服务器。 |
| 性能     | 由于是动态生成页面，可以通过自行配置提高性能，但是仍然无法媲美静态页面 | 几乎无需考虑性能问题  |
| 访问速度 | 依赖于服务器配置以及cdn加速。 | 只需考虑cdn加速   |
| 功能完善 | 作为强大的cms功能很完善，需要的功能基本可以插件下载直接实现。   | 额外功能也可以通过插件实现，不过稍微需要自行查找以及diy |
| 后台管理         |现成的后台管理功能，开箱即用           |由于静态博客，本身没有后台管理，有需求需要自行搜索实现       |

通过比较以及个人轻度使用经历，WordPress对于我来说，意味着每年要花费一点小钱维护服务器，同时还需要稍微注意一下服务器以及网站安全，当服务器过期不想付费时还需要备份以及导出，这对于我只想单纯写点博客实在太过繁琐，所以暂时放弃。

静态博客Hexo我也轻度用过，主题很多，功能也比较齐全，只是相比Hugo，由于构建博客依赖NodeJs，所以本地构建需要环境基础，速度也没有那么快，迁移稍微麻烦些。（如果使用代码托管平台自动构建，则两者基本没差别）。

说到本篇博客主角：Hugo。基于Go语言编写，优点在于本地构建速度超快，同时无需准备任何前提环境，只需要简单配置即可。它可以很简洁，也可以根据个人需求以及diy能力变得功能强大。虽然比Hexo发家晚，但是star数和fork数远远超过前者。所以从本篇博客开始，我打算一边慢慢升级个人博客，同时陆陆续续写博客搭建升级系列。
## 本地博客搭建
 1. 直接从[https://github.com/gohugoio/hugo/releases](https://github.com/gohugoio/hugo/releases)下载windows二进制压缩包。解压，将`.exe`运行文件放入`bin`目录下，然后将`bin`目录添加到环境变量(此举是为了全局方便使用Hugo命令) 。
 2. 为了后续添加主题以及推送到线上平台，还需要额外下载安装git工具（自行傻瓜式安装即可）。
 3. 用命令创建新博客项目 `hugo new site 'your BlogSite name（此处我自定义命名为'HugoBlog''` 。创建完成后进入新生成的文件夹，可以看到相关文件结构。
 4. `content`目录下存放文章，`themes`存放主题，`config.toml`用于配置整个博客站点。
 5. 选择一个博客主题作为基础样式，可以去Hugo官网或者各大帖子推荐上找到自己初步看顺眼的主题，然后添加。
	```
	cd HugoBlog
	git init 
	git submodule add https://github.com/luizdepra/hugo-coder.git themes/hugo-coder
	```
6.  简单配置一下`config.toml`,暂时不追求完美，之后可以陆续按需求陆续更新。[https://github.com/allworldg/hugo/blob/master/config.toml](https://github.com/allworldg/hugo/blob/master/config.toml)
	```toml
	theme = "hugo-coder"
	languageCode = "zh-cn"
	defaultContentLanguage = "zh-cn"
	paginate = 20
	pygmentsStyle = "bw"
	pygmentsCodeFences = true
	pygmentsCodeFencesGuessSyntax = true
	enableEmoji = true
	```
7. 创建一篇文章 `Hugo new Blog/FistBlog.md` ，此时在`/content/Blog`目录下会生成新的文章，然后就可以随意书写了。需要注意的是，如果想在指定导航下看到文章目录，则需要在`content`内创建一个文件夹，比如`Blog`。如果是想直接看到内容，则直接在`content`目录下创建文章即可。例如：点击“关于”直接展示内容。
   
8. 写好后将文章`draft`状态改为`false`，然后`HugoBLog`根目录下命令行运行`Hugo server`就可以本地浏览博客网站。
## 使用博客托管平台+自动部署发布
本地写好博客后还需要将整个博客站点放到一个合适的代码托管平台，这样我就可以在网络上用域名访问我的博客平台。静态博客在网络上发布的传统方式一般是这样的：**写好文章-> 本地生成静态页面 -> 将网站所需要的文件单独上传 -> 发布成功 ->(可选)上传完整站点数据备份。**

这么繁琐的步骤实在打击积极性，好在github可以自动部署，我们可以简化为:**本地上传仓库a -> github action自动部署 -> 推送到仓库b，网站展示。**

1. 远程创建代码仓库
	创建一个github账号，创建两个仓库a和b，a存放整个博客文件夹的文件，b用来存放静态博客页面数据。需要注意，创建时b仓库命名必须是`"用户名.github.io"`，这样我们才能通过`"用户名.github.io"`来访问博客。
2. 将所有网站数据推送代码仓库a，在`HugoBlog`根目录运行命令

	```bash
	git init . #新建一个本地仓库
	git remote add origin https://github.com/allworldg/hugo.git #将本地仓库和代码仓库a建立关系
	git add .
	git commit -m "init"
	git push origin master #发送本地数据到代码仓库a
	```
	查看自己的远程库，推送成功。
	
3. 代码仓库a只用作完整数据备份，现在我需要利用github actions，也就是通过创建脚本自动将a仓库部分文件更新到仓库b。
	1. 首先点击`actions`，创建自定义workflow
	   
	2. github上已经有很多现成的actions，所以我们可以直接拿来用。这里推荐使用的是`peaceiris/actions-gh-pages` 。在配置文件自定义workflow配置文件中只需要根据自己情况修改`jobs:steps:uses`和`external_repository:(代码仓库b的地址)`即可。
	
		```toml
		name: GitHub Pages
		on:
		  push:
		    branches:
		      - master
		
		jobs:
		  deploy:
		    runs-on: ubuntu-20.04
		    steps:
		      - name: Checkout repositories
		        uses: actions/checkout@v2
		        with:
		          submodules: true  # Fetch Hugo themes (true OR recursive)
		          fetch-depth: 0    # Fetch all history for .GitInfo and .Lastmod
		
		      - name: Setup Hugo
		        uses: allworldg/actions-hugo@v2
		        with:
		          hugo-version: 'latest'
		
		      - name: Build
		        run: hugo
		
		      - name: Deploy
		        uses: allworldg/actions-gh-pages@v3
		        with:
		          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
		          external_repository: allworldg/allworldg.github.io
		          publish_branch: master
		          publish_dir: ./public
		  ```
	  3. 注意到配置文件中有一个`deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}`，我们需要创建公私钥分别放在两个仓库中才能实现action推送。
	     
	     输入命令`ssh-keygen -f actions-deploy-key`，然后进入**C:\Users\username\.ssh**,将**actions-deploy-key私钥(非publisher类型)** 文件内容放入a仓库的 settings->Deploy keys , 同理将 公钥(同名称,pulisher类型文件) 内容放入b仓库相同位置。
  4. 创建完成后，每次推送代码仓库a，代码仓库b就能同步更新，然后输入自己博客平台域名即可!![](https://img.allworldg.xyz/2022/05/4a6a87f1bdc187e99d53dab79f667810.png)
## 后续
简单好搭建博客后，对于博客其他优化以及功能问题，例如：图床挑选，cdn加速，seo优化，评论功能，广告系统等等在之后慢慢实现，同时我也会同步更新相关文章。当然，最重要地还是勤写博客，做好总结。[allworldg：菜鸟小白的个人空间](https://allworldg.xyz/)
