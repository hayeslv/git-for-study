function foo(x: number) {

}
foo(); // 没传参，报错

function bar(x: number, y?: number) {

}
// 可选参数，传一个或两个参数都行
bar(1)
bar(1, 2)