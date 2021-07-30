// myLoaders/lhz-style-loader.js
// 作用：动态创建style标签，内容是上一个loader返回的信息，dom操作塞入文档头部

module.exports = function(source) {
  return `
    const tag = document.createElement("style");
    tag.innerHTML = ${source};
    document.head.appendChild(tag);
  `;
}