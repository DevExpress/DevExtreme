/* eslint-disable import/no-import-module-exports */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable max-classes-per-file */

import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as wheelEventName } from '@js/common/core/events/core/wheel';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import { getNavigator, hasProperty } from '@js/core/utils/window';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { parseScalar } from '@ts/viz/core/utils';
import { makeEventEmitter } from '@ts/viz/vector_map/event_emitter';

const navigator = getNavigator();
const _math = Math;
const _abs = _math.abs;
const _sqrt = _math.sqrt;
const _round = _math.round;
const _addNamespace = addNamespace;

const _NAME = 'dxVectorMap';
const EVENT_START = 'start';
const EVENT_MOVE = 'move';
const EVENT_END = 'end';
const EVENT_ZOOM = 'zoom';
const EVENT_HOVER_ON = 'hover-on';
const EVENT_HOVER_OFF = 'hover-off';
const EVENT_CLICK = 'click';
const EVENT_FOCUS_ON = 'focus-on';
const EVENT_FOCUS_MOVE = 'focus-move';
const EVENT_FOCUS_OFF = 'focus-off';

const CLICK_TIME_THRESHOLD = 500;
const CLICK_COORD_THRESHOLD_MOUSE = 5;
const CLICK_COORD_THRESHOLD_TOUCH = 20;
const DRAG_COORD_THRESHOLD_MOUSE = 5;
const DRAG_COORD_THRESHOLD_TOUCH = 10;
const WHEEL_COOLDOWN = 50;
const WHEEL_DIRECTION_COOLDOWN = 300;

interface EventNames {
  start: string;
  move: string;
  end: string;
  wheel: string;
}

interface Coords {
  x: number;
  y: number;
}

type EventHandler = (event: ThemeValue) => void;

type FireCallback = (name: string, arg: ThemeValue) => void;

interface TrackerProjection {
  on: (handlers: { center: () => void; zoom: () => void }) => () => void;
}

interface TrackerParams {
  root: ThemeValue;
  projection: TrackerProjection;
  dataKey: string;
}

interface TrackerOptions {
  touchEnabled?: boolean;
  wheelEnabled?: boolean;
}

interface ClickState extends Coords {
  threshold: number;
  time: number;
}

interface DragState extends Coords {
  data: ThemeValue;
  active?: boolean;
}

let EVENTS: EventNames;

setupEvents();

export let Tracker = class Tracker {
  declare _root: ThemeValue;

  declare _focus: InstanceType<typeof Focus>;

  declare _docHandlers: Record<string, EventHandler>;

  declare _rootHandlers: Record<string, EventHandler>;

  declare _wheelLock: ThemeValue;

  declare _clickState: ClickState | null;

  declare _dragState: DragState | null;

  declare _zoomState: ThemeValue;

  declare _hoverState: { data: ThemeValue } | null;

  declare _hoverTarget: ThemeValue;

  declare _isTouchEnabled: boolean;

  declare _isWheelEnabled: boolean;

  declare _eventNames: string[];

  declare _initEvents: () => void;

  declare _disposeEvents: () => void;

  declare _fire: (name: string, arg?: ThemeValue) => void;

  declare on: (handlers: Record<string, (arg: ThemeValue) => void>) => () => void;

  constructor(parameters: TrackerParams) {
    this._root = parameters.root;
    this._createEventHandlers(parameters.dataKey);
    this._createProjectionHandlers(parameters.projection);
    this._initEvents();
    this._focus = new Focus((name, arg) => {
      this._fire(name, arg);
    });
    this._attachHandlers();
  }

  dispose(): void {
    this._detachHandlers();
    this._disposeEvents();
    this._focus.dispose();
    // @ts-expect-error dispose releases the root, the focus and the handlers
    this._root = this._focus = this._docHandlers = this._rootHandlers = null;
  }

  _startClick(event: ThemeValue, data: ThemeValue): void {
    if (!data) { return; }
    const coords = getEventCoords(event);
    this._clickState = {
      x: coords.x,
      y: coords.y,
      threshold: isTouchEvent(event) ? CLICK_COORD_THRESHOLD_TOUCH : CLICK_COORD_THRESHOLD_MOUSE,
      time: Date.now(),
    };
  }

  _endClick(event: ThemeValue, data: ThemeValue): void {
    const state = this._clickState;
    let threshold;
    let coords;

    if (!state) { return; }

    if (data && Date.now() - state.time <= CLICK_TIME_THRESHOLD) {
      threshold = state.threshold;
      coords = getEventCoords(event);
      if (_abs(coords.x - state.x) <= threshold && _abs(coords.y - state.y) <= threshold) {
        this._fire(EVENT_CLICK, {
          data, x: coords.x, y: coords.y, $event: event,
        });
      }
    }
    this._clickState = null;
  }

  _startDrag(event: ThemeValue, data: ThemeValue): void {
    if (!data) { return; }
    const coords = getEventCoords(event);
    const state = this._dragState = { x: coords.x, y: coords.y, data };
    this._fire(EVENT_START, { x: state.x, y: state.y, data: state.data });
  }

  _moveDrag(event: ThemeValue, data: ThemeValue): void {
    const state = this._dragState;

    if (!state) { return; }

    const coords = getEventCoords(event);
    const threshold = isTouchEvent(event) ? DRAG_COORD_THRESHOLD_TOUCH : DRAG_COORD_THRESHOLD_MOUSE;
    if (state.active || _abs(coords.x - state.x) > threshold || _abs(coords.y - state.y) > threshold) {
      state.x = coords.x;
      state.y = coords.y;
      state.active = true;
      state.data = data || {};
      this._fire(EVENT_MOVE, { x: state.x, y: state.y, data: state.data });
    }
  }

  _endDrag(): void {
    const state = this._dragState;
    if (!state) { return; }
    this._dragState = null;
    this._fire(EVENT_END, { x: state.x, y: state.y, data: state.data });
  }

  _wheelZoom(event: ThemeValue, data: ThemeValue): void {
    if (!data) { return; }
    const lock = this._wheelLock;
    const time = Date.now();

    if (time - lock.time <= WHEEL_COOLDOWN) { return; }
    // T136650
    if (time - lock.dirTime > WHEEL_DIRECTION_COOLDOWN) {
      lock.dir = 0;
    }
    // T107589, T136650
    const delta = adjustWheelDelta(event.delta / 120 || 0, lock);

    if (delta === 0) { return; }

    const coords = getEventCoords(event);
    this._fire(EVENT_ZOOM, { delta, x: coords.x, y: coords.y });
    lock.time = lock.dirTime = time;
  }

  _startZoom(event: ThemeValue, data: ThemeValue): void {
    if (!isTouchEvent(event) || !data) {
      return;
    }

    const state = this._zoomState = this._zoomState || {};
    let coords;
    let pointer2;

    if (state.pointer1 && state.pointer2) { return; }

    if (state.pointer1 === undefined) {
      state.pointer1 = getPointerId(event) || 0;
      coords = getMultitouchEventCoords(event, state.pointer1);
      state.x1 = state.x1_0 = coords.x;
      state.y1 = state.y1_0 = coords.y;
    }
    if (state.pointer2 === undefined) {
      pointer2 = getPointerId(event) || 1;
      if (pointer2 !== state.pointer1) {
        coords = getMultitouchEventCoords(event, pointer2);
        if (coords) {
          state.x2 = state.x2_0 = coords.x;
          state.y2 = state.y2_0 = coords.y;
          state.pointer2 = pointer2;
          state.ready = true;
          this._endDrag();
        }
      }
    }
  }

  _moveZoom(event: ThemeValue): void {
    const state = this._zoomState;
    let coords;

    if (!state || !isTouchEvent(event)) {
      return;
    }

    if (state.pointer1 !== undefined) {
      coords = getMultitouchEventCoords(event, state.pointer1);
      if (coords) {
        state.x1 = coords.x;
        state.y1 = coords.y;
      }
    }
    if (state.pointer2 !== undefined) {
      coords = getMultitouchEventCoords(event, state.pointer2);
      if (coords) {
        state.x2 = coords.x;
        state.y2 = coords.y;
      }
    }
  }

  _endZoom(event: ThemeValue): void {
    const state = this._zoomState;
    let startDistance;
    let currentDistance;

    if (!state || !isTouchEvent(event)) {
      return;
    }

    if (state.ready) {
      startDistance = getDistance(state.x1_0, state.y1_0, state.x2_0, state.y2_0);
      currentDistance = getDistance(state.x1, state.y1, state.x2, state.y2);
      this._fire(EVENT_ZOOM, { ratio: currentDistance / startDistance, x: (state.x1_0 + state.x2_0) / 2, y: (state.y1_0 + state.y2_0) / 2 });
    }
    this._zoomState = null;
  }

  _startHover(event: ThemeValue, data: ThemeValue): void {
    this._doHover(event, data, true);
  }

  _moveHover(event: ThemeValue, data: ThemeValue): void {
    this._doHover(event, data, false);
  }

  _doHover(event: ThemeValue, data: ThemeValue, isTouch: boolean): void {
    if ((this._dragState && this._dragState.active) || (this._zoomState && this._zoomState.ready)) {
      this._cancelHover();
      return;
    }

    if (isTouchEvent(event) !== isTouch || this._hoverTarget === event.target || (this._hoverState && this._hoverState.data === data)) {
      return;
    }

    this._cancelHover();
    if (data) {
      this._hoverState = { data };
      this._fire(EVENT_HOVER_ON, { data });
    }
    this._hoverTarget = event.target;
  }

  _cancelHover(): void {
    const state = this._hoverState;
    this._hoverState = this._hoverTarget = null;
    if (state) {
      this._fire(EVENT_HOVER_OFF, { data: state.data });
    }
  }

  _startFocus(event: ThemeValue, data: ThemeValue): void {
    this._doFocus(event, data, true);
  }

  _moveFocus(event: ThemeValue, data: ThemeValue): void {
    this._doFocus(event, data, false);
  }

  _doFocus(event: ThemeValue, data: ThemeValue, isTouch: boolean): void {
    if ((this._dragState && this._dragState.active) || (this._zoomState && this._zoomState.ready)) {
      this._cancelFocus();
      return;
    }

    if (isTouchEvent(event) !== isTouch) { return; }

    this._focus.turnOff();
    data && this._focus.turnOn(data, getEventCoords(event));
  }

  _cancelFocus(): void {
    this._focus.cancel();
  }

  _createEventHandlers(DATA_KEY: string): void {
    const that = this;

    that._docHandlers = {};
    that._rootHandlers = {};

    that._docHandlers[EVENTS.start] = function (event): void {
      const isTouch = isTouchEvent(event);
      const data = getData(event);

      if (isTouch && !that._isTouchEnabled) { return; }
      if (data) {
        event.preventDefault();
      }

      that._startClick(event, data);
      that._startDrag(event, data);
      that._startZoom(event, data);
      that._startHover(event, data);
      that._startFocus(event, data);
    };

    that._docHandlers[EVENTS.move] = function (event): void {
      const isTouch = isTouchEvent(event);
      const data = getData(event);

      if (isTouch && !that._isTouchEnabled) { return; }

      that._moveDrag(event, data);
      that._moveZoom(event);
      that._moveHover(event, data);
      that._moveFocus(event, data);
    };

    that._docHandlers[EVENTS.end] = function (event): void {
      const isTouch = isTouchEvent(event);
      const data = getData(event);

      if (isTouch && !that._isTouchEnabled) { return; }

      that._endClick(event, data);
      that._endDrag();
      that._endZoom(event);
    };

    that._rootHandlers[EVENTS.wheel] = function (event): void {
      that._cancelFocus();

      if (!that._isWheelEnabled) { return; }

      const data = getData(event);
      if (data) {
        event.preventDefault();
        event.stopPropagation(); // T249548
        that._wheelZoom(event, data);
      }
    };
    that._wheelLock = { dir: 0 };

    // Actually it is responsibility of the text element wrapper to handle "data" to its span elements (if there are any).
    // Now to avoid not so necessary complication of renderer text-span issue is handled on the side of the tracker.
    function getData(event: ThemeValue): ThemeValue {
      const target = event.target;
      return (target.tagName === 'tspan' ? target.parentNode : target)[DATA_KEY];
    }
  }

  _createProjectionHandlers(projection: TrackerProjection): void {
    const that = this;
    projection.on({ center: handler, zoom: handler }); // T247841
    function handler(): void {
      // `_cancelHover` probably should also be called here but for now let it not be so
      that._cancelFocus();
    }
  }

  reset(): void {
    this._clickState = null;
    this._endDrag();
    this._cancelHover();
    this._cancelFocus();
  }

  setOptions(options: TrackerOptions): void {
    this.reset();
    this._detachHandlers();
    this._isTouchEnabled = !!parseScalar(options.touchEnabled, true);
    this._isWheelEnabled = !!parseScalar(options.wheelEnabled, true);
    this._attachHandlers();
  }

  _detachHandlers(): void {
    if (this._isTouchEnabled) {
      this._root.css({ 'touch-action': '', '-webkit-user-select': '' })
        .off(_addNamespace('MSHoldVisual', _NAME))
        .off(_addNamespace('contextmenu', _NAME));
    }
    eventsEngine.off(domAdapter.getDocument(), this._docHandlers);
    this._root.off(this._rootHandlers);
  }

  _attachHandlers(): void {
    if (this._isTouchEnabled) {
      this._root.css({ 'touch-action': 'none', '-webkit-user-select': 'none' })
        .on(_addNamespace('MSHoldVisual', _NAME), (event) => {
          event.preventDefault();
        })
        .on(_addNamespace('contextmenu', _NAME), (event) => {
          isTouchEvent(event) && event.preventDefault();
        });
    }
    // @ts-expect-error eventsEngine.on also accepts an (event name -> handler) map, its d.ts lacks that overload
    eventsEngine.on(domAdapter.getDocument(), this._docHandlers);
    this._root.on(this._rootHandlers);
  }
};

Object.assign(Tracker.prototype, {
  _eventNames: [
    EVENT_START, EVENT_MOVE, EVENT_END, EVENT_ZOOM, EVENT_CLICK,
    EVENT_HOVER_ON, EVENT_HOVER_OFF,
    EVENT_FOCUS_ON, EVENT_FOCUS_OFF, EVENT_FOCUS_MOVE,
  ],
});

let Focus = class Focus {
  declare dispose: () => void;

  declare turnOn: (data: ThemeValue, coords: Coords) => void;

  declare turnOff: () => void;

  declare cancel: () => void;

  constructor(fire: FireCallback) {
    let that = this;
    let _activeData: ThemeValue = null;
    let _data: ThemeValue = null;
    let _disabled = false;
    let _x;
    let _y;

    that.dispose = function (): void {
      // @ts-expect-error dispose releases the methods, the callback and the state
      that.turnOn = that.turnOff = that.cancel = that.dispose = that = fire = _activeData = _data = null;
    };
    that.turnOn = function (data, coords): void {
      if (data === _data && _disabled) { return; }
      _disabled = false;
      _data = data;
      if (_activeData) {
        _x = coords.x;
        _y = coords.y;
        if (_data === _activeData) {
          fire(EVENT_FOCUS_MOVE, { data: _data, x: _x, y: _y });
          onCheck(true);
        } else {
          fire(EVENT_FOCUS_ON, {
            data: _data, x: _x, y: _y, done: onCheck,
          });
        }
      } else {
        _x = coords.x;
        _y = coords.y;
        fire(EVENT_FOCUS_ON, {
          data: _data, x: _x, y: _y, done: onCheck,
        });
      }
      function onCheck(result: boolean): void {
        _disabled = !result;
        if (result) {
          _activeData = _data;
        }
      }
    };
    that.turnOff = function (): void {
      _data = null;
      if (_activeData && !_disabled) {
        fire(EVENT_FOCUS_OFF, { data: _activeData });
        _activeData = null;
      }
    };
    that.cancel = function (): void {
      if (_activeData) {
        fire(EVENT_FOCUS_OFF, { data: _activeData });
      }
      _activeData = _data = null;
    };
  }
};

makeEventEmitter(Tracker);

/// #DEBUG
const originFocus = Focus;

exports._DEBUG_forceEventMode = function (mode: string): void {
  // @ts-expect-error setupEvents reads the forced mode from `arguments` in the debug build only
  setupEvents(mode);
};

export { Focus };

exports._DEBUG_stubFocusType = function (focusType: typeof Focus): void {
  Focus = focusType;
};

exports._DEBUG_restoreFocusType = function (): void {
  Focus = originFocus;
};
/// #ENDDEBUG

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return _sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function isTouchEvent(event: ThemeValue): boolean {
  const type: string = event.originalEvent.type;
  const pointerType = event.originalEvent.pointerType;
  return type.startsWith('touch') || (type.startsWith('MSPointer') && pointerType !== 4) || (type.startsWith('pointer') && pointerType !== 'mouse');
}

function selectItem(flags: boolean[], items: string[]): string {
  let i = 0;
  const ii = flags.length;
  let item;
  for (; i < ii; ++i) {
    if (flags[i]) {
      item = items[i];
      break;
    }
  }
  return _addNamespace(item || items[i], _NAME);
}

function setupEvents(): void {
  // @ts-expect-error pointerEnabled and msPointerEnabled are legacy non-standard navigator flags
  let flags = [navigator.pointerEnabled, navigator.msPointerEnabled, hasProperty('ontouchstart')];
  /// #DEBUG
  if (arguments.length) {
    flags = [
      arguments[0] === 'pointer',
      arguments[0] === 'MSPointer',
      arguments[0] === 'touch',
    ];
  }
  /// #ENDDEBUG
  EVENTS = {
    start: selectItem(flags, ['pointerdown', 'MSPointerDown', 'touchstart mousedown', 'mousedown']),
    move: selectItem(flags, ['pointermove', 'MSPointerMove', 'touchmove mousemove', 'mousemove']),
    end: selectItem(flags, ['pointerup', 'MSPointerUp', 'touchend mouseup', 'mouseup']),
    wheel: _addNamespace(wheelEventName, _NAME),
  };
}

function getEventCoords(event: ThemeValue): Coords {
  const originalEvent = event.originalEvent;
  const touch = (originalEvent.touches && originalEvent.touches[0]) || {};
  return { x: touch.pageX || originalEvent.pageX || event.pageX, y: touch.pageY || originalEvent.pageY || event.pageY };
}

function getPointerId(event: { originalEvent: { pointerId?: number } }): number | undefined {
  return event.originalEvent.pointerId;
}

function getMultitouchEventCoords(event: ThemeValue, pointerId: number): Coords | null {
  let originalEvent = event.originalEvent;
  if (originalEvent.pointerId !== undefined) {
    originalEvent = originalEvent.pointerId === pointerId ? originalEvent : null;
  } else {
    originalEvent = originalEvent.touches[pointerId];
  }
  return originalEvent ? { x: originalEvent.pageX || event.pageX, y: originalEvent.pageY || event.pageY } : null;
}

function adjustWheelDelta(delta: number, lock: ThemeValue): number {
  if (delta === 0) { return 0; }

  let _delta = _abs(delta);
  const sign = _round(delta / _delta);

  if (lock.dir && sign !== lock.dir) { return 0; }

  lock.dir = sign;
  if (_delta < 0.1) {
    _delta = 0;
  } else if (_delta < 1) {
    _delta = 1;
  } else if (_delta > 4) {
    _delta = 4;
  } else {
    _delta = _round(_delta);
  }
  return sign * _delta;
}

/// #DEBUG
export function DEBUG_set_Tracker(value: typeof Tracker): void {
  Tracker = value;
}
/// #ENDDEBUG
