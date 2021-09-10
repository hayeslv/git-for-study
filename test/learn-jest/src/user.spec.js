/*
 * @Author: Lvhz
 * @Date: 2021-09-10 16:51:02
 * @Description: Description
 */

const User = require('./User')
test('setName', () => {
  const user = new User('xiaohong')
  user.setName('xiaohei')
  expect(user.name).toBe('xiaohei')
})