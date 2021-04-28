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

let price =2;
let quantity = 2;
let total = 0;

// watcher before
// let target = () => { // getter func
// 	total = price * quantity;
// };
// dep.depend();
// target();

function watcher(myFunc) {
	target = myFunc;
	dep.depend();
	target();
	target = null;
}

// watcher after
watcher(() => {
	total = price * quantity;
});
console.log(total);

price = 5;
dep.notify(); // updated
console.log(total);

// own Dep instance
