import { cancelAnimationFrame, requestAnimationFrame } from '@js/common/core/animation/frame';
import registerEmitter from '@js/common/core/events/core/emitter_registrator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import GestureEmitter from '@js/common/core/events/gesture/emitter.gesture';
import {
  addNamespace, eventData, eventDelta, isDxMouseWheelEvent, isMouseEvent,
} from '@js/common/core/events/utils/index';
import Class from '@js/core/class';
import devices from '@ts/core/m_devices';

const { abstract } = Class;

const realDevice = devices.real();

const SCROLL_EVENT = 'scroll';
const SCROLL_INIT_EVENT = 'dxscrollinit';
const SCROLL_START_EVENT = 'dxscrollstart';
const SCROLL_MOVE_EVENT = 'dxscroll';
const SCROLL_END_EVENT = 'dxscrollend';
const SCROLL_STOP_EVENT = 'dxscrollstop';
const SCROLL_CANCEL_EVENT = 'dxscrollcancel';

const Locker = Class.inherit((function () {
  const NAMESPACED_SCROLL_EVENT = addNamespace(SCROLL_EVENT, 'dxScrollEmitter');

  return {

    ctor(element) {
      this._element = element;

      this._locked = false;

      this._proxiedScroll = (e) => {
        if (!this._disposed) {
          this._scroll(e);
        }
      };
      eventsEngine.on(this._element, NAMESPACED_SCROLL_EVENT, this._proxiedScroll);
    },

    _scroll: abstract,

    check(e, callback) {
      if (this._locked) {
        callback();
      }
    },

    dispose() {
      this._disposed = true;
      eventsEngine.off(this._element, NAMESPACED_SCROLL_EVENT, this._proxiedScroll);
    },

  };
})());

const TimeoutLocker = Locker.inherit((function () {
  return {

    ctor(element, timeout) {
      this.callBase(element);

      this._timeout = timeout;
    },

    _scroll() {
      this._prepare();
      this._forget();
    },

    _prepare() {
      if (this._timer) {
        this._clearTimer();
      }
      this._locked = true;
    },

    _clearTimer() {
      clearTimeout(this._timer);
      this._locked = false;
      this._timer = null;
    },

    _forget() {
      const that = this;

      this._timer = setTimeout(() => {
        that._clearTimer();
      }, this._timeout);
    },

    dispose() {
      this.callBase();

      this._clearTimer();
    },

  };
})());

const WheelLocker = TimeoutLocker.inherit((function () {
  const WHEEL_UNLOCK_TIMEOUT = 400;

  return {

    ctor(element) {
      this.callBase(element, WHEEL_UNLOCK_TIMEOUT);

      this._lastWheelDirection = null;
    },

    check(e, callback) {
      this._checkDirectionChanged(e);

      this.callBase(e, callback);
    },

    _checkDirectionChanged(e) {
      if (!isDxMouseWheelEvent(e)) {
        this._lastWheelDirection = null;
        return;
      }

      const direction = e.shiftKey || false;
      const directionChange = this._lastWheelDirection !== null && direction !== this._lastWheelDirection;
      this._lastWheelDirection = direction;

      this._locked = this._locked && !directionChange;
    },

  };
})());

let PointerLocker = TimeoutLocker.inherit((function () {
  const POINTER_UNLOCK_TIMEOUT = 400;

  return {

    ctor(element) {
      this.callBase(element, POINTER_UNLOCK_TIMEOUT);
    },

  };
})());

(function () {
  const { ios: isIos, android: isAndroid } = realDevice;

  if (!(isIos || isAndroid)) {
    return;
  }

  PointerLocker = Locker.inherit((function () {
    return {

      _scroll() {
        this._locked = true;

        const that = this;
        cancelAnimationFrame(this._scrollFrame);
        this._scrollFrame = requestAnimationFrame(() => {
          that._locked = false;
        });
      },

      check(e, callback) {
        cancelAnimationFrame(this._scrollFrame);
        cancelAnimationFrame(this._checkFrame);

        const that = this;
        const { callBase } = this;
        this._checkFrame = requestAnimationFrame(() => {
          callBase.call(that, e, callback);

          that._locked = false;
        });
      },

      dispose() {
        this.callBase();

        cancelAnimationFrame(this._scrollFrame);
        cancelAnimationFrame(this._checkFrame);
      },

    };
  })());
}());

const ScrollEmitter = GestureEmitter.inherit((function () {
  const INERTIA_TIMEOUT = 100;
  const VELOCITY_CALC_TIMEOUT = 200;
  const FRAME_DURATION = Math.round(1000 / 60);

  return {

    ctor(element) {
      this.callBase.apply(this, arguments);
      this.direction = 'both';

      this._pointerLocker = new PointerLocker(element);
      this._wheelLocker = new WheelLocker(element);
    },

    validate() {
      return true;
    },

    configure(data) {
      if (data.scrollTarget) {
        this._pointerLocker.dispose();
        this._wheelLocker.dispose();
        this._pointerLocker = new PointerLocker(data.scrollTarget);
        this._wheelLocker = new WheelLocker(data.scrollTarget);
      }

      this.callBase(data);
    },

    _init(e) {
      this._wheelLocker.check(e, () => {
        if (isDxMouseWheelEvent(e)) {
          this._accept(e);
        }
      });

      this._pointerLocker.check(e, () => {
        const skipCheck = this.isNative && isMouseEvent(e);
        if (!isDxMouseWheelEvent(e) && !skipCheck) {
          this._accept(e);
        }
      });

      this._fireEvent(SCROLL_INIT_EVENT, e);

      this._prevEventData = eventData(e);
    },

    move(e) {
      this.callBase.apply(this, arguments);

      e.isScrollingEvent = this.isNative || e.isScrollingEvent;
    },

    _start(e) {
      this._savedEventData = eventData(e);

      this._fireEvent(SCROLL_START_EVENT, e);

      this._prevEventData = eventData(e);
    },

    _move(e) {
      const currentEventData: any = eventData(e);

      this._fireEvent(SCROLL_MOVE_EVENT, e, {
        delta: eventDelta(this._prevEventData, currentEventData),
      });

      const delta = eventDelta(this._savedEventData, currentEventData);
      if (delta.time > VELOCITY_CALC_TIMEOUT) {
        this._savedEventData = this._prevEventData;
      }

      this._prevEventData = eventData(e);
    },

    _end(e) {
      // @ts-expect-error
      const endEventDelta = eventDelta(this._prevEventData, eventData(e));
      let velocity = { x: 0, y: 0 };

      if (!isDxMouseWheelEvent(e) && endEventDelta.time < INERTIA_TIMEOUT) {
        const delta = eventDelta(this._savedEventData, this._prevEventData);
        const velocityMultiplier = FRAME_DURATION / delta.time;

        velocity = { x: delta.x * velocityMultiplier, y: delta.y * velocityMultiplier };
      }

      this._fireEvent(SCROLL_END_EVENT, e, {
        velocity,
      });
    },

    _stop(e) {
      this._fireEvent(SCROLL_STOP_EVENT, e);
    },

    cancel(e) {
      this.callBase.apply(this, arguments);

      this._fireEvent(SCROLL_CANCEL_EVENT, e);
    },

    dispose() {
      this.callBase.apply(this, arguments);

      this._pointerLocker.dispose();
      this._wheelLocker.dispose();
    },

    _clearSelection() {
      if (this.isNative) {
        return;
      }

      return this.callBase.apply(this, arguments);
    },

    _toggleGestureCover() {
      if (this.isNative) {
        return;
      }

      return this.callBase.apply(this, arguments);
    },

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
    SCROLL_CANCEL_EVENT,
  ],
});

export default {
  init: SCROLL_INIT_EVENT,
  start: SCROLL_START_EVENT,
  move: SCROLL_MOVE_EVENT,
  end: SCROLL_END_EVENT,
  stop: SCROLL_STOP_EVENT,
  cancel: SCROLL_CANCEL_EVENT,
  scroll: SCROLL_EVENT,
};
