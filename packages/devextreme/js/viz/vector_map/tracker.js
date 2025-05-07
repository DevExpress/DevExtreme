import eventsEngine from '../../common/core/events/core/events_engine';
import { getNavigator, hasProperty } from '../../core/utils/window';
import domAdapter from '../../core/dom_adapter';
import { makeEventEmitter } from './event_emitter';
import { addNamespace } from '../../common/core/events/utils/index';
import { name as wheelEventName } from '../../common/core/events/core/wheel';
import { parseScalar } from '../core/utils';

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

let EVENTS;
let Focus;

setupEvents();

export function Tracker(parameters) {
    const that = this;
    that._root = parameters.root;
    that._createEventHandlers(parameters.dataKey);
    that._createProjectionHandlers(parameters.projection);
    that._initEvents();
    that._focus = new Focus(function(name, arg) {
        that._fire(name, arg);
    });
    that._attachHandlers();
}

Tracker.prototype = {
    constructor: Tracker,

    dispose: function() {
        const that = this;
        that._detachHandlers();
        that._disposeEvents();
        that._focus.dispose();
        that._root = that._focus = that._docHandlers = that._rootHandlers = null;
    },

    _eventNames: [
        EVENT_START, EVENT_MOVE, EVENT_END, EVENT_ZOOM, EVENT_CLICK,
        EVENT_HOVER_ON, EVENT_HOVER_OFF,
        EVENT_FOCUS_ON, EVENT_FOCUS_OFF, EVENT_FOCUS_MOVE
    ],

    _startClick: function(event, data) {
        if(!data) { return; }
        const coords = getEventCoords(event);
        this._clickState = {
            x: coords.x, y: coords.y,
            threshold: isTouchEvent(event) ? CLICK_COORD_THRESHOLD_TOUCH : CLICK_COORD_THRESHOLD_MOUSE,
            time: Date.now()
        };
    },

    _endClick: function(event, data) {
        const state = this._clickState;
        let threshold;
        let coords;

        if(!state) { return; }

        if(data && Date.now() - state.time <= CLICK_TIME_THRESHOLD) {
            threshold = state.threshold;
            coords = getEventCoords(event);
            if(_abs(coords.x - state.x) <= threshold && _abs(coords.y - state.y) <= threshold) {
                this._fire(EVENT_CLICK, { data: data, x: coords.x, y: coords.y, $event: event });
            }
        }
        this._clickState = null;
    },

    _startDrag: function(event, data) {
        if(!data) { return; }
        const coords = getEventCoords(event);
        const state = this._dragState = { x: coords.x, y: coords.y, data: data };
        this._fire(EVENT_START, { x: state.x, y: state.y, data: state.data });
    },

    _moveDrag: function(event, data) {
        const state = this._dragState;

        if(!state) { return; }

        const coords = getEventCoords(event);
        const threshold = isTouchEvent(event) ? DRAG_COORD_THRESHOLD_TOUCH : DRAG_COORD_THRESHOLD_MOUSE;
        if(state.active || _abs(coords.x - state.x) > threshold || _abs(coords.y - state.y) > threshold) {
            state.x = coords.x;
            state.y = coords.y;
            state.active = true;
            state.data = data || {};
            this._fire(EVENT_MOVE, { x: state.x, y: state.y, data: state.data });
        }
    },

    _endDrag: function() {
        const state = this._dragState;
        if(!state) { return; }
        this._dragState = null;
        this._fire(EVENT_END, { x: state.x, y: state.y, data: state.data });
    },

    _wheelZoom: function(event, data) {
        if(!data) { return; }
        const that = this;
        const lock = that._wheelLock;
        const time = Date.now();

        if(time - lock.time <= WHEEL_COOLDOWN) { return; }
        // T136650
        if(time - lock.dirTime > WHEEL_DIRECTION_COOLDOWN) {
            lock.dir = 0;
        }
        // T107589, T136650
        const delta = adjustWheelDelta(event.delta / 120 || 0, lock);

        if(delta === 0) { return; }

        const coords = getEventCoords(event);
        that._fire(EVENT_ZOOM, { delta: delta, x: coords.x, y: coords.y });
        lock.time = lock.dirTime = time;
    },

    _startZoom: function(event, data) {
        if(!isTouchEvent(event) || !data) {
            return;
        }

        const state = this._zoomState = this._zoomState || {};
        let coords;
        let pointer2;

        if(state.pointer1 && state.pointer2) { return; }

        if(state.pointer1 === undefined) {
            state.pointer1 = getPointerId(event) || 0;
            coords = getMultitouchEventCoords(event, state.pointer1);
            state.x1 = state.x1_0 = coords.x;
            state.y1 = state.y1_0 = coords.y;
        }
        if(state.pointer2 === undefined) {
            pointer2 = getPointerId(event) || 1;
            if(pointer2 !== state.pointer1) {
                coords = getMultitouchEventCoords(event, pointer2);
                if(coords) {
                    state.x2 = state.x2_0 = coords.x;
                    state.y2 = state.y2_0 = coords.y;
                    state.pointer2 = pointer2;
                    state.ready = true;
                    this._endDrag();
                }
            }
        }
    },

    _moveZoom: function(event) {
        const state = this._zoomState;
        let coords;

        if(!state || !isTouchEvent(event)) {
            return;
        }

        if(state.pointer1 !== undefined) {
            coords = getMultitouchEventCoords(event, state.pointer1);
            if(coords) {
                state.x1 = coords.x;
                state.y1 = coords.y;
            }
        }
        if(state.pointer2 !== undefined) {
            coords = getMultitouchEventCoords(event, state.pointer2);
            if(coords) {
                state.x2 = coords.x;
                state.y2 = coords.y;
            }
        }
    },

    _endZoom: function(event) {
        const state = this._zoomState;
        let startDistance;
        let currentDistance;

        if(!state || !isTouchEvent(event)) {
            return;
        }

        if(state.ready) {
            startDistance = getDistance(state.x1_0, state.y1_0, state.x2_0, state.y2_0);
            currentDistance = getDistance(state.x1, state.y1, state.x2, state.y2);
            this._fire(EVENT_ZOOM, { ratio: currentDistance / startDistance, x: (state.x1_0 + state.x2_0) / 2, y: (state.y1_0 + state.y2_0) / 2 });
        }
        this._zoomState = null;
    },

    _startHover: function(event, data) {
        this._doHover(event, data, true);
    },

    _moveHover: function(event, data) {
        this._doHover(event, data, false);
    },

    _doHover: function(event, data, isTouch) {
        const that = this;
        if((that._dragState && that._dragState.active) || (that._zoomState && that._zoomState.ready)) {
            that._cancelHover();
            return;
        }

        if(isTouchEvent(event) !== isTouch || that._hoverTarget === event.target || (that._hoverState && that._hoverState.data === data)) {
            return;
        }

        that._cancelHover();
        if(data) {
            that._hoverState = { data: data };
            that._fire(EVENT_HOVER_ON, { data: data });
        }
        that._hoverTarget = event.target;
    },

    _cancelHover: function() {
        const state = this._hoverState;
        this._hoverState = this._hoverTarget = null;
        if(state) {
            this._fire(EVENT_HOVER_OFF, { data: state.data });
        }
    },

    _startFocus: function(event, data) {
        this._doFocus(event, data, true);
    },

    _moveFocus: function(event, data) {
        this._doFocus(event, data, false);
    },

    _doFocus: function(event, data, isTouch) {
        const that = this;
        if((that._dragState && that._dragState.active) || (that._zoomState && that._zoomState.ready)) {
            that._cancelFocus();
            return;
        }

        if(isTouchEvent(event) !== isTouch) { return; }

        that._focus.turnOff();
        data && that._focus.turnOn(data, getEventCoords(event));
    },

    _cancelFocus: function() {
        this._focus.cancel();
    },

    _createEventHandlers: function(DATA_KEY) {
        const that = this;

        that._docHandlers = {};
        that._rootHandlers = {};

        that._docHandlers[EVENTS.start] = function(event) {
            const isTouch = isTouchEvent(event);
            const data = getData(event);

            if(isTouch && !that._isTouchEnabled) { return; }
            if(data) {
                event.preventDefault();
            }

            that._startClick(event, data);
            that._startDrag(event, data);
            that._startZoom(event, data);
            that._startHover(event, data);
            that._startFocus(event, data);
        };

        that._docHandlers[EVENTS.move] = function(event) {
            const isTouch = isTouchEvent(event);
            const data = getData(event);

            if(isTouch && !that._isTouchEnabled) { return; }

            that._moveDrag(event, data);
            that._moveZoom(event, data);
            that._moveHover(event, data);
            that._moveFocus(event, data);
        };

        that._docHandlers[EVENTS.end] = function(event) {
            const isTouch = isTouchEvent(event);
            const data = getData(event);

            if(isTouch && !that._isTouchEnabled) { return; }

            that._endClick(event, data);
            that._endDrag(event, data);
            that._endZoom(event, data);
        };

        that._rootHandlers[EVENTS.wheel] = function(event) {
            that._cancelFocus();

            if(!that._isWheelEnabled) { return; }

            const data = getData(event);
            if(data) {
                event.preventDefault();
                event.stopPropagation(); // T249548
                that._wheelZoom(event, data);
            }
        };
        that._wheelLock = { dir: 0 };

        // Actually it is responsibility of the text element wrapper to handle "data" to its span elements (if there are any).
        // Now to avoid not so necessary complication of renderer text-span issue is handled on the side of the tracker.
        function getData(event) {
            const target = event.target;
            return (target.tagName === 'tspan' ? target.parentNode : target)[DATA_KEY];
        }
    },

    _createProjectionHandlers: function(projection) {
        const that = this;
        projection.on({ 'center': handler, 'zoom': handler }); // T247841
        function handler() {
            // `_cancelHover` probably should also be called here but for now let it not be so
            that._cancelFocus();
        }
    },

    reset: function() {
        const that = this;
        that._clickState = null;
        that._endDrag();
        that._cancelHover();
        that._cancelFocus();
    },

    setOptions: function(options) {
        const that = this;
        that.reset();
        that._detachHandlers();
        that._isTouchEnabled = !!parseScalar(options.touchEnabled, true);
        that._isWheelEnabled = !!parseScalar(options.wheelEnabled, true);
        that._attachHandlers();
    },

    _detachHandlers: function() {
        const that = this;
        if(that._isTouchEnabled) {
            that._root.css({ 'touch-action': '', '-webkit-user-select': '' }).
                off(_addNamespace('MSHoldVisual', _NAME)).
                off(_addNamespace('contextmenu', _NAME));
        }
        eventsEngine.off(domAdapter.getDocument(), that._docHandlers);
        that._root.off(that._rootHandlers);
    },

    _attachHandlers: function() {
        const that = this;
        if(that._isTouchEnabled) {
            that._root.css({ 'touch-action': 'none', '-webkit-user-select': 'none' }).
                on(_addNamespace('MSHoldVisual', _NAME), function(event) {
                    event.preventDefault();
                }).
                on(_addNamespace('contextmenu', _NAME), function(event) {
                    isTouchEvent(event) && event.preventDefault();
                });
        }
        eventsEngine.on(domAdapter.getDocument(), that._docHandlers);
        that._root.on(that._rootHandlers);
    }
};

Focus = function(fire) {
    let that = this;
    let _activeData = null;
    let _data = null;
    let _disabled = false;
    let _x;
    let _y;

    that.dispose = function() {
        that.turnOn = that.turnOff = that.cancel = that.dispose = that = fire = _activeData = _data = null;
    };
    that.turnOn = function(data, coords) {
        if(data === _data && _disabled) { return; }
        _disabled = false;
        _data = data;
        if(_activeData) {
            _x = coords.x;
            _y = coords.y;
            if(_data === _activeData) {
                fire(EVENT_FOCUS_MOVE, { data: _data, x: _x, y: _y });
                onCheck(true);
            } else {
                fire(EVENT_FOCUS_ON, { data: _data, x: _x, y: _y, done: onCheck });
            }
        } else {
            _x = coords.x;
            _y = coords.y;
            fire(EVENT_FOCUS_ON, { data: _data, x: _x, y: _y, done: onCheck });
        }
        function onCheck(result) {
            _disabled = !result;
            if(result) {
                _activeData = _data;
            }
        }
    };
    that.turnOff = function() {
        _data = null;
        if(_activeData && !_disabled) {
            fire(EVENT_FOCUS_OFF, { data: _activeData });
            _activeData = null;
        }
    };
    that.cancel = function() {
        if(_activeData) {
            fire(EVENT_FOCUS_OFF, { data: _activeData });
        }
        _activeData = _data = null;
    };
};

makeEventEmitter(Tracker);

///#DEBUG
const originFocus = Focus;

export function _DEBUG_forceEventMode(mode) {
    setupEvents(mode);
}

export { Focus };

export function _DEBUG_stubFocusType(focusType) {
    Focus = focusType;
}

export function _DEBUG_restoreFocusType() {
    Focus = originFocus;
}

///#ENDDEBUG

function getDistance(x1, y1, x2, y2) {
    return _sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function isTouchEvent(event) {
    const type = event.originalEvent.type;
    const pointerType = event.originalEvent.pointerType;
    return /^touch/.test(type) || (/^MSPointer/.test(type) && pointerType !== 4) || (/^pointer/.test(type) && pointerType !== 'mouse');
}

function selectItem(flags, items) {
    let i = 0;
    const ii = flags.length;
    let item;
    for(; i < ii; ++i) {
        if(flags[i]) {
            item = items[i];
            break;
        }
    }
    return _addNamespace(item || items[i], _NAME);
}

function setupEvents() {
    let flags = [navigator.pointerEnabled, navigator.msPointerEnabled, hasProperty('ontouchstart')];
    ///#DEBUG
    if(arguments.length) {
        flags = [
            arguments[0] === 'pointer',
            arguments[0] === 'MSPointer',
            arguments[0] === 'touch'
        ];
    }
    ///#ENDDEBUG
    EVENTS = {
        start: selectItem(flags, ['pointerdown', 'MSPointerDown', 'touchstart mousedown', 'mousedown']),
        move: selectItem(flags, ['pointermove', 'MSPointerMove', 'touchmove mousemove', 'mousemove']),
        end: selectItem(flags, ['pointerup', 'MSPointerUp', 'touchend mouseup', 'mouseup']),
        wheel: _addNamespace(wheelEventName, _NAME)
    };
}

function getEventCoords(event) {
    const originalEvent = event.originalEvent;
    const touch = (originalEvent.touches && originalEvent.touches[0]) || {};
    return { x: touch.pageX || originalEvent.pageX || event.pageX, y: touch.pageY || originalEvent.pageY || event.pageY };
}

function getPointerId(event) {
    return event.originalEvent.pointerId;
}

function getMultitouchEventCoords(event, pointerId) {
    let originalEvent = event.originalEvent;
    if(originalEvent.pointerId !== undefined) {
        originalEvent = originalEvent.pointerId === pointerId ? originalEvent : null;
    } else {
        originalEvent = originalEvent.touches[pointerId];
    }
    return originalEvent ? { x: originalEvent.pageX || event.pageX, y: originalEvent.pageY || event.pageY } : null;
}

function adjustWheelDelta(delta, lock) {
    if(delta === 0) { return 0; }

    let _delta = _abs(delta);
    const sign = _round(delta / _delta);

    if(lock.dir && sign !== lock.dir) { return 0; }

    lock.dir = sign;
    if(_delta < 0.1) {
        _delta = 0;
    } else if(_delta < 1) {
        _delta = 1;
    } else if(_delta > 4) {
        _delta = 4;
    } else {
        _delta = _round(_delta);
    }
    return sign * _delta;
}
