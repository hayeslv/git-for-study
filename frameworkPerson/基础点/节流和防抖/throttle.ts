// 节流：每个时间段内只执行一次
export function throttle(fn: Function, interval: number = 300) {
  let lock = false;
  let I = null;
  let start: number;

  return (...args: Array<any>) => {
    if(start === undefined) {
      start = new Date().getTime();
    }
    if(lock) return;
    lock = true;
    fn(...args);

    const ellapsed = (new Date().getTime() - start);

    I = setTimeout(() => {
      lock = false;
    }, interval - ellapsed % interval)
  }
}