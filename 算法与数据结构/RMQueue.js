/*
 * @Author: Lvhz
 * @Date: 2021-07-02 08:42:57
 * @Description: 单调队列
 */

// 维护单调递增序列
class MonoQueueAdd {
  constructor(arr, k) {
    const q = [];
    for (let i = 0; i < arr.length; i++) {
      // 把之前破坏单调性的元素都从队尾移出（维护单调性）
      while (q.length && arr[q[q.length - 1]] > arr[i]) q.pop();
      q.push(i); // 记录下标
      if(i - q[0] === k) q.shift(); // 头部元素出队
      // 这时头部就记录的是最小元素的下标了
      if(i + 1 < k) continue;
      // if(i + 1 > k) console.log(' ');
      // 输出头部元素
      console.log(arr[q[0]]);
    }
  }
}

// new MonoQueueAdd([1,3,-1,-3,5,3,6,7], 3)

// 维护单调递减序列
class MonoQueueReduce {
  constructor(arr, k) {
    const q = [];
    for (let i = 0; i < arr.length; i++) {
      // 把之前破坏单调性的元素都从队尾移出（维护单调性）
      while (q.length && arr[q[q.length - 1]] < arr[i]) q.pop();
      q.push(i); // 记录下标
      if(i - q[0] === k) q.shift(); // 头部元素出队
      // 这时头部就记录的是最小元素的下标了
      if(i + 1 < k) continue;
      // if(i + 1 > k) console.log(' ');
      // 输出头部元素
      console.log(arr[q[0]]);
    }
  }
}
new MonoQueueReduce([1,3,-1,-3,5,3,6,7], 3)



