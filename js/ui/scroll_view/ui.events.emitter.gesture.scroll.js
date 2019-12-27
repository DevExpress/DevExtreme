const eventsEngine = require('../../events/core/events_engine');
const Class = require('../../core/class');
const abstract = Class.abstract;
const eventUtils = require('../../events/utils');
const GestureEmitter = require('../../events/gesture/emitter.gesture');
const registerEmitter = require('../../events/core/emitter_registrator');
const animationFrame = require('../../animation/frame');
const realDevice = require('../../core/devices').real();
const compareVersions = require('../../core/utils/version').compare;


const SCROLL_INIT_EVENT = 'dxscrollinit';
const SCROLL_START_EVENT = 'dxscrollstart';
const SCROLL_MOVE_EVENT = 'dxscroll';
const SCROLL_END_EVENT = 'dxscrollend';
const SCROLL_STOP_EVENT = 'dxscrollstop';
const SCROLL_CANCEL_EVENT = 'dxscrollcancel';


const Locker = Class.inherit((function() {

    const NAMESPACED_SCROLL_EVENT = eventUtils.addNamespace('scroll', 'dxScrollEmitter');

    return {

        ctor: function(element) {
            this._element = element;

            this._locked = false;

            const that = this;
            this._proxiedScroll = function(e) { that._scroll(e); };
            eventsEngine.on(this._element, NAMESPACED_SCROLL_EVENT, this._proxiedScroll);
        },

        _scroll: abstract,

        check: function(e, callback) {
            if(this._locked) {
                callback();
            }
        },

        dispose: function() {
            eventsEngine.off(this._element, NAMESPACED_SCROLL_EVENT, this._proxiedScroll);
        }

    };

})());


const TimeoutLocker = Locker.inherit((function() {

    return {

        ctor: function(element, timeout) {
            this.callBase(element);

            this._timeout = timeout;
        },

        _scroll: function() {
            this._prepare();
            this._forget();
        },

        _prepare: function() {
            if(this._timer) {
                this._clearTimer();
            }
            this._locked = true;
        },

        _clearTimer: function() {
            clearTimeout(this._timer);
            this._locked = false;
            this._timer = null;
        },

        _forget: function() {
            const that = this;

            this._timer = setTimeout(function() {
                that._clearTimer();
            }, this._timeout);
        },

        dispose: function() {
            this.callBase();

            this._clearTimer();
        }

    };

})());


const WheelLocker = TimeoutLocker.inherit((function() {

    const WHEEL_UNLOCK_TIMEOUT = 400;

    return {

        ctor: function(element) {
            this.callBase(element, WHEEL_UNLOCK_TIMEOUT);

            this._lastWheelDirection = null;
        },

        check: function(e, callback) {
            this._checkDirectionChanged(e);

            this.callBase(e, callback);
        },

        _checkDirectionChanged: function(e) {
            if(!eventUtils.isDxMouseWheelEvent(e)) {
                this._lastWheelDirection = null;
                return;
            }

            const direction = e.shiftKey || false;
            const directionChange = this._lastWheelDirection !== null && direction !== this._lastWheelDirection;
            this._lastWheelDirection = direction;

            this._locked = this._locked && !directionChange;
        }

    };

})());


let PointerLocker = TimeoutLocker.inherit((function() {

    const POINTER_UNLOCK_TIMEOUT = 400;

    return {

        ctor: function(element) {
            this.callBase(element, POINTER_UNLOCK_TIMEOUT);
        }

    };

})());

(function() {
    const ios8_greater = realDevice.ios && compareVersions(realDevice.version, [8]) >= 0;
    const android5_greater = realDevice.android && compareVersions(realDevice.version, [5]) >= 0;

    if(!(ios8_greater || android5_greater)) {
        return;
    }

    PointerLocker = Locker.inherit((function() {

        return {

            _scroll: function() {
                this._locked = true;

                const that = this;
                animationFrame.cancelAnimationFrame(this._scrollFrame);
                this._scrollFrame = animationFrame.requestAnimationFrame(function() {
                    that._locked = false;
                });
            },

            check: function(e, callback) {
                animationFrame.cancelAnimationFrame(this._scrollFrame);
                animationFrame.cancelAnimationFrame(this._checkFrame);

                const that = this;
                const callBase = this.callBase;
                this._checkFrame = animationFrame.requestAnimationFrame(function() {
                    callBase.call(that, e, callback);

                    that._locked = false;
                });
            },

            dispose: function() {
                this.callBase();

                animationFrame.cancelAnimationFrame(this._scrollFrame);
                animationFrame.cancelAnimationFrame(this._checkFrame);
            }

        };

    })());

})();


const ScrollEmitter = GestureEmitter.inherit((function() {

    const INERTIA_TIMEOUT = 100;
    const VELOCITY_CALC_TIMEOUT = 200;
    const FRAME_DURATION = Math.round(1000 / 60);

    return {

        ctor: function(element) {
            this.callBase.apply(this, arguments);
            this.direction = 'both';

            this._pointerLocker = new PointerLocker(element);
            this._wheelLocker = new WheelLocker(element);
        },

        validate: function() {
            return true;
        },

        configure: function(data) {
            if(data.scrollTarget) {
                this._pointerLocker.dispose();
                this._wheelLocker.dispose();
                this._pointerLocker = new PointerLocker(data.scrollTarget);
                this._wheelLocker = new WheelLocker(data.scrollTarget);
            }

            this.callBase(data);
        },

        _init: function(e) {
            this._wheelLocker.check(e, function() {
                if(eventUtils.isDxMouseWheelEvent(e)) {
                    this._accept(e);
                }
            }.bind(this));

            this._pointerLocker.check(e, function() {
                const skipCheck = this.isNative && eventUtils.isMouseEvent(e);
                if(!eventUtils.isDxMouseWheelEvent(e) && !skipCheck) {
                    this._accept(e);
                }
            }.bind(this));

            this._fireEvent(SCROLL_INIT_EVENT, e);

            this._prevEventData = eventUtils.eventData(e);
        },

        move: function(e) {
            this.callBase.apply(this, arguments);

            e.isScrollingEvent = this.isNative || e.isScrollingEvent;
        },

        _start: function(e) {
            this._savedEventData = eventUtils.eventData(e);

            this._fireEvent(SCROLL_START_EVENT, e);

            this._prevEventData = eventUtils.eventData(e);
        },

        _move: function(e) {
            const currentEventData = eventUtils.eventData(e);

            this._fireEvent(SCROLL_MOVE_EVENT, e, {
                delta: eventUtils.eventDelta(this._prevEventData, currentEventData)
            });

            const eventDelta = eventUtils.eventDelta(this._savedEventData, currentEventData);
            if(eventDelta.time > VELOCITY_CALC_TIMEOUT) {
                this._savedEventData = this._prevEventData;
            }

            this._prevEventData = eventUtils.eventData(e);
        },

        _end: function(e) {
            const endEventDelta = eventUtils.eventDelta(this._prevEventData, eventUtils.eventData(e));
            let velocity = { x: 0, y: 0 };

            if(!eventUtils.isDxMouseWheelEvent(e) && endEventDelta.time < INERTIA_TIMEOUT) {
                const eventDelta = eventUtils.eventDelta(this._savedEventData, this._prevEventData);
                const velocityMultiplier = FRAME_DURATION / eventDelta.time;

                velocity = { x: eventDelta.x * velocityMultiplier, y: eventDelta.y * velocityMultiplier };
            }

            this._fireEvent(SCROLL_END_EVENT, e, {
                velocity: velocity
            });
        },

        _stop: function(e) {
            this._fireEvent(SCROLL_STOP_EVENT, e);
        },

        cancel: function(e) {
            this.callBase.apply(this, arguments);

            this._fireEvent(SCROLL_CANCEL_EVENT, e);
        },

        dispose: function() {
            this.callBase.apply(this, arguments);

            this._pointerLocker.dispose();
            this._wheelLocker.dispose();
        },

        _clearSelection: function() {
            if(this.isNative) {
                return;
            }

            return this.callBase.apply(this, arguments);
        },

        _toggleGestureCover: function() {
            if(this.isNative) {
                return;
            }

            return this.callBase.apply(this, arguments);
        }

    };

})());

registerEmitter({
    emitter: ScrollEmitter,
    events: [
        SCROLL_INIT_EVENT,
        SCROLL_START_EVENT,
        SCROLL_MOVE_EVENT,
        SCROLL_END_EVENT,
        SCROLL_STOP_EVENT,
        SCROLL_CANCEL_EVENT
    ]
});

module.exports = {
    init: SCROLL_INIT_EVENT,
    start: SCROLL_START_EVENT,
    move: SCROLL_MOVE_EVENT,
    end: SCROLL_END_EVENT,
    stop: SCROLL_STOP_EVENT,
    cancel: SCROLL_CANCEL_EVENT
};
