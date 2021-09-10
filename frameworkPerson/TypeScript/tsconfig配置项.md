```json
{
  "compilerOptions": {
    "noImplicitAny": true, // 是否允许隐式any
    "strictNullChecks": true, // 在使用有可能是null的值前，你需要显式的检查
  }
}
```



### noImplicitAny

不允许隐式any

```ts
function foo(x) {
  console.log(x);
}
```



### strictNullChecks

在使用有可能是null的值前，你需要显式的检查

```ts
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

另外，可以用 ！操作符，来断言某个值不是空值

```ts
function doSomething1(x: string | null) {
  console.log("Hello, " + x!.toUpperCase());
}
console.log(doSomething1(null)); // 这里会报错，因为这个断言只是人为的。用户认为自己比ts更懂这里
```































