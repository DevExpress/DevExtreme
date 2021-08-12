import { locate, move } from '../../animation/translator';
import domAdapter from '../../core/dom_adapter';
import { getOffset } from '../../core/utils/size';
import $ from '../../core/renderer';
import { fitIntoRange } from '../../core/utils/math';
import { isWindow } from '../../core/utils/type';
import eventsEngine from '../../events/core/events_engine';

class DraggableOverlay {
    constructor(options) {
        const { dragTarget, startEventName, updateEventName, dragContainer, outsideMultiplayer, content, updatePositionChangedHandled } = options;
        eventsEngine.on(dragTarget, startEventName, (e) => { this._dragStartHandler(e); });
        eventsEngine.on(dragTarget, updateEventName, (e) => { this._dragUpdateHandler(e); });

        this._$container = dragContainer;
        this._outsideMultiplayer = outsideMultiplayer;
        this._$content = content;
        this._updatePositionChangedHandled = updatePositionChangedHandled;
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

    _deltaSize() {
        const $content = this.$content();
        const $container = this.$container();

        const contentWidth = $content.outerWidth();
        const contentHeight = $content.outerHeight();
        let containerWidth = $container.outerWidth();
        let containerHeight = $container.outerHeight();
        const document = domAdapter.getDocument();
        if(this._isWindow($container)) {
            const fullPageHeight = Math.max($(document).outerHeight(), containerHeight);
            const fullPageWidth = Math.max($(document).outerWidth(), containerWidth);

            containerHeight = fullPageHeight;
            containerWidth = fullPageWidth;
        }

        containerWidth = Math.min(containerWidth, $(document).outerWidth());
        const outsideMultiplayer = this.outsideMultiplayer() ?? 0;

        return {
            width: containerWidth - contentWidth + (contentWidth * outsideMultiplayer),
            height: containerHeight - contentHeight + (contentHeight * outsideMultiplayer),
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
        const popupPosition = getOffset(this.$content().get(0));
        const dragAreaPosition = this._isWindow(this.$container())
            ? { top: 0, left: 0 }
            : getOffset(this.$container().get(0));
        const deltaSize = this._deltaSize();
        const isAllowedDrag = deltaSize.height >= 0 && deltaSize.width >= 0;

        const dragAreaOffsetMultiplayer = this.outsideMultiplayer() ?? 0;
        const dragAreaOffset = {
            width: this._$content.outerWidth() * dragAreaOffsetMultiplayer,
            height: this._$content.outerHeight() * dragAreaOffsetMultiplayer
        };

        return {
            top: isAllowedDrag ? popupPosition.top - dragAreaPosition.top + dragAreaOffset.height : 0,
            bottom: isAllowedDrag ? -popupPosition.top + dragAreaPosition.top + deltaSize.height : 0,
            left: isAllowedDrag ? popupPosition.left - dragAreaPosition.left + dragAreaOffset.width : 0,
            right: isAllowedDrag ? -popupPosition.left + dragAreaPosition.left + deltaSize.width : 0
        };
    }

    _changePosition(offset) {
        const position = locate(this._$content);

        move(this._$content, {
            left: position.left + offset.left,
            top: position.top + offset.top
        });

        this._updatePositionChangedHandled(true);

        // this._positionChangeHandled = true;
    }

    _isWindow($element) {
        return !!$element && isWindow($element.get(0));
    }

    updateDragContainer($element) {
        this._$container = $element;
    }

    updateOutsideMultiplayer(value) {
        this._outsideMultiplayer = value;
    }

    changePositionOnRenderPosition() {
        const allowedOffsets = this._allowedOffsets();

        this._changePosition({
            top: fitIntoRange(0, -allowedOffsets.top, allowedOffsets.bottom),
            left: fitIntoRange(0, -allowedOffsets.left, allowedOffsets.right)
        });
    }

    $content() {
        return this._$content;
    }

    $container() {
        return this._$container;
    }

    outsideMultiplayer() {
        return this._outsideMultiplayer;
    }
}

export default DraggableOverlay;
