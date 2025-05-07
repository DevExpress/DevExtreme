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

const KEYBOARD_DRAG_STEP = 5;

class PopupDrag {
  _positionController: any;

  _draggableElement: any;

  _handle: any;

  _dragEnabled: any;

  _prevOffset!: { x: number; y: number };

  constructor(config) {
    this.init(config);
  }

  init({
    dragEnabled,
    handle,
    draggableElement,
    positionController,
  }) {
    // TODO: get rid of dragEnabled

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

  moveDown(e) {
    this._moveTo(KEYBOARD_DRAG_STEP, 0, e);
  }

  moveUp(e) {
    this._moveTo(-KEYBOARD_DRAG_STEP, 0, e);
  }

  moveLeft(e) {
    this._moveTo(0, -KEYBOARD_DRAG_STEP, e);
  }

  moveRight(e) {
    this._moveTo(0, KEYBOARD_DRAG_STEP, e);
  }

  subscribe() {
    const eventNames = this._getEventNames();

    eventsEngine.on(this._handle, eventNames.startEventName, (e) => { this._dragStartHandler(e); });
    eventsEngine.on(this._handle, eventNames.updateEventName, (e) => { this._dragUpdateHandler(e); });
    eventsEngine.on(this._handle, eventNames.endEventName, (e) => { this._dragEndHandler(e); });
  }

  unsubscribe() {
    const eventNames = this._getEventNames();

    eventsEngine.off(this._handle, eventNames.startEventName);
    eventsEngine.off(this._handle, eventNames.updateEventName);
    eventsEngine.off(this._handle, eventNames.endEventName);
  }

  _getEventNames() {
    const namespace = 'overlayDrag';
    const startEventName = addNamespace(dragStartEvent, namespace);
    const updateEventName = addNamespace(dragMoveEvent, namespace);
    const endEventName = addNamespace(dragEndEvent, namespace);

    return {
      startEventName,
      updateEventName,
      endEventName,
    };
  }

  _dragStartHandler(e) {
    const allowedOffsets = this._getAllowedOffsets();

    this._prevOffset = { x: 0, y: 0 };

    e.targetElements = [];
    e.maxTopOffset = allowedOffsets.top;
    e.maxBottomOffset = allowedOffsets.bottom;
    e.maxLeftOffset = allowedOffsets.left;
    e.maxRightOffset = allowedOffsets.right;
  }

  _dragUpdateHandler(e) {
    const targetOffset = {
      top: e.offset.y - this._prevOffset.y,
      left: e.offset.x - this._prevOffset.x,
    };

    this._moveByOffset(targetOffset);

    this._prevOffset = e.offset;
  }

  _dragEndHandler(event) {
    this._positionController.dragHandled();
    this._positionController.detectVisualPositionChange(event);
  }

  _moveTo(top, left, e) {
    if (!this._dragEnabled) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const offset = this._fitOffsetIntoAllowedRange(top, left);
    this._moveByOffset(offset);
    this._dragEndHandler(e);
  }

  _fitOffsetIntoAllowedRange(top, left) {
    const allowedOffsets = this._getAllowedOffsets();

    return {
      top: fitIntoRange(top, -allowedOffsets.top, allowedOffsets.bottom),
      left: fitIntoRange(left, -allowedOffsets.left, allowedOffsets.right),
    };
  }

  _getContainerDimensions() {
    const document = domAdapter.getDocument();
    const container = this._positionController.$dragResizeContainer.get(0);

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

  _getContainerPosition() {
    const container = this._positionController.$dragResizeContainer.get(0);

    return isWindow(container)
      ? { top: 0, left: 0 }
      : getOffset(container);
  }

  _getElementPosition() {
    return getOffset(this._draggableElement);
  }

  _getInnerDelta() {
    const containerDimensions = this._getContainerDimensions();
    const elementDimensions = this._getElementDimensions();

    return {
      x: containerDimensions.width - elementDimensions.width,
      y: containerDimensions.height - elementDimensions.height,
    };
  }

  _getOuterDelta() {
    const { width, height } = this._getElementDimensions();
    const { outsideDragFactor } = this._positionController;

    return {
      x: width * outsideDragFactor,
      y: height * outsideDragFactor,
    };
  }

  _getFullDelta() {
    const fullDelta = this._getInnerDelta();
    const outerDelta = this._getOuterDelta();

    return {
      x: fullDelta.x + outerDelta.x,
      y: fullDelta.y + outerDelta.y,
    };
  }

  _getElementDimensions() {
    return {
      width: this._draggableElement.offsetWidth,
      height: this._draggableElement.offsetHeight,
    };
  }

  _getAllowedOffsets() {
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

  _moveByOffset(offset) {
    const currentPosition = locate(this._draggableElement);
    const newPosition = {
      left: currentPosition.left + offset.left,
      top: currentPosition.top + offset.top,
    };

    move(this._draggableElement, newPosition);
  }
}

export default PopupDrag;
