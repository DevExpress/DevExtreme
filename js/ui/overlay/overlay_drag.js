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
        const { dragEnabled, handle, container, draggableElement, outsideDragFactor, updatePositionChangeHandled } = config;

        this.container = container;
        this.outsideDragFactor = outsideDragFactor;
        this._draggableElement = draggableElement;
        this._handle = handle;
        this.dragEnabled = dragEnabled;
        this._updatePositionChangeHandled = updatePositionChangeHandled;

        this.unsubscribe();

        if(!dragEnabled) {
            return;
        }

        this.subscribe();
    }

    moveDown(e) {
        this.moveTo(KEYBOARD_DRAG_STEP, 0, e);
    }

    moveUp(e) {
        this.moveTo(-KEYBOARD_DRAG_STEP, 0, e);
    }

    moveLeft(e) {
        this.moveTo(0, -KEYBOARD_DRAG_STEP, e);
    }

    moveRight(e) {
        this.moveTo(0, KEYBOARD_DRAG_STEP, e);
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

    moveTo(top, left, e) {
        if(!this.dragEnabled) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const allowedOffsets = this._allowedOffsets();
        const offset = {
            top: fitIntoRange(top, -allowedOffsets.top, allowedOffsets.bottom),
            left: fitIntoRange(left, -allowedOffsets.left, allowedOffsets.right)
        };
        this._changePosition(offset);
    }

    _dragStartHandler(e) {
        e.targetElements = [];

        this._prevOffset = { x: 0, y: 0 };

        const allowedOffsets = this._allowedOffsets();
        e.maxTopOffset = allowedOffsets.top;
        e.maxBottomOffset = allowedOffsets.bottom;
        e.maxLeftOffset = allowedOffsets.left;
        e.maxRightOffset = allowedOffsets.right;
    }

    _getContainerDimensions() {
        const container = this.container;
        let containerWidth = getOuterWidth(container);
        let containerHeight = getOuterHeight(container);
        const document = domAdapter.getDocument();
        if(isWindow(container)) {
            const fullPageHeight = Math.max(document.body.clientHeight, containerHeight);
            const fullPageWidth = Math.max(document.body.clientWidth, containerWidth);

            containerHeight = fullPageHeight;
            containerWidth = fullPageWidth;
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

    _deltaSize() {
        const draggableElement = this._draggableElement;
        const draggableElementWidth = draggableElement.offsetWidth;
        const draggableElementHeight = draggableElement.offsetHeight;
        const containerDimensions = this._getContainerDimensions();
        const outsideDragFactor = this.outsideDragFactor;
        const outOfContainerOffset = {
            width: draggableElementWidth * outsideDragFactor,
            height: draggableElementHeight * outsideDragFactor
        };

        return {
            width: containerDimensions.width - draggableElementWidth + outOfContainerOffset.width,
            height: containerDimensions.height - draggableElementHeight + outOfContainerOffset.height,
        };
    }

    _dragUpdateHandler(e) {
        const offset = e.offset;
        const prevOffset = this._prevOffset;
        const targetOffset = {
            top: offset.y - prevOffset.y,
            left: offset.x - prevOffset.x
        };

        this._changePosition(targetOffset);

        this._prevOffset = offset;
    }

    _allowedOffsets() {
        const draggableElementPosition = getOffset(this._draggableElement);
        const dragAreaPosition = this._getContainerPosition();
        const deltaSize = this._deltaSize();
        const isDragAllowed = deltaSize.height >= 0 && deltaSize.width >= 0;

        const dragAreaOffsetFactor = this.outsideDragFactor;
        const dragAreaOffset = {
            width: this._draggableElement.offsetWidth * dragAreaOffsetFactor,
            height: this._draggableElement.offsetHeight * dragAreaOffsetFactor
        };

        return {
            top: isDragAllowed ? draggableElementPosition.top - dragAreaPosition.top + dragAreaOffset.height : 0,
            bottom: isDragAllowed ? -draggableElementPosition.top + dragAreaPosition.top + deltaSize.height : 0,
            left: isDragAllowed ? draggableElementPosition.left - dragAreaPosition.left + dragAreaOffset.width : 0,
            right: isDragAllowed ? -draggableElementPosition.left + dragAreaPosition.left + deltaSize.width : 0
        };
    }

    _changePosition(offset) {
        const position = locate(this._draggableElement);
        const resultPosition = {
            left: position.left + offset.left,
            top: position.top + offset.top
        };

        move(this._draggableElement, resultPosition);
        this._updatePositionChangeHandled(true);

        return { h: { location: resultPosition.left }, v: { location: resultPosition.top } };
    }

    renderPositionHandler() {
        const allowedOffsets = this._allowedOffsets();

        return this._changePosition({
            top: fitIntoRange(0, -allowedOffsets.top, allowedOffsets.bottom),
            left: fitIntoRange(0, -allowedOffsets.left, allowedOffsets.right)
        });
    }

    get container() {
        return this._container;
    }

    set container(element) {
        this._container = element;
    }

    get outsideDragFactor() {
        return this._outsideDragFactor ?? 0;
    }

    set outsideDragFactor(value) {
        this._outsideDragFactor = value;
    }
}

export default OverlayDrag;
