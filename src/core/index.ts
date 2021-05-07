/**
 * main entry
 */
import Vue from './instance/index'

Vue['version'] = '__VERSION__'

console.log(Vue)

const app = new Vue({
    el: '#app',
    data() {
        return {
            msg: 'vue init',
            arr: [
                {
                    label: 'lin',
                    value: 1
                },
                {
                    label: 'wang',
                    value: 2
                }
            ],
            obj: {
                id: 0,
                tmp: 'obj init'
            }
        }
    }
})

console.log(app)

setTimeout(() => {
    const $get = document.getElementById('get')
    const $set = document.getElementById('set')

    $get.addEventListener('click', function () {
        console.log(app.msg)
        const obj = app.obj
        console.log(obj)
    })

    $set.addEventListener('click', function () {
        app.obj.tmp = 'obj update'
        console.log(app.obj)
    })

    const $cnt = document.getElementById('cnt')
    const watcher = () => {
        $cnt.innerHTML = JSON.stringify(app._data)
    }
    watcher()
})

export default Vue