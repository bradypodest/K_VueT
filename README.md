# K_VueT

 简体中文 | [English](./README-zh.md)

> 一个简单使用Element UI & axios & iconfont & permission control 的vue 后台管理，需要配合后端项目K.CoreT使用
> 本项目是基于 vue-admin-template 项目进行二次开发

## 功能介绍
|                    功能                 |       描述                                             |     完成情况 |
| :-------------------------------------: | :----------------------------------------------------: | :----------: |
|                  基础界面               |     克隆于vue-admin-template,界面样式一致                |    OK        |
|                  jwt登录                |     采用K.VueT项目jwt登录接口获取token                   |     OK       |
|            动态路由（支持三级路由）       |     可根据项目动态分配项目链接                           |     OK       |
|                页面图标库               |     项目中可使用的图标展示页面                            |     OK       |
|              页面全屏按钮                |    同chrome的F11效果一致,浏览器无边框                    |     OK       |
|          项目国际化（见另一分支项目）     |     可选择项目语言                                       |  OK（主分支无）|
|          项目全局配置                    |    可配置项目的部分颜色,是否有标签栏,是否隐藏项目logo      |   OK          |
|            页面标签页                   |     标签页具有关闭其他页，关闭当前页,刷新页面功能           |   OK          |
|           QQ,微信登录                   |     使用QQ，微信快速登录                                  |   NO         |
|           页面菜单配置                  |      可配置菜单页面                                       |   OK          |
|           项目权限                      |     项目可根据用户具有的权限显示对应页面,使用指定的功能      |  Ongoing      |
|           用户管理（包含用户权限）        |    用户                                                 |   Ongoing     |
|           角色管理 （与权限相关）         |    角色                                                 |   Ongoing     |
|           其它功能（待定）               |                                                         |    NO         |




## Build Setup

```bash
# 克隆项目
git clone git@github.com:bradypodest/K_VueT.git

# 进入项目文件夹
cd K_VueT

# 安装依赖  （建议使用cnpm install  或者 npm install --registry=https://registry.npm.taobao.org）
npm install 

# 运行
npm run dev
```

浏览器访问 http://localhost:8889

## 示例图

![示例图](https://github.com/PanJiaChen/PanJiaChen.github.io/blob/master/images/demo.gif)

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

Copyright (c) 2019-present bradypodest
