(async () => {
  const { MongoClient } = require('mongodb');

  // 创建客户端
  const client = new MongoClient(
    'mongodb://192.168.2.100:27017', 
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
  // console.log('insert:', ret);

  // 查询
  ret = await fruits.findOne();
  console.log('find:', ret);

  // 更新
  ret = await fruits.updateOne({ name: '芒果' }, { 
    $set: {
      name: '香蕉'
    }
  })
  console.log('update:', ret);

  // 全部删除
  await fruits.deleteMany();

  // 断开数据库连接
  client.close();
})()