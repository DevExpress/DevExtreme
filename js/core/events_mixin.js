"use strict";

var $ = require("jquery"),
    DefaultEventsStrategy = require("./events_strategy");

/**
 * @name EventsMixin
 * @publicName EventsMixin
 * @module core/events_mixin
 * @export default
 * @hidden
 */
module.exports = {
    ctor: function() {
        this._events = {};
        this.setEventsStrategy(new DefaultEventsStrategy(this));
    },

    setEventsStrategy: function(strategy) {
        this._eventsStrategy = strategy;
    },

    hasEvent: function(eventName) {
        return this._eventsStrategy.hasEvent(eventName);
    },

    fireEvent: function(eventName, eventArgs) {
        this._eventsStrategy.fireEvent(eventName, eventArgs);
        return this;
    },

    /**
     * @name EventsMixinMethods_on
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return object
     */
    /**
     * @name EventsMixinMethods_on
     * @publicName on(events)
     * @param1 events:object
     * @return object
     */
    on: function(eventName, eventHandler) {
        if($.isPlainObject(eventName)) {
            $.each(eventName, $.proxy(function(e, h) { this.on(e, h); }, this));
        } else {
            this._eventsStrategy.on(eventName, eventHandler);
        }

        return this;
    },

    /**
     * @name EventsMixinMethods_off
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return object
     */
    /**
     * @name EventsMixinMethods_off
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return object
     */
    off: function(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this;
    },

    _disposeEvents: function() {
        this._eventsStrategy.dispose();
    }
};
