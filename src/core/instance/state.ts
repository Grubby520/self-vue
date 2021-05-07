import { isReserved } from '../util/index'
import { observe } from '../observer/index'

/**
 * 两件事：
 *   数据响应式的入口：分别处理 props、methods、data、computed、watch
 *   优先级：props、methods、data、computed 对象中的属性不能出现重复，优先级和列出顺序一致
 *         其中 computed 中的 key 不能和 props、data 中的 key 重复，methods 不影响
 */
export function initState(vm: any) {
    vm._watcher = []
    const opts = vm.$options
    if (opts.props) {

    }
    if (opts.methods) {

    }

    if (opts.data) {
        initData(vm)
    } else {
        observe(vm._data = {}, true) // init root data
    }
}

function initData(vm: any) {
    let data = vm.$options.data
    // 考点：
    // 必须定义成function，返回Object / each instance can maintain an independent copy of the returned data object
    // 每个实例都是返回的数据对象的独立的副本
    data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
    const keys = Object.keys(data)

    let i = keys.length
    while (i--) {
        const key = keys[i]
        // 验重
        // why? 把key代理到vm._data,其实不然，proxy内部是把key添加到vm实例上，使得this.xx能够获取data里的数据
        if (!isReserved(key)) {
            proxy(vm, '_data', key)
        }
    }
    // observe data 为data对象上的数据设置响应式
    observe(data, true /* asRootData */);
}

export function getData(data: Function, vm: any) {
    // pushTarget()
    return data.call(vm, vm) // data里可能有用到this
    // popTarget()
}

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    set: null,
    get: null
}

// ?考点：为什么this.xx能够访问data属性里定义的属性（中间状态 _data ）
export function proxy(target: Object, sourceKey: string, key: string) {
    // this 的理解还是不到家...
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key] // get 是从_data里取值
    }

    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }

    Object.defineProperty(target, key, sharedPropertyDefinition)
}
