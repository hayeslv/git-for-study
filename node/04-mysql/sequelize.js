/*
 * @Author: Lvhz
 * @Date: 2021-07-09 16:32:15
 * @Description: Description
 */
(
  async () => {
    const Sequelize = require('sequelize');
    
    // 建立连接（数据库名称，用户名，密码）
    const sequelize = new Sequelize('node-test', 'root', '123', {
      host: 'localhost', // 地址
      dialect: 'mysql',
      operatorsAliases: false // 仍可通过传入 operators map 至 operatorsAliases 的方式来用字符串运算符，但会返回弃用警告
    });

    // 定义模型
    const Fruit = sequelize.define('Fruit', {
      name: { type: Sequelize.STRING(20), allowNull: false },
      price: { type: Sequelize.FLOAT, allowNull: false },
      stock: { type: Sequelize.INTEGER, defaultValue: 0 }
    })

    // 同步数据库（把表同步到数据库中），force：true 则会删除已存在表
    let ret = await Fruit.sync();
    console.log('sync:', ret);

    // 新增表数据
    ret = await Fruit.create({
      name: '香蕉',
      price: 3.5
    })
    console.log('create:', ret);
    
    // 更新表数据
    await Fruit.update(
      { price: 4 },
      { where: { name: '香蕉' } }
    )
    console.log('findAll', JSON.stringify(ret));

    // 查询
    const Op = Sequelize.Op;
    ret = await Fruit.findAll({
      where: {
        price: {
          [Op.lt]: 5,
          [Op.gt]: 2
        }
      }
    });
    console.log('find', JSON.stringify(ret, '', '\t'));
  }
)()