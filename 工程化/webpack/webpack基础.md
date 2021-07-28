## 一、webpack-01工程

### 1、webpack安装

- 局部安装（推荐）

- 全局安装（不推荐）
  - npm install webpack webpack-cli -g 4.x
  - 版本号固定，升级需要手动
  - 开发的时候，手上有多个活，依赖webpack的版本都不一样，就不方便



```bash
npm init
npm i webpack@4.43.0 webpack-cli@3.3.12 -D
```



打包命令：

```bash
npx webpack
```





### 2、webpack配置

```js
// webpack是基于bodeJS的，核心模块API，可以放心使用
// 命令行执行 npx webpack
const path = require('path');
module.exports = {
  entry: "./src/index.js",
  output: {
    // path要求是绝对路径
    path: path.resolve(__dirname, './dist'),
    filename: "main.js"
  },
  mode: "development", // development production none
}
```



#### 如果不使用webpack的默认文件

- 在同级目录下新增  webpack.dev.config.js
- 在package.json文件的script内加入：`"build:dev": "webpack --config ./webpack.dev.config.js"`
- --config 没有配置的情况下，默认走的是 webpack.config.js 配置文件



### 3、单入口、多入口

entry可以是单入口（spa）或多入口（mpa）的

单入口：

```js
// 字符串形式
entry: "./src/index.js",
// 对象形式
entry: {
  main: "./src/index.js"
},
```

多入口：

```js
entry: {
  main: "./src/index.js"
},
output: {
  path: path.resolve(__dirname, './dist'),
  filename: "[name].js" // 占位符：这里的名称和entry的key名称一致
},
```

多入口对应多出口（一点要使用占位符的方式）

```js
entry: {
  main: "./src/index.js",
  login: "./src/login.js",
  list: "./src/list.js"
},
output: {
  // path要求是绝对路径
  path: path.resolve(__dirname, './dist'),
  filename: "[name].js" // 占位符：这里的名称和entry的key名称一致
},
```



### 4、chunk：代码片段

Index：

./src/index.js

​	---other.js（依赖）



执行打包任务：index.js 收集依赖信息（路径）+ 内容处理成一个 chunk

​	other.js 与上面一样



然后chunk依赖信息汇总成一个对象：依赖图谱（模块路径 + 模块对应的代码片段）



bundle  chunk  chunks  module

bundle 构建后产生的资源文件叫 bundle文件

bundle对应一个chunks

一个chunks对应至少一个module

一个module对应至少一个chunk



### 5、插件

#### HtmlWebpackPlugin

> 作用：自动生成html文件，引入bundle文件，压缩html

```bash
npm i html-webpack-plugin -D
```

这个插件默认是@5x，这里使用4x，执行下面的代码

```
npm i html-webpack-plugin@4 -D
```

```js
// webpack.dev.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin()
]
```

打包：

```bash
npm run build:dev
```

查看html文件，发现它把所有的出口js文件都引入了，没有做到精准匹配。



**设置html模板**

```html
// public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

修改 webpack.dev.config.js 的配置

```js
plugins: [
  new HtmlWebpackPlugin({
    template: "./public/index.html", // 模板匹配
    filename: "index.html",
    chunks: ["index", "login"] // 可以引入多个资源文件
  }),
  new HtmlWebpackPlugin({
    template: "./public/index.html", // 模板匹配
    filename: "login.html",
    chunks: ["login"]
  }),
  new HtmlWebpackPlugin({
    template: "./public/index.html", // 模板匹配
    filename: "list.html",
    chunks: ["list"]
  })
]
```



## 二、webpack-02工程

### 1、css支持

> webpack默认只支持 js 和 json 文件

项目中新建文件 src/style/index.css

```css
body{
  background-color: red;
}
```

入口文件引入css模块：src/index.js

```js
import css from './style/index.css'
```

#### css-loader

引入对应的 loader：这里要匹配webpack4x的版本，不配置版本的话css-loader默认给的最新（webpack5x的版本）

```bash
npm i css-loader@5.2.6 -D
```

修改webpack.config.js文件

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: "css-loader"
    }
  ]
},
```

> css-loader就是对我们的代码进行了一次序列化，使其可以顺利的打包到我们的chunk中（但是不会起页面效果，因为它不会告诉浏览器怎么使用）

#### style-loader

```bash
npm i style-loader@2.0.0 -D
```

修改rules

```js
rules: [
  {
    test: /\.css$/,
    // 当多个loader作用于一个模块的时候，执行顺序是自右向左的
    use: ["style-loader", "css-loader"]
  }
]
```

此时再执行打包

```bash
npm run build:dev
```

就可以看到页面变红了

### 2、less支持

> less-loader功能：将less转换成css

```bash
npm i less less-loader@7.3.0 -D
```

新建less文件：src/style/index.less

```less
body{
  div{
    height: 100px;
    background-color: blue;
  }
}
```

src/index.js

```js
import css from './style/index.less'
```

添加rules

```js
rules: [
  {
    test: /\.less$/,
    use: ["style-loader", "css-loader", "less-loader"]
  }
]
```



### 3、postcss：强大的工具集

> postCSS是一个处理css的工具

```bash
npm i postcss postcss-loader@4.2.0 -D
```













