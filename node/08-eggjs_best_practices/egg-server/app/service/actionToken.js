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