单调队列是对原队列的另外一种表示方式



#### 1、leetcode239-滑动窗口最大值

给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回滑动窗口中的最大值。

示例：

```
输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]
解释：
滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

题解：

```js
var maxSlidingWindow = function(nums, k) {
    // 单调队列
    let q = [], ret = [];
    for(let i=0; i<nums.length; i++) {
        // 处理尾部
        while(q.length && nums[q[q.length - 1]] < nums[i]) q.pop();
        q.push(i);
        // 处理头部
        if(i - q[0] === k) q.shift();
        if(i+1 < k) continue;
        ret.push(nums[q[0]]);
    }
    return ret;
}; 
```



#### 2、剑指Offer 59-Ⅱ 队列的最大值

请定义一个队列并实现函数 max_value 得到队列里的最大值，要求函数max_value、push_back 和 pop_front 的均摊时间复杂度都是O(1)。

若队列为空，pop_front 和 max_value 需要返回 -1

示例：

```
输入: 
["MaxQueue","push_back","push_back","max_value","pop_front","max_value"]
[[],[1],[2],[],[],[]]
输出: [null,null,null,2,1,2]
```

题解：

```js
var MaxQueue = function() {
    this.q = [];
    this.mq = []; // 单调队列
};

MaxQueue.prototype.max_value = function() {
    if(this.mq.length === 0) return -1;
    return this.mq[0];
};

MaxQueue.prototype.push_back = function(value) {
    this.q.push(value);
    // 如果这里改成 >= ，pop_front会变得更复杂，需要记录下标信息，相同下标时单调队列才出队元素
    while(this.mq.length && value > this.mq[this.mq.length - 1]) this.mq.pop();
    this.mq.push(value);
};

MaxQueue.prototype.pop_front = function() {
    if(this.mq.length === 0) return -1;
    // 判断弹出的是不是单调队列的队首元素
    if(this.q[0] === this.mq[0]) this.mq.shift();
    let ret = this.q.shift();
    return ret;
};
```



#### 3、leetcode862-和至少为K的最短子数组

返回 `A` 的最短的非空连续子数组的**长度**，该子数组的和至少为 `K` 。

如果没有和至少为 `K` 的非空子数组，返回 `-1` 。

```js
var shortestSubarray = function(nums, k) {
    let q = []; // 单调队列
    let sum = new Array(nums.length + 1); // 前缀和数组：需要比原数组长度+1，因为前缀和数组第0位为0
    sum[0] = 0;
    // 初始化前缀和数组
    for(let i=0; i<nums.length; i++) sum[i+1] = sum[i] + nums[i];
    // 接下来依次扫描前缀和数组的每一位
    q.push(0); // 单调队列中存储的是相关元素的下标：有了下标也就可以索引到值
    let pos = -1; // 上一次找到的位置
    let ans = -1; // 最短的满足序列的长度
    for(let i=1; i<sum.length; i++) {
        while(q.length && sum[i] - sum[q[0]] >= k) pos = q.shift();
        if(pos !== -1 && (i - pos < ans || ans === -1)) ans = i - pos;
        // 将当前的元素压入到单调队列中
        while(q.length && sum[i] < sum[q[q.length - 1]]) q.pop();
        q.push(i);
    }
    return ans;
};
```



#### 4、leetcode1438-绝对差不超过限制的最长连续子数组

给你一个整数数组 nums ，和一个表示限制的整数 limit，请你返回最长连续子数组的长度，该子数组中的任意两个元素之间的绝对差必须小于或者等于 limit 。

如果不存在满足条件的子数组，则返回 0 。

```js
var longestSubarray = function(nums, limit) {
    function check(nums, k, limit) {
        let qmin = [], qmax = [];
        for(let i=0; i<nums.length; i++) {
            while(qmin.length && nums[i] < nums[qmin[qmin.length - 1]]) qmin.pop();
            while(qmax.length && nums[i] > nums[qmax[qmax.length - 1]]) qmax.pop();
            qmin.push(i);
            qmax.push(i);
            if(i + 1 < k) continue;
            if(i - qmin[0] === k) qmin.shift();
            if(i - qmax[0] === k) qmax.shift();

            if(nums[qmax[0]] - nums[qmin[0]] <= limit) return true;
        }
        return false;
    }
    function bs(nums, l, r, limit) {
        if(l === r) return l;
        let mid = (l + r + 1) >> 1;
        if(check(nums, mid, limit)) {
            l = mid;
        } else {
            r = mid - 1;
        }
        return bs(nums, l, r, limit);
    }
    return bs(nums, 0, nums.length, limit);
};
```









































































