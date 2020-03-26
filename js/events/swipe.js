const eventUtils = require('./utils');
const GestureEmitter = require('./gesture/emitter.gesture');
const registerEmitter = require('./core/emitter_registrator');

const SWIPE_START_EVENT = 'dxswipestart';
const SWIPE_EVENT = 'dxswipe';
const SWIPE_END_EVENT = 'dxswipeend';


const HorizontalStrategy = {
    defaultItemSizeFunc: function() {
        return this.getElement().width();
    },

    getBounds: function() {
        return [
            this._maxLeftOffset,
            this._maxRightOffset
        ];
    },

    calcOffsetRatio: function(e) {
        const endEventData = eventUtils.eventData(e);
        return (endEventData.x - (this._savedEventData && this._savedEventData.x || 0)) / this._itemSizeFunc().call(this, e);
    },

    isFastSwipe: function(e) {
        const endEventData = eventUtils.eventData(e);
        return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.x - this._tickData.x) >= (endEventData.time - this._tickData.time);
    }
};

const VerticalStrategy = {
    defaultItemSizeFunc: function() {
        return this.getElement().height();
    },

    getBounds: function() {
        return [
            this._maxTopOffset,
            this._maxBottomOffset
        ];
    },

    calcOffsetRatio: function(e) {
        const endEventData = eventUtils.eventData(e);
        return (endEventData.y - (this._savedEventData && this._savedEventData.y || 0)) / this._itemSizeFunc().call(this, e);
    },

    isFastSwipe: function(e) {
        const endEventData = eventUtils.eventData(e);
        return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.y - this._tickData.y) >= (endEventData.time - this._tickData.time);
    }
};


const STRATEGIES = {
    'horizontal': HorizontalStrategy,
    'vertical': VerticalStrategy
};

const SwipeEmitter = GestureEmitter.inherit({

    TICK_INTERVAL: 300,
    FAST_SWIPE_SPEED_LIMIT: 10,

    ctor: function(element) {
        this.callBase(element);

        this.direction = 'horizontal';
        this.elastic = true;
    },

    _getStrategy: function() {
        return STRATEGIES[this.direction];
    },

    _defaultItemSizeFunc: function() {
        return this._getStrategy().defaultItemSizeFunc.call(this);
    },

    _itemSizeFunc: function() {
        return this.itemSizeFunc || this._defaultItemSizeFunc;
    },

    _init: function(e) {
        this._tickData = eventUtils.eventData(e);
    },

    _start: function(e) {
        this._savedEventData = eventUtils.eventData(e);

        e = this._fireEvent(SWIPE_START_EVENT, e);

        if(!e.cancel) {
            this._maxLeftOffset = e.maxLeftOffset;
            this._maxRightOffset = e.maxRightOffset;
            this._maxTopOffset = e.maxTopOffset;
            this._maxBottomOffset = e.maxBottomOffset;
        }
    },

    _move: function(e) {
        const strategy = this._getStrategy();
        const moveEventData = eventUtils.eventData(e);
        let offset = strategy.calcOffsetRatio.call(this, e);

        offset = this._fitOffset(offset, this.elastic);

        if(moveEventData.time - this._tickData.time > this.TICK_INTERVAL) {
            this._tickData = moveEventData;
        }

        this._fireEvent(SWIPE_EVENT, e, {
            offset: offset
        });

        e.preventDefault();
    },

    _end: function(e) {
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

    _fitOffset: function(offset, elastic) {
        const strategy = this._getStrategy();
        const bounds = strategy.getBounds.call(this);

        if(offset < -bounds[0]) {
            return elastic ? (-2 * bounds[0] + offset) / 3 : -bounds[0];
        }

        if(offset > bounds[1]) {
            return elastic ? (2 * bounds[1] + offset) / 3 : bounds[1];
        }

        return offset;
    },

    _calcTargetOffset: function(offsetRatio, isFast) {
        let result;
        if(isFast) {
            result = Math.ceil(Math.abs(offsetRatio));
            if(offsetRatio < 0) {
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

registerEmitter({
    emitter: SwipeEmitter,
    events: [
        SWIPE_START_EVENT,
        SWIPE_EVENT,
        SWIPE_END_EVENT
    ]
});

exports.swipe = SWIPE_EVENT;
exports.start = SWIPE_START_EVENT;
exports.end = SWIPE_END_EVENT;
