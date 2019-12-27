const $ = require('../core/renderer');
const eventsEngine = require('../events/core/events_engine');
const registerComponent = require('../core/component_registrator');
const commonUtils = require('../core/utils/common');
const extend = require('../core/utils/extend').extend;
const inArray = require('../core/utils/array').inArray;
const each = require('../core/utils/iterator').each;
const typeUtils = require('../core/utils/type');
const windowUtils = require('../core/utils/window');
const translator = require('../animation/translator');
const fitIntoRange = require('../core/utils/math').fitIntoRange;
const DOMComponent = require('../core/dom_component');
const eventUtils = require('../events/utils');
const dragEvents = require('../events/drag');
const isPlainObject = typeUtils.isPlainObject;
const isFunction = typeUtils.isFunction;
const domUtils = require('../core/utils/dom');

const RESIZABLE = 'dxResizable';
const RESIZABLE_CLASS = 'dx-resizable';
const RESIZABLE_RESIZING_CLASS = 'dx-resizable-resizing';

const RESIZABLE_HANDLE_CLASS = 'dx-resizable-handle';
const RESIZABLE_HANDLE_TOP_CLASS = 'dx-resizable-handle-top';
const RESIZABLE_HANDLE_BOTTOM_CLASS = 'dx-resizable-handle-bottom';
const RESIZABLE_HANDLE_LEFT_CLASS = 'dx-resizable-handle-left';
const RESIZABLE_HANDLE_RIGHT_CLASS = 'dx-resizable-handle-right';

const RESIZABLE_HANDLE_CORNER_CLASS = 'dx-resizable-handle-corner';

const DRAGSTART_START_EVENT_NAME = eventUtils.addNamespace(dragEvents.start, RESIZABLE);
const DRAGSTART_EVENT_NAME = eventUtils.addNamespace(dragEvents.move, RESIZABLE);
const DRAGSTART_END_EVENT_NAME = eventUtils.addNamespace(dragEvents.end, RESIZABLE);

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

            roundStepValue: true
        });
    },

    _init: function() {
        this.callBase();
        this.$element().addClass(RESIZABLE_CLASS);
    },

    _initMarkup: function() {
        this.callBase();
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
        const handles = this.option('handles');

        if(handles === 'none') {
            return;
        }

        const directions = handles === 'all' ? ['top', 'bottom', 'left', 'right'] : handles.split(' ');

        each(directions, (function(index, handleName) {
            this._renderHandle(handleName);
        }).bind(this));

        inArray('bottom', directions) + 1 && inArray('right', directions) + 1 && this._renderHandle('corner-bottom-right');
        inArray('bottom', directions) + 1 && inArray('left', directions) + 1 && this._renderHandle('corner-bottom-left');
        inArray('top', directions) + 1 && inArray('right', directions) + 1 && this._renderHandle('corner-top-right');
        inArray('top', directions) + 1 && inArray('left', directions) + 1 && this._renderHandle('corner-top-left');
    },

    _renderHandle: function(handleName) {
        const $element = this.$element();
        const $handle = $('<div>');

        $handle
            .addClass(RESIZABLE_HANDLE_CLASS)
            .addClass(RESIZABLE_HANDLE_CLASS + '-' + handleName)
            .appendTo($element);

        this._attachEventHandlers($handle);
    },

    _attachEventHandlers: function($handle) {
        if(this.option('disabled')) {
            return;
        }

        const handlers = {};
        handlers[DRAGSTART_START_EVENT_NAME] = this._dragStartHandler.bind(this);
        handlers[DRAGSTART_EVENT_NAME] = this._dragHandler.bind(this);
        handlers[DRAGSTART_END_EVENT_NAME] = this._dragEndHandler.bind(this);

        eventsEngine.on($handle, handlers, {
            direction: 'both',
            immediate: true
        });
    },

    _dragStartHandler: function(e) {
        const $element = this.$element();
        if($element.is('.dx-state-disabled, .dx-state-disabled *')) {
            e.cancel = true;
            return;
        }

        this._toggleResizingClass(true);
        this._movingSides = this._getMovingSides(e);

        this._elementLocation = translator.locate($element);

        const elementRect = $element.get(0).getBoundingClientRect();

        this._elementSize = {
            width: elementRect.width,
            height: elementRect.height
        };

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
        const handleWidth = $handle.outerWidth();
        const handleHeight = $handle.outerHeight();
        const handleOffset = $handle.offset();
        const areaOffset = area.offset;
        const scrollOffset = this._getAreaScrollOffset();


        e.maxLeftOffset = handleOffset.left - areaOffset.left - scrollOffset.scrollX;
        e.maxRightOffset = areaOffset.left + area.width - handleOffset.left - handleWidth + scrollOffset.scrollX;
        e.maxTopOffset = handleOffset.top - areaOffset.top - scrollOffset.scrollY;
        e.maxBottomOffset = areaOffset.top + area.height - handleOffset.top - handleHeight + scrollOffset.scrollY;
    },

    _getBorderWidth: function($element, direction) {
        if(typeUtils.isWindow($element.get(0))) return 0;
        const borderWidth = $element.css(SIDE_BORDER_WIDTH_STYLES[direction]);
        return parseInt(borderWidth) || 0;
    },

    _dragHandler: function(e) {
        const $element = this.$element();
        const sides = this._movingSides;

        const location = this._elementLocation;
        const size = this._elementSize;
        const offset = this._getOffset(e);

        const width = size.width + offset.x * (sides.left ? -1 : 1);
        const height = size.height + offset.y * (sides.top ? -1 : 1);

        if(offset.x || this.option('stepPrecision') === 'strict') this._renderWidth(width);
        if(offset.y || this.option('stepPrecision') === 'strict') this._renderHeight(height);

        const elementRect = $element.get(0).getBoundingClientRect();
        const offsetTop = offset.y - ((elementRect.height || height) - height);
        const offsetLeft = offset.x - ((elementRect.width || width) - width);

        translator.move($element, {
            top: location.top + (sides.top ? offsetTop : 0),
            left: location.left + (sides.left ? offsetLeft : 0)
        });

        this._resizeAction({
            event: e,
            width: this.option('width') || width,
            height: this.option('height') || height,
            handles: this._movingSides
        });

        domUtils.triggerResizeEvent($element);
    },

    _getOffset: function(e) {
        const offset = e.offset;
        const steps = commonUtils.pairToObject(this.option('step'), !this.option('roundStepValue'));
        const sides = this._getMovingSides(e);
        const strictPrecision = this.option('stepPrecision') === 'strict';

        if(!sides.left && !sides.right) offset.x = 0;
        if(!sides.top && !sides.bottom) offset.y = 0;

        return strictPrecision ? this._getStrictOffset(offset, steps, sides) : this._getSimpleOffset(offset, steps);
    },

    _getSimpleOffset: function(offset, steps) {
        return {
            x: offset.x - offset.x % steps.h,
            y: offset.y - offset.y % steps.v
        };
    },

    _getStrictOffset: function(offset, steps, sides) {
        const location = this._elementLocation;
        const size = this._elementSize;
        const xPos = sides.left ? location.left : location.left + size.width;
        const yPos = sides.top ? location.top : location.top + size.height;
        const newXShift = (xPos + offset.x) % steps.h;
        const newYShift = (yPos + offset.y) % steps.v;
        const sign = Math.sign || function(x) {
            x = +x;
            if(x === 0 || isNaN(x)) {
                return x;
            }
            return x > 0 ? 1 : -1;
        };
        const separatorOffset = function(steps, offset) {
            return (1 + sign(offset) * 0.2) % 1 * steps;
        };
        const isSmallOffset = function(offset, steps) {
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

        return {
            x: (sides.left || sides.right) && !isSmallOffset(offset.x, steps.h) ? newOffsetX : 0,
            y: (sides.top || sides.bottom) && !isSmallOffset(offset.y, steps.v) ? newOffsetY : 0
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
            if(typeUtils.isWindow(areaElement)) {
                scrollOffset.scrollX = areaElement.pageXOffset;
                scrollOffset.scrollY = areaElement.pageYOffset;
            }
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
                width: $area.innerWidth(),
                height: $area.innerHeight(),
                offset: extend({
                    top: 0,
                    left: 0
                }, typeUtils.isWindow($area[0]) ? {} : $area.offset())
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

        result.width -= this.$element().outerWidth() - this.$element().innerWidth();
        result.height -= this.$element().outerHeight() - this.$element().innerHeight();
    },

    _dragEndHandler: function(e) {
        const $element = this.$element();

        this._resizeEndAction({
            event: e,
            width: $element.outerWidth(),
            height: $element.outerHeight(),
            handles: this._movingSides
        });

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
            case 'handles':
                this._invalidate();
                break;
            case 'minWidth':
            case 'maxWidth':
                windowUtils.hasWindow() && this._renderWidth(this.$element().outerWidth());
                break;
            case 'minHeight':
            case 'maxHeight':
                windowUtils.hasWindow() && this._renderHeight(this.$element().outerHeight());
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
                break;
            default:
                this.callBase(args);
                break;
        }
    },

    _clean: function() {
        this.$element().find('.' + RESIZABLE_HANDLE_CLASS).remove();
    }

});

registerComponent(RESIZABLE, Resizable);

module.exports = Resizable;
