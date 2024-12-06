import Emitter from '@js/common/core/events/core/emitter';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  createEvent, eventData, eventDelta, isDxMouseWheelEvent, isTouchEvent, needSkipEvent,
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

const ready = readyCallbacks.add;
const { abs } = Math;

const SLEEP = 0;
const INITED = 1;
const STARTED = 2;

let TOUCH_BOUNDARY = 10;
const IMMEDIATE_TOUCH_BOUNDARY = 0;
const IMMEDIATE_TIMEOUT = 180;

const supportPointerEvents = function () {
  return styleProp('pointer-events');
};

const setGestureCover = callOnce(() => {
  const GESTURE_COVER_CLASS = 'dx-gesture-cover';

  const isDesktop = devices.real().deviceType === 'desktop';

  if (!supportPointerEvents() || !isDesktop) {
    return noop;
  }

  const $cover = $('<div>')
    .addClass(GESTURE_COVER_CLASS)
    .css('pointerEvents', 'none');
  // @ts-expect-error
  eventsEngine.subscribeGlobal($cover, 'dxmousewheel', (e) => {
    e.preventDefault();
  });

  ready(() => {
    // @ts-expect-error
    $cover.appendTo('body');
  });

  return function (toggle, cursor) {
    $cover.css('pointerEvents', toggle ? 'all' : 'none');
    toggle && $cover.css('cursor', cursor);
  };
});

const gestureCover = function (toggle, cursor) {
  const gestureCoverStrategy = setGestureCover();
  gestureCoverStrategy(toggle, cursor);
};

const GestureEmitter = Emitter.inherit({

  gesture: true,

  configure(data) {
    this.getElement().css('msTouchAction', data.immediate ? 'pinch-zoom' : '');

    this.callBase(data);
  },

  allowInterruptionByMouseWheel() {
    return this._stage !== STARTED;
  },

  getDirection() {
    return this.direction;
  },

  _cancel() {
    this.callBase.apply(this, arguments);

    this._toggleGestureCover(false);
    this._stage = SLEEP;
  },

  start(e) {
    if (e._needSkipEvent || needSkipEvent(e)) {
      this._cancel(e);
      return;
    }

    this._startEvent = createEvent(e);
    this._startEventData = eventData(e);

    this._stage = INITED;
    this._init(e);

    this._setupImmediateTimer();
  },

  _setupImmediateTimer() {
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
  },

  move(e) {
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
  },

  _directionConfirmed(e) {
    const touchBoundary = this._getTouchBoundary(e);
    // @ts-expect-error
    const delta = eventDelta(this._startEventData, eventData(e));
    const deltaX = abs(delta.x);
    const deltaY = abs(delta.y);

    const horizontalMove = this._validateMove(touchBoundary, deltaX, deltaY);
    const verticalMove = this._validateMove(touchBoundary, deltaY, deltaX);

    const direction = this.getDirection(e);
    const bothAccepted = direction === 'both' && (horizontalMove || verticalMove);
    const horizontalAccepted = direction === 'horizontal' && horizontalMove;
    const verticalAccepted = direction === 'vertical' && verticalMove;

    return bothAccepted || horizontalAccepted || verticalAccepted || this._immediateAccepted;
  },

  _validateMove(touchBoundary, mainAxis, crossAxis) {
    return mainAxis && mainAxis >= touchBoundary && (this.immediate ? mainAxis >= crossAxis : true);
  },

  _getTouchBoundary(e) {
    return this.immediate || isDxMouseWheelEvent(e) ? IMMEDIATE_TOUCH_BOUNDARY : TOUCH_BOUNDARY;
  },

  _adjustStartEvent(e) {
    const touchBoundary = this._getTouchBoundary(e);
    // @ts-expect-error
    const delta = eventDelta(this._startEventData, eventData(e));

    this._startEvent.pageX += sign(delta.x) * touchBoundary;
    this._startEvent.pageY += sign(delta.y) * touchBoundary;
  },

  _resetActiveElement() {
    if (devices.real().platform === 'ios' && this.getElement().find(':focus').length) {
      domUtils.resetActiveElement();
    }
  },

  _toggleGestureCover(toggle) {
    this._toggleGestureCoverImpl(toggle);
  },

  _toggleGestureCoverImpl(toggle) {
    const isStarted = this._stage === STARTED;

    if (isStarted) {
      gestureCover(toggle, this.getElement().css('cursor'));
    }
  },

  _clearSelection(e) {
    if (isDxMouseWheelEvent(e) || isTouchEvent(e)) {
      return;
    }

    domUtils.clearSelection();
  },

  end(e) {
    this._toggleGestureCover(false);

    if (this._stage === STARTED) {
      this._end(e);
    } else if (this._stage === INITED) {
      this._stop(e);
    }

    this._stage = SLEEP;
  },

  dispose() {
    clearTimeout(this._immediateTimer);
    this.callBase.apply(this, arguments);
    this._toggleGestureCover(false);
  },

  _init: noop,
  _start: noop,
  _move: noop,
  _stop: noop,
  _end: noop,

});
GestureEmitter.initialTouchBoundary = TOUCH_BOUNDARY;
GestureEmitter.touchBoundary = function (newBoundary) {
  if (isDefined(newBoundary)) {
    TOUCH_BOUNDARY = newBoundary;
    return;
  }

  return TOUCH_BOUNDARY;
};

export default GestureEmitter;
