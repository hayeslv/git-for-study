// 加载器作用：读一下模型列表，看里面有多少模型文件，把这些模型文件自动加载
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 通用加载器
function load(dir, cb) {
  const url = path.resolve(__dirname, dir);
  const files = fs.readdirSync(url);
  files.forEach(filename => {
    // 去掉扩展名
    filename = filename.replace('.js', '');
    // 加载模块
    const file = require(url + '/' + filename);
    cb(filename, file);
  })
}

const loadModel = config => app => {
  mongoose.connect(config.db.url, config.db.options);
  const conn = mongoose.connection;
  conn.on('error', () => console.error('连接失败'));
  // 存储所有的连接实例
  app.$model = {}
  load('../model', (filename, { schema }) => {
    // 生成模型实例
    console.log('load model:' + filename, schema);
    app.$model[filename] = mongoose.model(filename, schema);
  })
}

module.exports = {
  loadModel
}

