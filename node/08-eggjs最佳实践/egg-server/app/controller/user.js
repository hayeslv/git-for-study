'use strict';
/**
 * @Controller 用户管理
 */

const Controller = require('egg').Controller;

class UserController extends Controller {
  /**
   * @summary 创建用户
   * @description 创建用户 记录用户帐户/密码/类型
   * @router post /api/user
   */
  async create() {
    const { ctx } = this;
    ctx.body = 'user ctrl';
  }
}

module.exports = UserController;
