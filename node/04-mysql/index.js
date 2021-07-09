/*
 * @Author: Lvhz
 * @Date: 2021-07-08 17:03:38
 * @Description: mysql
 */
(async () => {
  const mysql = require('mysql2/promise');

  const config = {
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'node-test' // 数据库名称
  }
  
  const connection = await mysql.createConnection(config);

  console.log('success!!!!!!!!!!!!!');

  // 创建表
  let ret = await connection.execute(`
    CREATE TABLE IF NOT EXISTS test (
      id INT NOT NULL AUTO_INCREMENT,
      message VARCHAR(45) NULL,
      PRIMARY KEY (id)
    )
  `)

  // 插入数据（占位符）
  ret = await connection.execute(`INSERT INTO test(message) VALUE (?)`, ['abc'])

  // 查询
  const [rows, fields] = await connection.execute(`SELECT * FROM test`);
  console.log('select', rows);
})()