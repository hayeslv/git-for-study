// myLoaders/lhz-less-loader.js
// 作用：less 转成 css

// 这里也是为什么安装less-loader的时候需要安装less的原因
const less = require('less');

module.exports = function(source) {
  less.render(source, (error, output) => {
    const cssInfo = output.css;
    this.callback(error, cssInfo);
  })
}