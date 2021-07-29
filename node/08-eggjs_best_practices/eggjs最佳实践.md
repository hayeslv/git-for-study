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

**创建基础数据**

推荐用mongoose或者service方法，不要用sql

**清理现场**

每次启动的时候还原测试数据

```js
// /app.js
// 如果实现了app.js，egg会在这里提供一些钩子，此时可以把初始化数据的操作放在相应的钩子里
class AppBootHook {
  constructor(app) {
    this.app = app;
    app.root_path = __dirname;
  }
  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }
  configDidLoad() {
    // Config, plugin files have been loaded.
  }
  async didLoad() {
    // All files have loaded, start plugin here.
  }
  async willReady() {
    // All plugins have started, can do some thing before app ready
  }
  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
    console.log('========Init Data=========')
    const ctx = await this.app.createAnonymousContext();
    // 如果多个表，可以在这里全部干掉
    await ctx.model.User.remove();
    // 在这里进行测试数据初始化
    await ctx.service.user.create({
      mobile: '13611388415',
      password: '111111',
      realName: '海爷',
    })
  }
  async serverDidReady() {}
  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = AppBootHook;
```

此时启动 `npm run dev` 后，去mongodb里面查看，即可看到users这张表的数据被初始化我们想要的了



### 九、用户鉴权模块

注册jwt模块

```bash
npm i egg-jwt -S
```

```js
// config/plugin.js
jwt: {
 enable: true,
 package: 'egg-jwt',
}
```

```js
// config/config.default.js
config.jwt = {
  secret: 'Great4-M',
  enable: true, // default is false
  match: /^\/api/, // optional
}
```

所有 /api 的接口都需要鉴权，登录登出等不用鉴权的接口：  /auth/login     /auth/logout

```js
// app/service/actionToken.js
'use strict'
const { Service } = require('egg')
class ActionTokenService extends Service {
  async apply(_id) {
    const { ctx } = this
    return ctx.app.jwt.sign({
      data: { _id: _id },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
    }, ctx.app.config.jwt.secret)
  }
}
module.exports = ActionTokenService
```

```js
// app/service/userAccess.js
'use strict'
const { Service } = require('egg')
class UserAccessService extends Service {
  async login(payload) {
    const { ctx, service } = this
    const user = await service.user.findByMobile(payload.mobile)
    if (!user) {
      ctx.throw(404, 'user not found') // 这里是因为外层之前做了接收错误处理
    }
    let verifyPsw = await ctx.compare(payload.password, user.password)
    if (!verifyPsw) {
      ctx.throw(404, 'user password is error')
    }
    // ⽣成Token令牌
    return {
      token: await service.actionToken.apply(user._id)
    }
  }
  // 其实不存在logout功能，token直接在客户端丢弃就可以了。这里预留一个登出功能
  async logout() {}
  // 拿出当前登录用户的登录信息
  async current() {
    const { ctx, service } = this
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id
    const user = await service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }
    // 密码不返回
    user.password = ''
    return user
  }
}
module.exports = UserAccessService
```



Contract层

```js
// app/contract/userAccess.js
module.exports = {
  loginRequest: {
    mobile: { 
      type: 'string', 
      required: true, 
      description: '⼿机号', 
      example: '18801731528', 
      format: /^1[34578]\d{9}$/, 
    },
    password: { 
      type: 'string', 
      required: true, 
      description: '密码', 
      example: '111111', 
    },
  },
}
```



Controller层：把内容暴露出去

```js
// app/controller/userAccess.js
'use strict'
const { Controller } = require('egg')
/**
 * @Controller ⽤户鉴权
 */
class UserAccessController extends Controller {
  constructor(ctx) {
    super(ctx)
  }
  /**
   * @summary ⽤户登⼊
   * @description ⽤户登⼊
   * @router post /auth/jwt/login
   * @request body loginRequest *body
   * @response 200 baseResponse 创建成功
   */
  async login() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(ctx.rule.loginRequest);
    // 组装参数
    const payload = ctx.request.body || {}
    // 调⽤ Service 进⾏业务处理
    const res = await service.userAccess.login(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }
  /**
   * @summary ⽤户登出
   * @description ⽤户登出
   * @router post /auth/jwt/logout
   * @request body loginRequest *body
   * @response 200 baseResponse 创建成功
   */
  async logout() {
    const { ctx, service } = this
    // 调⽤ Service 进⾏业务处理
    await service.userAccess.logout()
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx })
  }
}
module.exports = UserAccessController
```

- 在swagger中点击测试：http://127.0.0.1:7001/swagger-ui.html
  - 可以看到用户鉴权中有登入登出接口了

- 访问自己写的页面：http://127.0.0.1:7001/public/index.html
  - 可以点击登入、用户列表，来测试



### 十、文件上传

```bash
npm i await-stream-ready stream-wormhole image-downloader -S
```

```js
// app/controller/upload.js
const fs = require('fs')
const path = require('path')
const { Controller } = require('egg')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
/**
 * @Controller 上传
 */
class UploadController extends Controller {
  constructor(ctx) {
    super(ctx)
  }
  /**
   * @summary 上传单个⽂件
   * @description 上传单个⽂件
   * @router post /api/upload/single
   */
  async create() {
    const { ctx } = this
    // 要通过 ctx.getFileStream 便捷的获取到⽤户上传的⽂件，需要满⾜两个条件：
    // 只⽀持上传⼀个⽂件。
    // 上传⽂件必须在所有其他的 fields 后⾯，否则在拿到⽂件流时可能还获取不到fields。
    const stream = await ctx.getFileStream()
    // 所有表单字段都能通过 `stream.fields` 获取到
    const filename = path.basename(stream.filename) // ⽂件名称
    const extname = path.extname(stream.filename).toLowerCase() // ⽂件扩展名称
    const uuid = (Math.random() * 999999).toFixed()
    // 组装参数 stream
    const target = path.join(this.config.baseDir, 'app/public/uploads', `${uuid}${extname}`)
    const writeStream = fs.createWriteStream(target)
    // ⽂件处理，上传到云存储等等
    try {
      await awaitWriteStream(stream.pipe(writeStream))
    } catch (err) {
      // 必须将上传的⽂件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream) // 其实就是一直on data，内部不做任何处理，让它存，存个寂寞
      throw err
    }
    // 调⽤ Service 进⾏业务处理
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx })
  }
}
module.exports = UploadController
```

查看：http://127.0.0.1:7001/public/upload.html























