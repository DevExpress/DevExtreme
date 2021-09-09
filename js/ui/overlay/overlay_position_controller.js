import $ from '../../core/renderer';
import { isDefined, isString, isEvent, isWindow } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import positionUtils from '../../animation/position';
import { resetPosition, locate, move } from '../../animation/translator';
import { getWindow } from '../../core/utils/window';
import { originalViewPort, value as viewPort } from '../../core/utils/view_port';
import { pairToObject } from '../../core/utils/common';

const window = getWindow();

const OVERLAY_POSITION_ALIASES = {
    'top': { my: 'top center', at: 'top center' },
    'bottom': { my: 'bottom center', at: 'bottom center' },
    'right': { my: 'right center', at: 'right center' },
    'left': { my: 'left center', at: 'left center' },
    'center': { my: 'center', at: 'center' },
    'right bottom': { my: 'right bottom', at: 'right bottom' },
    'right top': { my: 'right top', at: 'right top' },
    'left bottom': { my: 'left bottom', at: 'left bottom' },
    'left top': { my: 'left top', at: 'left top' }
};
const OVERLAY_DEFAULT_BOUNDARY_OFFSET = { h: 0, v: 0 };


const SIDE_BORDER_WIDTH_STYLES = {
    'left': 'borderLeftWidth',
    'top': 'borderTopWidth',
    'right': 'borderRightWidth',
    'bottom': 'borderBottomWidth'
};
const WEIGHT_OF_SIDES = {
    'left': -1,
    'top': -1,
    'center': 0,
    'right': 1,
    'bottom': 1
};
const POPOVER_POSITION_ALIASES = {
    // NOTE: public API
    'top': { my: 'bottom center', at: 'top center', collision: 'fit flip' },
    'bottom': { my: 'top center', at: 'bottom center', collision: 'fit flip' },
    'right': { my: 'left center', at: 'right center', collision: 'flip fit' },
    'left': { my: 'right center', at: 'left center', collision: 'flip fit' }
};
const POPOVER_DEFAULT_BOUNDARY_OFFSET = { h: 10, v: 10 };

class OverlayPositionController {
    constructor({
        position, target, container,
        $root, $content, $wrapper,
        onPositioned,
        allowDragOutside, dragAndResizeArea, outsideDragFactor
    }) {
        this._props = {
            position,
            target,
            container,
            allowDragOutside,
            dragAndResizeArea,
            outsideDragFactor
        };

        this._onPositioned = onPositioned;
        this._$root = $root;
        this._$content = $content;
        this._$wrapper = $wrapper;

        this._visualPosition = undefined;
        this._$wrapperCoveredElement = undefined;
        this._$dragResizeContainer = undefined;
        this._outsideDragFactor = undefined;

        this.updateContainer(container);
        this.updatePosition(position, target);
        this._updateDragResizeContainer();
        this._updateOutsideDragFactor();
    }

    get $dragResizeContainer() {
        return this._$dragResizeContainer;
    }

    set dragAndResizeArea(dragAndResizeArea) {
        this._props.dragAndResizeArea = dragAndResizeArea;

        this._updateDragResizeContainer();
    }

    set allowDragOutside(allowDragOutside) {
        this._props.allowDragOutside = allowDragOutside;

        this._updateDragResizeContainer();
        this._updateOutsideDragFactor();
    }

    get outsideDragFactor() {
        return this._outsideDragFactor;
    }

    set outsideDragFactor(outsideDragFactor) {
        this._props.outsideDragFactor = outsideDragFactor;

        this._updateOutsideDragFactor();
    }

    updateTarget(target) {
        this._props.target = target;

        this.updatePosition(this._props.position, target);
    }

    updatePosition(positionProp, targetProp = this._props.target) {
        this._props.position = positionProp;
        this._position = this._normalizePosition(positionProp, targetProp);

        this._updateWrapperCoveredElement();
    }

    updateContainer(containerProp) {
        this._props.container = containerProp;

        const container = containerProp ?? viewPort();

        let $container = this._$root.closest(container);

        if(!$container.length) {
            $container = $(container).first();
        }

        this._$container = $container.length ? $container : this._$root.parent();
        this._updateWrapperCoveredElement();
        this._updateDragResizeContainer();
    }

    positionContent() {
        if(!this._visualPosition) {
            this.renderInitialPosition();
        } else {
            const currentPosition = locate(this._$content);
            move(this._$content, this._visualPosition);
            this._positionedHandler(currentPosition, this._visualPosition);
        }
    }

    renderInitialPosition() {
        const currentPosition = this._visualPosition;

        this._renderBoundaryOffset();
        resetPosition(this._$content);
        const position = positionUtils.setup(this._$content, this._position);
        this._visualPosition = { top: position.v.location, left: position.h.location };

        this._positionedHandler(currentPosition, this._visualPosition);
    }

    positionWrapper() {
        if(this._$wrapperCoveredElement) {
            positionUtils.setup(this._$wrapper, { my: 'top left', at: 'top left', of: this._$wrapperCoveredElement });
        }
    }

    isContainerWindow() {
        return !this._$wrapperCoveredElement || isWindow(this._$wrapperCoveredElement);
    }

    _updateOutsideDragFactor() {
        this._outsideDragFactor = this._getOutsideDragFactor();
    }

    _getOutsideDragFactor() {
        if(this._props.allowDragOutside) {
            return 1;
        }

        return this._props.outsideDragFactor;
    }

    _updateDragResizeContainer() {
        this._$dragResizeContainer = this._getDragResizeContainer();
    }

    _getDragResizeContainer() {
        if(this._props.allowDragOutside) {
            return $(window);
        }
        if(this._props.dragAndResizeArea) {
            return $(this._props.dragAndResizeArea);
        }

        const isContainerDefined = originalViewPort().get(0) || this._props.container;

        return isContainerDefined ? this._$container : $(window);
    }

    _updateWrapperCoveredElement() {
        this._$wrapperCoveredElement = this._getWrapperCoveredElement();
    }

    _positionedHandler(previousPosition, position) {
        this._onPositioned({ previousPosition, position });
    }

    _renderBoundaryOffset() {
        const boundaryOffset = this._position ?? { boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET };

        this._$content.css('margin', `${boundaryOffset.v}px ${boundaryOffset.h}px`);
    }

    _getWrapperCoveredElement() {
        const containerProp = this._props.container;

        if(containerProp) {
            return $(containerProp);
        }
        if(this._position) {
            return $(isEvent(this._position.of) ? window : (this._position.of || window));
        }
    }

    _normalizePosition(positionProp, targetProp) {
        const defaultPositionConfig = {
            of: targetProp,
            boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
        };

        if(isDefined(positionProp)) {
            return extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
        } else {
            return defaultPositionConfig;
        }
    }

    _positionToObject(position) {
        if(isString(position)) {
            return extend({}, OVERLAY_POSITION_ALIASES[position]);
        }

        return position;
    }
}

class PopupPositionController extends OverlayPositionController {
    constructor({ fullScreen, ...args }) {
        super(args);

        this._fullScreen = fullScreen;
        this.updateContainer();
    }

    _getWrapperCoveredElement() {
        if(this._fullScreen) {
            return $(window);
        }

        return super._getWrapperCoveredElement();
    }
}

class PopoverPositionController extends OverlayPositionController {
    constructor({ shading, $arrow, ...args }) {
        super(args);

        this._shading = shading;

        this._$arrow = $arrow;

        this._positionSide = undefined;
    }

    positionWrapper() {
        if(this._shading) {
            this._$wrapper.css({ top: 0, left: 0 });
        }
    }

    _getContainerPosition() {
        const offset = pairToObject(this._position.offset || '');
        let hOffset = offset.h;
        let vOffset = offset.v;
        const isVerticalSide = this._isVerticalSide();
        const isHorizontalSide = this._isHorizontalSide();

        if(isVerticalSide || isHorizontalSide) {
            const isPopoverInside = this._isPopoverInside();
            const sign = (isPopoverInside ? -1 : 1) * WEIGHT_OF_SIDES[this._positionSide];
            const arrowSize = isVerticalSide ? this._$arrow.height() : this._$arrow.width();
            const arrowSizeCorrection = this._getContentBorderWidth(this._positionSide);
            const arrowOffset = sign * (arrowSize - arrowSizeCorrection);

            isVerticalSide ? vOffset += arrowOffset : hOffset += arrowOffset;
        }

        return extend({}, this._position, { offset: hOffset + ' ' + vOffset });
    }

    _getContentBorderWidth(side) {
        const borderWidth = this._$content.css(SIDE_BORDER_WIDTH_STYLES[side]);

        return parseInt(borderWidth) || 0;
    }

    _isPopoverInside() {
        const my = positionUtils.setup.normalizeAlign(this._position.my);
        const at = positionUtils.setup.normalizeAlign(this._position.at);

        return my.h === at.h && my.v === at.v;
    }

    _isVerticalSide(side) {
        side = side || this._positionSide;
        return side === 'top' || side === 'bottom';
    }

    _isHorizontalSide(side) {
        side = side || this._positionSide;
        return side === 'left' || side === 'right';
    }

    _getDisplaySide(position) {
        const my = positionUtils.setup.normalizeAlign(position.my);
        const at = positionUtils.setup.normalizeAlign(position.at);

        const weightSign = WEIGHT_OF_SIDES[my.h] === WEIGHT_OF_SIDES[at.h] && WEIGHT_OF_SIDES[my.v] === WEIGHT_OF_SIDES[at.v] ? -1 : 1;
        const horizontalWeight = Math.abs(WEIGHT_OF_SIDES[my.h] - weightSign * WEIGHT_OF_SIDES[at.h]);
        const verticalWeight = Math.abs(WEIGHT_OF_SIDES[my.v] - weightSign * WEIGHT_OF_SIDES[at.v]);

        return horizontalWeight > verticalWeight ? at.h : at.v;
    }

    _normalizePosition(positionProp, targetProp) {
        const defaultPositionConfig = {
            of: targetProp,
            boundaryOffset: POPOVER_DEFAULT_BOUNDARY_OFFSET
        };

        let resultPosition;
        if(isDefined(positionProp)) {
            resultPosition = extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
        } else {
            resultPosition = defaultPositionConfig;
        }

        this._positionSide = this._getDisplaySide(resultPosition);

        return resultPosition;
    }

    _positionToObject(positionProp) {
        if(isString(positionProp)) {
            return extend({}, POPOVER_POSITION_ALIASES[positionProp]);
        }

        return positionProp;
    }
}

export {
    OVERLAY_POSITION_ALIASES,
    OverlayPositionController,
    PopupPositionController,
    POPOVER_POSITION_ALIASES,
    PopoverPositionController
};
