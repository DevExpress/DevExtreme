import type { Cancelable } from '@js/common/core/events';
import { eventData } from '@js/common/core/events/utils';
import { getHeight, getWidth } from '@js/core/utils/size';
import type { EmitterEvent, EventCoords } from '@ts/events/core/m_emitter';
import registerEmitter from '@ts/events/core/m_emitter_registrator';
import type { GestureDirection } from '@ts/events/gesture/m_emitter.gesture';
import GestureEmitter from '@ts/events/gesture/m_emitter.gesture';

const SWIPE_START_EVENT = 'dxswipestart';
const SWIPE_EVENT = 'dxswipe';
const SWIPE_END_EVENT = 'dxswipeend';

export type SwipeStartEvent = Event & Cancelable & {
  maxLeftOffset: number;
  maxRightOffset: number;
};
export type SwipeUpdateEvent = Event & {
  offset: number;

};
export type SwipeEndEvent = Event & {
  targetOffset: number;
};

type SwipeBoundsEvent = EmitterEvent & {
  maxLeftOffset?: number;
  maxRightOffset?: number;
  maxTopOffset?: number;
  maxBottomOffset?: number;
};

type SwipeItemSizeFunc = (this: SwipeEmitter, e?: EmitterEvent) => number;

interface SwipeStrategy {
  defaultItemSizeFunc: (this: SwipeEmitter) => number;
  getBounds: (this: SwipeEmitter) => [number | undefined, number | undefined];
  calcOffsetRatio: (this: SwipeEmitter, e: EmitterEvent) => number;
  isFastSwipe: (this: SwipeEmitter, e: EmitterEvent) => boolean;
}

const HorizontalStrategy: SwipeStrategy = {
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
    const endEventData: EventCoords = eventData(e);
    return (endEventData.x - ((this._savedEventData && this._savedEventData.x) || 0)) / this._itemSizeFunc().call(this, e);
  },

  isFastSwipe(e) {
    const endEventData: EventCoords = eventData(e);
    return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.x - this._tickData.x) >= (endEventData.time - this._tickData.time);
  },
};

const VerticalStrategy: SwipeStrategy = {
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
    const endEventData: EventCoords = eventData(e);
    return (endEventData.y - ((this._savedEventData && this._savedEventData.y) || 0)) / this._itemSizeFunc().call(this, e);
  },

  isFastSwipe(e) {
    const endEventData: EventCoords = eventData(e);
    return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.y - this._tickData.y) >= (endEventData.time - this._tickData.time);
  },
};

const STRATEGIES: Record<string, SwipeStrategy> = {
  horizontal: HorizontalStrategy,
  vertical: VerticalStrategy,
};

class SwipeEmitter extends GestureEmitter {
  TICK_INTERVAL = 300;

  FAST_SWIPE_SPEED_LIMIT = 10;

  elastic: boolean;

  itemSizeFunc?: SwipeItemSizeFunc;

  _tickData!: EventCoords;

  _savedEventData?: EventCoords;

  _maxLeftOffset?: number;

  _maxRightOffset?: number;

  _maxTopOffset?: number;

  _maxBottomOffset?: number;

  constructor(element: Element) {
    super(element);

    this.direction = 'horizontal';
    this.elastic = true;
  }

  _getStrategy(): SwipeStrategy {
    return STRATEGIES[this.direction as GestureDirection];
  }

  _defaultItemSizeFunc(): number {
    return this._getStrategy().defaultItemSizeFunc.call(this);
  }

  _itemSizeFunc(): SwipeItemSizeFunc {
    return this.itemSizeFunc ?? this._defaultItemSizeFunc;
  }

  _init(e: EmitterEvent): void {
    this._tickData = eventData(e);
  }

  _start(e: EmitterEvent): void {
    this._savedEventData = eventData(e);

    const startEvent: SwipeBoundsEvent = this._fireEvent(SWIPE_START_EVENT, e);

    if (!startEvent.cancel) {
      this._maxLeftOffset = startEvent.maxLeftOffset;
      this._maxRightOffset = startEvent.maxRightOffset;
      this._maxTopOffset = startEvent.maxTopOffset;
      this._maxBottomOffset = startEvent.maxBottomOffset;
    }
  }

  _move(e: EmitterEvent): void {
    const strategy = this._getStrategy();
    const moveEventData: EventCoords = eventData(e);
    let offset = strategy.calcOffsetRatio.call(this, e);

    offset = this._fitOffset(offset, this.elastic);

    if (moveEventData.time - this._tickData.time > this.TICK_INTERVAL) {
      this._tickData = moveEventData;
    }

    this._fireEvent(SWIPE_EVENT, e, {
      offset,
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    if (e.cancelable !== false) {
      e.preventDefault();
    }
  }

  _end(e: EmitterEvent): void {
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
  }

  _fitOffset(offset: number, elastic: boolean): number {
    const strategy = this._getStrategy();
    const bounds = strategy.getBounds.call(this);
    const minOffset = bounds[0];
    const maxOffset = bounds[1];

    if (minOffset !== undefined && offset < -minOffset) {
      return elastic ? (-2 * minOffset + offset) / 3 : -minOffset;
    }

    if (maxOffset !== undefined && offset > maxOffset) {
      return elastic ? (2 * maxOffset + offset) / 3 : maxOffset;
    }

    return offset;
  }

  _calcTargetOffset(offsetRatio: number, isFast: boolean): number {
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
}

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
