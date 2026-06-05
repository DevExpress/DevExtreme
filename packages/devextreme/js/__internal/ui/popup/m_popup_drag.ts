import { locate, move } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  end as dragEndEvent,
  move as dragMoveEvent,
  start as dragStartEvent,
} from '@js/common/core/events/drag';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import { fitIntoRange } from '@js/core/utils/math';
import { getOffset, getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import { isWindow } from '@js/core/utils/type';
import type {
  DxEvent,
  PointerInteractionEvent,
} from '@js/events';
import type { PopupPositionController } from '@ts/ui/popup/popup_position_controller';

const KEYBOARD_DRAG_STEP = 5;

export interface PopupDragConfig<TPositionController> {
  dragEnabled?: boolean;
  draggableElement?: HTMLElement | Element;
  handle?: HTMLElement | Element;
  positionController: TPositionController;
}

type MoveEvent = DxEvent<PointerInteractionEvent | KeyboardEvent>;

interface ElementPosition {
  top: number;
  left: number;
}

interface Delta {
  x: number;
  y: number;
}

export default class PopupDrag<TPositionController extends PopupPositionController> {
  _draggableElement?: PopupDragConfig<TPositionController>['draggableElement'];

  _dragEnabled?: PopupDragConfig<TPositionController>['dragEnabled'];

  _handle?: PopupDragConfig<TPositionController>['handle'];

  protected readonly _namespace: string = 'overlayDrag';

  _positionController?: PopupDragConfig<TPositionController>['positionController'];

  _prevOffset?: Delta;

  constructor(configuration: PopupDragConfig<TPositionController>) {
    this.init(configuration);
  }

  init(configuration: PopupDragConfig<TPositionController>): void {
    const {
      positionController,
      draggableElement,
      handle,
      dragEnabled,
    } = configuration;

    this._positionController = positionController;
    this._draggableElement = draggableElement;
    this._handle = handle;
    this._dragEnabled = dragEnabled;

    this.unsubscribe();

    if (!dragEnabled) {
      return;
    }

    this.subscribe();
  }

  moveDown(e: MoveEvent): void {
    this._moveTo(KEYBOARD_DRAG_STEP, 0, e);
  }

  moveUp(e: MoveEvent): void {
    this._moveTo(-KEYBOARD_DRAG_STEP, 0, e);
  }

  moveLeft(e: MoveEvent): void {
    this._moveTo(0, -KEYBOARD_DRAG_STEP, e);
  }

  moveRight(e: MoveEvent): void {
    this._moveTo(0, KEYBOARD_DRAG_STEP, e);
  }

  subscribe(): void {
    const eventNames = this._getEventNames();

    eventsEngine.on(this._handle, eventNames.startEventName, (e) => {
      this._dragStartHandler(e);
    });

    eventsEngine.on(this._handle, eventNames.updateEventName, (e) => {
      this._dragUpdateHandler(e);
    });

    eventsEngine.on(this._handle, eventNames.endEventName, (e) => {
      this._dragEndHandler(e);
    });
  }

  unsubscribe(): void {
    const eventNames = this._getEventNames();

    eventsEngine.off(this._handle, eventNames.startEventName);
    eventsEngine.off(this._handle, eventNames.updateEventName);
    eventsEngine.off(this._handle, eventNames.endEventName);
  }

  _getEventNames(): {
    startEventName: string;
    updateEventName: string;
    endEventName: string;
  } {
    const startEventName = addNamespace(dragStartEvent, this._namespace);
    const updateEventName = addNamespace(dragMoveEvent, this._namespace);
    const endEventName = addNamespace(dragEndEvent, this._namespace);

    return {
      startEventName,
      updateEventName,
      endEventName,
    };
  }

  _dragStartHandler(e: MoveEvent & {
    targetElements: unknown[];
    maxTopOffset: number;
    maxBottomOffset: number;
    maxLeftOffset: number;
    maxRightOffset: number;
  }): void {
    const allowedOffsets = this._getAllowedOffsets();

    this._prevOffset = { x: 0, y: 0 };

    e.targetElements = [];
    e.maxTopOffset = allowedOffsets.top;
    e.maxBottomOffset = allowedOffsets.bottom;
    e.maxLeftOffset = allowedOffsets.left;
    e.maxRightOffset = allowedOffsets.right;
  }

  _dragUpdateHandler(e: MoveEvent & {
    offset: { y: number; x: number }
  }): void {
    const targetOffset = {
      top: e.offset.y - (this._prevOffset?.y ?? 0),
      left: e.offset.x - (this._prevOffset?.x ?? 0),
    };

    this._moveByOffset(targetOffset);

    this._prevOffset = e.offset;
  }

  _dragEndHandler(event: MoveEvent): void {
    this._positionController?.dragHandled();
    this._positionController?.detectVisualPositionChange(event);
  }

  _moveTo(
    top: number,
    left: number,
    e: MoveEvent,
  ): void {
    if (!this._dragEnabled) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const offset = this._fitOffsetIntoAllowedRange(top, left);

    this._moveByOffset(offset);
    this._dragEndHandler(e);
  }

  _fitOffsetIntoAllowedRange(top: number, left: number): ElementPosition {
    const allowedOffsets = this._getAllowedOffsets();

    return {
      top: fitIntoRange(top, -allowedOffsets.top, allowedOffsets.bottom),
      left: fitIntoRange(left, -allowedOffsets.left, allowedOffsets.right),
    };
  }

  _getContainerDimensions(): {
    width: number;
    height: number;
  } {
    const document = domAdapter.getDocument();
    const container = this._positionController?.$dragResizeContainer?.get(0);

    let containerWidth = getOuterWidth(container);
    let containerHeight = getOuterHeight(container);

    if (isWindow(container)) {
      containerHeight = Math.max(document.body.clientHeight, containerHeight);
      containerWidth = Math.max(document.body.clientWidth, containerWidth);
    }

    return {
      width: containerWidth,
      height: containerHeight,
    };
  }

  _getContainerPosition(): ElementPosition {
    const container = this._positionController?.$dragResizeContainer?.get(0);

    return isWindow(container)
      ? { top: 0, left: 0 }
      : getOffset(container);
  }

  _getElementPosition(): ElementPosition {
    return getOffset(this._draggableElement);
  }

  _getInnerDelta(): Delta {
    const containerDimensions = this._getContainerDimensions();
    const elementDimensions = this._getElementDimensions();

    return {
      x: containerDimensions.width - (elementDimensions.width ?? 0),
      y: containerDimensions.height - (elementDimensions.height ?? 0),
    };
  }

  _getOuterDelta(): Delta {
    const { width = 0, height = 0 } = this._getElementDimensions();
    const { outsideDragFactor = 0 } = this._positionController ?? {};

    return {
      x: width * outsideDragFactor,
      y: height * outsideDragFactor,
    };
  }

  _getFullDelta(): Delta {
    const fullDelta = this._getInnerDelta();
    const outerDelta = this._getOuterDelta();

    return {
      x: fullDelta.x + outerDelta.x,
      y: fullDelta.y + outerDelta.y,
    };
  }

  _getElementDimensions(): {
    width: number | undefined;
    height: number | undefined;
  } {
    return {
      width: (this._draggableElement as HTMLElement)?.offsetWidth,
      height: (this._draggableElement as HTMLElement)?.offsetHeight,
    };
  }

  _getAllowedOffsets(): {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } {
    const fullDelta = this._getFullDelta();
    const isDragAllowed = fullDelta.y >= 0 && fullDelta.x >= 0;

    if (!isDragAllowed) {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      };
    }

    const elementPosition = this._getElementPosition();
    const containerPosition = this._getContainerPosition();
    const outerDelta = this._getOuterDelta();

    return {
      top: elementPosition.top - containerPosition.top + outerDelta.y,
      bottom: -elementPosition.top + containerPosition.top + fullDelta.y,
      left: elementPosition.left - containerPosition.left + outerDelta.x,
      right: -elementPosition.left + containerPosition.left + fullDelta.x,
    };
  }

  _moveByOffset(offset: ElementPosition): void {
    const currentPosition = locate(this._draggableElement);
    const newPosition = {
      left: currentPosition.left + offset.left,
      top: currentPosition.top + offset.top,
    };

    move(this._draggableElement, newPosition);
  }
}
