import Dep from './dep'
import { def, hasProto, hasOwn, isObject, isPlainObject } from '../util/index'
import { arrayMethods } from './array'

/**
 * 响应式数据的核心
 * Define a reactive property on an Object
 * @param obj 对象
 * @param key 属性
 * @param val
 * @param customSetter
 * @param shallow
 */
export function defineReactive(
  obj: object,
  key: string,
  val?: any,
  customSetter?: Function,
  shallow?: boolean
) {
  const dep = new Dep()
  // 返回对象上一个自有属性对应的属性描述符（对象上直接赋值的，不需要从原型链上查找的属性）
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    // 不可修改或删除
    return
  }
  // 是否有预定义getter和setter
  const getter = property && property.get
  const setter = property && property.get
  if ((!getter || setter) && arguments.length === 2) {
    // 初始化基本走这儿
    val = obj[key]
  }
  let childOb = !shallow && observe(val) // 给单个property创建observer实例

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      /**
       * Dep.target 为 Dep 类的一个静态属性，值为 watcher，在实例化 Watcher 时会被设置
       * 实例化 Watcher 时会执行 new Watcher 时传递的回调函数（computed 除外，因为它懒执行）
       * 而回调函数中如果有 vm.key 的读取行为，则会触发这里的 读取 拦截，进行依赖收集
       * 回调函数执行完以后又会将 Dep.target 设置为 null，避免这里重复收集依赖
       */
      if (Dep.target) { // 有依赖的前提下
        dep.depend()
        if (childOb) {
          childOb.dep.depend() // ? 收集依赖
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val // 旧值
      // ? 怎么讲 newVal !== newVal && value !== value
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (getter && !setter) {
        return // 只有getter，说明是常量，不用响应式
      }
      if (setter) {
        setter.call(obj, newVal) // 有setter，调用setter更新值
      } else {
        val = newVal
      }
      childOb = observe(newVal) // 新值依然响应式
      dep.notify() // 通过依赖 update，queueWatcher队列执行相应的cb
    }
  })
}

/**
 * Observer class that is attached to each observed object.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // ? number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      /**
       * value 为数组
       * hasProto = '__proto__' in {}
       * 用于判断对象是否存在 __proto__ 属性，通过 obj.__proto__ 可以访问对象的原型链
       * 但由于 __proto__ 不是标准属性，所以有些浏览器不支持，比如 IE6-10，Opera10.1
       * 为什么要判断，是因为一会儿要通过 __proto__ 操作数据的原型链
       * 覆盖数组默认的七个原型方法，以实现数组响应式 (push,pop,shift,unshift,splice,sort,reverse)
       */
      if (hasProto) {
        protoAugment(value, arrayMethods) // data下每个property添加一个 __proto__: Observer
      }
      this.observerArray(value) // 单独处理数组
    } else {
      this.walk(value)
    }
  }

  // 数组走这里
  observerArray(arr: Array<any>) {
    for (let i = 0, l = arr.length; i < l; i++) {
      observe(arr[i])
    }
  }

  /**
   * only be called when value type is Object(not Array)
   * 给所有的properties转换成 getter/setter
   */
  walk(obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0, l = keys.length; i < l; i++) {
      defineReactive(obj, keys[i])
    }
  }
}

/**
 * 通过使用__proto__拦截原型链来增加目标对象或数组
 */
function protoAugment(target, src: Object) {
  target.__proto__ = src
}

/**
 * Attempt to create an observer instance for a value
 * @returns 基础类型就没有返回值
 */
export function observe(value: any, asRootData?: boolean): Observer | void {
  if (!isObject(value)) { // 基础数据类型不做响应式处理
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '') && value.__ob__ instanceof Observer) {
    // 可能会动态新增属性，所以判断 if the value already has one
    ob = value.__ob__
  } else if (Array.isArray(value) || isPlainObject(value) && Object.isExtensible(value) && !value._isVue) {
    // 例如 Object.freeze | Object.seal 是不可扩展的，就不会做处理
    ob = new Observer(value)
  }
  // ? 待研究-跟组件才有还是子组件也有
  if (asRootData && ob) {
    ob.vmCount++ // ? 难道是嵌套
  }
  return ob
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 * 
 * defineProperty监听不到数组长度变化的，监听数组所有索引的成本太高
 * 数组是单独调用observeArray方法-数据描述符，不是defineReactive方法-存储描述符，
 * 使用defineProperty对Array的7个原型方法进行拦截，把被拦截的数据的原型指向改造后的原型（arrayMethods）
 * 并没有直接修改Array.prototype(隔离，不污染全局的Array)，而是把arrayMethods赋值给value的__proto__(现代浏览器都有实现),只对data中的属性有效
 */
function dependArray(value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend() // 收集依赖
    if (Array.isArray(e)) {
      dependArray(e) // recursive遍历
    }
  }
}
