/*
 * @Author: Lvhz
 * @Date: 2021-07-08 16:27:34
 * @Description: 通过对象字面量来存储数据
 */
const fs = require('fs');

function set(key, value) {
  fs.readFile('./db.json', (err, data) => {
    const json = data ? JSON.parse(data) : {};
    json[key] = value;
    fs.writeFile('./db.json', JSON.stringify(json), err => {
      if(err) {
        console.log('err:', err);
      }else {
        console.log('写入成功');
      }
    })
  })
}

function get(key) {
  fs.readFile('./db.json', (err, data) => {
    const json = data ? JSON.parse(data) : {};
    console.log(json[key]);
  })
}

// 开发命令行
// set a 1\n
// get a\n
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', input => {
  const [op, key, value] = input.split(' ');
  if(op === 'get') {
    get(key);
  } else if(op === 'set') {
    set(key, value);
  } else if(op === 'quit') {
    rl.close();
  } else {
    console.log('没有操作');
  }
})

rl.on('close', () => {
  console.log('程序结束');
  process.exit(0);
})
