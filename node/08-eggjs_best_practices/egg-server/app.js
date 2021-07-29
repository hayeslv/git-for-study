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