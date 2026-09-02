import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  createEvent, eventData, eventDelta, isDxMouseWheelEvent,
  isMouseEvent, isTouchEvent, needSkipEvent,
} from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import callOnce from '@js/core/utils/call_once';
import { noop } from '@js/core/utils/common';
import { sign } from '@js/core/utils/math';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { styleProp } from '@js/core/utils/style';
import { isDefined } from '@js/core/utils/type';
import devices from '@ts/core/m_devices';
import domUtils from '@ts/core/utils/m_dom';
import type { EmitterConfigData, EmitterEvent, EventCoords } from '@ts/events/core/emitter';
import Emitter from '@ts/events/core/emitter';

const ready = readyCallbacks.add;
const { abs } = Math;

const SLEEP = 0;
const INITED = 1;
const STARTED = 2;

let TOUCH_BOUNDARY = 10;
const IMMEDIATE_TOUCH_BOUNDARY = 0;
const IMMEDIATE_TIMEOUT = 180;

// The gesture pipeline operates on pointer events that always carry
// page coordinates.
export type GestureEvent = EmitterEvent & {
  pageX: number;
  pageY: number;
};

export type GestureDirection = 'both' | 'horizontal' | 'vertical';

type GestureCover = (toggle: boolean, cursor: string) => void;

const supportPointerEvents = function (): string | undefined {
  const prop: string | undefined = styleProp('pointer-events');

  return prop;
};

const setGestureCover = callOnce((): GestureCover => {
  const GESTURE_COVER_CLASS = 'dx-gesture-cover';

  const isDesktop = devices.real().deviceType === 'desktop';

  if (!supportPointerEvents() || !isDesktop) {
    return noop;
  }

  const $cover = $('<div>')
    .addClass(GESTURE_COVER_CLASS)
    .css('pointerEvents', 'none');
  // @ts-expect-error subscribeGlobal is not declared in the public events engine type
  eventsEngine.subscribeGlobal($cover, 'dxmousewheel', (e) => {
    e.preventDefault();
  });

  ready(() => {
    // @ts-expect-error appendTo accepts a selector at runtime
    $cover.appendTo('body');
  });

  return function (toggle, cursor) {
    $cover.css('pointerEvents', toggle ? 'all' : 'none');
    if (toggle) {
      $cover.css('cursor', cursor);
    }
  };
});

const gestureCover = function (toggle: boolean, cursor: string): void {
  const gestureCoverStrategy: GestureCover = setGestureCover();
  gestureCoverStrategy(toggle, cursor);
};

class GestureEmitter extends Emitter {
  gesture = true;

  direction?: GestureDirection;

  immediate?: boolean;

  immediateTimeout?: number;

  _stage?: number;

  _startEvent!: GestureEvent;

  _startEventData!: EventCoords;

  _immediateTimer?: ReturnType<typeof setTimeout>;

  _immediateAccepted?: boolean;

  static initialTouchBoundary = TOUCH_BOUNDARY;

  static touchBoundary(newBoundary?: number): number | undefined {
    if (isDefined(newBoundary)) {
      TOUCH_BOUNDARY = newBoundary;
      return undefined;
    }

    return TOUCH_BOUNDARY;
  }

  configure(data: EmitterConfigData, eventName?: string): void {
    this.getElement().css('msTouchAction', data.immediate ? 'pinch-zoom' : '');

    super.configure(data, eventName);
  }

  allowInterruptionByMouseWheel(): boolean {
    return this._stage !== STARTED;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDirection(e?: EmitterEvent): GestureDirection | undefined {
    return this.direction;
  }

  _cancel(e?: EmitterEvent): void {
    super._cancel(e);

    this._toggleGestureCover(false);
    this._stage = SLEEP;
  }

  start(e: EmitterEvent): void {
    // T1328053: macOS Ctrl+click opens the system context menu. Kept out of needSkipEvent()
    // because importing m_devices into that low-level events util forces `new Devices()` into
    // early module init and breaks init order (resizeCallbacks stops firing).
    const isMacContextMenuClick = isMouseEvent(e) && Boolean(e.ctrlKey) && devices.real().mac;

    if (e._needSkipEvent || needSkipEvent(e) || isMacContextMenuClick) {
      this._cancel(e);
      return;
    }

    this._startEvent = createEvent(e);
    this._startEventData = eventData(e);

    this._stage = INITED;
    this._init(e);

    this._setupImmediateTimer();
  }

  _setupImmediateTimer(): void {
    clearTimeout(this._immediateTimer);
    this._immediateAccepted = false;

    if (!this.immediate) {
      return;
    }

    if (this.immediateTimeout === 0) {
      this._immediateAccepted = true;
      return;
    }

    this._immediateTimer = setTimeout(() => {
      this._immediateAccepted = true;
    }, this.immediateTimeout ?? IMMEDIATE_TIMEOUT);
  }

  move(e: EmitterEvent): void {
    if (this._stage === INITED && this._directionConfirmed(e)) {
      this._stage = STARTED;

      this._resetActiveElement();
      this._toggleGestureCover(true);
      this._clearSelection(e);

      this._adjustStartEvent(e);
      this._start(this._startEvent);

      if (this._stage === SLEEP) {
        return;
      }

      this._requestAccept(e);
      this._move(e);
      this._forgetAccept();
    } else if (this._stage === STARTED) {
      this._clearSelection(e);
      this._move(e);
    }
  }

  _directionConfirmed(e: EmitterEvent): boolean {
    const touchBoundary = this._getTouchBoundary(e);
    const delta: EventCoords = eventDelta(this._startEventData, eventData(e));
    const deltaX = abs(delta.x);
    const deltaY = abs(delta.y);

    const horizontalMove = this._validateMove(touchBoundary, deltaX, deltaY);
    const verticalMove = this._validateMove(touchBoundary, deltaY, deltaX);

    const direction = this.getDirection(e);
    const bothAccepted = direction === 'both' && (horizontalMove || verticalMove);
    const horizontalAccepted = direction === 'horizontal' && horizontalMove;
    const verticalAccepted = direction === 'vertical' && verticalMove;

    return Boolean(
      bothAccepted || horizontalAccepted || verticalAccepted || this._immediateAccepted,
    );
  }

  _validateMove(touchBoundary: number, mainAxis: number, crossAxis: number): boolean {
    return Boolean(mainAxis)
      && mainAxis >= touchBoundary
      && (this.immediate ? mainAxis >= crossAxis : true);
  }

  _getTouchBoundary(e: EmitterEvent): number {
    return this.immediate || isDxMouseWheelEvent(e) ? IMMEDIATE_TOUCH_BOUNDARY : TOUCH_BOUNDARY;
  }

  _adjustStartEvent(e: EmitterEvent): void {
    const touchBoundary = this._getTouchBoundary(e);
    const delta: EventCoords = eventDelta(this._startEventData, eventData(e));

    this._startEvent.pageX += sign(delta.x) * touchBoundary;
    this._startEvent.pageY += sign(delta.y) * touchBoundary;
  }

  _resetActiveElement(): void {
    if (devices.real().platform === 'ios' && this.getElement().find(':focus').length) {
      domUtils.resetActiveElement();
    }
  }

  _toggleGestureCover(toggle: boolean): void {
    this._toggleGestureCoverImpl(toggle);
  }

  _toggleGestureCoverImpl(toggle: boolean): void {
    const isStarted = this._stage === STARTED;

    if (isStarted) {
      gestureCover(toggle, this.getElement().css('cursor') as string);
    }
  }

  _clearSelection(e: EmitterEvent): void {
    if (isDxMouseWheelEvent(e) || isTouchEvent(e)) {
      return;
    }

    domUtils.clearSelection();
  }

  end(e: EmitterEvent): void {
    this._toggleGestureCover(false);

    if (this._stage === STARTED) {
      this._end(e);
    } else if (this._stage === INITED) {
      this._stop(e);
    }

    this._stage = SLEEP;
  }

  dispose(): void {
    clearTimeout(this._immediateTimer);
    super.dispose();
    this._toggleGestureCover(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _init(e: EmitterEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _start(e: EmitterEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _move(e: EmitterEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _stop(e: EmitterEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _end(e: EmitterEvent): void {}
}

export default GestureEmitter;
