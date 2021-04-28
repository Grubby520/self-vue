import { remove } from '../util/index';

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
	target: any;
	subs: any[];

	constructor() {
		this.subs = [];
	}

	addSub(sub) {
		this.subs.push(sub);
	}

	// removeSub(sub) {
	// 	remove(this.subs, sub);
	// }

	// depend() {
	// 	if (Dep.target) {
	// 		Dep.target.addDep(this);
	// 	}
	// }

	notify() {
		// re-running all the targets
		this.subs.forEach(sub => sub.update());
	}
}
