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