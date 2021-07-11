根据模型自动生成接口：

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































