import Callbacks from "./utils/callbacks";
import { each } from "./utils/iterator";
import { isFunction } from "./utils/type";

export class EventsStrategy {
    constructor(owner) {
        this._events = {};
        this._owner = owner;
    }
    static setEventsStrategy(owner, strategy) {
        if(strategy) {
            if(typeof strategy === "function") {
                return strategy(owner);
            }
            return strategy;
        } else {
            return new EventsStrategy(owner);
        }
    }

    hasEvent(eventName) {
        const callbacks = this._events[eventName];
        if(callbacks) {
            return callbacks.has();
        }
        return false;
    }

    fireEvent(eventName, eventArgs) {
        const callbacks = this._events[eventName];
        if(callbacks) {
            callbacks.fireWith(this._owner, eventArgs);
        }
        return this._owner;
    }

    on(eventName, eventHandler) {
        let callbacks = this._events[eventName];

        if(!callbacks) {
            callbacks = Callbacks();
            this._events[eventName] = callbacks;
        }

        const addFn = callbacks.originalAdd || callbacks.add;
        addFn.call(callbacks, eventHandler);
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
        each(this._events, function() {
            this.empty();
        });
    }
}
