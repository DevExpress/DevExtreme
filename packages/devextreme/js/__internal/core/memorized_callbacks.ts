import Callbacks from '@js/core/utils/callbacks';
import { each } from '@js/core/utils/iterator';

import type { CallbackInterface } from './utils/m_callbacks';

type MemorizedHandler = Parameters<CallbackInterface['add']>[0];

type MemorizedInvoke = (this: unknown, ...args: unknown[]) => void;

class MemorizedCallbacks {
  memory: unknown[][];

  callbacks: CallbackInterface;

  constructor() {
    this.memory = [];
    this.callbacks = Callbacks();
  }

  add(fn: MemorizedHandler): void {
    each(this.memory, (_, item) => (fn as MemorizedInvoke).apply(fn, item));
    this.callbacks.add(fn);
  }

  remove(fn: MemorizedHandler): void {
    this.callbacks.remove(fn);
  }

  fire(...args: unknown[]): void {
    this.memory.push(args);
    this.callbacks.fire(...args);
  }
}

export { MemorizedCallbacks };
