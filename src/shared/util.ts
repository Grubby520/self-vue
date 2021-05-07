/**
 * Remove an item from an array.
 */
export function remove(arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) { // 没有使用 !== ,而是使用的 > （书里也有提及）
      return arr.splice(index, 1)
    }
  }
}

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object'
}

/**
 * 创建一个纯函数的缓存版本
 */
export function cached(fn: Function): Function {
  const cache = Object.create(null)
  return (function cachedFn(str: string) {
    const hit = cache[str] // 这必然是false?
    return hit || (cache[str] = fn(str)) // ? 没看懂意义何在?
  })
}
