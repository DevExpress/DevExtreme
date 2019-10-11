var $ = require("../core/renderer"),
    window = require("../core/utils/window").getWindow(),
    eventsEngine = require("../events/core/events_engine"),
    stringUtils = require("../core/utils/string"),
    registerComponent = require("../core/component_registrator"),
    translator = require("../animation/translator"),
    Animator = require("./scroll_view/animator"),
    browser = require("../core/utils/browser"),
    dasherize = require("../core/utils/inflector").dasherize,
    extend = require("../core/utils/extend").extend,
    DOMComponentWithTemplate = require("../core/dom_component_with_template"),
    getPublicElement = require("../core/utils/dom").getPublicElement,
    eventUtils = require("../events/utils"),
    pointerEvents = require("../events/pointer"),
    dragEvents = require("../events/drag"),
    positionUtils = require("../animation/position"),
    typeUtils = require("../core/utils/type"),
    noop = require("../core/utils/common").noop,
    viewPortUtils = require("../core/utils/view_port"),
    commonUtils = require("../core/utils/common");

var DRAGGABLE = "dxDraggable",
    DRAGSTART_EVENT_NAME = eventUtils.addNamespace(dragEvents.start, DRAGGABLE),
    DRAG_EVENT_NAME = eventUtils.addNamespace(dragEvents.move, DRAGGABLE),
    DRAGEND_EVENT_NAME = eventUtils.addNamespace(dragEvents.end, DRAGGABLE),
    DRAG_ENTER_EVENT_NAME = eventUtils.addNamespace(dragEvents.enter, DRAGGABLE),
    DRAGEND_LEAVE_EVENT_NAME = eventUtils.addNamespace(dragEvents.leave, DRAGGABLE),
    POINTERDOWN_EVENT_NAME = eventUtils.addNamespace(pointerEvents.down, DRAGGABLE),

    CLONE_CLASS = "clone";

var targetDraggable,
    sourceDraggable;

class ScrollHelper {
    constructor(orientation, component) {
        this._preventScroll = true;
        this._component = component;

        if(orientation === "vertical") {
            this._scrollValue = "scrollTop";
            this._overFlowAttr = "overflowY";
            this._sizeAttr = "height";
            this._scrollSizeProp = "scrollHeight";
            this._limitProps = {
                start: "top",
                end: "bottom"
            };
        } else {
            this._scrollValue = "scrollLeft";
            this._overFlowAttr = "overflowX";
            this._sizeAttr = "width";
            this._scrollSizeProp = "scrollWidth";
            this._limitProps = {
                start: "left",
                end: "right"
            };
        }
    }

    findScrollable(elements, mousePosition) {
        var that = this;

        if(!elements.some(element => that._trySetScrollable(element, mousePosition))) {
            that._$scrollable = null;
            that._scrollSpeed = 0;
        }
    }

    _trySetScrollable(element, mousePosition) {
        var that = this,
            $element = $(element),
            distanceToBorders,
            sensitivity = that._component.option("scrollSensitivity"),
            isScrollable = ($element.css(that._overFlowAttr) === "auto" || $element.hasClass("dx-scrollable-container"))
                && $element.prop(that._scrollSizeProp) > $element[that._sizeAttr]();

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
        var area = $area.get(0),
            areaBoundingRect;

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
        var component = this._component,
            sensitivity = component.option("scrollSensitivity"),
            maxSpeed = component.option("scrollSpeed");

        return Math.round((sensitivity - distance) / sensitivity * maxSpeed);
    }

    scrollByStep() {
        var that = this,
            nextScrollPosition;

        if(that._$scrollable && that._scrollSpeed) {
            if(that._$scrollable.hasClass("dx-scrollable-container")) {
                var $scrollable = that._$scrollable.closest(".dx-scrollable"),
                    scrollableInstance = $scrollable.data("dxScrollable") || $scrollable.data("dxScrollView");

                if(scrollableInstance) {
                    nextScrollPosition = scrollableInstance.scrollOffset();
                    nextScrollPosition[that._limitProps.start] += that._scrollSpeed;

                    scrollableInstance.scrollTo(nextScrollPosition);
                }
            } else {
                nextScrollPosition = that._$scrollable[that._scrollValue]() + that._scrollSpeed;

                that._$scrollable[that._scrollValue](nextScrollPosition);
            }

            let dragMoveArgs = that._component._dragMoveArgs;
            if(dragMoveArgs) {
                that._component._dragMoveHandler(dragMoveArgs);
            }
        }
    }

    reset() {
        this._$scrollable = null;
        this._scrollSpeed = 0;
    }
}

var ScrollAnimator = Animator.inherit({

    ctor: function(strategy) {
        this.callBase();

        this._strategy = strategy;
    },

    _step: function() {
        var horizontalScrollHelper = this._strategy.horizontalScrollHelper,
            verticalScrollHelper = this._strategy.verticalScrollHelper;

        horizontalScrollHelper && horizontalScrollHelper.scrollByStep();
        verticalScrollHelper && verticalScrollHelper.scrollByStep();
    }
});

/**
 * @name DraggableBase
 * @inherits DOMComponent
 * @export default
 * @hidden
 */

/**
 * @name dxDraggable
 * @inherits DraggableBase
 * @hasTranscludedContent
 * @module ui/draggable
 * @export default
 */

var Draggable = DOMComponentWithTemplate.inherit({
    reset: noop,

    dragMove: noop,

    dragEnter: noop,

    dragLeave: noop,

    dragEnd: noop,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
             * @name dxDraggableOptions.onDragStart
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 cancel:boolean
             * @type_function_param1_field6 itemData:any
             * @type_function_param1_field7 itemElement:dxElement
             * @type_function_param1_field8 fromData:any
             * @action
             */
            onDragStart: null,
            /**
             * @name dxDraggableOptions.onDragMove
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 cancel:boolean
             * @type_function_param1_field6 itemData:any
             * @type_function_param1_field7 itemElement:dxElement
             * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
             * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
             * @type_function_param1_field10 fromData:any
             * @type_function_param1_field11 toData:any
             * @action
             */
            onDragMove: null,
            /**
             * @name dxDraggableOptions.onDragEnd
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 cancel:boolean
             * @type_function_param1_field6 itemData:any
             * @type_function_param1_field7 itemElement:dxElement
             * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
             * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
             * @type_function_param1_field10 fromData:any
             * @type_function_param1_field11 toData:any
             * @action
             */
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
            /**
             * @name DraggableBaseOptions.dragDirection
             * @type Enums.DragDirection
             * @default "both"
             */
            dragDirection: "both",
            /**
             * @name DraggableBaseOptions.boundary
             * @type string|Node|jQuery
             * @default undefined
             */
            boundary: undefined,
            boundOffset: 0,
            allowMoveByClick: false,
            itemData: null,
            /**
             * @name DraggableBaseOptions.container
             * @type string|Node|jQuery
             * @default undefined
             */
            container: undefined,
            /**
             * @name dxDraggableOptions.dragTemplate
             * @type template|function
             * @type_function_param1 dragInfo:object
             * @type_function_param1_field1 itemData:any
             * @type_function_param1_field2 itemElement:dxElement
             * @type_function_param2 containerElement:dxElement
             * @type_function_return string|Node|jQuery
             * @default undefined
             */
            dragTemplate: undefined,
            /**
             * @name DraggableBaseOptions.contentTemplate
             * @type template|function
             * @type_function_return string|Node|jQuery
             * @hidden
             * @default "content"
             */
            contentTemplate: "content",
            /**
             * @name DraggableBaseOptions.handle
             * @type string
             * @default ""
             */
            handle: "",
            /**
             * @name dxDraggableOptions.filter
             * @type string
             * @default ""
             * @hidden
             */
            filter: "",
            /**
             * @name dxDraggableOptions.clone
             * @type boolean
             * @default false
             */
            clone: false,
            /**
             * @name DraggableBaseOptions.autoScroll
             * @type boolean
             * @default true
             */
            autoScroll: true,
            /**
             * @name DraggableBaseOptions.scrollSpeed
             * @type number
             * @default 60
             */
            scrollSpeed: 60,
            /**
             * @name DraggableBaseOptions.scrollSensitivity
             * @type number
             * @default 60
             */
            scrollSensitivity: 60,
            /**
             * @name DraggableBaseOptions.group
             * @type string
             * @default undefined
             */
            group: undefined,
            /**
             * @name DraggableBaseOptions.data
             * @type any
             * @default undefined
             */
            data: undefined,
            /**
             * @name DraggableBaseOptions.cursorOffset
             * @type string|object
             */
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
            group: true,
            itemData: true,
            data: true
        });
    },

    _init: function() {
        this.callBase();
        this._attachEventHandlers();

        this._scrollAnimator = new ScrollAnimator(this);

        this.horizontalScrollHelper = new ScrollHelper("horizontal", this);
        this.verticalScrollHelper = new ScrollHelper("vertical", this);
    },

    _normalizeCursorOffset: function(offset, options) {
        if(typeUtils.isFunction(offset)) {
            offset = offset.call(this, options);
        }

        if(typeUtils.isObject(offset)) {
            offset = {
                h: offset.x,
                v: offset.y
            };
        }

        let result = commonUtils.pairToObject(offset);

        return {
            left: result.h,
            top: result.v
        };
    },

    _initPosition: function(options, initialOffset) {
        let elementOffset,
            dragElementOffset,
            $element = $(options.itemElement),
            $dragElement = $(options.dragElement),
            isCloned = this._dragElementIsCloned(),
            cursorOffset = this.option("cursorOffset"),
            normalizedCursorOffset = this._normalizeCursorOffset(cursorOffset, options),
            currentLocate = this._initialLocate = translator.locate($dragElement);

        if(isCloned || initialOffset) {
            elementOffset = initialOffset || $element.offset();
            dragElementOffset = $dragElement.offset();
            elementOffset.top -= dragElementOffset.top - normalizedCursorOffset.top - currentLocate.top;
            elementOffset.left -= dragElementOffset.left - normalizedCursorOffset.left - currentLocate.left;
        }

        if(elementOffset || cursorOffset) {
            this._move(elementOffset || normalizedCursorOffset, $dragElement);
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
        var componentName = this.NAME;

        return dasherize(componentName) + (className ? "-" + className : "");
    },

    _getItemsSelector: function() {
        return this.option("filter") || "";
    },

    _$content: function() {
        var $element = this.$element(),
            $wrapper = $element.children(".dx-template-wrapper");

        return $wrapper.length ? $wrapper : $element;
    },

    _attachEventHandlers: function() {
        if(this.option("disabled")) {
            return;
        }

        var $element = this._$content(),
            itemsSelector = this._getItemsSelector(),
            allowMoveByClick = this.option("allowMoveByClick"),
            data = {
                direction: this.option("dragDirection"),
                immediate: this.option("immediate"),
                checkDropTarget: () => {
                    var targetGroup = this.option("group"),
                        sourceGroup = this._getSourceDraggable().option("group");

                    return sourceGroup && sourceGroup === targetGroup;
                }
            };

        if(allowMoveByClick) {
            $element = this._getArea();
            eventsEngine.on($element, POINTERDOWN_EVENT_NAME, data, this._pointerDownHandler.bind(this));
        }

        if(itemsSelector[0] === ">") {
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

    _getDragTemplateArgs: function($element) {
        let container = this._getContainer();

        return {
            container: getPublicElement($(container)),
            model: {
                itemData: this.option("itemData"),
                itemElement: getPublicElement($element)
            }
        };
    },

    _createDragElement: function($element) {
        let result = $element,
            clone = this.option("clone"),
            container = this._getContainer(),
            template = this.option("dragTemplate");

        if(template) {
            template = this._getTemplate(template);
            result = $(template.render(this._getDragTemplateArgs($element)));
        } else if(clone) {
            result = $element.clone().outerWidth($element.outerWidth()).appendTo(container);
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
        eventsEngine.off(this._$content(), "." + DRAGGABLE);
        eventsEngine.off(this._getArea(), "." + DRAGGABLE);
    },

    _move: function(position, $element) {
        translator.move($element || this._$dragElement, position);
    },

    _getDraggableElement: function(e) {
        let $sourceElement = this._getSourceElement();

        if($sourceElement) {
            return $sourceElement;
        }

        let allowMoveByClick = this.option("allowMoveByClick");
        if(allowMoveByClick) {
            return this.$element();
        }

        let $target = $(e && e.target),
            itemsSelector = this._getItemsSelector();

        if(itemsSelector[0] === ">") {
            var $items = this._$content().find(itemsSelector);
            if(!$items.is($target)) {
                $target = $target.closest($items);
            }
        }
        return $target;
    },

    _getSourceElement: function() {
        let draggable = this._getSourceDraggable();

        return draggable._$sourceElement;
    },

    _pointerDownHandler: function(e) {
        if(eventUtils.needSkipEvent(e)) {
            return;
        }

        let position = {},
            $element = this.$element(),
            dragDirection = this.option("dragDirection");

        if(dragDirection === "horizontal" || dragDirection === "both") {
            position.left = e.pageX - $element.offset().left + translator.locate($element).left - $element.width() / 2;
        }

        if(dragDirection === "vertical" || dragDirection === "both") {
            position.top = e.pageY - $element.offset().top + translator.locate($element).top - $element.height() / 2;
        }

        this._move(position, $element);
        this._getAction("onDragMove")(this._getEventArgs(e));
    },

    _isValidElement: function(event, $element) {
        let handle = this.option("handle"),
            $target = $(event.originalEvent && event.originalEvent.target);

        if(handle && !$target.closest(handle).length) {
            return false;
        }

        if(!$element.length) {
            return false;
        }

        return !$element.is(".dx-state-disabled, .dx-state-disabled *");
    },

    _dragStartHandler: function(e) {
        let $dragElement,
            initialOffset,
            isFixedPosition,
            $element = this._getDraggableElement(e);

        if(this._$sourceElement) {
            return;
        }
        if(!this._isValidElement(e, $element)) {
            e.cancel = true;
            return;
        }

        let dragStartArgs = this._getDragStartArgs(e, $element);
        this._getAction("onDragStart")(dragStartArgs);

        if(dragStartArgs.cancel) {
            e.cancel = true;
            return;
        }

        this.option("itemData", dragStartArgs.itemData);
        this._setSourceDraggable();

        this._$sourceElement = $element;
        initialOffset = $element.offset();
        $dragElement = this._$dragElement = this._createDragElement($element);

        this._toggleDraggingClass(true);
        this._toggleDragSourceClass(true);
        isFixedPosition = $dragElement.css("position") === "fixed";

        this._initPosition(extend({}, dragStartArgs, { dragElement: $dragElement.get(0) }), isFixedPosition && initialOffset);

        var $area = this._getArea(),
            areaOffset = this._getAreaOffset($area),
            boundOffset = this._getBoundOffset(),
            areaWidth = $area.outerWidth(),
            areaHeight = $area.outerHeight(),
            elementWidth = $dragElement.width(),
            elementHeight = $dragElement.height();

        var startOffset = {
            left: $dragElement.offset().left - areaOffset.left,
            top: $dragElement.offset().top - areaOffset.top
        };
        if($area.length) {
            e.maxLeftOffset = startOffset.left - boundOffset.left;
            e.maxRightOffset = areaWidth - startOffset.left - elementWidth - boundOffset.right;
            e.maxTopOffset = startOffset.top - boundOffset.top;
            e.maxBottomOffset = areaHeight - startOffset.top - elementHeight - boundOffset.bottom;
        }

        if(this.option("autoScroll")) {
            this._startAnimator();
        }
    },

    _getAreaOffset: function($area) {
        var offset = $area && positionUtils.offset($area);
        return offset ? offset : { left: 0, top: 0 };
    },

    _toggleDraggingClass: function(value) {
        this._$dragElement && this._$dragElement.toggleClass(this._addWidgetPrefix("dragging"), value);
    },

    _toggleDragSourceClass: function(value, $element) {
        let $sourceElement = $element || this._$sourceElement;
        $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix("source"), value);
    },

    _getBoundOffset: function() {
        var boundOffset = this.option("boundOffset");

        if(typeUtils.isFunction(boundOffset)) {
            boundOffset = boundOffset.call(this);
        }

        return stringUtils.quadToObject(boundOffset);
    },

    _getArea: function() {
        var area = this.option("boundary");

        if(typeUtils.isFunction(area)) {
            area = area.call(this);
        }
        return $(area);
    },

    _getContainer: function() {
        var container = this.option("container");

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

        let offset = e.offset,
            startPosition = this._startPosition;

        this._move({
            left: startPosition.left + offset.x,
            top: startPosition.top + offset.y
        });

        if(this.option("autoScroll")) {
            this._findScrollable(e);
        }

        let eventArgs = this._getEventArgs(e);
        this._getAction("onDragMove")(eventArgs);

        if(eventArgs.cancel === true) {
            return;
        }

        let targetDraggable = this._getTargetDraggable();
        targetDraggable.dragMove(e);
    },

    _findScrollable: function(e) {
        var that = this,
            $dragElement = that._$dragElement,
            ownerDocument = $dragElement.get(0).ownerDocument,
            $window = $(window),
            mousePosition = {
                x: e.pageX - $window.scrollLeft(),
                y: e.pageY - $window.scrollTop()
            },
            allObjects;

        if(browser.msie) {
            let msElements = ownerDocument.msElementsFromPoint(mousePosition.x, mousePosition.y);

            if(msElements) {
                allObjects = Array.prototype.slice.call(msElements);
            } else {
                allObjects = [];
            }
        } else {
            allObjects = ownerDocument.elementsFromPoint(mousePosition.x, mousePosition.y);
        }

        that.verticalScrollHelper && that.verticalScrollHelper.findScrollable(allObjects, mousePosition);
        that.horizontalScrollHelper && that.horizontalScrollHelper.findScrollable(allObjects, mousePosition);
    },

    _getEventArgs: function(e) {
        let sourceDraggable = this._getSourceDraggable(),
            targetDraggable = this._getTargetDraggable();

        return {
            event: e,
            itemData: sourceDraggable.option("itemData"),
            itemElement: getPublicElement(sourceDraggable._$sourceElement),
            fromComponent: sourceDraggable,
            toComponent: targetDraggable,
            fromData: sourceDraggable.option("data"),
            toData: targetDraggable.option("data"),
        };
    },

    _getDragEndAndDropArgs: function(e) {
        let targetDraggable = this._getTargetDraggable();

        return extend(this._getEventArgs(e), {
            fromComponent: this,
            toComponent: targetDraggable,
            toData: targetDraggable.option("data")
        });
    },

    _getDragStartArgs: function(e, $itemElement) {
        let args = this._getEventArgs(e);

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
        let dragEndEventArgs = this._getDragEndAndDropArgs(e),
            dropEventArgs = this._getDragEndAndDropArgs(e),
            targetDraggable = this._getTargetDraggable(),
            needRevertPosition = true;

        try {
            this._getAction("onDragEnd")(dragEndEventArgs);
        } finally {
            if(!dragEndEventArgs.cancel) {
                if(targetDraggable !== this) {
                    targetDraggable._getAction("onDrop")(dropEventArgs);
                }

                if(!dropEventArgs.cancel) {
                    targetDraggable.dragEnd(dragEndEventArgs);
                    needRevertPosition = false;
                }
            }

            if(needRevertPosition) {
                this._revertItemToInitialPosition();
            }

            this.reset();
            targetDraggable.reset();
            this._stopAnimator();
            this.horizontalScrollHelper.reset();
            this.verticalScrollHelper.reset();

            this._resetDragElement();
            this._resetSourceElement();

            this._resetTargetDraggable();
            this._resetSourceDraggable();
        }
    },

    _dragEnterHandler: function(e) {
        this._setTargetDraggable();

        let sourceDraggable = this._getSourceDraggable();
        sourceDraggable.dragEnter(e);
    },

    _dragLeaveHandler: function(e) {
        this._resetTargetDraggable();

        this.reset();

        let sourceDraggable = this._getSourceDraggable();
        sourceDraggable.dragLeave(e);
    },

    _getAction: function(name) {
        return this["_" + name + "Action"] || this._createActionByOption(name);
    },

    _getAnonymousTemplateName: function() {
        return "content";
    },

    _initTemplates: function() {
        if(!this.option("contentTemplate")) return;

        this.callBase.apply(this, arguments);
    },

    _render: function() {
        this.callBase();
        this.$element().addClass(this._addWidgetPrefix());

        const transclude = this._getAnonymousTemplateName() === this.option("contentTemplate"),
            template = this._getTemplateByOption("contentTemplate");

        if(template) {
            $(template.render({
                container: this.element(),
                transclude
            }));
        }
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "onDragStart":
            case "onDragMove":
            case "onDragEnd":
            case "onDrop":
                this["_" + name + "Action"] = this._createActionByOption(name);
                break;
            case "dragTemplate":
            case "contentTemplate":
            case "container":
            case "clone":
                this._resetDragElement();
                break;
            case "allowMoveByClick":
            case "dragDirection":
            case "disabled":
            case "boundary":
            case "filter":
            case "immediate":
                this._resetDragElement();
                this._detachEventHandlers();
                this._attachEventHandlers();
                break;
            case "autoScroll":
                this.verticalScrollHelper.reset();
                this.horizontalScrollHelper.reset();
                break;
            case "scrollSensitivity":
            case "scrollSpeed":
            case "boundOffset":
            case "handle":
            case "group":
            case "data":
            case "itemData":
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
        let currentGroup = this.option("group"),
            sourceDraggable = this._getSourceDraggable();

        if(currentGroup && currentGroup === sourceDraggable.option("group")) {
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
