export function initRender(vm: any) {
    vm._node = null
    vm._staticTrees = null // v-once cached trees

    vm.$slots = null
    vm.$scopedSlots = null

    vm._c = null
    vm.$createElement = null

    // 给 $attrs $listeners 响应式处理
}