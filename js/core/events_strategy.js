const Callbacks = require('./utils/callbacks');
const isFunction = require('./utils/type').isFunction;
const each = require('./utils/iterator').each;
const Class = require('./class');

module.exports = Class.inherit({
    ctor: function(owner) {
        this._events = {};
        this._owner = owner;
    },

    hasEvent: function(eventName) {
        const callbacks = this._events[eventName];
        if(callbacks) {
            return callbacks.has();
        }
        return false;
    },

    fireEvent: function(eventName, eventArgs) {
        const callbacks = this._events[eventName];
        if(callbacks) {
            callbacks.fireWith(this._owner, eventArgs);
        }
    },

    on: function(eventName, eventHandler) {
        let callbacks = this._events[eventName];
        let addFn;

        if(!callbacks) {
            callbacks = Callbacks();
            this._events[eventName] = callbacks;
        }
        addFn = callbacks.originalAdd || callbacks.add;
        addFn.call(callbacks, eventHandler);
    },

    off: function(eventName, eventHandler) {
        const callbacks = this._events[eventName];
        if(callbacks) {
            if(isFunction(eventHandler)) {
                callbacks.remove(eventHandler);
            } else {
                callbacks.empty();
            }
        }
    },

    dispose: function() {
        each(this._events, function() {
            this.empty();
        });
    }
});
