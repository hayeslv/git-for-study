/*
 * @Author: Lvhz
 * @Date: 2021-06-30 08:28:00
 * @Description: Description
 */
const net = require('net');
const chatServer = net.createServer();
const clientList = [];

chatServer.on('connection', client => {
  // 流
  client.write('Hi\n');
  clientList.push(client);
  client.on('data', data => {
    // 二进制通讯 Buffer
    console.log('receive', data.toString());
    // 广播
    clientList.forEach(v => {
      v.write(data);
    });
  });
});

// 可以监听95535之间的任何一个端口
chatServer.listen(9000);


// 通过telnet连接服务器
// telnet localhost 9000




