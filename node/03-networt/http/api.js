/*
 * @Author: Lvhz
 * @Date: 2021-06-30 10:34:19
 * @Description: Description
 */
const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log('url', method, url);
  console.log('cookie', req.headers.cookie); // 观察cookie
  if (method === 'GET' && url === '/') {
    fs.readFile('./index.html', (err, data) => {
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else if (method === 'GET' && url === '/api/users') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // 设置跨域已经传cookie
    res.setHeader('Set-Cookie', 'cooie1=123'); // 添加cookie
    res.end(JSON.stringify([{ name: 'dylan', age: 18 }]));
  } else if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // 设置跨域已经传cookie
    res.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Headers': 'X-Token,Content-Type',
      'Access-Control-Allow-Methods': 'PUT'
    });
    res.end();
  } else if (method === 'POST' && url === '/api/save') {
    // body流
    const reqData = [];
    req.on('data', data => {
      reqData.push(data);
    });
    req.on('end', () => {
      const data = Buffer.concat(reqData);
      console.log('post data:', data.toString());
      res.end(data.toString());
    });
  }
});

server.listen(4000, () => {
  console.log('api listen at 4000');
});
