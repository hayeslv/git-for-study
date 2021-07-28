// 1、函数，不可以是箭头函数：因为在函数内部要使用到this
// 2、loader必须有返回值
// 3、如何设置options
// myLoaders\lhz-loader.js
module.exports = function(source) {
  const result = source.replace("hello", '雷猴啊~');
  return result;
}