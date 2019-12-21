var DefaultEventsStrategy = require('./events_strategy'),
    each = require('./utils/iterator').each,
    isPlainObject = require('./utils/type').isPlainObject;

module.exports = {
    ctor: function() {
        this._events = {};
        this.setEventsStrategy(new DefaultEventsStrategy(this));
    },

    setEventsStrategy: function(strategy) {
        if(typeof strategy === 'function') {
            strategy = strategy(this);
        }

        this._eventsStrategy = strategy;
    },

    hasEvent: function(eventName) {
        return this._eventsStrategy.hasEvent(eventName);
    },

    fireEvent: function(eventName, eventArgs) {
        this._eventsStrategy.fireEvent(eventName, eventArgs);
        return this;
    },

    on: function(eventName, eventHandler) {
        if(isPlainObject(eventName)) {
            each(eventName, (function(e, h) { this.on(e, h); }).bind(this));
        } else {
            this._eventsStrategy.on(eventName, eventHandler);
        }

        return this;
    },

    off: function(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this;
    },

    _disposeEvents: function() {
        this._eventsStrategy.dispose();
    }
};
