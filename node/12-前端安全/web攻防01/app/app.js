// 引入koa
const koa = require('koa');
const app = new koa();
const session = require('koa-session');

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())
const router = require('koa-router')();
const views = require('koa-views');
const query = require('./db')
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'cookie:sess',
    /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true,
    /** (boolean) automatically commit headers (default true) */
    overwrite: false,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true, //! cookie只读
    /** (boolean) httpOnly or not (default true) */
    signed: false,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false,
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));


app.use(async (ctx, next) => {
    await next()
    // 参数出现在HTML内容或属性浏览器会拦截
    ctx.set('X-XSS-Protection', 0)
    // ctx.set('Content-Security-Policy', "default-src 'self'") //! CSP测试：只允许加载本站资源
    // ctx.set('Content-Security-Policy', "img-src 'https'") //! CSP测试：只允许加载 HTTPS 协议图片
    // ctx.set('X-FRAME-OPTIONS', 'DENY') //! 防点击劫持

    //! 查看网站调用的源
    // const referer = ctx.request.header.referer
    // console.log('Referer:', referer)

})
// const helmet = require('koa-helmet')
// app.use(helmet())


router.get('/', async (ctx) => {
    res = await query('select * from test.text')
    // ctx.set('X-FRAME-OPTIONS', 'DENY')
    await ctx.render('index', {
        from: ctx.query.from, // 从url参数中获取from
        username: ctx.session.username,
        text: res[0].text,
        //! 演示转码：黑名单
        // from: escape(ctx.query.from || ''), // 从url参数中获取from
        // username: escape(ctx.session.username || ''),
        // text: escape(res[0].text || ''),

        // from: html, //! 演示xss库
    });
});

//! 演示XSS：白名单（富文本）
const xss = require('xss');
let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>')
console.log(html);

function escape(str) {
    console.log(str);
    str = str.replace(/&/g, '&amp;')
    str = str.replace(/</g, '&lt;')
    str = str.replace(/>/g, '&gt;')
    str = str.replace(/"/g, '&quto;')
    str = str.replace(/'/g, '&#39;')
    str = str.replace(/`/g, '&#96;')
    str = str.replace(/\//g, '&#x2F;')
    return str
}



router.get('/login', async (ctx) => {
    await ctx.render('login');
});

const encryptPassword = require('./password')
router.post('/login', async (ctx) => {

    const { username, password } = ctx.request.body

    // 可注入写法
    let sql = `
    SELECT *
    FROM test.user
    WHERE username = '${username}'
    AND password = '${password}'
    `
    console.log('sql', sql)
    res = await query(sql)
    console.log('db', res)
    if (res.length !== 0) {
        ctx.redirect('/?from=china')
        ctx.session.username = ctx.request.body.username
    }

    // SQL规约 --- 传参的方式（防止SQL注入）：原因是这段代码对他进行了转化
    // let sql = `
    // SELECT *
    // FROM test.user
    // WHERE username = ?
    // AND password = ?
    // `
    // res = await query(sql, [username, password]);
    // if (res.length !== 0) {
    //     ctx.redirect('/?from=china')
    //     ctx.session.username = ctx.request.body.username
    // }

    // if (res.length !== 0 && res[0].salt === null) {
    //     console.log('no salt ..')
    //     if (password === res[0].password) {
    //         sql = `
    //             update test.user
    //             set salt = ?,
    //             password = ?
    //             where username = ?
    //         `
    //         const salt = Math.random() * 99999 + new Date().getTime()
    //         res = await query(sql, [salt, encryptPassword(salt, password), username])
    //         ctx.session.username = ctx.request.body.username
    //         ctx.redirect('/?from=china')
    //     }
    // } else {
    //     console.log('has salt')
    //     if (encryptPassword(res[0].salt, password) === res[0].password) {
    //         ctx.session.username = ctx.request.body.username
    //         ctx.redirect('/?from=china')
    //     }
    // }
});

router.post('/updateText', async (ctx) => {
    text = ctx.request.body.text
    // console.log(text , escape(text))
    // text = escape(text)
    res = await query(`REPLACE INTO test.text (id,text) VALUES(1,'${text}');`)
    console.log('mysql:', ctx.request.body)
    ctx.redirect('/')
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app