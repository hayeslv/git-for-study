const http = require('http');

const session = {

}

http.createServer((req, res) => {
  console.log('cookie:', req.headers.cookie);

  const sessionKey = 'sid';
  const cookie = req.headers.cookie;
  // 判断sid是否存在
  if(cookie && cookie.includes(sessionKey)) {
    // 旧用户
    res.end('ComeBack');
    // abc=123;sid=222222;der=2212112
    // 取出sid
    const pattern = new RegExp(`${sessionKey}=([^;]+);?\s*`);
    const sid = pattern.exec(cookie)[1];
    console.log('user session:', session[sid]);
  } else {
    // 新用户
    const sid = (Math.random() * 9999999).toFixed();
    res.setHeader('Set-Cookie', `${sessionKey}=${sid};`);
    session[sid] = { name: 'laowang' };
    res.end('Hello')
  }

  // 存编号：id

  // res.setHeader('Set-Cookie', 'abc=123')
  // res.end('hello cookie');
})
.listen(3000, () => {
  console.log('server at 3000');
})