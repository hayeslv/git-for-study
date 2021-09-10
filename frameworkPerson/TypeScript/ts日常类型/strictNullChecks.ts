/*
 * @Author: Lvhz
 * @Date: 2021-07-18 08:46:07
 * @Description: Description
 */
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}

function doSomething1(x: string | null) {
  console.log("Hello, " + x!.toUpperCase());
}
console.log(doSomething1(null));