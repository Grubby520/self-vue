import Vue from '../../core'
import { cached } from '../../core/util/index'
import { query } from './util'

const idToTemplate = cached((id) => {
    const el = query(id)
    return el && el.innerHTML
})

const mount = Vue.prototype.$mount

Vue.prototype.$mount = function (el: string | Element, hydrating?: Boolean) {
    // 优先级 render template el
    el = el && query(el)
    const options = this.$options
    // resolve template/el and convert to render function 转成render函数
    if (!options.render) {
        let template = options.template
        if (template) {
            // compile template into render function
            if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                    // 如果值以 # 开始，则它将被用作选择符，并使用匹配元素的 innerHTML 作为模板(<script type="x-template">)
                    template = idToTemplate(template)
                }
            } else if (template.nodeType) {
                template = template.innerHTML
            } else {
                return this
            }
        } else if (el) {
            template = getOuterHTML(el)
        }

        if (template) {
            // ...
        }
    }
    return mount.call(this, el, hydrating)
}

function getOuterHTML(el: Element): string {
    if (el.outerHTML) {
        return el.outerHTML
    } else {
        const container = document.createElement('div')
        container.appendChild(el.cloneNode(true))
        return container.innerHTML
    }
}