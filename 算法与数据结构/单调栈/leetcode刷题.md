### 01、leetcode155-最小栈

设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

- push(x) —— 将元素 x 推入栈中。
- pop() —— 删除栈顶的元素。
- top() —— 获取栈顶元素。
- getMin() —— 检索栈中的最小元素。

```js
var MinStack = function() {
    this.s = [];
    this.min_s = []; // 利用第二个栈来记录最小值
};

MinStack.prototype.push = function(val) {
    this.s.push(val);
    if(this.min_s.length === 0 || val <= this.min_s[this.min_s.length - 1]) this.min_s.push(val);
};

MinStack.prototype.pop = function() {
    let val = this.s.pop();
    if(val === this.min_s[this.min_s.length - 1]) this.min_s.pop();
};

MinStack.prototype.top = function() {
    return this.s[this.s.length - 1];
};
MinStack.prototype.getMin = function() {
    return this.min_s[this.min_s.length - 1];
};
```



### 02、leetcode503-下一个更大元素Ⅱ

给定一个循环数组（最后一个元素的下一个元素是数组的第一个元素），输出每个元素的下一个更大元素。数字 x 的下一个更大的元素是按数组遍历顺序，这个数字之后的第一个比它更大的数，这意味着你应该循环地搜索它的下一个更大的数。如果不存在，则输出 -1。

```js
var nextGreaterElements = function(nums) {
    // 使用单调递减栈
    let s = [];
    let ret = new Array(nums.length).fill(-1);
    // 单调栈所有元素入栈
    for(let i=0; i<nums.length; i++) {
        // 压入下标
        while(s.length && nums[i] > nums[s[s.length - 1]]) {
            // 说明是男一号
            ret[s[s.length - 1]] = nums[i];
            s.pop();
        }
        s.push(i);
    }
    // 因为是循环数组，所以将原有的数组入栈两次
    for(let i=0; i<nums.length; i++) {
        // 压入下标
        while(s.length && nums[i] > nums[s[s.length - 1]]) {
            // 说明是男一号
            ret[s[s.length - 1]] = nums[i];
            s.pop();
        }
        s.push(i);
    }
    return ret;
};
```



































