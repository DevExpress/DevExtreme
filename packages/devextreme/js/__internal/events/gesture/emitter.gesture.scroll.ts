/* eslint-disable max-classes-per-file */
import { cancelAnimationFrame, requestAnimationFrame } from '@js/common/core/animation/frame';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  addNamespace, eventData, eventDelta, isDxMouseWheelEvent, isMouseEvent,
} from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import devices from '@ts/core/m_devices';
import type { EmitterConfigData, EmitterEvent, EventCoords } from '@ts/events/core/emitter';
import registerEmitter from '@ts/events/core/emitter_registrator';
import GestureEmitter from '@ts/events/gesture/emitter.gesture';

const realDevice = devices.real();

const SCROLL_EVENT = 'scroll';
const SCROLL_INIT_EVENT = 'dxscrollinit';
const SCROLL_START_EVENT = 'dxscrollstart';
const SCROLL_MOVE_EVENT = 'dxscroll';
const SCROLL_END_EVENT = 'dxscrollend';
const SCROLL_STOP_EVENT = 'dxscrollstop';
const SCROLL_CANCEL_EVENT = 'dxscrollcancel';

const NAMESPACED_SCROLL_EVENT = addNamespace(SCROLL_EVENT, 'dxScrollEmitter');

const WHEEL_UNLOCK_TIMEOUT = 400;
const POINTER_UNLOCK_TIMEOUT = 400;

const INERTIA_TIMEOUT = 100;
const VELOCITY_CALC_TIMEOUT = 200;
const FRAME_DURATION = Math.round(1000 / 60);

type ScrollLockerElement = Element | dxElementWrapper;

type ScrollEvent = EmitterEvent & {
  isScrollingEvent?: boolean;
};

type ScrollConfigData = EmitterConfigData & {
  scrollTarget?: ScrollLockerElement;
};

abstract class Locker {
  _element: ScrollLockerElement;

  _locked: boolean;

  _disposed?: boolean;

  _proxiedScroll: (e: EmitterEvent) => void;

  constructor(element: ScrollLockerElement) {
    this._element = element;

    this._locked = false;

    this._proxiedScroll = (e): void => {
      if (!this._disposed) {
        this._scroll(e);
      }
    };
    eventsEngine.on(this._element, NAMESPACED_SCROLL_EVENT, this._proxiedScroll);
  }

  abstract _scroll(e: EmitterEvent): void;

  check(e: EmitterEvent, callback: () => void): void {
    if (this._locked) {
      callback();
    }
  }

  dispose(): void {
    this._disposed = true;
    eventsEngine.off(this._element, NAMESPACED_SCROLL_EVENT, this._proxiedScroll);
  }
}

class TimeoutLocker extends Locker {
  _timeout: number;

  _timer?: ReturnType<typeof setTimeout> | null;

  constructor(element: ScrollLockerElement, timeout: number) {
    super(element);

    this._timeout = timeout;
  }

  _scroll(): void {
    this._prepare();
    this._forget();
  }

  _prepare(): void {
    if (this._timer) {
      this._clearTimer();
    }
    this._locked = true;
  }

  _clearTimer(): void {
    clearTimeout(this._timer ?? undefined);
    this._locked = false;
    this._timer = null;
  }

  _forget(): void {
    this._timer = setTimeout(() => {
      this._clearTimer();
    }, this._timeout);
  }

  dispose(): void {
    super.dispose();

    this._clearTimer();
  }
}

class WheelLocker extends TimeoutLocker {
  _lastWheelDirection: boolean | null;

  constructor(element: ScrollLockerElement) {
    super(element, WHEEL_UNLOCK_TIMEOUT);

    this._lastWheelDirection = null;
  }

  check(e: EmitterEvent, callback: () => void): void {
    this._checkDirectionChanged(e);

    super.check(e, callback);
  }

  _checkDirectionChanged(e: EmitterEvent & { shiftKey?: boolean }): void {
    if (!isDxMouseWheelEvent(e)) {
      this._lastWheelDirection = null;
      return;
    }

    const direction = e.shiftKey || false;
    const directionChange = this._lastWheelDirection !== null
      && direction !== this._lastWheelDirection;
    this._lastWheelDirection = direction;

    this._locked = this._locked && !directionChange;
  }
}

class PointerTimeoutLocker extends TimeoutLocker {
  constructor(element: ScrollLockerElement) {
    super(element, POINTER_UNLOCK_TIMEOUT);
  }
}

// NOTE: on iOS and Android the pointer lock is released on the next animation
// frame instead of by a timeout.
class PointerFrameLocker extends Locker {
  _scrollFrame = -1;

  _checkFrame = -1;

  _scroll(): void {
    this._locked = true;

    cancelAnimationFrame(this._scrollFrame);
    this._scrollFrame = requestAnimationFrame(() => {
      this._locked = false;
    });
  }

  check(e: EmitterEvent, callback: () => void): void {
    cancelAnimationFrame(this._scrollFrame);
    cancelAnimationFrame(this._checkFrame);

    this._checkFrame = requestAnimationFrame(() => {
      super.check(e, callback);

      this._locked = false;
    });
  }

  dispose(): void {
    super.dispose();

    cancelAnimationFrame(this._scrollFrame);
    cancelAnimationFrame(this._checkFrame);
  }
}

const { ios: isIos, android: isAndroid } = realDevice;

const PointerLocker = isIos || isAndroid ? PointerFrameLocker : PointerTimeoutLocker;

class ScrollEmitter extends GestureEmitter {
  _pointerLocker: Locker;

  _wheelLocker: Locker;

  isNative?: boolean;

  _prevEventData!: EventCoords;

  _savedEventData!: EventCoords;

  constructor(element: Element) {
    super(element);
    this.direction = 'both';

    this._pointerLocker = new PointerLocker(element);
    this._wheelLocker = new WheelLocker(element);
  }

  validate(): boolean {
    return true;
  }

  configure(data: ScrollConfigData, eventName?: string): void {
    if (data.scrollTarget) {
      this._pointerLocker.dispose();
      this._wheelLocker.dispose();
      this._pointerLocker = new PointerLocker(data.scrollTarget);
      this._wheelLocker = new WheelLocker(data.scrollTarget);
    }

    super.configure(data, eventName);
  }

  _init(e: EmitterEvent): void {
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
  }

  move(e: ScrollEvent): void {
    super.move(e);

    e.isScrollingEvent = this.isNative || e.isScrollingEvent;
  }

  _start(e: EmitterEvent): void {
    this._savedEventData = eventData(e);

    this._fireEvent(SCROLL_START_EVENT, e);

    this._prevEventData = eventData(e);
  }

  _move(e: EmitterEvent): void {
    const currentEventData: EventCoords = eventData(e);

    this._fireEvent(SCROLL_MOVE_EVENT, e, {
      delta: eventDelta(this._prevEventData, currentEventData),
    });

    const delta: EventCoords = eventDelta(this._savedEventData, currentEventData);
    if (delta.time > VELOCITY_CALC_TIMEOUT) {
      this._savedEventData = this._prevEventData;
    }

    this._prevEventData = eventData(e);
  }

  _end(e: EmitterEvent): void {
    const endEventDelta: EventCoords = eventDelta(this._prevEventData, eventData(e));
    let velocity = { x: 0, y: 0 };

    if (!isDxMouseWheelEvent(e) && endEventDelta.time < INERTIA_TIMEOUT) {
      const delta: EventCoords = eventDelta(this._savedEventData, this._prevEventData);
      const velocityMultiplier = FRAME_DURATION / delta.time;

      velocity = { x: delta.x * velocityMultiplier, y: delta.y * velocityMultiplier };
    }

    this._fireEvent(SCROLL_END_EVENT, e, {
      velocity,
    });
  }

  _stop(e: EmitterEvent): void {
    this._fireEvent(SCROLL_STOP_EVENT, e);
  }

  cancel(e: EmitterEvent): void {
    super.cancel(e);

    this._fireEvent(SCROLL_CANCEL_EVENT, e);
  }

  dispose(): void {
    super.dispose();

    this._pointerLocker.dispose();
    this._wheelLocker.dispose();
  }

  _clearSelection(e: EmitterEvent): void {
    if (this.isNative) {
      return;
    }

    super._clearSelection(e);
  }

  _toggleGestureCover(toggle: boolean): void {
    if (this.isNative) {
      return;
    }

    super._toggleGestureCover(toggle);
  }
}

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
