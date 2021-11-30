import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import devices from '../core/devices';
import domAdapter from '../core/dom_adapter';
import { resetActiveElement } from '../core/utils/dom';
import { requestAnimationFrame, cancelAnimationFrame } from '../animation/frame';
import { addNamespace, fireEvent } from './utils/index';
import { subscribeNodesDisposing, unsubscribeNodesDisposing } from './utils/event_nodes_disposing';
import pointerEvents from './pointer';
import Emitter from './core/emitter';
import registerEmitter from './core/emitter_registrator';

const CLICK_EVENT_NAME = 'dxclick';

const misc = { requestAnimationFrame, cancelAnimationFrame };

let prevented = null;
let lastFiredEvent = null;

const onNodeRemove = () => {
    lastFiredEvent = null;
};

const clickHandler = function(e) {
    const originalEvent = e.originalEvent;
    const eventAlreadyFired = lastFiredEvent === originalEvent || originalEvent && originalEvent.DXCLICK_FIRED;
    const leftButton = !e.which || e.which === 1;

    if(leftButton && !prevented && !eventAlreadyFired) {
        if(originalEvent) {
            originalEvent.DXCLICK_FIRED = true;
        }

        unsubscribeNodesDisposing(lastFiredEvent, onNodeRemove);
        lastFiredEvent = originalEvent;
        subscribeNodesDisposing(lastFiredEvent, onNodeRemove);

        fireEvent({
            type: CLICK_EVENT_NAME,
            originalEvent: e
        });
    }
};

const ClickEmitter = Emitter.inherit({

    ctor: function(element) {
        this.callBase(element);
        eventsEngine.on(this.getElement(), 'click', clickHandler);
    },

    start: function(e) {
        prevented = null;
    },

    cancel: function() {
        prevented = true;
    },

    dispose: function() {
        eventsEngine.off(this.getElement(), 'click', clickHandler);
    }
});


// NOTE: fixes native click blur on slow devices
(function() {
    const desktopDevice = devices.real().generic;

    if(!desktopDevice) {
        let startTarget = null;
        let blurPrevented = false;

        const isInput = function(element) {
            return $(element).is('input, textarea, select, button ,:focus, :focus *');
        };

        const pointerDownHandler = function(e) {
            startTarget = e.target;
            blurPrevented = e.isDefaultPrevented();
        };

        const clickHandler = function(e) {
            const $target = $(e.target);
            if(!blurPrevented && startTarget && !$target.is(startTarget) && !$(startTarget).is('label') && isInput($target)) {
                resetActiveElement();
            }

            startTarget = null;
            blurPrevented = false;
        };

        const NATIVE_CLICK_FIXER_NAMESPACE = 'NATIVE_CLICK_FIXER';
        const document = domAdapter.getDocument();
        eventsEngine.subscribeGlobal(document, addNamespace(pointerEvents.down, NATIVE_CLICK_FIXER_NAMESPACE), pointerDownHandler);
        eventsEngine.subscribeGlobal(document, addNamespace('click', NATIVE_CLICK_FIXER_NAMESPACE), clickHandler);
    }
})();


/**
  * @name UI Events.dxclick
  * @type eventType
  * @type_function_param1 event:event
  * @module events/click
*/
registerEmitter({
    emitter: ClickEmitter,
    bubble: true,
    events: [
        CLICK_EVENT_NAME
    ]
});

export { CLICK_EVENT_NAME as name };

///#DEBUG
export {
    misc
};
///#ENDDEBUG
