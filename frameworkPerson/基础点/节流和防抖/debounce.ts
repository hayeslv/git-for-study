// 防抖：只执行最后一次
export function debounce(fn: Function, delay: number = 300) {
  let I = null;
  return (...args: Array<any>) => {
    clearTimeout(I);
    I = setTimeout(() => {
      fn(...args);
    }, delay);
  }
}