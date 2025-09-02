import eventsEngine from '../../common/core/events/core/events_engine';
import Class from '../../core/class';
import domAdapter from '../../core/dom_adapter';
import { name as wheelEventName } from '../../common/core/events/core/wheel';
import ReadyCallbacks from '../../core/utils/ready_callbacks';
import { addNamespace } from '../../common/core/events/utils/index';
import pointerEvents from '../../common/core/events/pointer';
///#DEBUG
import { debug } from '../../core/utils/console';
///#ENDDEBUG
const EVENT_NS = 'gauge-tooltip';

const TOOLTIP_HIDE_DELAY = 100;

const ready = ReadyCallbacks.add;

const Tracker = Class.inherit({
    ctor: function(parameters) {
        ///#DEBUG
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
            if(that._tooltipTarget !== target) {
                const callback = (result) => {
                    result && (that._tooltipTarget = target);
                };
                callback(that._callbacks['tooltip-show'](data_target, data_info, callback));
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
        that._element.off('.' + EVENT_NS);
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
        const that = this;
        that._element.off('.' + EVENT_NS);
        if(state) {
            const data = { tracker: that };
            that._element
                .on(addNamespace([pointerEvents.move], EVENT_NS), data, handleTooltipMouseOver)
                .on(addNamespace([pointerEvents.out], EVENT_NS), data, handleTooltipMouseOut)
                .on(addNamespace([pointerEvents.down], EVENT_NS), data, handleTooltipTouchStart)
                .on(addNamespace([pointerEvents.up], EVENT_NS), data, handleTooltipTouchEnd)
                .on(addNamespace([wheelEventName], EVENT_NS), data, handleTooltipMouseWheel);
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

let active_touch_tooltip_tracker = null;

///#DEBUG
Tracker._DEBUG_reset = function() {
    active_touch_tooltip_tracker = null;
};
///#ENDDEBUG

function handleTooltipMouseOver(event) {
    const tracker = event.data.tracker;
    tracker._x = event.pageX;
    tracker._y = event.pageY;
    tracker._showTooltip(event);
}

function handleTooltipMouseOut(event) {
    event.data.tracker._hideTooltip(TOOLTIP_HIDE_DELAY);
}

function handleTooltipMouseWheel(event) {
    event.data.tracker._hideTooltip();
}

function handleTooltipTouchStart(event) {
    const tracker = active_touch_tooltip_tracker = event.data.tracker;
    tracker._touch = true;
    handleTooltipMouseOver(event);
}

function handleTooltipTouchEnd() {
    active_touch_tooltip_tracker._touch = false;
}

function handleDocumentTooltipTouchStart(event) {
    const tracker = active_touch_tooltip_tracker;
    if(tracker && !tracker._touch) {
        tracker._hideTooltip(TOOLTIP_HIDE_DELAY);
        active_touch_tooltip_tracker = null;
    }
}

ready(function() {
    eventsEngine.subscribeGlobal(domAdapter.getDocument(), addNamespace([pointerEvents.down], EVENT_NS), handleDocumentTooltipTouchStart);
});

export default Tracker;
