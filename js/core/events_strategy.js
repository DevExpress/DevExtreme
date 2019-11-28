import Callbacks from "./utils/callbacks";
import { each } from "./utils/iterator";
import { isFunction, isPlainObject } from "./utils/type";

/**
 * @name EventsStrategy
 * @module core/events_strategy
 * @export EventsStrategy
 * @hidden
 */
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

    /**
     * @name EventsStrategyMethods.on
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @returns this
     */
    /**
     * @name EventsStrategyMethods.on
     * @publicName on(events)
     * @param1 events:object
     * @returns this
     */
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

    /**
     * @name EventsStrategyMethods.off
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    /**
     * @name EventsStrategyMethods.off
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     */
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
