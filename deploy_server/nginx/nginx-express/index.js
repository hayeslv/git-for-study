const express = require('express');
const app_1 = express();
const app_2 = express();
const app_3 = express();
  
// 定义要监听的端口号
const listenedPort_1 = '8087';
const listenedPort_2 = '8088';
const listenedPort_3 = '8089';
  
app_1.get('/', (req, res) => res.send(`Hello World! I am port ${listenedPort_1}～`));
app_2.get('/', (req, res) => res.send(`Hello World! I am port ${listenedPort_2}～`));
app_3.get('/', (req, res) => res.send(`Hello World! I am port ${listenedPort_3}～`));
  
// 监听端口
app_1.listen(listenedPort_1, () => console.log(`success: ${listenedPort_1}`));
app_2.listen(listenedPort_2, () => console.log(`success: ${listenedPort_2}`));
app_3.listen(listenedPort_3, () => console.log(`success: ${listenedPort_3}`));