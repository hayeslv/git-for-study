根据模型自动生成接口（参考keystonejs）：

定义模型

自动生成CRUD接口

- 反向工程  代码生成器
- 动态编程
  - 根据文件夹自动加载模块
  - 自动产生路由 -- 注册通配路由



- conf.js

```js
module.exports = {
  db: {
    url: 'mongodb://192.168.2.100:27017/test',
    options: {
      useNewUrlParser: true
    }
  }
}
```

- model/user.js

```js
module.exports = {
  schema: {
    mobile: { type: String, required: true },
    realName: { type: String, required: true }
  }
}
```

- framework/api.js

```js
module.exports = {
  async init(ctx, next) {
    const model = ctx.app.$model[ctx.params.list];
    if(model) {
      ctx.list = model;
      await next();
    } else {
      ctx.body = 'no this model'
    }
  },
  async list(ctx) {
    ctx.body = await ctx.list.find({})
  },
  async get(ctx) {
    ctx.body = await ctx.list.findOne({ _id: ctx.params.id })
  },
  async create(ctx) {
    ctx.body = await ctx.list.create(ctx.request.body);
  },
  async update(ctx) {
    ctx.body = await ctx.list.updateOne(
      { _id: ctx.params.id },
      ctx.request.body
    )
  },
  async del(ctx) {
    ctx.body = await ctx.list.deleteOne({ _id: ctx.params.id })
  }
}
```

- framework/loader.js

```js
// 加载器作用：读一下模型列表，看里面有多少模型文件，把这些模型文件自动加载
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 通用加载器
function load(dir, cb) {
  const url = path.resolve(__dirname, dir);
  const files = fs.readdirSync(url);
  files.forEach(filename => {
    // 去掉扩展名
    filename = filename.replace('.js', '');
    // 加载模块
    const file = require(url + '/' + filename);
    cb(filename, file);
  })
}

const loadModel = config => app => {
  mongoose.connect(config.db.url, config.db.options);
  const conn = mongoose.connection;
  conn.on('error', () => console.error('连接失败'));
  // 存储所有的连接实例
  app.$model = {}
  load('../model', (filename, { schema }) => {
    // 生成模型实例
    console.log('load model:' + filename, schema);
    app.$model[filename] = mongoose.model(filename, schema);
  })
}

module.exports = {
  loadModel
}
```

- framework/router.js

```js
const router = require('koa-router')();
const {
  init, get, create, update, del, list
} = require('./api');

//  注册通用路由：/api/user/:id
router.get('/api/:list/:id', init, get);
router.get('/api/:list', init, list);
router.post('/api/:list', init, create);
router.put('/api/:list/:id', init, update);
router.delete('/api/:list/:id', init, del);

module.exports = router.routes();
```

- index.js

```js
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
```























