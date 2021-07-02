/*
 * @Author: Lvhz
 * @Date: 2021-04-15 09:38:25
 * @Description: 数据结构：堆
 *               下标从0开始，则子节点下标是 2i+1，2i+2；下标从1开始，则子节点下标是 2i，2i+1
 */

// 大顶堆
class MaxHeap {
  constructor(fn) {
    this.fn = fn;
    this.arr = [];
    this.cnt = 0;
  }
  shift_up(ind) { // 向上调整（插入使用）
    while (this.arr[Math.floor((ind - 1) / 2)] < this.arr[ind]) { // 父节点元素值小于子节点元素值
    // while (Math.floor((ind - 1) / 2) >= 0 && this.fn(this.arr[Math.floor((ind - 1) / 2)], this.arr[ind])) {
      [this.arr[Math.floor((ind - 1) / 2)], this.arr[ind]] = [this.arr[ind], this.arr[Math.floor((ind - 1) / 2)]];
      ind = Math.floor((ind - 1) / 2);
    }
  }
  shift_down(ind) { // 向下调整（pop使用）
    const n = this.cnt - 1; // n：最后一个子节点的下标
    while (ind * 2 + 1 <= n) { // 左子树的下标小于等于最后一个子节点下标（此时一定有左孩子）
      let temp = ind; // temp保存最大值的下标
      if (this.arr[temp] < this.arr[ind * 2 + 1]) temp = ind * 2 + 1;
      if (ind * 2 + 2 <= n && this.arr[temp] < this.arr[ind * 2 + 2]) temp = ind * 2 + 2;
      if (temp === ind) break;
      [this.arr[temp], this.arr[ind]] = [this.arr[ind], this.arr[temp], this.arr[ind]];
      ind = temp;
    }
  }
  push(x) {
    this.arr[this.cnt++] = x;
    this.shift_up(this.cnt - 1);
    this.print(); // 输出
    return;
  }
  pop() {
    if (this.cnt === 0) return;
    const pop_val = this.top();
    [this.arr[0], this.arr[this.cnt - 1]] = [this.arr[this.cnt - 1], this.arr[0]]; // 最后一位和头部交换，为了排序做准备
    this.cnt--;
    this.shift_down(0);
    // this.print(); // 输出
    return pop_val;
  }
  top() { return this.arr[0]; }
  size() { return this.cnt; }
  getData() {
    const list = [];
    for (let i = 0; i < this.cnt; i++) list.push(this.arr[i]);
    return list;
  }
  print() {
    console.log(this.getData().join(' '));
  }
}

// 小顶堆
class MinHeap {
  constructor(arr) {
    this.arr = arr || [];
    this.cnt = 0;
  }
  shift_up(ind) { // 向上调整（插入使用）
    while (this.arr[Math.floor((ind - 1) / 2)] > this.arr[ind]) { // 父节点元素值大于子节点元素值
      [this.arr[Math.floor((ind - 1) / 2)], this.arr[ind]] = [this.arr[ind], this.arr[Math.floor((ind - 1) / 2)]];
      ind = Math.floor((ind - 1) / 2);
    }
  }
  shift_down(ind) { // 向下调整（pop使用）
    const n = this.cnt - 1; // n：最后一个子节点的下标
    while (ind * 2 + 1 <= n) { // 左子树的下标小于等于最后一个子节点下标（此时一定有左孩子）
      let temp = ind; // temp保存最大值的下标
      if (this.arr[temp] > this.arr[ind * 2 + 1]) temp = ind * 2 + 1;
      if (ind * 2 + 2 <= n && this.arr[temp] > this.arr[ind * 2 + 2]) temp = ind * 2 + 2;
      if (temp === ind) break;
      [this.arr[temp], this.arr[ind]] = [this.arr[ind], this.arr[temp], this.arr[ind]];
      ind = temp;
    }
  }
  push(x) {
    this.arr[this.cnt++] = x;
    this.shift_up(this.cnt - 1);
    // this.print(); // 输出
    return;
  }
  pop() {
    if (this.cnt === 0) return;
    const pop_val = this.top();
    [this.arr[0], this.arr[this.cnt - 1]] = [this.arr[this.cnt - 1], this.arr[0]]; // 最后一位和头部交换，为了排序做准备
    this.cnt--;
    this.shift_down(0);
    // this.print(); // 输出
    return pop_val;
  }
  top() { return this.arr[0]; }
  size() { return this.cnt; }
  getData() {
    const list = [];
    for (let i = 0; i < this.cnt; i++) list.push(this.arr[i]);
    return list;
  }
  print() {
    console.log(this.getData().join(' '));
  }
}

// 通用堆
class Heap {
  constructor(fn) {
    if (typeof fn === 'function') {
      this.fn = fn;
    } else if (fn === '>') { // 大顶堆
      this.fn = (a, b) => a < b; // 父节点小于子节点，则交换
    } else if (fn === '<') { // 小顶堆
      this.fn = (a, b) => a > b;
    }
    this.arr = [];
    this.cnt = 0;
  }
  shift_up(ind) { // 向上调整（插入使用）
    while (Math.floor((ind - 1) / 2) >= 0 && this.fn(this.arr[Math.floor((ind - 1) / 2)], this.arr[ind])) {
      [this.arr[Math.floor((ind - 1) / 2)], this.arr[ind]] = [this.arr[ind], this.arr[Math.floor((ind - 1) / 2)]];
      ind = Math.floor((ind - 1) / 2);
    }
  }
  shift_down(ind) { // 向下调整（pop使用）
    const n = this.cnt - 1; // n：最后一个子节点的下标
    while (ind * 2 + 1 <= n) { // 左子树的下标小于等于最后一个子节点下标（此时一定有左孩子）
      let temp = ind; // temp保存最大值的下标
      if (this.fn(this.arr[temp], this.arr[ind * 2 + 1])) temp = ind * 2 + 1;
      if (ind * 2 + 2 <= n && this.fn(this.arr[temp], this.arr[ind * 2 + 2])) temp = ind * 2 + 2;
      if (temp === ind) break;
      [this.arr[temp], this.arr[ind]] = [this.arr[ind], this.arr[temp], this.arr[ind]];
      ind = temp;
    }
  }
  push(x) {
    this.arr[this.cnt++] = x;
    this.shift_up(this.cnt - 1);
    return;
  }
  pop() {
    if (this.cnt === 0) return;
    const pop_val = this.top();
    [this.arr[0], this.arr[this.cnt - 1]] = [this.arr[this.cnt - 1], this.arr[0]]; // 最后一位和头部交换，为了排序做准备
    this.cnt--;
    this.shift_down(0);
    // this.print(); // 输出
    return pop_val;
  }
  top() {
    return this.arr[0];
  }
  size() {
    return this.cnt;
  }
  empty() {
    return this.cnt === 0;
  }
  getData() {
    const list = [];
    for (let i = 0; i < this.cnt; i++) list.push(this.arr[i]);
    return list;
  }
  print() {
    console.log(this.getData().join(' '));
  }
}
  

//! 测试代码
const compare = (a, b) => {
  return a[0] + a[1] < b[0] + b[1];
};

const heap = new Heap(compare);

heap.push([1, 2]);
heap.push([2, 3]);
heap.push([1, 6]);
heap.push([2, 4]);
heap.push([6, 3]);
heap.push([3, 3]);
heap.push([1, 1]);

// heap.push(4);
// heap.push(1);
// heap.push(7);
// heap.push(5);
// heap.push(6);
// heap.push(3);
// heap.push(9);

// heap.getData();
heap.print();
