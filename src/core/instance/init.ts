import { initLifecycle } from './lifecycle'
import { initEvents } from './events'
import { initRender } from './render'
import { initState } from './state'

let uid = 0

export function initMixin(Vue: any) {
    Vue.prototype._init = function (options: Object) {
        const vm = this
        vm._uid = uid++
        vm._isVue = true

        // 合并全局配置
        vm.$options = options || {}

        vm._renderProxy = vm

        vm._self = vm // 这tm不会无限循环?

        // 初始化组件实例的关系属性，如 $options, $parent, $root, $children, $refs
        initLifecycle(vm)

        initEvents(vm)

        initRender(vm)

        // callHook(vm, 'beforeCreate')

        // 据响应式的核心入口，处理 props,methods,data,computed,watch (observe)
        initState(vm)
    }
}