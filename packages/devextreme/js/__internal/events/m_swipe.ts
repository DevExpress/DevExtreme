import registerEmitter from '@js/common/core/events/core/emitter_registrator';
import GestureEmitter from '@js/common/core/events/gesture/emitter.gesture';
import { eventData } from '@js/common/core/events/utils/index';
import { getHeight, getWidth } from '@js/core/utils/size';

const SWIPE_START_EVENT = 'dxswipestart';
const SWIPE_EVENT = 'dxswipe';
const SWIPE_END_EVENT = 'dxswipeend';

const HorizontalStrategy = {
  defaultItemSizeFunc() {
    return getWidth(this.getElement());
  },

  getBounds() {
    return [
      this._maxLeftOffset,
      this._maxRightOffset,
    ];
  },

  calcOffsetRatio(e) {
    const endEventData = eventData(e);
    return (endEventData.x - (this._savedEventData && this._savedEventData.x || 0)) / this._itemSizeFunc().call(this, e);
  },

  isFastSwipe(e) {
    const endEventData = eventData(e);
    return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.x - this._tickData.x) >= (endEventData.time - this._tickData.time);
  },
};

const VerticalStrategy = {
  defaultItemSizeFunc() {
    return getHeight(this.getElement());
  },

  getBounds() {
    return [
      this._maxTopOffset,
      this._maxBottomOffset,
    ];
  },

  calcOffsetRatio(e) {
    const endEventData = eventData(e);
    return (endEventData.y - (this._savedEventData && this._savedEventData.y || 0)) / this._itemSizeFunc().call(this, e);
  },

  isFastSwipe(e) {
    const endEventData = eventData(e);
    return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.y - this._tickData.y) >= (endEventData.time - this._tickData.time);
  },
};

const STRATEGIES = {
  horizontal: HorizontalStrategy,
  vertical: VerticalStrategy,
};

const SwipeEmitter = GestureEmitter.inherit({

  TICK_INTERVAL: 300,
  FAST_SWIPE_SPEED_LIMIT: 10,

  ctor(element) {
    this.callBase(element);

    this.direction = 'horizontal';
    this.elastic = true;
  },

  _getStrategy() {
    return STRATEGIES[this.direction];
  },

  _defaultItemSizeFunc() {
    return this._getStrategy().defaultItemSizeFunc.call(this);
  },

  _itemSizeFunc() {
    return this.itemSizeFunc || this._defaultItemSizeFunc;
  },

  _init(e) {
    this._tickData = eventData(e);
  },

  _start(e) {
    this._savedEventData = eventData(e);

    e = this._fireEvent(SWIPE_START_EVENT, e);

    if (!e.cancel) {
      this._maxLeftOffset = e.maxLeftOffset;
      this._maxRightOffset = e.maxRightOffset;
      this._maxTopOffset = e.maxTopOffset;
      this._maxBottomOffset = e.maxBottomOffset;
    }
  },

  _move(e) {
    const strategy = this._getStrategy();
    const moveEventData = eventData(e);
    let offset = strategy.calcOffsetRatio.call(this, e);

    offset = this._fitOffset(offset, this.elastic);

    if (moveEventData.time - this._tickData.time > this.TICK_INTERVAL) {
      this._tickData = moveEventData;
    }

    this._fireEvent(SWIPE_EVENT, e, {
      offset,
    });

    if (e.cancelable !== false) {
      e.preventDefault();
    }
  },

  _end(e) {
    const strategy = this._getStrategy();
    const offsetRatio = strategy.calcOffsetRatio.call(this, e);
    const isFast = strategy.isFastSwipe.call(this, e);
    let startOffset = offsetRatio;
    let targetOffset = this._calcTargetOffset(offsetRatio, isFast);

    startOffset = this._fitOffset(startOffset, this.elastic);
    targetOffset = this._fitOffset(targetOffset, false);

    this._fireEvent(SWIPE_END_EVENT, e, {
      offset: startOffset,
      targetOffset,
    });
  },

  _fitOffset(offset, elastic) {
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

  _calcTargetOffset(offsetRatio, isFast) {
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
  },
});

registerEmitter({
  emitter: SwipeEmitter,
  events: [
    SWIPE_START_EVENT,
    SWIPE_EVENT,
    SWIPE_END_EVENT,
  ],
});

export {
  SWIPE_END_EVENT as end,
  SWIPE_START_EVENT as start,
  SWIPE_EVENT as swipe,
};
