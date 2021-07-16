// 单调栈可以解决的问题：离它（每个元素）最近的最大或最小的值
class Stack {
  constructor(arr) {
    let n = arr.length;
    this.arr = arr;
    this.index = new Array(n);
    this.pre = new Array(n);
    this.next = new Array(n);
    this.s = [];

    for(let i=0; i<n; i++) this.index[i] = i;

    for(let i=0; i<n; i++) {
      while(this.s.length && this.arr[i] < this.arr[this.getStackTop()]) {
        // 栈不为空，并且当前元素小于栈顶元素
        this.next[this.getStackTop()] = i; // 对于s.top 这个元素来说，后面第一个比他小的元素是 i
        this.s.pop();
      }
      // 第一个打动不了的元素（有可能为空）
      if(this.s.length === 0) {
        this.pre[i] = -1;
      } else {
        this.pre[i] = this.getStackTop();
      }
      this.s.push(i);
    }
    while(this.s.length) {
      this.next[this.getStackTop()] = n;
      this.s.pop();
    }
    // 输出数组
    this.output(this.index, "index: ");
    this.output(arr, "now: ");
    this.output(this.pre, "pre: ");
    this.output(this.next, "next: ");
  }
  // 获取栈顶元素
  getStackTop(){
    return this.s[this.s.length - 1];
  }
  output(arr, msg) {
    let str = arr.join(' ');
    console.log(msg + str);
  }
}


let arr = [6,7,9,0,8,3,4,5,1,2];
const stack = new Stack(arr);

// 输出结果
// index: 0 1 2 3  4 5 6 7 8 9
// now:   6 7 9 0  8 3 4 5 1 2
// pre:  -1 0 1 -1 3 3 5 6 3 8
// next:  3 3 3 10 5 8 8 8 10 10

//! 对于 now：9而言，前面一个比他小的元素是7,7的下标是 pre=1，后面一个比他小的元素是0，0的下标是3，next=3
//! 对于 now：3而言，前面一个比他小的元素是0,0的下标是 pre=3，后面一个比他小的元素是1，1的下标是8，next=8