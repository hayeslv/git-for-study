## 什么是Monaco Editor？

微软之前有个项目叫做Monaco Workbench，后来这个项目变成了VSCode，而Monaco Editor（下文简称monaco）就是从这个项目中成长出来的一个web编辑器，他们很大一部分的代码（monaco-editor-core）都是共用的，所以monaco和VSCode在编辑代码，交互以及UI上几乎是一摸一样的，有点不同的是，两者的平台不一样，monaco基于浏览器，而VSCode基于electron，所以功能上VSCode更加健全，并且性能比较强大。



## 开始使用

本文是采用vue为基础开发web代码编辑器，所以以下都是基于vue来说明。



## 基本功能

安装monaco

```bash
npm i monaco-editor -S
npm i monaco-editor-webpack-plugin -S
```







































