// myLoaders/lhz-css-loader.js
// 作用：将css语法序列化

module.exports = function(source) {
  return JSON.stringify(source);
}