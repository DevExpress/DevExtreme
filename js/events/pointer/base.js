var eventsEngine = require("../../events/core/events_engine"),
    browser = require("../../core/utils/browser"),
    domAdapter = require("../../core/dom_adapter").default,
    Class = require("../../core/class"),
    eventUtils = require("../utils");

var POINTER_EVENTS_NAMESPACE = "dxPointerEvents";


var BaseStrategy = Class.inherit({

    ctor: function(eventName, originalEvents) {
        this._eventName = eventName;
        this._originalEvents = eventUtils.addNamespace(originalEvents, POINTER_EVENTS_NAMESPACE);
        this._handlerCount = 0;
        this.noBubble = this._isNoBubble();
    },

    _isNoBubble: function() {
        var eventName = this._eventName;

        return eventName === "dxpointerenter" ||
               eventName === "dxpointerleave";
    },

    _handler: function(e) {
        var delegateTarget = this._getDelegateTarget(e);

        return this._fireEvent({
            type: this._eventName,
            pointerType: e.pointerType || eventUtils.eventSource(e),
            originalEvent: e,
            delegateTarget: delegateTarget,
            // NOTE: TimeStamp normalization (FF bug #238041) (T277118)
            timeStamp: browser.mozilla ? (new Date()).getTime() : e.timeStamp
        });
    },

    _getDelegateTarget: function(e) {
        var delegateTarget;

        if(this.noBubble) {
            delegateTarget = e.delegateTarget;
        }

        return delegateTarget;
    },

    _fireEvent: function(args) {
        return eventUtils.fireEvent(args);
    },

    _setSelector: function(handleObj) {
        this._selector = this.noBubble && handleObj ? handleObj.selector : null;
    },

    _getSelector: function() {
        return this._selector;
    },

    setup: function() {
        return true;
    },

    add: function(element, handleObj) {
        if(this._handlerCount <= 0 || this.noBubble) {
            element = this.noBubble ? element : domAdapter.getDocument();
            this._setSelector(handleObj);

            var that = this;
            eventsEngine.on(element, this._originalEvents, this._getSelector(), function(e) {
                that._handler(e);
            });
        }

        if(!this.noBubble) {
            this._handlerCount++;
        }
    },

    remove: function(handleObj) {
        this._setSelector(handleObj);

        if(!this.noBubble) {
            this._handlerCount--;
        }
    },

    teardown: function(element) {
        if(this._handlerCount && !this.noBubble) {
            return;
        }

        element = this.noBubble ? element : domAdapter.getDocument();

        if(this._originalEvents !== "." + POINTER_EVENTS_NAMESPACE) {
            eventsEngine.off(element, this._originalEvents, this._getSelector());
        }
    },

    dispose: function(element) {
        element = this.noBubble ? element : domAdapter.getDocument();

        eventsEngine.off(element, this._originalEvents);
    }
});

module.exports = BaseStrategy;
