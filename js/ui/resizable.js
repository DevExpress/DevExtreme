import { getOuterWidth, getOuterHeight, getInnerWidth, getInnerHeight, getWidth, getHeight } from '../core/utils/size';
import { locate, move } from '../animation/translator';
import registerComponent from '../core/component_registrator';
import DOMComponent from '../core/dom_component';
import $ from '../core/renderer';
import { pairToObject } from '../core/utils/common';
import { extend } from '../core/utils/extend';
import { each } from '../core/utils/iterator';
import { fitIntoRange, inRange } from '../core/utils/math';
import { isPlainObject, isFunction, isWindow } from '../core/utils/type';
import { hasWindow } from '../core/utils/window';
import eventsEngine from '../events/core/events_engine';
import { start as dragEventStart, move as dragEventMove, end as dragEventEnd } from '../events/drag';
import { addNamespace } from '../events/utils/index';
import { triggerResizeEvent } from '../events/visibility_change';

const RESIZABLE = 'dxResizable';
const RESIZABLE_CLASS = 'dx-resizable';
const RESIZABLE_RESIZING_CLASS = 'dx-resizable-resizing';

const RESIZABLE_HANDLE_CLASS = 'dx-resizable-handle';
const RESIZABLE_HANDLE_TOP_CLASS = 'dx-resizable-handle-top';
const RESIZABLE_HANDLE_BOTTOM_CLASS = 'dx-resizable-handle-bottom';
const RESIZABLE_HANDLE_LEFT_CLASS = 'dx-resizable-handle-left';
const RESIZABLE_HANDLE_RIGHT_CLASS = 'dx-resizable-handle-right';

const RESIZABLE_HANDLE_CORNER_CLASS = 'dx-resizable-handle-corner';

const DRAGSTART_START_EVENT_NAME = addNamespace(dragEventStart, RESIZABLE);
const DRAGSTART_EVENT_NAME = addNamespace(dragEventMove, RESIZABLE);
const DRAGSTART_END_EVENT_NAME = addNamespace(dragEventEnd, RESIZABLE);

const SIDE_BORDER_WIDTH_STYLES = {
    'left': 'borderLeftWidth',
    'top': 'borderTopWidth',
    'right': 'borderRightWidth',
    'bottom': 'borderBottomWidth'
};
const Resizable = DOMComponent.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            handles: 'all',

            // NOTE: does not affect proportional resize
            step: '1',

            /**
            * @name dxResizableOptions.stepPrecision
            * @type string
            * @default "simple"
            * @acceptValues 'simple'|'strict'
            * @hidden
            */
            stepPrecision: 'simple',

            area: undefined,

            minWidth: 30,

            maxWidth: Infinity,

            minHeight: 30,

            maxHeight: Infinity,

            onResizeStart: null,

            onResize: null,

            onResizeEnd: null,

            roundStepValue: true,

            keepAspectRatio: true
        });
    },

    _init: function() {
        this.callBase();
        this.$element().addClass(RESIZABLE_CLASS);
    },

    _initMarkup: function() {
        this.callBase();
        this._initialOffset = this.$element().offset();
        this._locationDelta = { top: 0, left: 0 };
        this._renderHandles();
    },

    _render: function() {
        this.callBase();
        this._renderActions();
    },

    _renderActions: function() {
        this._resizeStartAction = this._createActionByOption('onResizeStart');
        this._resizeEndAction = this._createActionByOption('onResizeEnd');
        this._resizeAction = this._createActionByOption('onResize');
    },

    _renderHandles: function() {
        this._handles = [];
        const handles = this.option('handles');

        if(handles === 'none' || !handles) {
            return;
        }

        const directions = handles === 'all' ? ['top', 'bottom', 'left', 'right'] : handles.split(' ');
        const activeHandlesMap = {};

        each(directions, (index, handleName) => {
            activeHandlesMap[handleName] = true;
            this._renderHandle(handleName);
        });

        activeHandlesMap['bottom'] && activeHandlesMap['right'] && this._renderHandle('corner-bottom-right');
        activeHandlesMap['bottom'] && activeHandlesMap['left'] && this._renderHandle('corner-bottom-left');
        activeHandlesMap['top'] && activeHandlesMap['right'] && this._renderHandle('corner-top-right');
        activeHandlesMap['top'] && activeHandlesMap['left'] && this._renderHandle('corner-top-left');
        this._attachEventHandlers();
    },

    _renderHandle: function(handleName) {
        const $handle = $('<div>')
            .addClass(RESIZABLE_HANDLE_CLASS)
            .addClass(RESIZABLE_HANDLE_CLASS + '-' + handleName)
            .appendTo(this.$element());

        this._handles.push($handle);
    },

    _attachEventHandlers: function() {
        if(this.option('disabled')) {
            return;
        }

        const handlers = {};
        handlers[DRAGSTART_START_EVENT_NAME] = this._dragStartHandler.bind(this);
        handlers[DRAGSTART_EVENT_NAME] = this._dragHandler.bind(this);
        handlers[DRAGSTART_END_EVENT_NAME] = this._dragEndHandler.bind(this);

        this._handles.forEach(handleElement => {
            eventsEngine.on(handleElement, handlers, {
                direction: 'both',
                immediate: true
            });
        });
    },

    _detachEventHandlers: function() {
        this._handles.forEach(handleElement => {
            eventsEngine.off(handleElement);
        });
    },

    _toggleEventHandlers: function(shouldAttachEvents) {
        shouldAttachEvents ? this._attachEventHandlers() : this._detachEventHandlers();
    },

    _getElementSize: function() {
        const $element = this.$element();

        return $element.css('boxSizing') === 'border-box'
            ? {
                width: getOuterWidth($element),
                height: getOuterHeight($element),
            }
            : {
                width: getWidth($element),
                height: getHeight($element)
            };
    },

    _dragStartHandler: function(e) {
        const $element = this.$element();
        if($element.is('.dx-state-disabled, .dx-state-disabled *')) {
            e.cancel = true;
            return;
        }

        this._toggleResizingClass(true);
        this._movingSides = this._getMovingSides(e);

        this._elementLocation = locate($element);

        this._elementSize = this._getElementSize();

        this._renderDragOffsets(e);

        this._resizeStartAction({
            event: e,
            width: this._elementSize.width,
            height: this._elementSize.height,
            handles: this._movingSides
        });

        e.targetElements = null;
    },

    _toggleResizingClass: function(value) {
        this.$element().toggleClass(RESIZABLE_RESIZING_CLASS, value);
    },

    _renderDragOffsets: function(e) {
        const area = this._getArea();

        if(!area) {
            return;
        }

        const $handle = $(e.target).closest('.' + RESIZABLE_HANDLE_CLASS);
        const handleWidth = getOuterWidth($handle);
        const handleHeight = getOuterHeight($handle);
        const handleOffset = $handle.offset();
        const areaOffset = area.offset;
        const scrollOffset = this._getAreaScrollOffset();


        e.maxLeftOffset = this._leftMaxOffset = handleOffset.left - areaOffset.left - scrollOffset.scrollX;
        e.maxRightOffset = this._rightMaxOffset = areaOffset.left + area.width - handleOffset.left - handleWidth + scrollOffset.scrollX;
        e.maxTopOffset = this._topMaxOffset = handleOffset.top - areaOffset.top - scrollOffset.scrollY;
        e.maxBottomOffset = this._bottomMaxOffset = areaOffset.top + area.height - handleOffset.top - handleHeight + scrollOffset.scrollY;
    },

    _getBorderWidth: function($element, direction) {
        if(isWindow($element.get(0))) return 0;
        const borderWidth = $element.css(SIDE_BORDER_WIDTH_STYLES[direction]);
        return parseInt(borderWidth) || 0;
    },

    _proportionate: function(direction, value) {
        const size = this._elementSize;
        const factor = direction === 'x'
            ? size.width / size.height
            : size.height / size.width;

        return value * factor;
    },

    _getProportionalDelta: function({ x, y }) {
        const proportionalY = this._proportionate('y', x);
        if(proportionalY >= y) {
            return {
                x,
                y: proportionalY
            };
        }

        const proportionalX = this._proportionate('x', y);
        if(proportionalX >= x) {
            return {
                x: proportionalX,
                y
            };
        }

        return {
            x: 0,
            y: 0
        };
    },

    _getDirectionName: function(axis) {
        const sides = this._movingSides;

        if(axis === 'x') {
            return sides.left ? 'left' : 'right';
        } else {
            return sides.top ? 'top' : 'bottom';
        }
    },

    _fitIntoArea: function(axis, value) {
        const directionName = this._getDirectionName(axis);
        return Math.min(value, this[`_${directionName}MaxOffset`] ?? Infinity);
    },

    _fitDeltaProportionally: function(delta) {
        let fittedDelta = { ...delta };
        const size = this._elementSize;
        const { minWidth, minHeight, maxWidth, maxHeight } = this.option();

        const getWidth = () => size.width + fittedDelta.x;
        const getHeight = () => size.height + fittedDelta.y;
        const getFittedWidth = () => fitIntoRange(getWidth(), minWidth, maxWidth);
        const getFittedHeight = () => fitIntoRange(getHeight(), minHeight, maxHeight);
        const isInArea = (axis) => fittedDelta[axis] === this._fitIntoArea(axis, fittedDelta[axis]);
        const isFittedX = () => inRange(getWidth(), minWidth, maxWidth) && isInArea('x');
        const isFittedY = () => inRange(getHeight(), minHeight, maxHeight) && isInArea('y');

        if(!isFittedX()) {
            const x = this._fitIntoArea('x', getFittedWidth() - size.width);
            fittedDelta = { x, y: this._proportionate('y', x) };
        }
        if(!isFittedY()) {
            const y = this._fitIntoArea('y', getFittedHeight() - size.height);
            fittedDelta = { x: this._proportionate('x', y), y };
        }

        return isFittedX() && isFittedY()
            ? fittedDelta
            : { x: 0, y: 0 };
    },

    _fitDelta: function({ x, y }) {
        const size = this._elementSize;
        const { minWidth, minHeight, maxWidth, maxHeight } = this.option();

        return {
            x: fitIntoRange(size.width + x, minWidth, maxWidth) - size.width,
            y: fitIntoRange(size.height + y, minHeight, maxHeight) - size.height,
        };
    },

    _getDeltaByOffset: function(offset) {
        const sides = this._movingSides;
        const shouldKeepAspectRatio = this._isCornerHandler(sides) && this.option('keepAspectRatio');

        let delta = {
            x: offset.x * (sides.left ? -1 : 1),
            y: offset.y * (sides.top ? -1 : 1)
        };

        if(shouldKeepAspectRatio) {
            const proportionalDelta = this._getProportionalDelta(delta);
            const fittedProportionalDelta = this._fitDeltaProportionally(proportionalDelta);

            delta = fittedProportionalDelta;
        } else {
            const fittedDelta = this._fitDelta(delta);
            const roundedFittedDelta = this._roundByStep(fittedDelta);

            delta = roundedFittedDelta;
        }

        return delta;
    },

    _updatePosition: function(delta, { width, height }) {
        const location = this._elementLocation;
        const sides = this._movingSides;
        const $element = this.$element();

        const elementRect = this._getElementSize();
        const offsetTop = delta.y * (sides.top ? -1 : 1) - ((elementRect.height || height) - height);
        const offsetLeft = delta.x * (sides.left ? -1 : 1) - ((elementRect.width || width) - width);

        this._locationDelta.top = sides.top ? offsetTop : 0;
        this._locationDelta.left = sides.left ? offsetLeft : 0;

        move($element, {
            top: location.top + (sides.top ? offsetTop : 0),
            left: location.left + (sides.left ? offsetLeft : 0)
        });
    },

    _dragHandler: function(e) {
        const offset = this._getOffset(e);
        const delta = this._getDeltaByOffset(offset);

        const dimensions = this._updateDimensions(delta);

        this._updatePosition(delta, dimensions);
        this._triggerResizeAction(e, dimensions);
    },

    _updateDimensions: function(delta) {
        const isAbsoluteSize = (size) => {
            return size.substring(size.length - 2) === 'px';
        };

        const isStepPrecisionStrict = this.option('stepPrecision') === 'strict';
        const size = this._elementSize;

        const width = size.width + delta.x;
        const height = size.height + delta.y;
        const elementStyle = this.$element().get(0).style;
        const shouldRenderWidth = delta.x || isStepPrecisionStrict || isAbsoluteSize(elementStyle.width);
        const shouldRenderHeight = delta.y || isStepPrecisionStrict || isAbsoluteSize(elementStyle.height);

        if(shouldRenderWidth) this.option({ width });
        if(shouldRenderHeight) this.option({ height });

        return {
            width: shouldRenderWidth ? width : size.width,
            height: shouldRenderHeight ? height : size.height
        };
    },

    _triggerResizeAction: function(e, { width, height }) {
        this._resizeAction({
            event: e,
            width: this.option('width') || width,
            height: this.option('height') || height,
            handles: this._movingSides
        });

        triggerResizeEvent(this.$element());
    },

    _isCornerHandler(sides) {
        return Object.values(sides).reduce((xor, value) => xor ^ value, 0) === 0;
    },

    _getOffset: function(e) {
        const offset = e.offset;
        const sides = this._movingSides;

        if(!sides.left && !sides.right) offset.x = 0;
        if(!sides.top && !sides.bottom) offset.y = 0;

        return offset;
    },

    _roundByStep: function(delta) {
        return this.option('stepPrecision') === 'strict'
            ? this._roundStrict(delta)
            : this._roundNotStrict(delta);
    },

    _getSteps: function() {
        return pairToObject(this.option('step'), !this.option('roundStepValue'));
    },

    _roundNotStrict: function(delta) {
        const steps = this._getSteps();

        return {
            x: delta.x - delta.x % steps.h,
            y: delta.y - delta.y % steps.v
        };
    },

    _roundStrict: function(delta) {
        const sides = this._movingSides;
        const offset = {
            x: delta.x * (sides.left ? -1 : 1),
            y: delta.y * (sides.top ? -1 : 1)
        };
        const steps = this._getSteps();
        const location = this._elementLocation;
        const size = this._elementSize;
        const xPos = sides.left ? location.left : location.left + size.width;
        const yPos = sides.top ? location.top : location.top + size.height;
        const newXShift = (xPos + offset.x) % steps.h;
        const newYShift = (yPos + offset.y) % steps.v;
        const sign = Math.sign || (x => {
            x = +x;
            if(x === 0 || isNaN(x)) {
                return x;
            }
            return x > 0 ? 1 : -1;
        });
        const separatorOffset = (steps, offset) => {
            return (1 + sign(offset) * 0.2) % 1 * steps;
        };
        const isSmallOffset = (offset, steps) => {
            return Math.abs(offset) < 0.2 * steps;
        };

        let newOffsetX = offset.x - newXShift;
        let newOffsetY = offset.y - newYShift;

        if(newXShift > separatorOffset(steps.h, offset.x)) {
            newOffsetX += steps.h;
        }

        if(newYShift > separatorOffset(steps.v, offset.y)) {
            newOffsetY += steps.v;
        }

        const roundedOffset = {
            x: (sides.left || sides.right) && !isSmallOffset(offset.x, steps.h) ? newOffsetX : 0,
            y: (sides.top || sides.bottom) && !isSmallOffset(offset.y, steps.v) ? newOffsetY : 0
        };

        return {
            x: roundedOffset.x * (sides.left ? -1 : 1),
            y: roundedOffset.y * (sides.top ? -1 : 1)
        };
    },


    _getMovingSides: function(e) {
        const $target = $(e.target);
        const hasCornerTopLeftClass = $target.hasClass(RESIZABLE_HANDLE_CORNER_CLASS + '-top-left');
        const hasCornerTopRightClass = $target.hasClass(RESIZABLE_HANDLE_CORNER_CLASS + '-top-right');
        const hasCornerBottomLeftClass = $target.hasClass(RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-left');
        const hasCornerBottomRightClass = $target.hasClass(RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right');

        return {
            'top': $target.hasClass(RESIZABLE_HANDLE_TOP_CLASS) || hasCornerTopLeftClass || hasCornerTopRightClass,
            'left': $target.hasClass(RESIZABLE_HANDLE_LEFT_CLASS) || hasCornerTopLeftClass || hasCornerBottomLeftClass,
            'bottom': $target.hasClass(RESIZABLE_HANDLE_BOTTOM_CLASS) || hasCornerBottomLeftClass || hasCornerBottomRightClass,
            'right': $target.hasClass(RESIZABLE_HANDLE_RIGHT_CLASS) || hasCornerTopRightClass || hasCornerBottomRightClass
        };
    },

    _getArea: function() {
        let area = this.option('area');

        if(isFunction(area)) {
            area = area.call(this);
        }

        if(isPlainObject(area)) {
            return this._getAreaFromObject(area);
        }

        return this._getAreaFromElement(area);
    },

    _getAreaScrollOffset: function() {
        const area = this.option('area');
        const isElement = !isFunction(area) && !isPlainObject(area);
        const scrollOffset = { scrollY: 0, scrollX: 0 };
        if(isElement) {
            const areaElement = $(area)[0];
            if(isWindow(areaElement)) {
                scrollOffset.scrollX = areaElement.pageXOffset;
                scrollOffset.scrollY = areaElement.pageYOffset;
            }
        } else {
            const offset = this.$element().offset();
            scrollOffset.scrollX = offset.left - this._initialOffset.left;
            scrollOffset.scrollY = offset.top - this._initialOffset.top;
        }

        return scrollOffset;
    },

    _getAreaFromObject: function(area) {
        const result = {
            width: area.right - area.left,
            height: area.bottom - area.top,
            offset: {
                left: area.left,
                top: area.top
            }
        };

        this._correctAreaGeometry(result);

        return result;

    },

    _getAreaFromElement: function(area) {
        const $area = $(area);
        let result;

        if($area.length) {
            result = {
                width: getInnerWidth($area),
                height: getInnerHeight($area),
                offset: extend({
                    top: 0,
                    left: 0
                }, isWindow($area[0]) ? {} : $area.offset())
            };

            this._correctAreaGeometry(result, $area);
        }

        return result;
    },

    _correctAreaGeometry: function(result, $area) {
        const areaBorderLeft = $area ? this._getBorderWidth($area, 'left') : 0;
        const areaBorderTop = $area ? this._getBorderWidth($area, 'top') : 0;

        result.offset.left += areaBorderLeft + this._getBorderWidth(this.$element(), 'left');
        result.offset.top += areaBorderTop + this._getBorderWidth(this.$element(), 'top');

        result.width -= getOuterWidth(this.$element()) - getInnerWidth(this.$element());
        result.height -= getOuterHeight(this.$element()) - getInnerHeight(this.$element());
    },

    _updateScrollPositionCache() {
        this._initialOffset.top += this._locationDelta.top;
        this._initialOffset.left += this._locationDelta.left;
        this._locationDelta = { left: 0, top: 0 };
    },

    _dragEndHandler: function(e) {
        const $element = this.$element();

        this._resizeEndAction({
            event: e,
            width: getOuterWidth($element),
            height: getOuterHeight($element),
            handles: this._movingSides
        });

        this._updateScrollPositionCache();
        this._toggleResizingClass(false);
    },

    _renderWidth: function(width) {
        this.option('width', fitIntoRange(width, this.option('minWidth'), this.option('maxWidth')));
    },

    _renderHeight: function(height) {
        this.option('height', fitIntoRange(height, this.option('minHeight'), this.option('maxHeight')));
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'disabled':
                this._toggleEventHandlers(!args.value);
                this.callBase(args);
                break;
            case 'handles':
                this._invalidate();
                break;
            case 'minWidth':
            case 'maxWidth':
                hasWindow() && this._renderWidth(getOuterWidth(this.$element()));
                break;
            case 'minHeight':
            case 'maxHeight':
                hasWindow() && this._renderHeight(getOuterHeight(this.$element()));
                break;
            case 'onResize':
            case 'onResizeStart':
            case 'onResizeEnd':
                this._renderActions();
                break;
            case 'area':
            case 'stepPrecision':
            case 'step':
            case 'roundStepValue':
            case 'keepAspectRatio':
                break;
            default:
                this.callBase(args);
                break;
        }
    },

    _clean: function() {
        this.$element().find('.' + RESIZABLE_HANDLE_CLASS).remove();
    },

    _useTemplates: function() {
        return false;
    },
});

registerComponent(RESIZABLE, Resizable);

export default Resizable;
