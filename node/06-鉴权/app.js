const Koa = require('koa');
const app = new Koa();
const session = require('koa-session');
const redisStore = require('koa-redis');
const redis = require('redis');
const redisClient = redis.createClient(6379, '192.168.2.100');
const wrapper = require('co-redis'); // redis的npm比较老，是回调的方式，使用co-redis对其进行调整，包装成promise风格
const client = wrapper(redisClient)

app.keys = ['some secret'];

const SESS_CONFIG = {
  key: 'kkb:sess', // sid
  store: redisStore({ client }),
  signed: true, // 签名（提高session的安全性）：默认true
}

// session中间件
app.use(session(SESS_CONFIG, app));

// 中间件：每次把redis的值打印出来
app.use(async (ctx, next) => {
  const keys = await client.keys('*');
  keys.forEach(async key => {
    console.log(key,await client.get(key));
  })
  await next();
})

app.use(ctx => {
  if(ctx.path === '/favicon.ico') return;

  // 计数器：走完上面的session中间件后，ctx中会保存一个session对象
  let n = ctx.session.count || 0;

  ctx.session.count = ++n;
  ctx.body = `第${n}次访问`
})

app.listen(3000, () => {
  console.log('lis 3000');
})
