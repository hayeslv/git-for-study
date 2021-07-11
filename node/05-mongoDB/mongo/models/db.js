// 数据库建立连接的过程
// io 异步方法 后 做一些事情
// 串联两个异步方法

const conf = require('./conf');
const { EventEmitter } = require('events');

const { MongoClient } = require('mongodb');

class Mongodb {
  constructor(conf) {
    // 创建实例
    this.conf = conf;
    this.emmitter = new EventEmitter();

    this.client = new MongoClient(conf.url, {
      useNewUrlParser: true
    })

    // 建立连接
    this.client.connect(err => {
      if(err) throw err;
      console.log('连接成功');
      this.emmitter.emit('connect');
    })
  }
  // 返回对应的集合
  col(colName, dbName = conf.dbName) {
    return this.client.db(dbName).collection(colName);
  }
  // 订阅数据库连接
  once(event, cb) {
    this.emmitter.once(event, cb);
  }
}

module.exports = new Mongodb(conf);


