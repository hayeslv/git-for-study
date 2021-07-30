// myLoaders\lhz-loader-async.js
module.exports = function(source) {
  const callback = this.async();
  setTimeout(() => {
    const result = source.replace("loader", this.query.name);
    callback(null, result);
  }, 3000)
}