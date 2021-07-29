### 一、初始化eggjs

```bash
# 创建项⽬
npm i egg-init -g
egg-init egg-server --type=simple
cd egg-server
npm i

# 启动项⽬
npm run dev
open localhost:7001
```



#### 想做的内容：

- 根据jsdoc自动注册路由

- API 文档 swagger

- 自动化 --- 文档自动化



### 二、添加swagger-doc

【添加Controller方法】

```js
// app/controller/user.js
'use strict';
const { Controller } = require('egg');

/**
 * @Controller 用户管理
 */
class UserController extends Controller {
  constructor(ctx) {
    super(ctx)
  }
  /**
   * @summary 创建⽤户
   * @description 创建⽤户 记录⽤户账户/密码/类型
   * @router post /api/user
   * @request body createUserRequest *body
   * @response 200 baseResponse 创建成功
   */
  async create() {
    const { ctx } = this;
    ctx.body = 'user ctrl';
  }
}

module.exports = UserController;
```

【创建contract】

```js
// app/contract/index.js
module.exports = {
  baseRequest: {
    id: { type: 'string', description: 'id 唯⼀键', required: true, example: '1' },
  },
  baseResponse: {
    code: { type: 'integer', required: true, example: 0 },
    data: { type: 'string', example: '请求成功' },
    errorMessage: { type: 'string', example: '请求成功' },
  },
};
```

```js
// app/contract/user.js
module.exports = {
  createUserRequest: {
    mobile: { type: 'string', required: true, description: '⼿机号', example: '18801731528', format: /^1[34578]\d{9}$/ },
    password: { type: 'string', required: true, description: '密码', example: '111111' },
    realName: { type: 'string', required: true, description: '姓名', example:'Tom' },
  }
}
```



【添加SwaggerDoc功能】

> Swagger 是⼀个规范和完整的框架，⽤于⽣成、描述、调⽤和可视化 RESTful ⻛格的 Web 服务。

```bash
npm install egg-swagger-doc-feat -S
```

```js
// config/plugin
swaggerdoc : {
  enable: true,
  package: 'egg-swagger-doc-feat',
}
```

```js
// config/config.default.js
config.swaggerdoc = {
  dirScanner: './app/controller', // 扫描的文件夹
  apiInfo: { // 生成标题
    title: 'dylan接口',
    description: 'dylan接口 swagger-ui for egg',
    version: '1.0.0',
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  enableSecurity: false,
  // enableValidate: true,
  routerMap: true, // 自动产生路由映射
  enable: true,
}
```

启动：npm run dev

可以看到如下输出：

```bash
2021-07-28 15:38:45,560 INFO 85876 [egg-swagger-doc] register router: get /swagger-doc
2021-07-28 15:38:45,583 INFO 85876 [egg-swagger-doc] register router: get /swagger-ui.html
2021-07-28 15:38:45,585 INFO 85876 [egg-swagger-doc] register router: post /api/user for controller-user-create
```

swagger自己注册了：/swagger-doc 和 /swagger-ui.html

另外帮我们注册了：/api/user

此时就可以进行swagger来插件接口文档了：http://127.0.0.1:7001/swagger-ui.html



### 三、添加异常处理中间件

> 未思进，先思退。
>
> 未考虑成功，先考虑失败。

js中，尤其是异步的回调里面，一旦出现问题，你会发现好像什么都没有发生

在KOA设计中，一切皆中间件（洋葱圈 + async await）：因为一旦出现问题，它就会往顶层抛。

**做异常处理洋葱圈**

- 异常统⼀处理
  - 开发环境返回详细异常信息
  - ⽣产环境不返回详细信息

```js
// app/middleware/error_handler.js
'use strict'
module.exports = (option, app) => {
  return async function (ctx, next) {
    try {
      // 因为这个中间件注册在外层，所以这里面是所有的业务逻辑
      await next()
    } catch (err) {
      // 异常处理：所有的异常都在 app 上触发⼀个 error 事件，框架会记录⼀条错误⽇志
      app.emit('error', err, this)
      // ====== 统一异常应答 ======
      const status = err.status || 500
      // ⽣产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && app.config.env === 'prod' ?
        'Internal Server Error' :
        err.message
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        code: status, // 服务端⾃身的处理逻辑错误(包含框架错误500 及 ⾃定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
        error: error
      }
      if (status === 422) { // 422一般用在用户的输入信息有误
        ctx.body.detail = err.errors
      }
      ctx.status = 200
    }
  }
}
```

```js
// config/config.default.js
config.middleware = ['errorHandler']; // 规约：文件名是下划线的，在这里变成小驼峰
```



### 四、helper方法实现统一响应格式

> Helper 函数⽤来提供⼀些实⽤的 utility 函数。
>
> 它的作⽤在于我们可以将⼀些常⽤的动作抽离在 helper.js ⾥⾯成为⼀个独⽴的函数，这样可以⽤ JavaScript 来写复杂的逻辑，避免逻辑分散各处。另外还有⼀个好处是 Helper 这样⼀个简单的函 数，可以让我们更容易编写测试⽤例。

eggjs 框架内置了⼀些常⽤的 Helper 函数。我们也可以编写⾃定义的 Helper 函数。

```js
// app/controller/user.js
async create() {
  const { ctx } = this;
  const res = { abc: 123 };
  ctx.helper.success({ ctx, res });
}
```

```js
// app/extend/helper.js
const moment = require('moment')
 
// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss')

// 处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
  ctx.body = {
    code: 0,
    data: res,
    msg
  }
  ctx.status = 200
}
```



### 五、参数校验，validate检查

```bash
npm i egg-validate -S
```

```js
// config/plugin.js
validate: {
  enable: true,
  package: 'egg-validate'
}
```

```js
// app/controller/user.js
async create() {
  const { ctx } = this;
  // 参数校验
  // ctx.validate({
  //   user: { require: true }
  // })
  // 更好的写法：swagger-feat把所有的contract里面的描述，都绑定在rule这个对象里面了
  ctx.validate(ctx.rule.createUserRequest)
  const res = { abc: 123 };
  ctx.helper.success({ ctx, res });
}
```

在 swagger-ui.html 中试验一下，将请求参数改为：

```json
{
  "mobile": "",
  "password": "111111",
  "realName": "Tom"
}
```

可以看到 Response body 中的响应

```json
{
  "code": 422,
  "error": "Validation Failed",
  "detail": [
    {
      "message": "should not be empty",
      "code": "invalid",
      "field": "mobile"
    }
  ]
}
```

成功了！！！

如果确定每个接口都一定要校验，这里也可以做成一个中间件

```js
ctx.validate(ctx.rule.createUserRequest)
```



### 六、添加Model层：注6、7需要一起用

```bash
npm install egg-mongoose -S
```

```js
// config/plugin.js
mongoose : {
  enable: true,
  package: 'egg-mongoose',
},
```

```js
// config/config.default.js
config.mongoose = {
  url: 'mongodb://192.168.2.133:27017/egg_db',
  options: {
    // useMongoClient: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    bufferMaxEntries: 0,
  },
}
```

注册uesr的model层（用户的密码是不能单纯的放在数据库中的，需要加密）

```js
// app/model/user.js
module.exports = app => {
  const mongoose = app.mongoose
  const UserSchema = new mongoose.Schema({
    mobile: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    realName: { type: String, required: true },
    avatar: { type: String, default: 'https://1.gravatar.com/avatar/a3e54af3cb6e157e496ae430aed4f4a3?s=96&d=mm' },
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
  })
  return mongoose.model('User', UserSchema)
}
```



### 七、添加Service层

```bash
npm install egg-bcrypt -S
```

```js
// config/plugin.js
bcrypt : {
  enable: true,
  package: 'egg-bcrypt'
}
```

```js
// app/service/user.js
'use strict';
const { Service } = require('egg');
class UserService extends Service {
  /**
   * 创建⽤户
   * @param {*} payload
   */
  async create(payload) {
    const { ctx } = this
    // 密码要hash
    payload.password = await this.ctx.genHash(payload.password)
    return ctx.model.User.create(payload)
  }
}
module.exports = UserService
```

修改controller内容

```js
// app/controller/user.js
/**
 * @summary 创建⽤户
 * @description 创建⽤户 记录⽤户账户/密码/类型
 * @router post /api/user
 * @request body createUserRequest *body
 * @response 200 baseResponse 创建成功
 */
async create() {
  const { ctx, service } = this;
  // 参数校验
  ctx.validate(ctx.rule.createUserRequest)
  // 组装参数
  const payload = ctx.request.body || {}
  // 调⽤ Service 进⾏业务处理
  const res = await service.user.create(payload)
  ctx.helper.success({ ctx, res });
}
```

在swagger中点击测试：http://127.0.0.1:7001/swagger-ui.html

在数据库中查看是否插入数据：http://192.168.2.133:27018/



### 八、通过生命周期初始化数据

== 测试阶段创建一套基础数据

== 生成环境 自动准备基础数据

== 如何准备测试数据与清理现场

1.35





































