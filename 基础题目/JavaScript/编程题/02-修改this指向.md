封装函数 f，使 f 的 this 指向指定的对象

```js
function bindThis(f, oTarget) {
  
}
```



### 方法1：直接使用  bind、call、apply



```js
// bind
function bindThis(f, oTarget) {
  return f.bind(oTarget)
}
```

```js
// call
function bindThis(f, oTarget) {
 	return function() {
    return f.call(oTarget, ...arguments)
  } 
}
```

```js
// apply
function bindThis(f, oTarget) {
 	return function() {
    return f.apply(oTarget, arguments)
  } 
}
```



### 方法2：

```js
function bindThis(f, oTarget) {
    return function(...args) {
        oTarget.f = f;
        return oTarget.f(...args)
    }
}
```















