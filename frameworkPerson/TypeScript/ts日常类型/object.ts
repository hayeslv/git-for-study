/*
 * @Author: Lvhz
 * @Date: 2021-07-17 17:06:02
 * @Description: Description
 */
// 一个描述了x和y的对象，内容里x和y必须要有
const pt: {
  x: number,
  y: number,
  z?: number
} = {
  x: 1,
  y: 2
}

// 或者下面这种写法的代码可读性更高
type Point = {
  x: number,
  y: number,
}
const point: Point = {
  x: 1,
  y: 2
}
// point.z = 1; // 报错，因为定义属性时只有x、y

// 类型安全操作
const o : {
  a : string,
  b ? : {
      c : string
  }
} = {a : "1"}

// console.log(o.b.c) // 报错
console.log(o.b?.c) // undefined （右值）
o.b?.c = "Hello" // Error