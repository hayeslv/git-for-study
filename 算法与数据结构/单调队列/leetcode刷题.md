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



#### 5、leetcode513-找树左下角的值

给定一个二叉树，在树的最后一行找到最左边的值。

```js
var findBottomLeftValue = function(root) {
    let max_k = -1, val = 0;
    dfs(root, 0);
    function dfs(root, k) {
        if(!root) return;
        if(k > max_k) {
            // 第一次到达这个深度
            max_k = k;
            val = root.val;
        }
        dfs(root.left, k+1);
        dfs(root.right, k+1);
        return;
    }
    return val;
};
```



#### 6、leetcode135-分发糖果

老师想给孩子们分发糖果，有 N 个孩子站成了一条直线，老师会根据每个孩子的表现，预先给他们评分。

你需要按照以下要求，帮助老师给这些孩子分发糖果：

- 每个孩子至少分配到 1 个糖果。
- 评分更高的孩子必须比他两侧的邻位孩子获得更多的糖果。

那么这样下来，老师至少需要准备多少颗糖果呢？

```js
var candy = function(ratings) {
    let l = new Array(ratings.length);
    let r = new Array(ratings.length);
    // 从左到右
    for(let i=0, j=1; i<l.length; i++) {
        if(i && ratings[i] > ratings[i-1]) {
            j += 1;
        } else {
            j = 1;
        }
        l[i] = j;
    }
    // 从右到左
    for(let i=r.length - 1, j=1; i>=0; i--) {
        if(i < r.length - 1 && ratings[i] > ratings[i+1]) {
            j += 1;
        } else {
            j = 1;
        }
        r[i] = j;
    }
    let ans = 0;
    for(let i=0; i<l.length; i++) ans += Math.max(l[i], r[i]);
    console.log(l, r)
    return ans;
};
```



#### 7、leetcode365-水壶问题

有两个容量分别为 x升 和 y升 的水壶以及无限多的水。请判断能否通过使用这两个水壶，从而可以得到恰好 z升 的水？

如果可以，最后请用以上水壶中的一或两个来盛放取得的 z升 水。

你允许：

- 装满任意一个水壶
- 清空任意一个水壶
- 从一个水壶向另外一个水壶倒水，直到装满或者倒空





#### 8、leetcode1760-袋子里最少数目的球

给你一个整数数组 nums ，其中 nums[i] 表示第 i 个袋子里球的数目。同时给你一个整数 maxOperations 。

你可以进行如下操作至多 maxOperations 次：

- 选择任意一个袋子，并将袋子里的球分到 2 个新的袋子中，每个袋子里都有 正整数 个球。
  - 比方说，一个袋子里有 5 个球，你可以把它们分到两个新袋子里，分别有 1 个和 4 个球，或者分别有 2 个和 3 个球。

你的开销是单个袋子里球数目的 最大值 ，你想要 最小化 开销。

请你返回进行上述操作后的最小开销。

```js
function f(nums, x) {
    let cnt = 0;
    for(let i=0; i<nums.length; i++) {
        cnt += Math.floor(nums[i] / x) + !!(nums[i] % x) - 1;
    }
    return cnt;
}

function bs(nums, l, r, n) {
    if(l === r) return l;
    let mid = (l+r) >> 1;
    if(f(nums, mid) <= n) {
        r = mid;
    } else {
        l = mid + 1;
    }
    return bs(nums, l, r, n);
}

var minimumSize = function(nums, maxOperations) {
    let l = 1, r;
    r = Math.max(...nums);
    return bs(nums, l, r, maxOperations);
};
```



#### 9、leetcode45-跳跃游戏Ⅱ

给定一个非负整数数组，你最初位于数组的第一个位置。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

你的目标是使用最少的跳跃次数到达数组的最后一个位置。

假设你总是可以到达数组的最后一个位置。

```js
var jump = function(nums) {
    if(nums.length <= 1) return 0;
    let pre = 1, pos = nums[0];
    let cnt = 1;
    while(pos+1 < nums.length) { // 满足条件时，一直向后跳
        let j = pre;
        for(let i = pre + 1; i <= pos; i++) {
            if(i + nums[i] > j + nums[j]) j = i;
        }
        pre = pos + 1;
        pos = j + nums[j];
        cnt += 1;
    }
    return cnt;
};
```



#### 10、leetcode93-复原IP地址

给定一个只包含数字的字符串，用以表示一个 IP 地址，返回所有可能从 s 获得的 **有效 IP 地址** 。你可以按任何顺序返回答案。

**有效 IP 地址** 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。

例如："0.1.2.201" 和 "192.168.1.1" 是 **有效** IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 **无效** IP 地址。

```js
function dfs(s, k, ind, ret) {
    if(ind >= s.length) return;
    if(k === 4) {
        let num = 0;
        // 0开头的数字，也直接return掉
        if(s.length - ind > 1 && s[ind] === '0') return;
        for(let i=ind; i<s.length; i++) {
            num = num * 10 + s[i].charCodeAt() - '0'.charCodeAt();
            if(num > 255) return;
        }
        ret.push(s);
        return;
    }
    for(let i=ind, num = 0; i<s.length; i++) {
        num = num * 10 + s[i].charCodeAt() - '0'.charCodeAt();
        if(num > 255) return;
        if(i - ind >= 1 && s[ind] === '0') return;
        // 加上点
        let str = Array.from(s);
        str.splice(i+1, 0, '.');
        s = str.join('');
        dfs(s, k+1, i+2, ret); // 因为 i+1 是个点
        // 递归回溯，删除点
        str = Array.from(s);
        str.splice(i+1, 1);
        s = str.join('');
    }
}

var restoreIpAddresses = function(s) {
    let ret = [];
    // 第二个参数：当前正在插入第几个点
    // 第三个参数：当前这个点，可以插入的第一个合法位置
    dfs(s, 1, 0, ret)
    return ret;
};
```



#### 11、leetcode46-全排列

给定一个不含重复数字的数组 `nums` ，返回其 **所有可能的全排列** 。你可以 **按任意顺序** 返回答案。



#### 12、leetcode43-字符串相乘

给定两个以字符串形式表示的非负整数 `num1` 和 `num2`，返回 `num1` 和 `num2` 的乘积，它们的乘积也表示为字符串形式。

说明：

- num1 和 num2 的长度小于110。
- num1 和 num2 只包含数字 0-9。
- num1 和 num2 均不以零开头，除非是数字 0 本身。
- 不能使用任何标准库的大数类型（比如 BigInteger）或直接将输入转换为整数来处理。

```js
var multiply = function(num1, num2) {
    let a = new Array(num1.length);
    let b = new Array(num2.length);
    let c = new Array(a.length + b.length - 1).fill(0); // 结果数组
    for(let i=0; i<num1.length; i++) a[a.length - i - 1] = num1[i].charCodeAt() - '0'.charCodeAt();
    for(let i=0; i<num2.length; i++) b[b.length - i - 1] = num2[i].charCodeAt() - '0'.charCodeAt();
    for(let i=0; i<a.length; i++) {
        for(let j=0; j<b.length; j++) {
            // i 位 * i 位，应该加到结果数组的 i + i 位上
            c[i+j] += a[i] * b[j];
        }
    }
    // 处理进位
    for(let i=0; i<c.length; i++) {
        if(c[i] < 10) continue;
        // 最高位进位：扩展一位
        if(i+1 === c.length) c.push(0);
        c[i+1] += Math.floor(c[i] / 10);
        c[i] %= 10;
    }
    while(c.length > 1 && c[c.length - 1] === 0) c.pop();
    let ret = '';
    for(let i = c.length - 1; i>= 0; i--) ret += c[i].toString();
    return ret;
};
```































































