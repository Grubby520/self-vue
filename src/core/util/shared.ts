/**
 * 全局核心的util工具函数
 */
export function hasOwn(obj: Object | Array<any>, key: string): boolean {
    const hasOwnProperty = Object.prototype.hasOwnProperty
    return hasOwnProperty.call(obj, key)
}

const _toString = Object.prototype.toString

export function isPlainObject(obj: any): boolean {
    return _toString.call(obj) === '[object Object]'
}
