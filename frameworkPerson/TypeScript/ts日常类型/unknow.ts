let x:unknown = 1;
x = true;

// 如果y是any 或 unknown 就可以赋值，如果是其他就报错
let y: string = x;
let z: any = x;
let a: unknown = x;

// :用于类型标注
let myName = 'dylan' // 默认推导将myName设置为string类型
myName = 1; // 这边就报错了
