描述：查找两个节点的最近的一个共同父节点，可以包括节点自身

输入描述：oNode1 和 oNode2 在同一文档中，且不会为相同的节点



我的题解：实际上就是找两棵树的最近父节点

```js
function commonParentNode(oNode1, oNode2) {
    const set = new Set()
    while(oNode1) {
        set.add(oNode1)
        oNode1 = oNode1.parentNode
    }
    while(oNode2) {
        if(set.has(oNode2)) return oNode2
        oNode2 = oNode2.parentNode
    }
    return null
}
```



网上题解：使用contains

contains() ：如果A元素包含B元素，则返回true，否则false。

```js
function commonParentNode(oNode1, oNode2) {
  while(oNode1) {
    if(oNode1.contains(oNode2)) return oNode1
    oNode1 = oNode1.parentNode
  }
}
```















