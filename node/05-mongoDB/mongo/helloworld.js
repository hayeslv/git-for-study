(async () => {
  const { MongoClient } = require('mongodb');

  // 创建客户端
  const client = new MongoClient(
    'mongodb://192.168.2.130:27017', 
    { useNewUrlParser: true } // 是否在url中去识别你所用的DB
  );

  let ret = await client.connect();
  const db = client.db('test');
  // 集合（表）
  const fruits = db.collection('fruits');

  // 添加数据
  ret = await fruits.insertOne({
    name: '芒果',
    price: 20.1
  })
  console.log('insert:', ret);
})()