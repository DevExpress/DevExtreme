import { locate, move } from '../../animation/translator';
import domAdapter from '../../core/dom_adapter';
import { getOffset, getOuterWidth, getOuterHeight } from '../../core/utils/size';
import { fitIntoRange } from '../../core/utils/math';
import { isWindow } from '../../core/utils/type';
import eventsEngine from '../../events/core/events_engine';
import {
    start as dragEventStart,
    move as dragEventMove
} from '../../events/drag';
import { addNamespace } from '../../events/utils/index';

const KEYBOARD_DRAG_STEP = 5;

class OverlayDrag {
    constructor(config) {
        this.init(config);
    }

    init(config) {
        // TODO: get rid of dragEnabled, updatePositionChangeHandled
        const { dragEnabled, handle, container, draggableElement, outsideDragFactor, updatePositionChangeHandled } = config;

        this._container = container;
        this._outsideDragFactor = outsideDragFactor ?? 0;
        this._draggableElement = draggableElement;
        this._handle = handle;
        this._dragEnabled = dragEnabled;
        this._updatePositionChangeHandled = updatePositionChangeHandled;

        this.unsubscribe();

        if(!dragEnabled) {
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
    }

    unsubscribe() {
        const eventNames = this._getEventNames();

        eventsEngine.off(this._handle, eventNames.startEventName);
        eventsEngine.off(this._handle, eventNames.updateEventName);
    }

    get container() {
        return this._container;
    }

    set container(element) {
        this._container = element;
    }

    get outsideDragFactor() {
        return this._outsideDragFactor;
    }

    set outsideDragFactor(value) {
        this._outsideDragFactor = value;
    }

    _getEventNames() {
        const namespace = 'overlayDrag';
        const startEventName = addNamespace(dragEventStart, namespace);
        const updateEventName = addNamespace(dragEventMove, namespace);

        return {
            startEventName,
            updateEventName
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
            left: e.offset.x - this._prevOffset.x
        };

        this._moveByOffset(targetOffset);

        this._prevOffset = e.offset;
    }

    _moveTo(top, left, e) {
        if(!this._dragEnabled) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const allowedOffsets = this._getAllowedOffsets();
        const offset = {
            top: fitIntoRange(top, -allowedOffsets.top, allowedOffsets.bottom),
            left: fitIntoRange(left, -allowedOffsets.left, allowedOffsets.right)
        };

        this._moveByOffset(offset);
    }

    _getContainerDimensions() {
        const document = domAdapter.getDocument();

        let containerWidth = getOuterWidth(this._container);
        let containerHeight = getOuterHeight(this._container);
        if(isWindow(this._container)) {
            containerHeight = Math.max(document.body.clientHeight, containerHeight);
            containerWidth = Math.max(document.body.clientWidth, containerWidth);
        }

        return {
            width: containerWidth,
            height: containerHeight
        };
    }

    _getContainerPosition() {
        return isWindow(this._container)
            ? { top: 0, left: 0 }
            : getOffset(this._container);
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

        return {
            x: width * this._outsideDragFactor,
            y: height * this._outsideDragFactor
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
            height: this._draggableElement.offsetHeight
        };
    }

    _getAllowedOffsets() {
        const fullDelta = this._getFullDelta();
        const isDragAllowed = fullDelta.y >= 0 && fullDelta.x >= 0;
        if(!isDragAllowed) {
            return {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            };
        }

        const elementPosition = this._getElementPosition();
        const containerPosition = this._getContainerPosition();
        const outerDelta = this._getOuterDelta();

        return {
            top: elementPosition.top - containerPosition.top + outerDelta.y,
            bottom: -elementPosition.top + containerPosition.top + fullDelta.y,
            left: elementPosition.left - containerPosition.left + outerDelta.x,
            right: -elementPosition.left + containerPosition.left + fullDelta.x
        };
    }

    _moveByOffset(offset) {
        const currentPosition = locate(this._draggableElement);
        const newPosition = {
            left: currentPosition.left + offset.left,
            top: currentPosition.top + offset.top
        };

        move(this._draggableElement, newPosition);

        // TODO: remove
        this._updatePositionChangeHandled(true);

        return { h: { location: newPosition.left }, v: { location: newPosition.top } };
    }

    // TO REMOVE
    renderPositionHandler() {
        const allowedOffsets = this._getAllowedOffsets();

        return this._moveByOffset({
            top: fitIntoRange(0, -allowedOffsets.top, allowedOffsets.bottom),
            left: fitIntoRange(0, -allowedOffsets.left, allowedOffsets.right)
        });
    }
}

export default OverlayDrag;
