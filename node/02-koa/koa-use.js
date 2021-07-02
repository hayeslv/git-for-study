/*
 * @Author: Lvhz
 * @Date: 2021-06-27 10:04:22
 * @Description: Description
 */
const Koa = require('koa');
const app = new Koa();

app.use(async(ctx, next) => {

  await next();

});

app.use((ctx, next) => {
  ctx.body = String(process.pid);
});

app.listen(3000, () => {
  console.log('server at 3000');
});

