/*
 * @Author: Lvhz
 * @Date: 2021-06-23 15:08:31
 * @Description: Description
 */

const http = require('http');
const fs = require('fs');
const server = http.createServer((request, response) => {
  const { url, method, headers } = request;
  if (url === '/' && method === 'GET') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' });
        response.end('500 服务器错误');
      }
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      response.end(data);
    });
  } else if (url === '/user' && method === 'GET') { // 原生接口
    response.writeHead(200, { 'Content-type': 'application/json' });
    response.end(JSON.stringify({ 'name': 'dylan' }));
  } else if (method === 'GET' && headers.accept.includes('image/*')) {
    // 统一描述所有的图片请求
    fs.createReadStream('.' + url).pipe(response);
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain;charset=utf-8');
    response.end('404 页面没找到！');
  }
});

server.listen('3000', () => {
  console.log('server at 3000');
});

