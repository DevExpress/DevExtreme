var $ = require("../core/renderer"),
    window = require("../core/utils/window").getWindow(),
    eventsEngine = require("../events/core/events_engine"),
    stringUtils = require("../core/utils/string"),
    registerComponent = require("../core/component_registrator"),
    translator = require("../animation/translator"),
    dasherize = require("../core/utils/inflector").dasherize,
    extend = require("../core/utils/extend").extend,
    DOMComponentWithTemplate = require("../core/dom_component_with_template"),
    getPublicElement = require("../core/utils/dom").getPublicElement,
    eventUtils = require("../events/utils"),
    pointerEvents = require("../events/pointer"),
    dragEvents = require("../events/drag"),
    positionUtils = require("../animation/position"),
    isFunction = require("../core/utils/type").isFunction,
    noop = require("../core/utils/common").noop,
    viewPortUtils = require("../core/utils/view_port");

var DRAGGABLE = "dxDraggable",
    DRAGSTART_EVENT_NAME = eventUtils.addNamespace(dragEvents.start, DRAGGABLE),
    DRAG_EVENT_NAME = eventUtils.addNamespace(dragEvents.move, DRAGGABLE),
    DRAGEND_EVENT_NAME = eventUtils.addNamespace(dragEvents.end, DRAGGABLE),
    POINTERDOWN_EVENT_NAME = eventUtils.addNamespace(pointerEvents.down, DRAGGABLE),

    CLONE_CLASS = "clone";

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
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
             * @name DraggableBaseOptions.onDragStart
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @action
             */
            onDragStart: null,
            /**
             * @name DraggableBaseOptions.onDragMove
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @action
             */
            onDragMove: null,
            /**
             * @name DraggableBaseOptions.onDragEnd
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @action
             */
            onDragEnd: null,
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
             * @default window
             */
            boundary: window,
            boundOffset: 0,
            allowMoveByClick: false,
            /**
             * @name DraggableBaseOptions.container
             * @type string|Node|jQuery
             * @default undefined
             */
            container: undefined,
            /**
             * @name DraggableBaseOptions.template
             * @type template|function
             * @type_function_return string|Node|jQuery
             * @default undefined
             */
            template: undefined,
            /**
             * @name DraggableBaseOptions.handle
             * @type string
             * @default ""
             */
            handle: "",
            filter: "",
            /**
             * @name dxDraggableOptions.clone
             * @type boolean
             * @default false
             */
            clone: false
        });
    },

    _init: function() {
        this.callBase();
        this._attachEventHandlers();
    },

    _initTemplates: noop,

    _initPosition: function($element, $dragElement) {
        let elementOffset,
            dragElementOffset,
            isCloned = this._dragElementIsCloned();

        if(isCloned) {
            elementOffset = $element.offset(),
            dragElementOffset = $dragElement.offset();
            elementOffset.top -= dragElementOffset.top;
            elementOffset.left -= dragElementOffset.left;
            this._move(elementOffset, $dragElement);
        }

        this._startPosition = translator.locate($dragElement);
    },

    _addWidgetPrefix: function(className) {
        var componentName = this.NAME;

        return dasherize(componentName) + (className ? "-" + className : "");
    },

    _getItemsSelector: function() {
        return this.option("filter") || "";
    },

    _attachEventHandlers: function() {
        if(this.option("disabled")) {
            return;
        }

        var $element = this.$element(),
            itemsSelector = this._getItemsSelector(),
            allowMoveByClick = this.option("allowMoveByClick"),
            data = {
                direction: this.option("dragDirection"),
                immediate: this.option("immediate")
            };

        if(allowMoveByClick) {
            $element = this._getArea();
            eventsEngine.on($element, POINTERDOWN_EVENT_NAME, data, this._pointerDownHandler.bind(this));
        }

        eventsEngine.on($element, DRAGSTART_EVENT_NAME, itemsSelector, data, this._dragStartHandler.bind(this));
        eventsEngine.on($element, DRAG_EVENT_NAME, data, this._dragMoveHandler.bind(this));
        eventsEngine.on($element, DRAGEND_EVENT_NAME, data, this._dragEndHandler.bind(this));
    },

    _dragElementIsCloned: function() {
        return this._$dragElement && this._$dragElement.hasClass(this._addWidgetPrefix(CLONE_CLASS));
    },

    _createDragElement: function($element) {
        let result = $element,
            clone = this.option("clone"),
            container = this._getContainer(),
            template = this.option("template");

        if(template) {
            template = this._getTemplate(template);
            result = $(template.render({
                container: getPublicElement($(container)),
                model: {
                    sourceElement: getPublicElement($element)
                }
            }));
        } else if(clone) {
            result = $element.clone().appendTo(container);
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

    _detachEventHandlers: function() {
        eventsEngine.off(this.$element(), "." + DRAGGABLE);
        eventsEngine.off(this._getArea(), "." + DRAGGABLE);
    },

    _move: function(position, $element) {
        translator.move($element || this._$dragElement, position);
    },

    _getDraggableElement: function(e) {
        if(this._$sourceElement) {
            return this._$sourceElement;
        }

        let allowMoveByClick = this.option("allowMoveByClick");

        return allowMoveByClick ? this.$element() : $(e.target);
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

        this._getAction("onDragMove")({ event: e });
    },

    _isValidElement: function(event, $element) {
        let handle = this.option("handle"),
            isHandleElement = handle && $(event.originalEvent.target).closest(handle).length;

        return !$element.is(".dx-state-disabled, .dx-state-disabled *") && (!handle || isHandleElement);
    },

    _dragStartHandler: function(e) {
        let $element = this._getDraggableElement(e);

        if(!this._isValidElement(e, $element)) {
            e.cancel = true;
            return;
        }

        this._$sourceElement = $element;
        let $dragElement = this._$dragElement = this._createDragElement($element);

        this._initPosition($element, $dragElement);

        this._toggleDraggingClass(true);
        this._toggleDragSourceClass(true);

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

        e.maxLeftOffset = startOffset.left - boundOffset.left;
        e.maxRightOffset = areaWidth - startOffset.left - elementWidth - boundOffset.right;
        e.maxTopOffset = startOffset.top - boundOffset.top;
        e.maxBottomOffset = areaHeight - startOffset.top - elementHeight - boundOffset.bottom;

        this._getAction("onDragStart")({ event: e });
    },

    _getAreaOffset: function($area) {
        var offset = $area && positionUtils.offset($area);
        return offset ? offset : { left: 0, top: 0 };
    },

    _toggleDraggingClass: function(value) {
        this._$dragElement && this._$dragElement.toggleClass(this._addWidgetPrefix("dragging"), value);
    },

    _toggleDragSourceClass: function(value) {
        this._$sourceElement && this._$sourceElement.toggleClass(this._addWidgetPrefix("source"), value);
    },

    _getBoundOffset: function() {
        var boundOffset = this.option("boundOffset");

        if(isFunction(boundOffset)) {
            boundOffset = boundOffset.call(this);
        }

        return stringUtils.quadToObject(boundOffset);
    },

    _getArea: function() {
        var area = this.option("boundary");

        if(isFunction(area)) {
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
        if(!this._$dragElement) {
            e.cancel = true;
            return;
        }

        var offset = e.offset,
            startPosition = this._startPosition;

        this._move({
            left: startPosition.left + offset.x,
            top: startPosition.top + offset.y
        });

        this._getAction("onDragMove")({ event: e });
    },

    _getDragEndArgs: function(e) {
        return {
            event: e
        };
    },

    _dragEndHandler: function(e) {
        let eventArgs = this._getDragEndArgs(e);

        this._getAction("onDragEnd")(eventArgs);

        this._toggleDragSourceClass(false);
        this._resetDragElement();
        this._$sourceElement = null;

        return !eventArgs.cancel;
    },

    _getAction: function(name) {
        return this["_" + name + "Action"] || this._createActionByOption(name);
    },

    _render: function() {
        this.callBase();
        this.$element().addClass(this._addWidgetPrefix());
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "onDragStart":
            case "onDragMove":
            case "onDragEnd":
                this["_" + name + "Action"] = this._createActionByOption(name);
                break;
            case "template":
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
            case "boundOffset":
            case "handle":
                break;
            default:
                this.callBase(args);
        }
    },

    _dispose: function() {
        this.callBase();
        this._detachEventHandlers();
        this._resetDragElement();
        this._$sourceElement = null;
    }
});

registerComponent(DRAGGABLE, Draggable);

module.exports = Draggable;
