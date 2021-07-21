### 初始化eggjs

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



### 添加swagger-doc

【添加Controller方法】

```js
// app/controller/user.js
'use strict';
/**
 * @Controller 用户管理
 */

const Controller = require('egg').Controller;

class UserController extends Controller {
  constructor(ctx) {
    super(ctx)
  }
  /**
   * @summary 创建⽤户
   * @description 创建⽤户，记录⽤户账户/密码/类型
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

































