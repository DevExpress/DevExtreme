import eventsEngine from '../events/core/events_engine';
import domUtils from '../core/utils/dom';
import domAdapter from '../core/dom_adapter';
import Class from '../core/class';
import registerEvent from './core/event_registrator';
import { name as clickEventName } from './click';
import { addNamespace, fireEvent } from './utils';

const DBLCLICK_EVENT_NAME = 'dxdblclick';
const DBLCLICK_NAMESPACE = 'dxDblClick';
const NAMESPACED_CLICK_EVENT = addNamespace(clickEventName, DBLCLICK_NAMESPACE);

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
            fireEvent({
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

export { DBLCLICK_EVENT_NAME as name };
