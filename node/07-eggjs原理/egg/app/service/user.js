'use strict';
// 公共服务方法（会被自动加载到上下文中）
const { Service } = require('egg');

class UserService extends Service {
  async getAll() {
    return {
      name: 'service',
    };
  }
}

module.exports = UserService;
