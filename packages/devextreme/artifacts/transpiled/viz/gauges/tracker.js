"use strict";

exports.default = void 0;
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _class = _interopRequireDefault(require("../../core/class"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _wheel = require("../../events/core/wheel");
var _ready_callbacks = _interopRequireDefault(require("../../core/utils/ready_callbacks"));
var _index = require("../../events/utils/index");
var _pointer = _interopRequireDefault(require("../../events/pointer"));
var _console = require("../../core/utils/console");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
///#DEBUG

///#ENDDEBUG
const EVENT_NS = 'gauge-tooltip';
const TOOLTIP_HIDE_DELAY = 100;
const ready = _ready_callbacks.default.add;
const Tracker = _class.default.inherit({
  ctor: function (parameters) {
    ///#DEBUG
    _console.debug.assertParam(parameters, 'parameters');
    _console.debug.assertParam(parameters.renderer, 'parameters.renderer');
    _console.debug.assertParam(parameters.container, 'parameters.container');
    ///#ENDDEBUG
    const that = this;
    that._element = parameters.renderer.g().attr({
      'class': 'dxg-tracker',
      stroke: 'none',
      'stroke-width': 0,
      fill: '#000000',
      opacity: 0.0001
    }).linkOn(parameters.container, {
      name: 'tracker',
      after: 'peripheral'
    });
    that._showTooltipCallback = function () {
      const target = that._tooltipEvent.target;
      const data_target = target['gauge-data-target'];
      const data_info = target['gauge-data-info'];
      that._targetEvent = null; //  Internal state must be reset strictly BEFORE callback is invoked
      if (that._tooltipTarget !== target) {
        const callback = result => {
          result && (that._tooltipTarget = target);
        };
        callback(that._callbacks['tooltip-show'](data_target, data_info, callback));
      }
    };
    that._hideTooltipCallback = function () {
      that._hideTooltipTimeout = null;
      that._targetEvent = null;
      if (that._tooltipTarget) {
        that._callbacks['tooltip-hide']();
        that._tooltipTarget = null;
      }
    };
    that._dispose = function () {
      clearTimeout(that._hideTooltipTimeout);
      that._showTooltipCallback = that._hideTooltipCallback = that._dispose = null;
    };
    ///#DEBUG
    that._DEBUG_hideTooltipTimeoutSet = that._DEBUG_hideTooltipTimeoutCleared = 0;
    that.TOOLTIP_HIDE_DELAY = TOOLTIP_HIDE_DELAY;
    ///#ENDDEBUG
  },
  dispose: function () {
    const that = this;
    that._dispose();
    that.deactivate();
    that._element.off('.' + EVENT_NS);
    that._element.linkOff();
    that._element = that._context = that._callbacks = null;
    return that;
  },
  activate: function () {
    this._element.linkAppend();
    return this;
  },
  deactivate: function () {
    this._element.linkRemove().clear();
    return this;
  },
  attach: function (element, target, info) {
    element.data({
      'gauge-data-target': target,
      'gauge-data-info': info
    }).append(this._element);
    return this;
  },
  detach: function (element) {
    element.remove();
    return this;
  },
  setTooltipState: function (state) {
    const that = this;
    that._element.off('.' + EVENT_NS);
    if (state) {
      const data = {
        tracker: that
      };
      that._element.on((0, _index.addNamespace)([_pointer.default.move], EVENT_NS), data, handleTooltipMouseOver).on((0, _index.addNamespace)([_pointer.default.out], EVENT_NS), data, handleTooltipMouseOut).on((0, _index.addNamespace)([_pointer.default.down], EVENT_NS), data, handleTooltipTouchStart).on((0, _index.addNamespace)([_pointer.default.up], EVENT_NS), data, handleTooltipTouchEnd).on((0, _index.addNamespace)([_wheel.name], EVENT_NS), data, handleTooltipMouseWheel);
    }
    return that;
  },
  setCallbacks: function (callbacks) {
    this._callbacks = callbacks;
    return this;
  },
  _showTooltip: function (event) {
    const that = this;

    ///#DEBUG
    that._hideTooltipTimeout && ++that._DEBUG_hideTooltipTimeoutCleared;
    ///#ENDDEBUG
    clearTimeout(that._hideTooltipTimeout);
    that._hideTooltipTimeout = null;
    if (that._tooltipTarget === event.target) {
      return;
    }
    that._tooltipEvent = event;
    that._showTooltipCallback();
  },
  _hideTooltip: function (delay) {
    const that = this;
    clearTimeout(that._hideTooltipTimeout);
    if (delay) {
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
Tracker._DEBUG_reset = function () {
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
  if (tracker && !tracker._touch) {
    tracker._hideTooltip(TOOLTIP_HIDE_DELAY);
    active_touch_tooltip_tracker = null;
  }
}
ready(function () {
  _events_engine.default.subscribeGlobal(_dom_adapter.default.getDocument(), (0, _index.addNamespace)([_pointer.default.down], EVENT_NS), handleDocumentTooltipTouchStart);
});
var _default = exports.default = Tracker;
module.exports = exports.default;
module.exports.default = exports.default;