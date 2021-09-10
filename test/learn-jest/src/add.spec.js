/*
 * @Author: Lvhz
 * @Date: 2021-09-10 15:45:09
 * @Description: Description
 */
const add = require("./add");

// 给定 input
// 测试 output
test("should return 3 when 1 + 2", () => {
  // 准备测试数据 - given
  const a = 1;
  const b = 2;
  // 触发测试动作 - when
  const r = add(a, b);
  // jest -> 匹配器
  // 验证 断言 - then
  expect(r).toBe(3)
});
