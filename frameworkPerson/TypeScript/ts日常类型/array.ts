/*
 * @Author: Lvhz
 * @Date: 2021-07-17 16:06:01
 * @Description: Description
 */

// 通常一个数组中的所有内容都是同一个类型
const A = new Array<string>()
const B = []; // 相当于 Array<any>

// A[0] = 1; // 报错
A[0] = '1';

// React的一个hook：返回一个值和一个函数，本身不作为数组来用（记录），通常作为值类型类用
// function useState(x) {
//   return [x, setState]
// }





