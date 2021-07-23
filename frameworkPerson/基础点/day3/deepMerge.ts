// 深度合并（merge的自定义化太强了）
// ------  以下内容不为标准  ------

// 数组合并
function deepMergeArray(a : Array<any>, b : Array<any>) {
  // return a.concat(b);
  return [...a, ...b];
}

// type ObjectType = {
//   [key: string] : any
// }
// 对象合并
function deepMergeObject(a : ObjectType, b : ObjectType) {
  // {...a, ...b}
  return Object.assign({}, a, b);
}

// type Literal = number | string | boolean | bigint;
function deepMerge(a : Literal, b : Literal);
function deepMerge(a : any, b : any) {
  const typeA = typeof a;
  const typeB = typeof b;

  if(!a || !b) {
    return a || b;
  }

  if(typeA === 'string' && typeB === 'string') {
    return a;
  }

  if(typeA === 'function' || typeB === 'function') {

  }

  if(Array.isArray(a) && Array.isArray(b)) {
    
  }


}

deepMerge({}, {});
deepMerge(1, true);