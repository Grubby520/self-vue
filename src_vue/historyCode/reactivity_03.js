/**
* 当运行这样的代码并获取price的值时，我们希望price记住这个匿名函数(target)
* 如果price发生变化，或者被设置为一个新值，它将触发这个函数重新运行，因为它知道这一行依赖于它
* Get => Remember this anonymous function, we’ll run it again when our value changes.
	Set => Run the saved anonymous function, our value just changed
	Dep Class:
	Price accessed (get) => call dep.depend() to save the current target
	Price set => call dep.notify() on price,re-running all the targets
*/
let data = {
	price: 2,
	quantity: 2
};
let target = null; // public vari

/**
 * 订阅器
 */
class Dep {
	constructor() {
		this.subscribers = [];
	}

	addSub(sub) {
		// if (target && !this.subscribers.includes(target)) {
		// 	this.subscribers.push(target);
		// }
		this.subscribers.push(sub);
	}

	notify() {
		// re-running all the targets
		// this.subscribers.forEach(sub => sub());
		this.subscribers.forEach(sub => sub.update());
	}
}

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
	observe(value); // 递归遍历所有子属性
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


// each of properties has its own internal Dep Class
function watcher(myFunc) {
	target = myFunc;
	target();
	target = null;
}

// single property target func
watcher(() => {
	data.total = data.price * data.quantity;
});

console.log(target);

