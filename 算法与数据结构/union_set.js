/*
 * @Author: Lvhz
 * @Date: 2021-05-06 17:28:03
 * @Description: 数据结构：并查集
 */

// 1、查找速度快 O(1)
// 2、合并速度慢 O(n)
// 所以叫做QuickFind
class QuickFind {
  constructor(n) {
    this.n = n;
    const color = new Array(n + 1);
    for (let i = 0; i <= n; i++) { //  一开始，每个结点都是根节点
      color[i] = i;
    }
    this.color = color;
  }
  get(x) {
    return this.color[x];
  }
  merge(a, b) {
    if (this.color[a] === this.color[b]) return;
    const cb = this.color[b];
    for (let i = 0; i <= this.n; i++) {
      if (this.color[i] === cb) this.color[i] = this.color[a]; // 将集合中颜色等于b的元素，全部染成a的颜色
    }
  }
}

//! 平常使用
class UnionSet {
  constructor(n) {
    this.n = n;
    const fa = new Array(n + 1);
    for (let i = 0; i < fa.length; i++) { //  一开始，每个结点都是根节点
      fa[i] = i;
    }
    this.fa = fa;
  }
  find(x) { //  直接挂在根节点上（美其名曰扁平化管理）
    return this.fa[x] = (this.fa[x] === x ? x : this.find(this.fa[x]));
  }
  merge(a, b) {
    this.fa[this.find(a)] = this.find(b); //  将a挂载b上，b是a的爸爸
  }
  isConnect(a, b) {
    return this.find(a) === this.find(b);
  }
}

class UnionSet1 {
  constructor() {
    this.parent = new Map();
  }
  set(key, val) {
    this.parent.set(key, val);
  }
  find(x) {
    while (this.parent.has(x)) { // 一直向上找爹
      x = this.parent.get(x);
    }
    return x;
  }
  merge(a, b) {
    if (this.find(a) === this.find(b)) return;
    this.parent.set(this.find(a), this.find(b)); // 把a挂在b上
  }
  isConnect(a, b) {
    return this.find(a) === this.find(b);
  }
}