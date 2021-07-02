/*
 * @Author: Lvhz
 * @Date: 2021-06-30 11:19:38
 * @Description: Description
 */
const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(express.static(__dirname + '/'));
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:4000'
}));

app.listen(3000, () => {
  console.log('proxy listen at 3000');
});
