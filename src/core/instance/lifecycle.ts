// 初始化生命周期，在实例上添加了一系列的默认属性
export function initLifecycle(vm: any) {
    const options = vm.$options

    let parent = options.parent

    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm;

    vm.$children = []
    vm.$refs = {}

    // 用boolean标识，方便后面性能优化
    vm._watcher = null
    vm._inactive = null
    vm._directInactive = false
    vm._isMounted = false
    vm._isDestroyed = false
    vm._isBeingDestroyed = false
}
