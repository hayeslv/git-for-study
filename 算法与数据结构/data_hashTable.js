/*
 * @Author: Lvhz
 * @Date: 2021-06-14 14:43:18
 * @Description: Description
 */
// todo 待完善

// ====================开放定址法=========================
class HashTable {
  constructor(n = 100) {
    this.data = new Array(n);
    this.flag = new Array(n);
    this.count = 0;
  }
  insert(s) {
    let ind = this.hash_func(s) % this.data.length; // 哈希函数，计算哈希值
    ind = this.recalc_ind(ind, s); // 冲突处理
    if (!this.flag[ind]) { // 说明当前位置没有存储元素，将当前元素存进去
      this.data[ind] = s;
      this.flag[ind] = true;
      this.count += 1;
      if (this.count * 100 > this.data.length * 75) { // 装填因子大于 75%，该扩容了
        this.expand();
      }
    }
    return;
  }
  find(s) {
    let ind = this.hash_func(s) % this.data.length; // 哈希函数，计算哈希值
    ind = this.recalc_ind(ind, s); // 冲突处理
    return this.flag[ind];
  }
  hash_func(s) {
    const seed = 131;
    let hash = 0;
    for (let i = 0; s[i]; i++) {
      hash = hash * seed + s[i];
    }
    return hash & 0x7fffffff;
  }
  recalc_ind(ind, s) {
    let t = 1; // 代表当前正在试探第几次
    // 当前位置存在数据，并且当前位置的数据不等于传入的数据时
    while (this.flag[ind] && this.data[ind] !== s) {
      ind += t * t;
      t += 1;
      ind %= this.data.length;
    }
    return ind;
  }
  expand() {
    // const n = this.data.length * 2;
    // const h = new HashTable(n);
    // for (let i = 0; i < this.data.length; i++) {
    //   if (this.flag[i] === false) continue;
    //   h.insert(this.data[i]);
    // }
    // this.protptype = h;
    // return;
  }
}


// // 测试
// var h = new HashTable();
// h.insert('hello');
// h.insert('dylan');
// h.insert('lv');
// h.insert('lv1');
// h.insert('lv2');
// h.insert('lv3');
// h.insert('lv4');
// h.insert('lv5');

// console.log(h.find('1'));
// console.log(h.find('lv'));





// // ====================建立公共溢出区=========================
// class HashTable1 {
//   constructor(n = 100) {
//     this.data = new Array(n);
//     this.flag = new Array(n);
//     this.count = 0;
//     this.buff = new Set();
//   }
//   insert(s) {
//     const ind = this.hash_func(s) % this.data.length; // 哈希函数，计算哈希值
//     if (!this.flag[ind]) { // 说明当前位置没有存储元素，将当前元素存进去
//       this.data[ind] = s;
//       this.flag[ind] = true;
//       this.count += 1;
//       if (this.count * 100 > this.data.length * 75) { // 装填因子大于 75%，该扩容了
//         this.expand();
//       }
//     } else {
//       this.buff.add(s); // 当前位置有值了，放入公共溢出区
//     }
//     return;
//   }
//   find(s) {
//     const ind = this.hash_func(s) % this.data.length; // 哈希函数，计算哈希值
//     if (!this.flag[ind]) return false;
//     if (this.data[ind] === s) return true;
//     return this.buff.has(s);
//   }
//   hash_func(s) {
//     const seed = 131;
//     let hash = 0;
//     for (let i = 0; s[i]; i++) {
//       hash = hash * seed + s[i];
//     }
//     return hash & 0x7fffffff;
//   }
//   expand() {
//     // const n = this.data.length * 2;
//     // const h = new HashTable(n);
//     // for (let i = 0; i < this.data.length; i++) {
//     //   if (this.flag[i] === false) continue;
//     //   h.insert(this.data[i]);
//     // }
//     // this = h;
//     // return;
//   }
// }


// // 测试
// var h1 = new HashTable1();
// h1.insert('hello');
// h1.insert('dylan');
// h.insert('lv');

// console.log(h1.find('1'));
// console.log(h1.find('lv'));




// ====================拉链法=========================
class Node1 {
  constructor(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
  }
  insert(node) {
    node.next = this.next;
    this.next = node;
    return;
  }
}
class HashTable2 {
  constructor(n = 100) {
    this.data = new Array(n); // 哈希表中每个位置存储的是链表的头节点
    this.flag = new Array(n); // 哈希表中每个位置存储的是链表的头节点
    this.count = 0;
  }
  insert(s) {
    let ind = this.hash_func(s) % this.data.length; // 哈希函数，计算哈希值
    ind = this.recalc_ind(ind, s); // 冲突处理
    let p = this.data[ind];
    while (p.next && p.next.val !== s) p = p.next;
    if (!p.next) {
      p.insert(new Node1(s));
      this.count++;
      // if (this.count > this.data.length) { // 拉链法扩容时，装填因子可以大一些
      //   this.expand();
      // }
    }
    return;
  }
  find(s) {
    let ind = this.hash_func(s) % this.data.length; // 哈希函数，计算哈希值
    ind = this.recalc_ind(ind, s); // 冲突处理
    let p = this.data[ind].next;
    while (p && p.val !== s) p = p.next;
    return p !== null;
  }
  hash_func(s) {
    const seed = 131;
    let hash = 0;
    for (let i = 0; s[i]; i++) {
      hash = hash * seed + s[i];
    }
    return hash & 0x7fffffff;
  }
  recalc_ind(ind, s) {
    let t = 1; // 代表当前正在试探第几次
    // 当前位置存在数据，并且当前位置的数据不等于传入的数据时
    while (this.flag[ind] && this.data[ind] !== s) {
      ind += t * t;
      t += 1;
      ind %= this.data.length;
    }
    return ind;
  }
  expand() {
    // let n = this.data.length * 2;
    // let h = new HashTable(n);
    // for(let i=0; i<this.data.length; i++) {
    //   let p = this.data[i].next;
    //   while(p) {
    //     h.insert(p.val);
    //     p = p.next;
    //   }
    // }
    // this = h;
    // return;
  }
}


// 测试
var h2 = new HashTable2();
h2.insert('hello');
h2.insert('dylan');
h2.insert('lv');

console.log(h2.find('1'));
console.log(h2.find('lv'));



// =====================哈希链表============================
// 双向链表
class Node {
  constructor(key = 0, value = 0, prev = null, next = null) {
    this.key = key;
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
  remove_this() {
    if (this.prev) this.prev.next = this.next; // 当前节点的前一位，向后指向当前节点的下一位
    if (this.next) this.next.prev = this.prev; // 当前节点的后一位，向前指向当前节点的前一位
    this.next = this.prev = null; // 将当前节点的前后指针，分别赋值为空
    return this;
  }
  insert_prev(node) {
    node.next = this;
    node.prev = this.prev;
    if (this.prev) this.prev.next = node;
    this.prev = node;
  }
}
// 哈希链表，增加虚拟头节点和虚拟尾节点，添加就是在虚尾的前面添加，删除就是删除虚头后面的元素
class HashList {
  constructor(capacity) {
    this.capacity = capacity;
    this.data = new Map(); // 存储 key ： Node
    this.head = new Node();
    this.tail = new Node();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  put(key, value) {
    // 如果原本就存在，则将当前节点从链表中拆出来，然后将其放在链表末尾
    if (this.data.has(key)) {
      this.data.get(key).value = value;
      this.data.get(key).remove_this();
    } else {
      this.data.set(key, new Node(key, value));
    }
    this.tail.insert_prev(this.data.get(key));
    if (this.data.size > this.capacity) {
      this.data.delete(this.head.next.key); // 先在哈希表中删除
      this.head.next.remove_this(); // 再在链表中删除
    }
  }
  get(key) {
    if (!this.data.has(key)) return -1;
    this.data.get(key).remove_this();
    this.tail.insert_prev(this.data.get(key));
    return this.data.get(key).value;
  }
}
