import { each } from '@js/core/utils/iterator';
import { isFunction, isPlainObject } from '@js/core/utils/type';
import { Callbacks } from '@ts/core/utils/m_callbacks';

type EventHandler = Function;

type EventHandlers = Record<string, EventHandler | undefined>;

interface EventCallbacks {
  add: (fn?: EventHandler) => void;
  originalAdd?: (fn?: EventHandler) => void;
  remove: (fn?: EventHandler) => void;
  has: () => boolean;
  empty: () => void;
  fireWith: (context: unknown, args?: ArrayLike<unknown>) => void;
}

export interface EventsStrategyOptions {
  syncStrategy?: boolean;
}

export interface EventsStrategyInterface {
  on: (eventName: string | EventHandlers, eventHandler?: EventHandler) => void;
  off: (eventName: string, eventHandler?: EventHandler) => void;
  fireEvent: (eventName: string, eventArgs?: ArrayLike<unknown>) => unknown;
  hasEvent: (eventName: string) => boolean;
  dispose: () => void;
}

export class EventsStrategy implements EventsStrategyInterface {
  _events: Record<string, EventCallbacks>;

  _owner: unknown;

  _options: EventsStrategyOptions;

  constructor(owner: unknown, options: EventsStrategyOptions = {}) {
    this._events = {};
    this._owner = owner;
    this._options = options;
  }

  static create(
    owner: unknown,
    strategy?: EventsStrategyInterface | ((owner: unknown) => EventsStrategyInterface),
  ): EventsStrategyInterface {
    if (strategy) {
      return isFunction(strategy) ? strategy(owner) : strategy;
    }
    return new EventsStrategy(owner);
  }

  hasEvent(eventName: string): boolean {
    const callbacks = this._events[eventName];
    return callbacks ? callbacks.has() : false;
  }

  fireEvent(eventName: string, eventArgs?: ArrayLike<unknown>): unknown {
    const callbacks = this._events[eventName];
    if (callbacks) {
      callbacks.fireWith(this._owner, eventArgs);
    }
    return this._owner;
  }

  on(eventName: string | EventHandlers, eventHandler?: EventHandler): void {
    if (isPlainObject(eventName)) {
      each(eventName, (e, h) => {
        this.on(e, h);
      });
    } else {
      let callbacks = this._events[eventName];

      if (!callbacks) {
        callbacks = Callbacks({
          syncStrategy: this._options.syncStrategy,
        });
        this._events[eventName] = callbacks;
      }

      const addFn = callbacks.originalAdd || callbacks.add;
      addFn.call(callbacks, eventHandler);
    }
  }

  off(eventName: string, eventHandler?: EventHandler): void {
    const callbacks = this._events[eventName];
    if (callbacks) {
      if (isFunction(eventHandler)) {
        callbacks.remove(eventHandler);
      } else {
        callbacks.empty();
      }
    }
  }

  dispose(): void {
    each(this._events, (eventName, event) => {
      event.empty();
    });

    this._owner = null;
  }
}
