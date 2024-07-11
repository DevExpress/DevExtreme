"use strict";

exports.swipe = exports.start = exports.end = void 0;
var _size = require("../core/utils/size");
var _index = require("./utils/index");
var _emitter = _interopRequireDefault(require("./gesture/emitter.gesture"));
var _emitter_registrator = _interopRequireDefault(require("./core/emitter_registrator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SWIPE_START_EVENT = exports.start = 'dxswipestart';
const SWIPE_EVENT = exports.swipe = 'dxswipe';
const SWIPE_END_EVENT = exports.end = 'dxswipeend';
const HorizontalStrategy = {
  defaultItemSizeFunc: function () {
    return (0, _size.getWidth)(this.getElement());
  },
  getBounds: function () {
    return [this._maxLeftOffset, this._maxRightOffset];
  },
  calcOffsetRatio: function (e) {
    const endEventData = (0, _index.eventData)(e);
    return (endEventData.x - (this._savedEventData && this._savedEventData.x || 0)) / this._itemSizeFunc().call(this, e);
  },
  isFastSwipe: function (e) {
    const endEventData = (0, _index.eventData)(e);
    return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.x - this._tickData.x) >= endEventData.time - this._tickData.time;
  }
};
const VerticalStrategy = {
  defaultItemSizeFunc: function () {
    return (0, _size.getHeight)(this.getElement());
  },
  getBounds: function () {
    return [this._maxTopOffset, this._maxBottomOffset];
  },
  calcOffsetRatio: function (e) {
    const endEventData = (0, _index.eventData)(e);
    return (endEventData.y - (this._savedEventData && this._savedEventData.y || 0)) / this._itemSizeFunc().call(this, e);
  },
  isFastSwipe: function (e) {
    const endEventData = (0, _index.eventData)(e);
    return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.y - this._tickData.y) >= endEventData.time - this._tickData.time;
  }
};
const STRATEGIES = {
  'horizontal': HorizontalStrategy,
  'vertical': VerticalStrategy
};
const SwipeEmitter = _emitter.default.inherit({
  TICK_INTERVAL: 300,
  FAST_SWIPE_SPEED_LIMIT: 10,
  ctor: function (element) {
    this.callBase(element);
    this.direction = 'horizontal';
    this.elastic = true;
  },
  _getStrategy: function () {
    return STRATEGIES[this.direction];
  },
  _defaultItemSizeFunc: function () {
    return this._getStrategy().defaultItemSizeFunc.call(this);
  },
  _itemSizeFunc: function () {
    return this.itemSizeFunc || this._defaultItemSizeFunc;
  },
  _init: function (e) {
    this._tickData = (0, _index.eventData)(e);
  },
  _start: function (e) {
    this._savedEventData = (0, _index.eventData)(e);
    e = this._fireEvent(SWIPE_START_EVENT, e);
    if (!e.cancel) {
      this._maxLeftOffset = e.maxLeftOffset;
      this._maxRightOffset = e.maxRightOffset;
      this._maxTopOffset = e.maxTopOffset;
      this._maxBottomOffset = e.maxBottomOffset;
    }
  },
  _move: function (e) {
    const strategy = this._getStrategy();
    const moveEventData = (0, _index.eventData)(e);
    let offset = strategy.calcOffsetRatio.call(this, e);
    offset = this._fitOffset(offset, this.elastic);
    if (moveEventData.time - this._tickData.time > this.TICK_INTERVAL) {
      this._tickData = moveEventData;
    }
    this._fireEvent(SWIPE_EVENT, e, {
      offset: offset
    });
    if (e.cancelable !== false) {
      e.preventDefault();
    }
  },
  _end: function (e) {
    const strategy = this._getStrategy();
    const offsetRatio = strategy.calcOffsetRatio.call(this, e);
    const isFast = strategy.isFastSwipe.call(this, e);
    let startOffset = offsetRatio;
    let targetOffset = this._calcTargetOffset(offsetRatio, isFast);
    startOffset = this._fitOffset(startOffset, this.elastic);
    targetOffset = this._fitOffset(targetOffset, false);
    this._fireEvent(SWIPE_END_EVENT, e, {
      offset: startOffset,
      targetOffset: targetOffset
    });
  },
  _fitOffset: function (offset, elastic) {
    const strategy = this._getStrategy();
    const bounds = strategy.getBounds.call(this);
    if (offset < -bounds[0]) {
      return elastic ? (-2 * bounds[0] + offset) / 3 : -bounds[0];
    }
    if (offset > bounds[1]) {
      return elastic ? (2 * bounds[1] + offset) / 3 : bounds[1];
    }
    return offset;
  },
  _calcTargetOffset: function (offsetRatio, isFast) {
    let result;
    if (isFast) {
      result = Math.ceil(Math.abs(offsetRatio));
      if (offsetRatio < 0) {
        result = -result;
      }
    } else {
      result = Math.round(offsetRatio);
    }
    return result;
  }
});

/**
 * @name UI Events.dxswipestart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/swipe
*/
/**
  * @name UI Events.dxswipe
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 offset:number
  * @type_function_param1_field2 cancel:boolean
  * @module events/swipe
*/
/**
  * @name UI Events.dxswipeend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 offset:number
  * @type_function_param1_field2 targetOffset:number
  * @module events/swipe
*/

(0, _emitter_registrator.default)({
  emitter: SwipeEmitter,
  events: [SWIPE_START_EVENT, SWIPE_EVENT, SWIPE_END_EVENT]
});