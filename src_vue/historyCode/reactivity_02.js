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

class Dep {
	constructor() {
		this.subscribers = [];
	}

	depend() {
		if (target && !this.subscribers.includes(target)) {
			this.subscribers.push(target);
		}
	}

	notify() {
		// re-running all the targets
		this.subscribers.forEach(sub => sub());
	}
}

Object.keys(data).forEach(key => {
	// each property gets a dependency instance
	const dep = new Dep();
	let internalValue = data[key];
	Object.defineProperty(data, key, {
		get() {
			dep.depend(); // store the target
			return internalValue;
		},
		set(newVal) {
			internalValue = newVal;
			dep.notify(); // re-running all the targets
		}
	})
});

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

