import registerEvent from '@js/common/core/events/core/event_registrator';
import { eventData as eData, fireEvent } from '@js/common/core/events/utils/index';
import { data as elementData, removeData } from '@js/core/element_data';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { wrapToArray } from '@js/core/utils/array';
import { contains } from '@js/core/utils/dom';
import * as iteratorUtils from '@js/core/utils/iterator';
import type { EmitterEvent, EventCoords } from '@ts/events/core/emitter';
import registerEmitter from '@ts/events/core/emitter_registrator';
import type { GestureEvent } from '@ts/events/gesture/emitter.gesture';
import GestureEmitter from '@ts/events/gesture/emitter.gesture';

const DRAG_START_EVENT = 'dxdragstart';
const DRAG_EVENT = 'dxdrag';
const DRAG_END_EVENT = 'dxdragend';

const DRAG_ENTER_EVENT = 'dxdragenter';
const DRAG_LEAVE_EVENT = 'dxdragleave';
const DROP_EVENT = 'dxdrop';

const DX_DRAG_EVENTS_COUNT_KEY = 'dxDragEventsCount';

interface DropTargetConfig {
  itemPositionFunc?: ($element: dxElementWrapper) => Coordinates;
  itemSizeFunc?: ($element: dxElementWrapper) => { width: number; height: number };
  checkDropTarget?: ($target: dxElementWrapper, e: GestureEvent) => boolean;
}

interface DropTargetHandleObj {
  type?: string;
  selector?: string;
}

type DragStartEvent = EmitterEvent & {
  maxLeftOffset?: number;
  maxRightOffset?: number;
  maxTopOffset?: number;
  maxBottomOffset?: number;
  targetElements?: Element | Element[] | null;
};

type DragMoveEvent = EmitterEvent & {
  _cancelPreventDefault?: boolean;
};

const knownDropTargets: Element[] = [];
const knownDropTargetSelectors: (string | undefined)[][] = [];
const knownDropTargetConfigs: DropTargetConfig[] = [];

const dropTargetRegistration = {

  setup(element: Element, data: DropTargetConfig): void {
    const knownDropTarget = knownDropTargets.includes(element);
    if (!knownDropTarget) {
      knownDropTargets.push(element);
      knownDropTargetSelectors.push([]);
      knownDropTargetConfigs.push(data || {});
    }
  },

  add(element: Element, handleObj: DropTargetHandleObj): void {
    const index = knownDropTargets.indexOf(element);
    this.updateEventsCounter(element, handleObj.type, 1);

    const { selector } = handleObj;
    if (!knownDropTargetSelectors[index].includes(selector)) {
      knownDropTargetSelectors[index].push(selector);
    }
  },

  updateEventsCounter(element: Element, event: string | undefined, value: number): void {
    if ([DRAG_ENTER_EVENT, DRAG_LEAVE_EVENT, DROP_EVENT].includes(event ?? '')) {
      const eventsCount: number = elementData(element, DX_DRAG_EVENTS_COUNT_KEY) || 0;
      elementData(element, DX_DRAG_EVENTS_COUNT_KEY, Math.max(0, eventsCount + value));
    }
  },

  remove(element: Element, handleObj: DropTargetHandleObj): void {
    this.updateEventsCounter(element, handleObj.type, -1);
  },

  teardown(element: Element): void {
    const handlersCount: number | undefined = elementData(element, DX_DRAG_EVENTS_COUNT_KEY);
    if (!handlersCount) {
      const index = knownDropTargets.indexOf(element);
      knownDropTargets.splice(index, 1);
      knownDropTargetSelectors.splice(index, 1);
      knownDropTargetConfigs.splice(index, 1);
      removeData(element, DX_DRAG_EVENTS_COUNT_KEY);
    }
  },

};

registerEvent(DRAG_ENTER_EVENT, dropTargetRegistration);
registerEvent(DRAG_LEAVE_EVENT, dropTargetRegistration);
registerEvent(DROP_EVENT, dropTargetRegistration);

const getItemDelegatedTargets = function ($element: dxElementWrapper): dxElementWrapper {
  const dropTargetIndex = knownDropTargets.indexOf($element.get(0));
  const dropTargetSelectors = knownDropTargetSelectors[dropTargetIndex]
    .filter((selector) => selector);

  let $delegatedTargets = $element.find(dropTargetSelectors.join(', '));
  if (knownDropTargetSelectors[dropTargetIndex].includes(undefined)) {
    $delegatedTargets = $delegatedTargets.add($element);
  }
  return $delegatedTargets;
};

const getItemConfig = function ($element: dxElementWrapper): DropTargetConfig {
  const dropTargetIndex = knownDropTargets.indexOf($element.get(0));
  return knownDropTargetConfigs[dropTargetIndex];
};

const getItemPosition = function (
  dropTargetConfig: DropTargetConfig,
  $element: dxElementWrapper,
): Coordinates {
  if (dropTargetConfig.itemPositionFunc) {
    return dropTargetConfig.itemPositionFunc($element);
  }
  // NOTE: drop targets are always non-empty wrappers, so offset() is defined.
  return $element.offset() as Coordinates;
};

const getItemSize = function (
  dropTargetConfig: DropTargetConfig,
  $element: dxElementWrapper,
): { width: number; height: number } {
  if (dropTargetConfig.itemSizeFunc) {
    return dropTargetConfig.itemSizeFunc($element);
  }

  return {
    width: $element.get(0).getBoundingClientRect().width,
    height: $element.get(0).getBoundingClientRect().height,
  };
};

class DragEmitter extends GestureEmitter {
  _initEvent!: EmitterEvent;

  _maxLeftOffset?: number;

  _maxRightOffset?: number;

  _maxTopOffset?: number;

  _maxBottomOffset?: number;

  _dropTargets!: Element[];

  _currentDropTarget?: Element | null;

  constructor(element: Element) {
    super(element);

    this.direction = 'both';
  }

  _init(e: EmitterEvent): void {
    this._initEvent = e;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _start(e: EmitterEvent): void {
    const startEvent: DragStartEvent = this._fireEvent(DRAG_START_EVENT, this._initEvent);

    this._maxLeftOffset = startEvent.maxLeftOffset;
    this._maxRightOffset = startEvent.maxRightOffset;
    this._maxTopOffset = startEvent.maxTopOffset;
    this._maxBottomOffset = startEvent.maxBottomOffset;

    if (startEvent.targetElements || startEvent.targetElements === null) {
      const dropTargets = wrapToArray(startEvent.targetElements || []);
      this._dropTargets = iteratorUtils.map(dropTargets, (element) => $(element).get(0));
    } else {
      this._dropTargets = knownDropTargets;
    }
  }

  _move(e: GestureEvent): void {
    const eventData: EventCoords = eData(e);
    const dragOffset = this._calculateOffset(eventData);

    const moveEvent: DragMoveEvent = this._fireEvent(DRAG_EVENT, e, {
      offset: dragOffset,
    });

    this._processDropTargets(moveEvent as GestureEvent);

    if (!moveEvent._cancelPreventDefault) {
      moveEvent.preventDefault();
    }
  }

  _calculateOffset(eventData: EventCoords): { x: number; y: number } {
    return {
      x: this._calculateXOffset(eventData),
      y: this._calculateYOffset(eventData),
    };
  }

  _calculateXOffset(eventData: EventCoords): number {
    if (this.direction !== 'vertical') {
      const offset = eventData.x - this._startEventData.x;

      return this._fitOffset(offset, this._maxLeftOffset, this._maxRightOffset);
    }
    return 0;
  }

  _calculateYOffset(eventData: EventCoords): number {
    if (this.direction !== 'horizontal') {
      const offset = eventData.y - this._startEventData.y;

      return this._fitOffset(offset, this._maxTopOffset, this._maxBottomOffset);
    }
    return 0;
  }

  _fitOffset(offset: number, minOffset: number | undefined, maxOffset: number | undefined): number {
    let fittedOffset = offset;

    if (minOffset != null) {
      fittedOffset = Math.max(fittedOffset, -minOffset);
    }
    if (maxOffset != null) {
      fittedOffset = Math.min(fittedOffset, maxOffset);
    }

    return fittedOffset;
  }

  _processDropTargets(e: GestureEvent): void {
    const target = this._findDropTarget(e);
    const sameTarget = target === this._currentDropTarget;

    if (!sameTarget) {
      this._fireDropTargetEvent(e, DRAG_LEAVE_EVENT);
      this._currentDropTarget = target;
      this._fireDropTargetEvent(e, DRAG_ENTER_EVENT);
    }
  }

  _fireDropTargetEvent(event: EmitterEvent, eventName: string): void {
    if (!this._currentDropTarget) {
      return;
    }

    const eventData = {
      type: eventName,
      originalEvent: event,
      draggingElement: this._$element.get(0),
      target: this._currentDropTarget,
    };

    fireEvent(eventData);
  }

  _findDropTarget(e: GestureEvent): Element | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let result: Element | undefined;

    iteratorUtils.each(knownDropTargets, (_, target) => {
      if (!this._checkDropTargetActive(target)) {
        return;
      }

      const $target = $(target);
      iteratorUtils.each(getItemDelegatedTargets($target), (_index, delegatedTarget) => {
        const $delegatedTarget = $(delegatedTarget);
        if (this._checkDropTarget(getItemConfig($target), $delegatedTarget, $(result), e)) {
          result = delegatedTarget;
        }
      });
    });

    return result;
  }

  _checkDropTargetActive(target: Element): boolean {
    let active = false;

    iteratorUtils.each(this._dropTargets, (_, activeTarget) => {
      active = active || activeTarget === target || contains(activeTarget, target);
      return !active;
    });

    return active;
  }

  _checkDropTarget(
    config: DropTargetConfig,
    $target: dxElementWrapper,
    $prevTarget: dxElementWrapper,
    e: GestureEvent,
  ): boolean | dxElementWrapper {
    const isDraggingElement = $target.get(0) === $(e.target).get(0);
    if (isDraggingElement) {
      return false;
    }

    const targetPosition = getItemPosition(config, $target);
    if (e.pageX < targetPosition.left) {
      return false;
    }
    if (e.pageY < targetPosition.top) {
      return false;
    }

    const targetSize = getItemSize(config, $target);
    if (e.pageX > targetPosition.left + targetSize.width) {
      return false;
    }
    if (e.pageY > targetPosition.top + targetSize.height) {
      return false;
    }

    if ($prevTarget.length && $prevTarget.closest($target).length) {
      return false;
    }

    if (config.checkDropTarget && !config.checkDropTarget($target, e)) {
      return false;
    }

    return $target;
  }

  _end(e: GestureEvent): void {
    const eventData: EventCoords = eData(e);

    this._fireEvent(DRAG_END_EVENT, e, {
      offset: this._calculateOffset(eventData),
    });

    this._fireDropTargetEvent(e, DROP_EVENT);
    delete this._currentDropTarget;
  }
}

registerEmitter({
  emitter: DragEmitter,
  events: [
    DRAG_START_EVENT,
    DRAG_EVENT,
    DRAG_END_EVENT,
  ],
});

/// #DEBUG
export { knownDropTargets as dropTargets };
/// #ENDDEBUG

export {
  DROP_EVENT as drop,
  DRAG_END_EVENT as end,
  DRAG_ENTER_EVENT as enter,
  DRAG_LEAVE_EVENT as leave,
  DRAG_EVENT as move,
  DRAG_START_EVENT as start,
};
