/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { Callbacks } from '@ts/core/utils/callbacks';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

const eventEmitterMethods = {
  _initEvents(): void {
    const names = this._eventNames;
    let i;
    const ii = names.length;
    const events = this._events = {};
    for (i = 0; i < ii; i += 1) {
      events[names[i]] = Callbacks();
    }
  },

  _disposeEvents(): void {
    const events = this._events;
    let name;
    for (name in events) {
      events[name].empty();
    }
    this._events = null;
  },

  on(handlers: Record<string, (arg: ThemeValue) => void>): () => void {
    const events = this._events;
    let name;
    for (name in handlers) {
      events[name].add(handlers[name]);
    }
    return dispose;
    function dispose(): void {
      for (name in handlers) {
        events[name].remove(handlers[name]);
      }
    }
  },

  _fire(name: string, arg?: ThemeValue): void {
    this._events[name].fire(arg);
  },
};

export function makeEventEmitter(target: { prototype: ThemeValue }): void {
  const proto = target.prototype;
  let name;
  for (name in eventEmitterMethods) {
    proto[name] = eventEmitterMethods[name];
  }
}

/// #DEBUG
export { eventEmitterMethods as _TESTS_eventEmitterMethods };
/// #ENDDEBUG
