const Callbacks = require('../../core/utils/callbacks');

const eventEmitterMethods = {
    _initEvents: function() {
        const names = this._eventNames;
        let i;
        const ii = names.length;
        const events = this._events = {};
        for(i = 0; i < ii; ++i) {
            events[names[i]] = Callbacks();
        }
    },

    _disposeEvents: function() {
        const events = this._events;
        let name;
        for(name in events) {
            events[name].empty();
        }
        this._events = null;
    },

    on: function(handlers) {
        const events = this._events;
        let name;
        for(name in handlers) {
            events[name].add(handlers[name]);
        }
        return dispose;
        function dispose() {
            for(name in handlers) {
                events[name].remove(handlers[name]);
            }
        }
    },

    _fire: function(name, arg) {
        this._events[name].fire(arg);
    }
};

exports.makeEventEmitter = function(target) {
    const proto = target.prototype;
    let name;
    for(name in eventEmitterMethods) {
        proto[name] = eventEmitterMethods[name];
    }
};

///#DEBUG
exports._TESTS_eventEmitterMethods = eventEmitterMethods;
///#ENDDEBUG
