const eventsEngine = require('../events/core/events_engine');
const domUtils = require('../core/utils/dom');
const domAdapter = require('../core/dom_adapter');
const Class = require('../core/class');
const registerEvent = require('./core/event_registrator');
const clickEvent = require('./click');
const eventUtils = require('./utils');

const DBLCLICK_EVENT_NAME = 'dxdblclick';
const DBLCLICK_NAMESPACE = 'dxDblClick';
const NAMESPACED_CLICK_EVENT = eventUtils.addNamespace(clickEvent.name, DBLCLICK_NAMESPACE);

const DBLCLICK_TIMEOUT = 300;


const DblClick = Class.inherit({

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
        const timeStamp = e.timeStamp || Date.now();

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
