/*
 * @Author: Lvhz
 * @Date: 2021-09-10 16:28:26
 * @Description: Description
 */

const foo = require('./foo')
const bar = require('./bar')

jest.mock('./bar.js', () => {
  return jest.fn()
})

test('should call bar', () => {
  foo()
  // 检查bar是否被调用了
  expect(bar).toBeCalled()
})