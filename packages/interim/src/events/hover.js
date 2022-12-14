import eventsEngine from '../events/core/events_engine';
import { removeData, data as elementData } from '../core/element_data';
import Class from '../core/class';
import devices from '../core/devices';
import registerEvent from './core/event_registrator';
import { addNamespace, isTouchEvent, fireEvent } from './utils/index';
import pointerEvents from './pointer';

const HOVERSTART_NAMESPACE = 'dxHoverStart';
const HOVERSTART = 'dxhoverstart';
const POINTERENTER_NAMESPACED_EVENT_NAME = addNamespace(pointerEvents.enter, HOVERSTART_NAMESPACE);

const HOVEREND_NAMESPACE = 'dxHoverEnd';
const HOVEREND = 'dxhoverend';
const POINTERLEAVE_NAMESPACED_EVENT_NAME = addNamespace(pointerEvents.leave, HOVEREND_NAMESPACE);


const Hover = Class.inherit({

    noBubble: true,

    ctor: function() {
        this._handlerArrayKeyPath = this._eventNamespace + '_HandlerStore';
    },

    setup: function(element) {
        elementData(element, this._handlerArrayKeyPath, {});
    },

    add: function(element, handleObj) {
        const that = this;
        const handler = function(e) {
            that._handler(e);
        };

        eventsEngine.on(element, this._originalEventName, handleObj.selector, handler);
        elementData(element, this._handlerArrayKeyPath)[handleObj.guid] = handler;
    },

    _handler: function(e) {
        if(isTouchEvent(e) || devices.isSimulator()) {
            return;
        }

        fireEvent({
            type: this._eventName,
            originalEvent: e,
            delegateTarget: e.delegateTarget
        });
    },

    remove: function(element, handleObj) {
        const handler = elementData(element, this._handlerArrayKeyPath)[handleObj.guid];

        eventsEngine.off(element, this._originalEventName, handleObj.selector, handler);
    },

    teardown: function(element) {
        removeData(element, this._handlerArrayKeyPath);
    }

});

const HoverStart = Hover.inherit({

    ctor: function() {
        this._eventNamespace = HOVERSTART_NAMESPACE;
        this._eventName = HOVERSTART;
        this._originalEventName = POINTERENTER_NAMESPACED_EVENT_NAME;
        this.callBase();
    },

    _handler: function(e) {
        const pointers = e.pointers || [];
        if(!pointers.length) {
            this.callBase(e);
        }
    }

});

const HoverEnd = Hover.inherit({

    ctor: function() {
        this._eventNamespace = HOVEREND_NAMESPACE;
        this._eventName = HOVEREND;
        this._originalEventName = POINTERLEAVE_NAMESPACED_EVENT_NAME;
        this.callBase();
    }

});

/**
 * @name UI Events.dxhoverstart
 * @type eventType
 * @type_function_param1 event:event
 * @module events/hover
*/

/**
 * @name UI Events.dxhoverend
 * @type eventType
 * @type_function_param1 event:event
 * @module events/hover
*/

registerEvent(HOVERSTART, new HoverStart());
registerEvent(HOVEREND, new HoverEnd());

export {
    HOVERSTART as start,
    HOVEREND as end
};
