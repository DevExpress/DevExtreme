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

class OverlayDrag {
    constructor(options) {
        const { dragEnabled, handle, container, draggableElement, outsideMultiplayer, updatePositionChangeHandled } = options;
        const namespace = 'overlayDrag';
        const startEventName = addNamespace(dragEventStart, namespace);
        const updateEventName = addNamespace(dragEventMove, namespace);

        this.container = container;
        this.outsideMultiplayer = outsideMultiplayer;
        this._draggableElement = draggableElement;
        this._handle = handle;
        this._updatePositionChangeHandled = updatePositionChangeHandled;

        this.unsubscribe();

        if(!dragEnabled) {
            return;
        }

        eventsEngine.on(handle, startEventName, (e) => { this._dragStartHandler(e); });
        eventsEngine.on(handle, updateEventName, (e) => { this._dragUpdateHandler(e); });
    }

    unsubscribe() {
        const namespace = 'overlayDrag';
        const startEventName = addNamespace(dragEventStart, namespace);
        const updateEventName = addNamespace(dragEventMove, namespace);

        eventsEngine.off(this._handle, startEventName);
        eventsEngine.off(this._handle, updateEventName);
    }

    moveTo(top, left, e) {
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
        if(this._isWindow(container)) {
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

    _deltaSize() {
        const draggableElement = this._draggableElement;
        const draggableElementWidth = draggableElement.offsetWidth;
        const draggableElementHeight = draggableElement.offsetHeight;
        const containerDimensions = this._getContainerDimensions();
        const outsideMultiplayer = this.outsideMultiplayer;

        return {
            width: containerDimensions.width - draggableElementWidth + (draggableElementWidth * outsideMultiplayer),
            height: containerDimensions.height - draggableElementHeight + (draggableElementHeight * outsideMultiplayer),
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
        const overlayPosition = getOffset(this._draggableElement);
        const dragAreaPosition = this._isWindow(this._container)
            ? { top: 0, left: 0 }
            : getOffset(this._container);
        const deltaSize = this._deltaSize();
        const isDragAllowed = deltaSize.height >= 0 && deltaSize.width >= 0;

        const dragAreaOffsetMultiplayer = this.outsideMultiplayer;
        const dragAreaOffset = {
            width: this._draggableElement.offsetWidth * dragAreaOffsetMultiplayer,
            height: this._draggableElement.offsetHeight * dragAreaOffsetMultiplayer
        };

        return {
            top: isDragAllowed ? overlayPosition.top - dragAreaPosition.top + dragAreaOffset.height : 0,
            bottom: isDragAllowed ? -overlayPosition.top + dragAreaPosition.top + deltaSize.height : 0,
            left: isDragAllowed ? overlayPosition.left - dragAreaPosition.left + dragAreaOffset.width : 0,
            right: isDragAllowed ? -overlayPosition.left + dragAreaPosition.left + deltaSize.width : 0
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

    _isWindow(element) {
        return !!element && isWindow(element);
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

    get outsideMultiplayer() {
        return this._outsideMultiplayer ?? 0;
    }

    set outsideMultiplayer(value) {
        this._outsideMultiplayer = value;
    }
}

export default OverlayDrag;
