const $ = require('../core/renderer');
const window = require('../core/utils/window').getWindow();
const eventsEngine = require('../events/core/events_engine');
const stringUtils = require('../core/utils/string');
const registerComponent = require('../core/component_registrator');
const translator = require('../animation/translator');
const Animator = require('./scroll_view/animator');
const browser = require('../core/utils/browser');
const dasherize = require('../core/utils/inflector').dasherize;
const extend = require('../core/utils/extend').extend;
const DOMComponentWithTemplate = require('../core/dom_component_with_template');
const getPublicElement = require('../core/utils/dom').getPublicElement;
const eventUtils = require('../events/utils');
const pointerEvents = require('../events/pointer');
const dragEvents = require('../events/drag');
const positionUtils = require('../animation/position');
const typeUtils = require('../core/utils/type');
const noop = require('../core/utils/common').noop;
const viewPortUtils = require('../core/utils/view_port');
const commonUtils = require('../core/utils/common');
const EmptyTemplate = require('../core/templates/empty_template').EmptyTemplate;
const deferredUtils = require('../core/utils/deferred');
const when = deferredUtils.when;
const fromPromise = deferredUtils.fromPromise;

const DRAGGABLE = 'dxDraggable';
const DRAGSTART_EVENT_NAME = eventUtils.addNamespace(dragEvents.start, DRAGGABLE);
const DRAG_EVENT_NAME = eventUtils.addNamespace(dragEvents.move, DRAGGABLE);
const DRAGEND_EVENT_NAME = eventUtils.addNamespace(dragEvents.end, DRAGGABLE);
const DRAG_ENTER_EVENT_NAME = eventUtils.addNamespace(dragEvents.enter, DRAGGABLE);
const DRAGEND_LEAVE_EVENT_NAME = eventUtils.addNamespace(dragEvents.leave, DRAGGABLE);
const POINTERDOWN_EVENT_NAME = eventUtils.addNamespace(pointerEvents.down, DRAGGABLE);

const CLONE_CLASS = 'clone';

let targetDraggable;
let sourceDraggable;

class ScrollHelper {
    constructor(orientation, component) {
        this._preventScroll = true;
        this._component = component;

        if(orientation === 'vertical') {
            this._scrollValue = 'scrollTop';
            this._overFlowAttr = 'overflowY';
            this._sizeAttr = 'height';
            this._scrollSizeProp = 'scrollHeight';
            this._limitProps = {
                start: 'top',
                end: 'bottom'
            };
        } else {
            this._scrollValue = 'scrollLeft';
            this._overFlowAttr = 'overflowX';
            this._sizeAttr = 'width';
            this._scrollSizeProp = 'scrollWidth';
            this._limitProps = {
                start: 'left',
                end: 'right'
            };
        }
    }

    updateScrollable(elements, mousePosition) {
        const that = this;

        if(!elements.some(element => that._trySetScrollable(element, mousePosition))) {
            that._$scrollable = null;
            that._scrollSpeed = 0;
        }
    }

    isScrolling() {
        return !!this._scrollSpeed;
    }

    isScrollable($element) {
        const that = this;

        return ($element.css(that._overFlowAttr) === 'auto' || $element.hasClass('dx-scrollable-container'))
            && $element.prop(that._scrollSizeProp) > $element[that._sizeAttr]();
    }

    _trySetScrollable(element, mousePosition) {
        const that = this;
        const $element = $(element);
        let distanceToBorders;
        const sensitivity = that._component.option('scrollSensitivity');
        let isScrollable = that.isScrollable($element);

        if(isScrollable) {
            distanceToBorders = that._calculateDistanceToBorders($element, mousePosition);

            if(sensitivity > distanceToBorders[that._limitProps.start]) {
                if(!that._preventScroll) {
                    that._scrollSpeed = -that._calculateScrollSpeed(distanceToBorders[that._limitProps.start]);
                    that._$scrollable = $element;
                }
            } else if(sensitivity > distanceToBorders[that._limitProps.end]) {
                if(!that._preventScroll) {
                    that._scrollSpeed = that._calculateScrollSpeed(distanceToBorders[that._limitProps.end]);
                    that._$scrollable = $element;
                }
            } else {
                isScrollable = false;
                that._preventScroll = false;
            }
        }

        return isScrollable;
    }

    _calculateDistanceToBorders($area, mousePosition) {
        const area = $area.get(0);
        let areaBoundingRect;

        if(area) {
            areaBoundingRect = area.getBoundingClientRect();

            return {
                left: mousePosition.x - areaBoundingRect.left,
                top: mousePosition.y - areaBoundingRect.top,
                right: areaBoundingRect.right - mousePosition.x,
                bottom: areaBoundingRect.bottom - mousePosition.y
            };
        } else {
            return {};
        }
    }

    _calculateScrollSpeed(distance) {
        const component = this._component;
        const sensitivity = component.option('scrollSensitivity');
        const maxSpeed = component.option('scrollSpeed');

        return Math.ceil(Math.pow((sensitivity - distance) / sensitivity, 2) * maxSpeed);
    }

    scrollByStep() {
        const that = this;
        let nextScrollPosition;

        if(that._$scrollable && that._scrollSpeed) {
            if(that._$scrollable.hasClass('dx-scrollable-container')) {
                const $scrollable = that._$scrollable.closest('.dx-scrollable');
                const scrollableInstance = $scrollable.data('dxScrollable') || $scrollable.data('dxScrollView');

                if(scrollableInstance) {
                    nextScrollPosition = scrollableInstance.scrollOffset();
                    nextScrollPosition[that._limitProps.start] += that._scrollSpeed;

                    scrollableInstance.scrollTo(nextScrollPosition);
                }
            } else {
                nextScrollPosition = that._$scrollable[that._scrollValue]() + that._scrollSpeed;

                that._$scrollable[that._scrollValue](nextScrollPosition);
            }

            const dragMoveArgs = that._component._dragMoveArgs;
            if(dragMoveArgs) {
                that._component._dragMoveHandler(dragMoveArgs);
            }
        }
    }

    reset() {
        this._$scrollable = null;
        this._scrollSpeed = 0;
        this._preventScroll = true;
    }

    isOutsideScrollable(target, event) {
        const component = this._component;

        if(!component._$scrollable || !target.closest(component._$scrollable).length) {
            return false;
        }

        const scrollableSize = component._$scrollable.get(0).getBoundingClientRect();
        const start = scrollableSize[this._limitProps.start];
        const size = scrollableSize[this._sizeAttr];
        const location = this._sizeAttr === 'width' ? event.pageX : event.pageY;

        return location < start || location > (start + size);
    }
}

const ScrollAnimator = Animator.inherit({

    ctor: function(strategy) {
        this.callBase();

        this._strategy = strategy;
    },

    _step: function() {
        const horizontalScrollHelper = this._strategy._horizontalScrollHelper;
        const verticalScrollHelper = this._strategy._verticalScrollHelper;

        horizontalScrollHelper && horizontalScrollHelper.scrollByStep();
        verticalScrollHelper && verticalScrollHelper.scrollByStep();
    }
});


const Draggable = DOMComponentWithTemplate.inherit({
    reset: noop,

    dragMove: noop,

    dragEnter: noop,

    dragLeave: noop,

    dragEnd: function(sourceEvent) {
        const sourceDraggable = this._getSourceDraggable();

        sourceDraggable._fireRemoveEvent(sourceEvent);
    },

    _fireRemoveEvent: noop,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onDragStart: null,
            onDragMove: null,
            onDragEnd: null,
            /**
             * @name dxDraggableOptions.onDrop
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 itemData:any
             * @type_function_param1_field6 itemElement:dxElement
             * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
             * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
             * @type_function_param1_field9 fromData:any
             * @type_function_param1_field10 toData:any
             * @action
             * @hidden
             */
            onDrop: null,
            immediate: true,
            dragDirection: 'both',
            boundary: undefined,
            boundOffset: 0,
            allowMoveByClick: false,
            itemData: null,
            container: undefined,
            dragTemplate: undefined,
            /**
             * @name DraggableBaseOptions.contentTemplate
             * @type template|function
             * @type_function_return string|Node|jQuery
             * @hidden
             * @default "content"
             */
            contentTemplate: 'content',
            handle: '',
            /**
             * @name dxDraggableOptions.filter
             * @type string
             * @default ""
             * @hidden
             */
            filter: '',
            clone: false,
            autoScroll: true,
            scrollSpeed: 30,
            scrollSensitivity: 60,
            group: undefined,
            data: undefined,
            /**
             * @name DraggableBaseOptions.cursorOffset.x
             * @type number
             * @default 0
             */
            /**
             * @name DraggableBaseOptions.cursorOffset.y
             * @type number
             * @default 0
             */
        });
    },

    _setOptionsByReference: function() {
        this.callBase.apply(this, arguments);

        extend(this._optionsByReference, {
            component: true,
            group: true,
            itemData: true,
            data: true
        });
    },

    _init: function() {
        this.callBase();
        this._attachEventHandlers();

        this._scrollAnimator = new ScrollAnimator(this);

        this._horizontalScrollHelper = new ScrollHelper('horizontal', this);
        this._verticalScrollHelper = new ScrollHelper('vertical', this);
    },

    _normalizeCursorOffset: function(offset) {
        if(typeUtils.isObject(offset)) {
            offset = {
                h: offset.x,
                v: offset.y
            };
        }
        offset = commonUtils.splitPair(offset).map((value) => parseFloat(value));

        return {
            left: offset[0],
            top: offset.length === 1 ? offset[0] : offset[1]
        };
    },

    _getNormalizedCursorOffset: function(offset, options) {
        if(typeUtils.isFunction(offset)) {
            offset = offset.call(this, options);
        }

        return this._normalizeCursorOffset(offset);
    },

    _calculateElementOffset: function(options) {
        let elementOffset;
        let dragElementOffset;
        const event = options.event;
        const $element = $(options.itemElement);
        const $dragElement = $(options.dragElement);
        const isCloned = this._dragElementIsCloned();
        const cursorOffset = this.option('cursorOffset');
        let normalizedCursorOffset = { left: 0, top: 0 };
        const currentLocate = this._initialLocate = translator.locate($dragElement);

        if(isCloned || options.initialOffset || cursorOffset) {
            elementOffset = options.initialOffset || $element.offset();

            if(cursorOffset) {
                normalizedCursorOffset = this._getNormalizedCursorOffset(cursorOffset, options);

                if(isFinite(normalizedCursorOffset.left)) {
                    elementOffset.left = event.pageX;
                }

                if(isFinite(normalizedCursorOffset.top)) {
                    elementOffset.top = event.pageY;
                }
            }

            dragElementOffset = $dragElement.offset();
            elementOffset.top -= dragElementOffset.top + (normalizedCursorOffset.top || 0) - currentLocate.top;
            elementOffset.left -= dragElementOffset.left + (normalizedCursorOffset.left || 0) - currentLocate.left;
        }

        return elementOffset;
    },

    _initPosition: function(options) {
        const $dragElement = $(options.dragElement);
        const elementOffset = this._calculateElementOffset(options);

        if(elementOffset) {
            this._move(elementOffset, $dragElement);
        }

        this._startPosition = translator.locate($dragElement);
    },

    _startAnimator: function() {
        if(!this._scrollAnimator.inProgress()) {
            this._scrollAnimator.start();
        }
    },

    _stopAnimator: function() {
        this._scrollAnimator.stop();
    },

    _addWidgetPrefix: function(className) {
        const componentName = this.NAME;

        return dasherize(componentName) + (className ? '-' + className : '');
    },

    _getItemsSelector: function() {
        return this.option('filter') || '';
    },

    _$content: function() {
        const $element = this.$element();
        const $wrapper = $element.children('.dx-template-wrapper');

        return $wrapper.length ? $wrapper : $element;
    },

    _attachEventHandlers: function() {
        if(this.option('disabled')) {
            return;
        }

        let $element = this._$content();
        let itemsSelector = this._getItemsSelector();
        const allowMoveByClick = this.option('allowMoveByClick');
        const data = {
            direction: this.option('dragDirection'),
            immediate: this.option('immediate'),
            checkDropTarget: (target, event) => {
                const targetGroup = this.option('group');
                const sourceGroup = this._getSourceDraggable().option('group');

                if(this._verticalScrollHelper.isOutsideScrollable(target, event) || this._horizontalScrollHelper.isOutsideScrollable(target, event)) {
                    return false;
                }

                return sourceGroup && sourceGroup === targetGroup;
            }
        };

        if(allowMoveByClick) {
            $element = this._getArea();
            eventsEngine.on($element, POINTERDOWN_EVENT_NAME, data, this._pointerDownHandler.bind(this));
        }

        if(itemsSelector[0] === '>') {
            itemsSelector = itemsSelector.slice(1);
        }

        eventsEngine.on($element, DRAGSTART_EVENT_NAME, itemsSelector, data, this._dragStartHandler.bind(this));
        eventsEngine.on($element, DRAG_EVENT_NAME, data, this._dragMoveHandler.bind(this));
        eventsEngine.on($element, DRAGEND_EVENT_NAME, data, this._dragEndHandler.bind(this));
        eventsEngine.on($element, DRAG_ENTER_EVENT_NAME, data, this._dragEnterHandler.bind(this));
        eventsEngine.on($element, DRAGEND_LEAVE_EVENT_NAME, data, this._dragLeaveHandler.bind(this));
    },

    _dragElementIsCloned: function() {
        return this._$dragElement && this._$dragElement.hasClass(this._addWidgetPrefix(CLONE_CLASS));
    },

    _getDragTemplateArgs: function($element, $container) {
        return {
            container: getPublicElement($container),
            model: {
                itemData: this.option('itemData'),
                itemElement: getPublicElement($element)
            }
        };
    },

    _createDragElement: function($element) {
        let result = $element;
        const clone = this.option('clone');
        const $container = this._getContainer();
        let template = this.option('dragTemplate');

        if(template) {
            template = this._getTemplate(template);
            result = $('<div>').appendTo($container);
            template.render(this._getDragTemplateArgs($element, result));
        } else if(clone) {
            result = $('<div>').appendTo($container);
            $element.clone().css({
                width: $element.css('width'),
                height: $element.css('height')
            }).appendTo(result);
        }

        return result.toggleClass(this._addWidgetPrefix(CLONE_CLASS), result.get(0) !== $element.get(0));
    },

    _resetDragElement: function() {
        if(this._dragElementIsCloned()) {
            this._$dragElement.remove();
        } else {
            this._toggleDraggingClass(false);
        }
        this._$dragElement = null;
    },

    _resetSourceElement: function() {
        this._toggleDragSourceClass(false);
        this._$sourceElement = null;
    },

    _detachEventHandlers: function() {
        eventsEngine.off(this._$content(), '.' + DRAGGABLE);
        eventsEngine.off(this._getArea(), '.' + DRAGGABLE);
    },

    _move: function(position, $element) {
        translator.move($element || this._$dragElement, position);
    },

    _getDraggableElement: function(e) {
        const $sourceElement = this._getSourceElement();

        if($sourceElement) {
            return $sourceElement;
        }

        const allowMoveByClick = this.option('allowMoveByClick');
        if(allowMoveByClick) {
            return this.$element();
        }

        let $target = $(e && e.target);
        const itemsSelector = this._getItemsSelector();

        if(itemsSelector[0] === '>') {
            const $items = this._$content().find(itemsSelector);
            if(!$items.is($target)) {
                $target = $target.closest($items);
            }
        }
        return $target;
    },

    _getSourceElement: function() {
        const draggable = this._getSourceDraggable();

        return draggable._$sourceElement;
    },

    _pointerDownHandler: function(e) {
        if(eventUtils.needSkipEvent(e)) {
            return;
        }

        const position = {};
        const $element = this.$element();
        const dragDirection = this.option('dragDirection');

        if(dragDirection === 'horizontal' || dragDirection === 'both') {
            position.left = e.pageX - $element.offset().left + translator.locate($element).left - $element.width() / 2;
        }

        if(dragDirection === 'vertical' || dragDirection === 'both') {
            position.top = e.pageY - $element.offset().top + translator.locate($element).top - $element.height() / 2;
        }

        this._move(position, $element);
        this._getAction('onDragMove')(this._getEventArgs(e));
    },

    _isValidElement: function(event, $element) {
        const handle = this.option('handle');
        const $target = $(event.originalEvent && event.originalEvent.target);

        if(handle && !$target.closest(handle).length) {
            return false;
        }

        if(!$element.length) {
            return false;
        }

        return !$element.is('.dx-state-disabled, .dx-state-disabled *');
    },

    _dragStartHandler: function(e) {
        let $dragElement;
        let initialOffset;
        let isFixedPosition;
        const $element = this._getDraggableElement(e);

        if(this._$sourceElement) {
            return;
        }
        if(!this._isValidElement(e, $element)) {
            e.cancel = true;
            return;
        }

        const dragStartArgs = this._getDragStartArgs(e, $element);
        this._getAction('onDragStart')(dragStartArgs);

        if(dragStartArgs.cancel) {
            e.cancel = true;
            return;
        }

        this.option('itemData', dragStartArgs.itemData);
        this._setSourceDraggable();

        this._$sourceElement = $element;
        initialOffset = $element.offset();
        $dragElement = this._$dragElement = this._createDragElement($element);

        this._toggleDraggingClass(true);
        this._toggleDragSourceClass(true);
        isFixedPosition = $dragElement.css('position') === 'fixed';

        this._initPosition(extend({}, dragStartArgs, {
            dragElement: $dragElement.get(0),
            initialOffset: isFixedPosition && initialOffset
        }));

        const $area = this._getArea();
        const areaOffset = this._getAreaOffset($area);
        const boundOffset = this._getBoundOffset();
        const areaWidth = $area.outerWidth();
        const areaHeight = $area.outerHeight();
        const elementWidth = $dragElement.width();
        const elementHeight = $dragElement.height();

        const startOffset = {
            left: $dragElement.offset().left - areaOffset.left,
            top: $dragElement.offset().top - areaOffset.top
        };
        if($area.length) {
            e.maxLeftOffset = startOffset.left - boundOffset.left;
            e.maxRightOffset = areaWidth - startOffset.left - elementWidth - boundOffset.right;
            e.maxTopOffset = startOffset.top - boundOffset.top;
            e.maxBottomOffset = areaHeight - startOffset.top - elementHeight - boundOffset.bottom;
        }

        if(this.option('autoScroll')) {
            this._startAnimator();
        }
    },

    _getAreaOffset: function($area) {
        const offset = $area && positionUtils.offset($area);
        return offset ? offset : { left: 0, top: 0 };
    },

    _toggleDraggingClass: function(value) {
        this._$dragElement && this._$dragElement.toggleClass(this._addWidgetPrefix('dragging'), value);
    },

    _toggleDragSourceClass: function(value, $element) {
        const $sourceElement = $element || this._$sourceElement;
        $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix('source'), value);
    },

    _getBoundOffset: function() {
        let boundOffset = this.option('boundOffset');

        if(typeUtils.isFunction(boundOffset)) {
            boundOffset = boundOffset.call(this);
        }

        return stringUtils.quadToObject(boundOffset);
    },

    _getArea: function() {
        let area = this.option('boundary');

        if(typeUtils.isFunction(area)) {
            area = area.call(this);
        }
        return $(area);
    },

    _getContainer: function() {
        let container = this.option('container');

        if(container === undefined) {
            container = viewPortUtils.value();
        }

        return $(container);
    },

    _dragMoveHandler: function(e) {
        this._dragMoveArgs = e;
        if(!this._$dragElement) {
            e.cancel = true;
            return;
        }

        const offset = e.offset;
        const startPosition = this._startPosition;

        this._move({
            left: startPosition.left + offset.x,
            top: startPosition.top + offset.y
        });

        this._updateScrollable(e);

        const eventArgs = this._getEventArgs(e);
        this._getAction('onDragMove')(eventArgs);

        if(eventArgs.cancel === true) {
            return;
        }

        const targetDraggable = this._getTargetDraggable();
        targetDraggable.dragMove(e);
    },

    _updateScrollable: function(e) {
        const that = this;
        const $sourceElement = that._getSourceElement();

        that._$scrollable = null;
        $sourceElement.parents().toArray().some(function(element) {
            const $element = $(element);

            if(that._horizontalScrollHelper.isScrollable($element) || that._verticalScrollHelper.isScrollable($element)) {
                that._$scrollable = $element;

                return true;
            }
        });

        if(that.option('autoScroll')) {
            const $window = $(window);
            const mousePosition = {
                x: e.pageX - $window.scrollLeft(),
                y: e.pageY - $window.scrollTop()
            };
            const allObjects = that.getElementsFromPoint(mousePosition);

            that._verticalScrollHelper.updateScrollable(allObjects, mousePosition);
            that._horizontalScrollHelper.updateScrollable(allObjects, mousePosition);
        }
    },

    getElementsFromPoint: function(position) {
        const ownerDocument = this._$dragElement.get(0).ownerDocument;

        if(browser.msie) {
            const msElements = ownerDocument.msElementsFromPoint(position.x, position.y);

            if(msElements) {
                return Array.prototype.slice.call(msElements);
            }

            return [];
        }

        return ownerDocument.elementsFromPoint(position.x, position.y);
    },

    _defaultActionArgs: function() {
        const args = this.callBase.apply(this, arguments);
        const component = this.option('component');

        if(component) {
            args.component = component;
            args.element = component.element();
        }

        return args;
    },

    _getEventArgs: function(e) {
        const sourceDraggable = this._getSourceDraggable();
        const targetDraggable = this._getTargetDraggable();

        return {
            event: e,
            itemData: sourceDraggable.option('itemData'),
            itemElement: getPublicElement(sourceDraggable._$sourceElement),
            fromComponent: sourceDraggable.option('component') || sourceDraggable,
            toComponent: targetDraggable.option('component') || targetDraggable,
            fromData: sourceDraggable.option('data'),
            toData: targetDraggable.option('data'),
        };
    },

    _getDragStartArgs: function(e, $itemElement) {
        const args = this._getEventArgs(e);

        return {
            event: args.event,
            itemData: args.itemData,
            itemElement: $itemElement,
            fromData: args.fromData
        };
    },

    _revertItemToInitialPosition: function() {
        !this._dragElementIsCloned() && this._move(this._initialLocate, this._$sourceElement);
    },

    _dragEndHandler: function(e) {
        const dragEndEventArgs = this._getEventArgs(e);
        const dropEventArgs = this._getEventArgs(e);
        const targetDraggable = this._getTargetDraggable();
        let needRevertPosition = true;

        try {
            this._getAction('onDragEnd')(dragEndEventArgs);
        } finally {
            when(fromPromise(dragEndEventArgs.cancel))
                .done((cancel) => {
                    if(!cancel) {
                        if(targetDraggable !== this) {
                            targetDraggable._getAction('onDrop')(dropEventArgs);
                        }

                        if(!dropEventArgs.cancel) {
                            targetDraggable.dragEnd(dragEndEventArgs);
                            needRevertPosition = false;
                        }
                    }
                }).always(() => {
                    if(needRevertPosition) {
                        this._revertItemToInitialPosition();
                    }

                    this.reset();
                    targetDraggable.reset();
                    this._stopAnimator();
                    this._horizontalScrollHelper.reset();
                    this._verticalScrollHelper.reset();

                    this._resetDragElement();
                    this._resetSourceElement();

                    this._resetTargetDraggable();
                    this._resetSourceDraggable();
                });
        }
    },

    _dragEnterHandler: function(e) {
        this._setTargetDraggable();

        const sourceDraggable = this._getSourceDraggable();
        sourceDraggable.dragEnter(e);
    },

    _dragLeaveHandler: function(e) {
        this._resetTargetDraggable();

        if(this !== this._getSourceDraggable()) {
            this.reset();
        }

        const sourceDraggable = this._getSourceDraggable();
        sourceDraggable.dragLeave(e);
    },

    _getAction: function(name) {
        return this['_' + name + 'Action'] || this._createActionByOption(name);
    },

    _getAnonymousTemplateName: function() {
        return 'content';
    },

    _initTemplates: function() {
        if(!this.option('contentTemplate')) return;

        this.callBase.apply(this, arguments);
        this._defaultTemplates['content'] = new EmptyTemplate();
    },

    _render: function() {
        this.callBase();
        this.$element().addClass(this._addWidgetPrefix());

        const transclude = this._getAnonymousTemplateName() === this.option('contentTemplate');
        const template = this._getTemplateByOption('contentTemplate');

        if(template) {
            $(template.render({
                container: this.element(),
                transclude
            }));
        }
    },

    _optionChanged: function(args) {
        const name = args.name;

        switch(name) {
            case 'onDragStart':
            case 'onDragMove':
            case 'onDragEnd':
            case 'onDrop':
                this['_' + name + 'Action'] = this._createActionByOption(name);
                break;
            case 'dragTemplate':
            case 'contentTemplate':
            case 'container':
            case 'clone':
                this._resetDragElement();
                break;
            case 'allowMoveByClick':
            case 'dragDirection':
            case 'disabled':
            case 'boundary':
            case 'filter':
            case 'immediate':
                this._resetDragElement();
                this._detachEventHandlers();
                this._attachEventHandlers();
                break;
            case 'autoScroll':
                this._verticalScrollHelper.reset();
                this._horizontalScrollHelper.reset();
                break;
            case 'scrollSensitivity':
            case 'scrollSpeed':
            case 'boundOffset':
            case 'handle':
            case 'group':
            case 'data':
            case 'itemData':
                break;
            default:
                this.callBase(args);
        }
    },

    _getTargetDraggable: function() {
        return targetDraggable || this;
    },

    _getSourceDraggable: function() {
        return sourceDraggable || this;
    },

    _setTargetDraggable: function() {
        const currentGroup = this.option('group');
        const sourceDraggable = this._getSourceDraggable();

        if(currentGroup && currentGroup === sourceDraggable.option('group')) {
            targetDraggable = this;
        }
    },

    _setSourceDraggable: function() {
        sourceDraggable = this;
    },

    _resetSourceDraggable: function() {
        sourceDraggable = null;
    },

    _resetTargetDraggable: function() {
        targetDraggable = null;
    },

    _dispose: function() {
        this.callBase();
        this._detachEventHandlers();
        this._resetDragElement();
        this._resetTargetDraggable();
        this._resetSourceDraggable();
        this._$sourceElement = null;
        this._stopAnimator();
    }
});

registerComponent(DRAGGABLE, Draggable);

module.exports = Draggable;
