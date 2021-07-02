/*
 * @Author: Lvhz
 * @Date: 2021-05-17 15:45:16
 * @Description: 归并排序
 */

const merge_sort = (arr, l, r) => {
  if (l >= r) return;
  const mid = (l + r) >> 1; // 获取中间数
  merge_sort(arr, l, mid); // 对左半区间排序
  merge_sort(arr, mid + 1, r); // 对右半区间排序

  const temp = []; // 将左右两边的有序结果，合并到这里来
  let k = 0, p1 = l, p2 = mid + 1;
  while (p1 <= mid || p2 <= r) { // 当左右两半部分区间，其中还有元素的时候
    // 如果右半区间空了，或者左半区间没空 并且左边小于右边，则将左边插入数组
    if ((p2 > r) || (p1 <= mid && arr[p1] <= arr[p2])) {
      temp[k++] = arr[p1++];
    } else {
      temp[k++] = arr[p2++];
    }
  }
  for (let i = l; i <= r; i++) arr[i] = temp[i - l];
  return;
};

//! 测试代码
var list = [5, 1, 20, 15, 7, 4, 9, 6, 3, 0, 16, 12];
merge_sort(list, 0, list.length - 1);
console.log(list);
