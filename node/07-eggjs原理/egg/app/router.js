'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 约定优于定义
  // 定义（定义文件 程序） => 约定
  router.get('/', controller.home.index);
  router.get('/user', controller.user.index);
};
