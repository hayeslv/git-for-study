// 通常一个数组中的所有内容都是同一个类型
const A = new Array<string>()
const B = []; // 相当于 Array<any>

// A[0] = 1; // 报错
A[0] = '1';

// function useState(x) {
//   return [x, setState]
// }





