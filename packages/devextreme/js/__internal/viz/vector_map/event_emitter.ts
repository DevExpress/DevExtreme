/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-use-before-define */

import type { CallbackInterface } from '@ts/core/utils/callbacks';
import { Callbacks } from '@ts/core/utils/callbacks';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

type EventCallbacks = Record<string, CallbackInterface>;

interface EventEmitterHost {
  _eventNames: string[];
  _events: EventCallbacks | null;
}

const eventEmitterMethods = {
  _initEvents(this: EventEmitterHost): void {
    const names = this._eventNames;
    let i;
    const ii = names.length;
    const events = this._events = {};
    for (i = 0; i < ii; i += 1) {
      events[names[i]] = Callbacks();
    }
  },

  _disposeEvents(this: EventEmitterHost): void {
    const events = this._events as EventCallbacks;
    let name;
    for (name in events) {
      events[name].empty();
    }
    this._events = null;
  },

  on(this: EventEmitterHost, handlers: Record<string, (arg: ThemeValue) => void>): () => void {
    const events = this._events as EventCallbacks;
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

  _fire(this: EventEmitterHost, name: string, arg?: ThemeValue): void {
    (this._events as EventCallbacks)[name].fire(arg);
  },
};

export type EventEmitterMethods = typeof eventEmitterMethods;

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
