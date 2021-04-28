class Dep {
	constructor() {
		this.subscribers = [];
	}

	depend() {
		if (target && !this.subscribers.includes(target)) {
			// add it to subscribers
			this.subscribers.push(target);
		}
	}

	notify() {
		// run all the subscribers
		this.subscribers.forEach(sub => sub());
	}
}

const dep = new Dep();

let data = {
	price: 2,
	quantity: 2
};

// assume each of properties have own internal Dep Class
function watcher(myFunc) {
	target = myFunc;
	dep.depend();
	target();
	target = null;
}

watcher(() => {
	total = data.price * data.quantity;
});

/**
 * 降温watcher入参的匿名函数推送到它对应的subscriber数组中，调用dep.depend()
 * price 对应的Dep Class
 * quantity 对应的Dep Class
 */

// additional watchers
watcher(() => {
	salePrice = data.price * 0.9;
});

console.log(salePrice);

/**
 * 问题：当data.price is set,执行price的dep.notify()
 */
data.price = 5; // when this gets run, it will need to call notify() on the price
dep.notify(); // run this code

console.log(total);
console.log(salePrice);

/**
 * 我们需要一些方法来挂钩到一个数据属性(如price或quantity)，这样当它被访问时，我们可以将目标保存到我们的订阅者数组中，当它被更改时，运行存储我们的订阅者数组的函数
 * Solution: Object.defineProperty()
 */
Object.keys(data).forEach(key => {
	Object.defineProperty(data, key, {
		get() {
			return data[key];
		},
		set(newVal) {
			rdata[key] = newVal;
		}
	})
});

/**
* 当运行这样的代码并获取price的值时，我们希望price记住这个匿名函数(target)
* 如果price发生变化，或者被设置为一个新值，它将触发这个函数重新运行，因为它知道这一行依赖于它
* Get => Remember this anonymous function, we’ll run it again when our value changes.
	Set => Run the saved anonymous function, our value just changed
	Dep Class:
	Price accessed (get) => call dep.depend() to save the current target
	Price set => call dep.notify() on price,re-running all the targets
*/
