const Koa = require('koa');
const app = new Koa();
const session = require('koa-session');

app.keys = ['some secret'];

const SESS_CONFIG = {
  key: 'kkb:sess', // sid
}

// session中间件
app.use(session(SESS_CONFIG, app));

app.use(ctx => {
  if(ctx.path === '/favicon.ico') return;

  // 计数器：走完上面的session中间件后，ctx中会保存一个session对象
  let n = ctx.session.count || 0;

  ctx.session.count = ++n;
  ctx.body = `第${n}次访问`
})

app.listen(3000)
