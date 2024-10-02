import { each } from '../core/utils/iterator';
import Callbacks from './utils/callbacks';

export default class MemorizedCallbacks {
    constructor() {
        this.memory = [];
        this.callbacks = Callbacks();
    }

    add(fn) {
        each(this.memory, (_, item) => fn.apply(fn, item));
        this.callbacks.add(fn);
    }

    remove(fn) {
        this.callbacks.remove(fn);
    }

    fire(...args) {
        this.memory.push(args);
        this.callbacks.fire.apply(this.callbacks, args);
    }
}
