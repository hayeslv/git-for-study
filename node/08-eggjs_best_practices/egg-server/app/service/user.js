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
    payload.password = await this.ctx.genHash(payload.password)
    return ctx.model.User.create(payload)
  }
}
module.exports = UserService