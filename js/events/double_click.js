var eventsEngine = require("../events/core/events_engine"),
    domUtils = require("../core/utils/dom"),
    domAdapter = require("../core/dom_adapter"),
    Class = require("../core/class"),
    registerEvent = require("./core/event_registrator"),
    clickEvent = require("./click"),
    eventUtils = require("./utils");

var DBLCLICK_EVENT_NAME = "dxdblclick",
    DBLCLICK_NAMESPACE = "dxDblClick",
    NAMESPACED_CLICK_EVENT = eventUtils.addNamespace(clickEvent.name, DBLCLICK_NAMESPACE),

    DBLCLICK_TIMEOUT = 500;


var DblClick = Class.inherit({

    ctor: function() {
        this._handlerCount = 0;
        this._forgetLastClick();
    },

    _forgetLastClick: function() {
        this._firstClickTarget = null;
        this._lastClickTimeStamp = -DBLCLICK_TIMEOUT;
    },

    add: function() {
        if(this._handlerCount <= 0) {
            eventsEngine.on(domAdapter.getDocument(), NAMESPACED_CLICK_EVENT, this._clickHandler.bind(this));
        }
        this._handlerCount++;
    },

    _clickHandler: function(e) {
        var timeStamp = e.timeStamp || Date.now();

        if(timeStamp - this._lastClickTimeStamp < DBLCLICK_TIMEOUT) {
            eventUtils.fireEvent({
                type: DBLCLICK_EVENT_NAME,
                target: domUtils.closestCommonParent(this._firstClickTarget, e.target),
                originalEvent: e
            });
            this._forgetLastClick();
        } else {
            this._firstClickTarget = e.target;
            this._lastClickTimeStamp = timeStamp;
        }
    },

    remove: function() {
        this._handlerCount--;
        if(this._handlerCount <= 0) {
            this._forgetLastClick();
            eventsEngine.off(domAdapter.getDocument(), NAMESPACED_CLICK_EVENT);
        }
    }

});

registerEvent(DBLCLICK_EVENT_NAME, new DblClick());

exports.name = DBLCLICK_EVENT_NAME;
