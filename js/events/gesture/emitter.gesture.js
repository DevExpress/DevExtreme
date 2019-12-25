var $ = require('../../core/renderer'),
    eventsEngine = require('../../events/core/events_engine'),
    devices = require('../../core/devices'),
    styleUtils = require('../../core/utils/style'),
    callOnce = require('../../core/utils/call_once'),
    domUtils = require('../../core/utils/dom'),
    readyCallbacks = require('../../core/utils/ready_callbacks'),
    ready = readyCallbacks.add,
    mathUtils = require('../../core/utils/math'),
    noop = require('../../core/utils/common').noop,
    isDefined = require('../../core/utils/type').isDefined,
    eventUtils = require('../utils'),
    Emitter = require('../core/emitter'),
    sign = mathUtils.sign,
    abs = Math.abs;

var SLEEP = 0,
    INITED = 1,
    STARTED = 2,

    TOUCH_BOUNDARY = 10,
    IMMEDIATE_TOUCH_BOUNDARY = 0,
    IMMEDIATE_TIMEOUT = 180;

var supportPointerEvents = function() {
    return styleUtils.styleProp('pointer-events');
};

var setGestureCover = callOnce(function() {
    var GESTURE_COVER_CLASS = 'dx-gesture-cover';

    var isDesktop = devices.real().platform === 'generic';

    if(!supportPointerEvents() || !isDesktop) {
        return noop;
    }

    var $cover = $('<div>')
        .addClass(GESTURE_COVER_CLASS)
        .css('pointerEvents', 'none');

    eventsEngine.subscribeGlobal($cover, 'dxmousewheel', function(e) {
        e.preventDefault();
    });

    ready(function() {
        $cover.appendTo('body');
    });

    return function(toggle, cursor) {
        $cover.css('pointerEvents', toggle ? 'all' : 'none');
        toggle && $cover.css('cursor', cursor);
    };
});

var gestureCover = function(toggle, cursor) {
    var gestureCoverStrategy = setGestureCover();
    gestureCoverStrategy(toggle, cursor);
};

var GestureEmitter = Emitter.inherit({

    gesture: true,

    configure: function(data) {
        this.getElement().css('msTouchAction', data.immediate ? 'pinch-zoom' : '');

        this.callBase(data);
    },

    allowInterruptionByMouseWheel: function() {
        return this._stage !== STARTED;
    },

    getDirection: function() {
        return this.direction;
    },

    _cancel: function() {
        this.callBase.apply(this, arguments);

        this._toggleGestureCover(false);
        this._stage = SLEEP;
    },

    start: function(e) {
        if(e._needSkipEvent || eventUtils.needSkipEvent(e)) {
            this._cancel(e);
            return;
        }

        this._startEvent = eventUtils.createEvent(e);
        this._startEventData = eventUtils.eventData(e);

        this._stage = INITED;
        this._init(e);

        this._setupImmediateTimer();
    },

    _setupImmediateTimer: function() {
        clearTimeout(this._immediateTimer);
        this._immediateAccepted = false;

        if(!this.immediate) {
            return;
        }

        this._immediateTimer = setTimeout((function() {
            this._immediateAccepted = true;
        }).bind(this), IMMEDIATE_TIMEOUT);
    },

    move: function(e) {
        if(this._stage === INITED && this._directionConfirmed(e)) {
            this._stage = STARTED;

            this._resetActiveElement();
            this._toggleGestureCover(true);
            this._clearSelection(e);

            this._adjustStartEvent(e);
            this._start(this._startEvent);

            if(this._stage === SLEEP) {
                return;
            }

            this._requestAccept(e);
            this._move(e);
            this._forgetAccept();
        } else if(this._stage === STARTED) {
            this._clearSelection(e);
            this._move(e);
        }
    },

    _directionConfirmed: function(e) {
        var touchBoundary = this._getTouchBoundary(e),
            delta = eventUtils.eventDelta(this._startEventData, eventUtils.eventData(e)),
            deltaX = abs(delta.x),
            deltaY = abs(delta.y);

        var horizontalMove = this._validateMove(touchBoundary, deltaX, deltaY),
            verticalMove = this._validateMove(touchBoundary, deltaY, deltaX);

        var direction = this.getDirection(e),
            bothAccepted = direction === 'both' && (horizontalMove || verticalMove),
            horizontalAccepted = direction === 'horizontal' && horizontalMove,
            verticalAccepted = direction === 'vertical' && verticalMove;

        return bothAccepted || horizontalAccepted || verticalAccepted || this._immediateAccepted;
    },

    _validateMove: function(touchBoundary, mainAxis, crossAxis) {
        return mainAxis && mainAxis >= touchBoundary && (this.immediate ? mainAxis >= crossAxis : true);
    },

    _getTouchBoundary: function(e) {
        return (this.immediate || eventUtils.isDxMouseWheelEvent(e)) ? IMMEDIATE_TOUCH_BOUNDARY : TOUCH_BOUNDARY;
    },

    _adjustStartEvent: function(e) {
        var touchBoundary = this._getTouchBoundary(e),
            delta = eventUtils.eventDelta(this._startEventData, eventUtils.eventData(e));

        this._startEvent.pageX += sign(delta.x) * touchBoundary;
        this._startEvent.pageY += sign(delta.y) * touchBoundary;
    },

    _resetActiveElement: function() {
        if(devices.real().platform === 'ios' && this.getElement().find(':focus').length) {
            domUtils.resetActiveElement();
        }
    },

    _toggleGestureCover: function(toggle) {
        this._toggleGestureCoverImpl(toggle);
    },

    _toggleGestureCoverImpl: function(toggle) {
        var isStarted = this._stage === STARTED;

        if(isStarted) {
            gestureCover(toggle, this.getElement().css('cursor'));
        }
    },

    _clearSelection: function(e) {
        if(eventUtils.isDxMouseWheelEvent(e) || eventUtils.isTouchEvent(e)) {
            return;
        }

        domUtils.clearSelection();
    },

    end: function(e) {
        this._toggleGestureCover(false);

        if(this._stage === STARTED) {
            this._end(e);
        } else if(this._stage === INITED) {
            this._stop(e);
        }

        this._stage = SLEEP;
    },

    dispose: function() {
        clearTimeout(this._immediateTimer);
        this.callBase.apply(this, arguments);
        this._toggleGestureCover(false);
    },

    _init: noop,
    _start: noop,
    _move: noop,
    _stop: noop,
    _end: noop

});
GestureEmitter.initialTouchBoundary = TOUCH_BOUNDARY;
GestureEmitter.touchBoundary = function(newBoundary) {
    if(isDefined(newBoundary)) {
        TOUCH_BOUNDARY = newBoundary;
        return;
    }

    return TOUCH_BOUNDARY;
};

module.exports = GestureEmitter;
