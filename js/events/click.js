import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import devices from '../core/devices';
import domAdapter from '../core/dom_adapter';
import { resetActiveElement, contains, closestCommonParent } from '../core/utils/dom';
import { requestAnimationFrame, cancelAnimationFrame } from '../animation/frame';
import { addNamespace, fireEvent, eventDelta, eventData } from './utils/index';
import { subscribeNodesDisposing, unsubscribeNodesDisposing } from './utils/event_nodes_disposing';
import pointerEvents from './pointer';
import Emitter from './core/emitter';
import registerEmitter from './core/emitter_registrator';
import { compare as compareVersions } from '../core/utils/version';

const CLICK_EVENT_NAME = 'dxclick';
const TOUCH_BOUNDARY = 10;
const abs = Math.abs;

const isInput = function(element) {
    return $(element).is('input, textarea, select, button ,:focus, :focus *');
};

const misc = { requestAnimationFrame: requestAnimationFrame, cancelAnimationFrame: cancelAnimationFrame };

let ClickEmitter = Emitter.inherit({

    ctor: function(element) {
        this.callBase(element);

        this._makeElementClickable($(element));
    },

    _makeElementClickable: function($element) {
        if(!$element.attr('onclick')) {
            $element.attr('onclick', 'void(0)');
        }
    },

    start: function(e) {
        this._blurPrevented = e.isDefaultPrevented();
        this._startTarget = e.target;
        this._startEventData = eventData(e);
    },

    end: function(e) {
        if(this._eventOutOfElement(e, this.getElement().get(0)) || e.type === pointerEvents.cancel) {
            this._cancel(e);
            return;
        }

        if(!isInput(e.target) && !this._blurPrevented) {
            resetActiveElement();
        }

        this._accept(e);
        this._clickAnimationFrame = misc.requestAnimationFrame((function() {
            this._fireClickEvent(e);
        }).bind(this));
    },

    _eventOutOfElement: function(e, element) {
        const target = e.target;
        const targetChanged = !contains(element, target) && element !== target;

        const gestureDelta = eventDelta(eventData(e), this._startEventData);
        const boundsExceeded = abs(gestureDelta.x) > TOUCH_BOUNDARY || abs(gestureDelta.y) > TOUCH_BOUNDARY;

        return targetChanged || boundsExceeded;
    },

    _fireClickEvent: function(e) {
        this._fireEvent(CLICK_EVENT_NAME, e, {
            target: closestCommonParent(this._startTarget, e.target)
        });
    },

    dispose: function() {
        misc.cancelAnimationFrame(this._clickAnimationFrame);
    }

});


// NOTE: native strategy for desktop, iOS 9.3+, Android 5+
const realDevice = devices.real();
const useNativeClick =
        realDevice.generic ||
        realDevice.ios && compareVersions(realDevice.version, [9, 3]) >= 0 ||
        realDevice.android && compareVersions(realDevice.version, [5]) >= 0;

(function() {
    const NATIVE_CLICK_CLASS = 'dx-native-click';
    const isNativeClickEvent = function(target) {
        return useNativeClick || $(target).closest('.' + NATIVE_CLICK_CLASS).length;
    };


    let prevented = null;
    let lastFiredEvent = null;

    function onNodeRemove() {
        lastFiredEvent = null;
    }

    const clickHandler = function(e) {
        const originalEvent = e.originalEvent;
        const eventAlreadyFired = lastFiredEvent === originalEvent || originalEvent && originalEvent.DXCLICK_FIRED;
        const leftButton = !e.which || e.which === 1;

        if(leftButton && !prevented && isNativeClickEvent(e.target) && !eventAlreadyFired) {
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

    ClickEmitter = ClickEmitter.inherit({
        _makeElementClickable: function($element) {
            if(!isNativeClickEvent($element)) {
                this.callBase($element);
            }

            eventsEngine.on($element, 'click', clickHandler);
        },

        configure: function(data) {
            this.callBase(data);
            if(data.useNative) {
                this.getElement().addClass(NATIVE_CLICK_CLASS);
            }
        },

        start: function(e) {
            prevented = null;

            if(!isNativeClickEvent(e.target)) {
                this.callBase(e);
            }
        },

        end: function(e) {
            if(!isNativeClickEvent(e.target)) {
                this.callBase(e);
            }
        },

        cancel: function() {
            prevented = true;
        },

        dispose: function() {
            this.callBase();

            eventsEngine.off(this.getElement(), 'click', clickHandler);
        }
    });
})();


// NOTE: fixes native click blur on slow devices
(function() {
    const desktopDevice = devices.real().generic;

    if(!desktopDevice) {
        let startTarget = null;
        let blurPrevented = false;

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
    misc,
    useNativeClick
};
///#ENDDEBUG
