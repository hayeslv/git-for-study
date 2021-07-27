// webpack是基于bodeJS的，核心模块API，可以放心使用
// 命令行执行 npx webpack

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // spa（单入口） mpa（多入口）
  // entry: "./src/index.js",
  entry: {
    index: "./src/index.js",
    login: "./src/login.js",
    list: "./src/list.js"
  },
  output: {
    // path要求是绝对路径
    path: path.resolve(__dirname, './dist'),
    filename: "[name].js" // 占位符：这里的名称和entry的key名称一致
  },
  mode: "development", // development production none
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
}