### ts-node

Node环境的typescript解释执行器。REPL（Read eval print loop）

```shell
npm i ts-node -g
```

可以用ts-node执行文件

```shell
ts-node some.ts
```



#### 配置文件：tsconfig.json

```json
{
  "compilerOptions": {
    // 书写你的配置
  }
}
```



#### tsc（typescript compiler）

一个ts的编译器

```shell
npm i tsc -g
```



### 和webpack一起用

重新初始化一个项目：

```shell
mkdir ts-webpack
cd ts-webpack
npm init
```

先安装依赖

```shell
npm i webpack ts-loader typescript webpack-cli -S
```

写一个用于测试的ts文件（src/index.ts）

```ts
export class TreeNode<T> {
  left: TreeNode<T>
  right: TreeNode<T>
  data: T

  constructor(data: T) {
    this.data = data;
  }
}

function log(x) {
  console.log(x);
}

const node = new TreeNode<number>(100)
console.log(node.data);
```

在package.json中添加执行命令

```json
"scripts": {
  "start:dev": "webpack",
},
```

运行起来试一下效果：

```shell
npm run start:dev
```



### TS + React环境配置

#### 安装依赖

- 首先安装react库

```shell
npm i react react-dom -S
```

- 安装react和react-dom这两个库的类型定义

```shell
npm i @types/react @types/react-dom -D
```

- awesome-typescript-loader：缓存等工作做的更好

```shell
npm i awesome-typescript-loader -D
```

- 配置webpack开发环境

```shell
npm i webpack-dev-server html-webpack-plugin -D
```



#### 编译React

src/ReactHello.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom';

const App: (() => JSX.Element) = () => {
  return <div>
    <h1>Hello React!!!!</h1>
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'));
```

template.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

webpack.react.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    index: './src/ReactHello.tsx' // 编译react
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'buidle.[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3020
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template.html')
    })
  ]
}
```

在package.json中添加执行命令

```json
"scripts": {
  "start:react": "webpack serve --config webpack.react.js",
},
```

最后执行 npm run start:react  就成功了



#### React + Babel Preset

babel-preset 和 ts-loader的区别

- babel-loader：背后是babel
  - babel是干什么的？ --- The Compiler for next generation Javascript
    - 所有编译JS的事情，babel都干！
    - es6->es5->es3->polifill
  
  - 缓存+优化
  - 插件+生态

- ts-loader：背后是tsc
  - ts -> es



**补充babel的依赖**

```shell
npm i babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript -D
```

babel的preset是plugin的一个集合



**新增 webpack.react.withbabel.js文件**

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    // index: './src/index.ts' // webpack纯ts编译
    index: './src/ReactHello.tsx' // 编译react
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: { // !修改处
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-react',
              '@babel/preset-env'
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'buidle.[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3020
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template.html')
    })
  ]
}
```

最后在package.json中添加脚本命令

```shell
"start:react-babel": "webpack serve --config webpack.react.withbabel.js",
```



### TS + Vue环境配置

#### Step 1 : 添加vue需要的依赖

```shell
# Vue的依赖（vue3.0）
npm i vue@next -S
npm i @vue/compiler-sfc -D
# Vue的loader
npm i vue-loader -D
```

#### Step 2 : 写一个Vue的SFC和一个bootstraper

sfc - Single File Component（单文件组件）

新建单文件组件：src/Hellow.vue

```vue
<template>
  <h1>Hello Vue!</h1>
</template>
<script lang='ts'>

export default {
  setup() {
    return {
    }
  }
}
</script>
```

入口文件：src/main.ts

```ts
import {createApp} from 'vue';
import Hello from './Hello.vue';
createApp(Hello).mount('#root');
```

这时会发现 .vue 文件报错，因为对于vue而言，还需要一个 src/shims-vue.d.ts 文件，shim（垫片）

```ts
// 当vscode和webpack遇到.vue的文件，这个shims文件会帮助它理解成vue的组件
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

shim（垫片），通常为了处理兼容而命名。上面这个shim的目标是让vscode和webpack等知道.vue的文件，可以当做一个组件定义文件来使用。



#### Step 3: 写一个vue的webpack.config

webpack.vue.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
module.exports = {
  entry: {
    index: './src/main.ts' // 编译vue
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/] // 给.vue的文件都追加上.ts的后缀
        },
        exclude: /node_modules/
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'buidle.[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3020
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template.html')
    }),
    new VueLoaderPlugin()
  ]
}
```



#### Step 4 : 增加npm脚本

```json
 "start:vue": "webpack serve --config ./webpack.vue.js"
```



#### Step 5: 试一试

> 注意tsconfig中的jsx需要设置为preserve，也就是保留由ts-loader处理。
>

```shell
npm run start:vue
```



### Vue + Babel Preset

#### Step 1 : 安装依赖（跳过此步骤）

```shell
npm i -D babel-preset-typescript-vue3
```

> 我这边安装依赖后其他命令都不能执行了，不知道为什么，可能是对引用出了问题

#### Step 2: 写一个webpack.config文件

webpack.vue.withbabel.js

```js
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: "./src/main.ts" ,
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
				use : {
					loader : 'babel-loader',
					options : {
						presets : [
							"@babel/preset-env",
							"babel-preset-typescript-vue3",
							"@babel/preset-typescript",
						]
					}
				},
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
    ],
  },
  resolve: {
    extensions: [".vue", ".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 3020,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "template.html"),
    }),
    new VueLoaderPlugin()
  ],
}
```

#### Step 3 ： 配置npm脚本

```shell
"start:vue-babel": "webpack serve --config ./webpack.vue.withbabel.js"
```

#### Step 4: 执行观察结果

```shell
npm run start:vue-babel
```













































