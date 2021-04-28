import Dep from './dep';

/**
 * 订阅者
 */
class Wathcer {
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
		Dep.target = this; // 缓存自己，添加成功后去掉
		const value = this.vm.data[this.exp]; // 强制执行监听器里的get函数
		Dep.target = null; // 释放自己
		return value;
	}
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

/**
 * 添加订阅
 * @param {*} data 对象
 * @param {*} key 属性名
 * @param {*} value 属性值
 */
function defineReactive(data, key, value) {
	observe(value); // each of properties has its own internal Dep Class
	// each property gets a dependency instance
	const dep = new Dep();
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,
		get() {
			if (Dep.target) { // Watcher初始化触发
				dep.addSub(Dep.target); // 添加一个订阅者
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

function Vue(data, el, exp) {
	this.data = data;
	observe(data);
	el.innerHTML = this.data[exp]; // init template value
	new Wathcer(this, exp, value => {
		el.innerHTML = value;
	});
}
