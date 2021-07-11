const Koa = require('koa');
const app = new Koa();
const port = 3000;

// 希望api接口能够自动产生
// 1、需要加载器来加载模型
const config = require('./conf');
const { loadModel } = require('./framework/loader');
loadModel(config)(app);

// app.$model['user']
// 增删改查接口：
//      get list  /api/user
//      get list  /api/user/:id
//      post 添加 /api/user
//      put 更新  /api/user/:id


// 2、根据模型注册路由
const bodyParse = require('koa-bodyparser');
app.use(bodyParse());
const restful = require('./framework/router');
app.use(restful);

app.listen(port, () => {
  console.log(`app listen ${port}`);
})

