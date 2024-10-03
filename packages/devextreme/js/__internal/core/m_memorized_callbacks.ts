import Callbacks from '@js/core/utils/callbacks';
import { each } from '@js/core/utils/iterator';

class MemorizedCallbacks {
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

export { MemorizedCallbacks };
