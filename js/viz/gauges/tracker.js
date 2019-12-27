const eventsEngine = require('../../events/core/events_engine');
const Class = require('../../core/class');
const domAdapter = require('../../core/dom_adapter');
const ready = require('../../core/utils/ready_callbacks').add;
const wheelEvent = require('../../events/core/wheel');

const TOOLTIP_HIDE_DELAY = 100;

const Tracker = Class.inherit({
    ctor: function(parameters) {
        ///#DEBUG
        const debug = require('../../core/utils/console').debug;
        debug.assertParam(parameters, 'parameters');
        debug.assertParam(parameters.renderer, 'parameters.renderer');
        debug.assertParam(parameters.container, 'parameters.container');
        ///#ENDDEBUG
        const that = this;
        that._element = parameters.renderer.g().attr({ 'class': 'dxg-tracker', stroke: 'none', 'stroke-width': 0, fill: '#000000', opacity: 0.0001 }).linkOn(parameters.container, { name: 'tracker', after: 'peripheral' });

        that._showTooltipCallback = function() {
            const target = that._tooltipEvent.target;
            const data_target = target['gauge-data-target'];
            const data_info = target['gauge-data-info'];

            that._targetEvent = null; //  Internal state must be reset strictly BEFORE callback is invoked
            if(that._tooltipTarget !== target && that._callbacks['tooltip-show'](data_target, data_info)) {
                that._tooltipTarget = target;
            }
        };
        that._hideTooltipCallback = function() {
            that._hideTooltipTimeout = null;
            that._targetEvent = null;
            if(that._tooltipTarget) {
                that._callbacks['tooltip-hide']();
                that._tooltipTarget = null;
            }
        };
        that._dispose = function() {
            clearTimeout(that._hideTooltipTimeout);
            that._showTooltipCallback = that._hideTooltipCallback = that._dispose = null;
        };
        ///#DEBUG
        that._DEBUG_hideTooltipTimeoutSet = that._DEBUG_hideTooltipTimeoutCleared = 0;
        that.TOOLTIP_HIDE_DELAY = TOOLTIP_HIDE_DELAY;
        ///#ENDDEBUG
    },

    dispose: function() {
        const that = this;
        that._dispose();
        that.deactivate();
        that._element.linkOff();
        that._element = that._context = that._callbacks = null;
        return that;
    },

    activate: function() {
        this._element.linkAppend();
        return this;
    },

    deactivate: function() {
        this._element.linkRemove().clear();
        return this;
    },

    attach: function(element, target, info) {
        element.data({ 'gauge-data-target': target, 'gauge-data-info': info }).append(this._element);
        return this;
    },

    detach: function(element) {
        element.remove();
        return this;
    },

    setTooltipState: function(state) {
        const that = this; let data;
        that._element.off(tooltipMouseEvents).off(tooltipTouchEvents).off(tooltipMouseWheelEvents);
        if(state) {
            data = { tracker: that };
            that._element.on(tooltipMouseEvents, data).on(tooltipTouchEvents, data).on(tooltipMouseWheelEvents, data);
        }
        return that;
    },

    setCallbacks: function(callbacks) {
        this._callbacks = callbacks;
        return this;
    },

    _showTooltip: function(event) {
        const that = this;

        ///#DEBUG
        that._hideTooltipTimeout && ++that._DEBUG_hideTooltipTimeoutCleared;
        ///#ENDDEBUG
        clearTimeout(that._hideTooltipTimeout);
        that._hideTooltipTimeout = null;

        if(that._tooltipTarget === event.target) {
            return;
        }
        that._tooltipEvent = event;
        that._showTooltipCallback();
    },

    _hideTooltip: function(delay) {
        const that = this;
        clearTimeout(that._hideTooltipTimeout);
        if(delay) {
            ///#DEBUG
            ++that._DEBUG_hideTooltipTimeoutSet;
            ///#ENDDEBUG
            that._hideTooltipTimeout = setTimeout(that._hideTooltipCallback, delay);
        } else {
            that._hideTooltipCallback();
        }
    }
});

var tooltipMouseEvents = {
    'mouseover.gauge-tooltip': handleTooltipMouseOver,
    'mouseout.gauge-tooltip': handleTooltipMouseOut
};

const tooltipMouseMoveEvents = {
    'mousemove.gauge-tooltip': handleTooltipMouseMove
};

var tooltipMouseWheelEvents = {};
tooltipMouseWheelEvents[wheelEvent.name + '.gauge-tooltip'] = handleTooltipMouseWheel;

var tooltipTouchEvents = {
    'touchstart.gauge-tooltip': handleTooltipTouchStart
};

function handleTooltipMouseOver(event) {
    const tracker = event.data.tracker;
    tracker._x = event.pageX;
    tracker._y = event.pageY;
    tracker._element.off(tooltipMouseMoveEvents).on(tooltipMouseMoveEvents, event.data);
    tracker._showTooltip(event);
}

function handleTooltipMouseMove(event) {
    const tracker = event.data.tracker;

    tracker._x = event.pageX;
    tracker._y = event.pageY;
    tracker._showTooltip(event);
}

function handleTooltipMouseOut(event) {
    const tracker = event.data.tracker;
    tracker._element.off(tooltipMouseMoveEvents);
    tracker._hideTooltip(TOOLTIP_HIDE_DELAY);
}

function handleTooltipMouseWheel(event) {
    event.data.tracker._hideTooltip();
}

let active_touch_tooltip_tracker = null;

///#DEBUG
Tracker._DEBUG_reset = function() {
    active_touch_tooltip_tracker = null;
};
///#ENDDEBUG

function handleTooltipTouchStart(event) {
    event.preventDefault();
    let tracker = active_touch_tooltip_tracker;
    if(tracker && tracker !== event.data.tracker) {
        tracker._hideTooltip(TOOLTIP_HIDE_DELAY);
    }
    tracker = active_touch_tooltip_tracker = event.data.tracker;
    tracker._showTooltip(event);
    tracker._touch = true;
}

function handleTooltipDocumentTouchStart() {
    const tracker = active_touch_tooltip_tracker;
    if(tracker) {
        if(!tracker._touch) {
            tracker._hideTooltip(TOOLTIP_HIDE_DELAY);
            active_touch_tooltip_tracker = null;
        }
        tracker._touch = null;
    }
}

function handleTooltipDocumentTouchEnd() {
    const tracker = active_touch_tooltip_tracker;
    if(tracker) {
        tracker._hideTooltip(TOOLTIP_HIDE_DELAY);
        active_touch_tooltip_tracker = null;
    }
}

ready(function() {
    eventsEngine.subscribeGlobal(domAdapter.getDocument(), {
        'touchstart.gauge-tooltip': handleTooltipDocumentTouchStart,
        'touchend.gauge-tooltip': handleTooltipDocumentTouchEnd
    });
});
module.exports = Tracker;
