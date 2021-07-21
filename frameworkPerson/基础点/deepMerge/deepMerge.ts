function deepMergeArray(a : Array<any>, b : Array<any>) {
  // return a.concat(b);
  return [...a, ...b];
}

type MyObjectType = {
  [key: string] : any
}
function deepMergeObject(a : MyObjectType, b : MyObjectType) {
  // {...a, ...b}
  return Object.assign({}, a, b);
}

// type Literal = number | string | boolean | bigint;
function deepMerge(a : Literal, b : Literal);
function deepMerge(a : any, b : any) {
  const typeA = typeof a;
  const typeB = typeof b;

  if(typeA === 'string' && typeB === 'string') {
    return a;
  }
}