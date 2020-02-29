import Callbacks from './utils/callbacks';
import { each } from './utils/iterator';
import { isFunction, isPlainObject } from './utils/type';

export class EventsStrategy {
    constructor(owner) {
        this._events = {};
        this._owner = owner;
    }
    static create(owner, strategy) {
        if(strategy) {
            return isFunction(strategy) ? strategy(owner) : strategy;
        } else {
            return new EventsStrategy(owner);
        }
    }

    hasEvent(eventName) {
        const callbacks = this._events[eventName];
        return callbacks ? callbacks.has() : false;
    }

    fireEvent(eventName, eventArgs) {
        const callbacks = this._events[eventName];
        if(callbacks) {
            callbacks.fireWith(this._owner, eventArgs);
        }
        return this._owner;
    }

    on(eventName, eventHandler) {
        if(isPlainObject(eventName)) {
            each(eventName, (e, h) => {
                this.on(e, h);
            });
        } else {
            let callbacks = this._events[eventName];

            if(!callbacks) {
                callbacks = Callbacks();
                this._events[eventName] = callbacks;
            }

            const addFn = callbacks.originalAdd || callbacks.add;
            addFn.call(callbacks, eventHandler);
        }
    }

    off(eventName, eventHandler) {
        const callbacks = this._events[eventName];
        if(callbacks) {
            if(isFunction(eventHandler)) {
                callbacks.remove(eventHandler);
            } else {
                callbacks.empty();
            }
        }
    }

    dispose() {
        each(this._events, (eventName, event) => {
            event.empty();
        });
    }
}
