import Dep from './dep';
const Dep_: any = Dep;
/**
 * 订阅者
 */
class Watcher {
	vm: any;
	exp: string;
	cb: Function;
	value: any;
	constructor(vm, exp, cb) {
		this.vm = vm;
		this.exp = exp;
		this.cb = cb;
		this.value = this.get(); // 将自己添加到订阅器?
	}

	update() {
		this.run();
	}

	run() {
		const newValue = this.vm.data[this.exp],
			oldValue = this.value;
		if (newValue !== oldValue) {
			this.value = newValue;
			this.cb.call(this.vm, newValue, oldValue);
		}
	}

	get() {
		Dep_.target = this; // 缓存自己，添加成功后去掉
		const value = this.vm.data[this.exp]; // 强制执行监听器里的get函数
		Dep_.target = null; // 释放自己
		return value;
	}
}

/**
 * 添加订阅
 * @param {*} data 对象
 * @param {*} key 属性名
 * @param {*} value 属性值
 */
function defineReactive(data, key, value) {
	observe(value); // each of properties has its own internal Dep_ Class
	// each property gets a dependency instance
	const dep = new Dep_();
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,
		get() {
			if (Dep_.target) { // Watcher初始化触发
				dep.addSub(Dep_.target); // 添加一个订阅者
			}
			return value;
		},
		set(newVal) {
			if (value === newVal) return;
			value = newVal;
			dep.notify(); // re-running all the targets
		}
	})
}

/**
 * 数据监听
 * @param {*} data 
 */
function observe(data) {
	if (!data || typeof data !== 'object') {
		return;
	}
	Object.keys(data).forEach(key => {
		defineReactive(data, key, data[key]);
	})
}



export function Vue(data, el, exp) {
	this.data = data;
	observe(data);
	el.innerHTML = this.data[exp]; // init template value
	new Watcher(this, exp, value => {
		el.innerHTML = value;
	});
}
