import $ from "../core/renderer";
import registerComponent from "../core/component_registrator";
import { extend } from "../core/utils/extend";
import Draggable from "./draggable";
import { getPublicElement } from "../core/utils/dom";

var SORTABLE = "dxSortable",

    SOURCE_CLASS = "source",
    PLACEHOLDER_CLASS = "placeholder";

/**
* @name dxSortable
* @inherits DraggableBase
* @hasTranscludedContent
* @module ui/sortable
* @export default
*/

var Sortable = Draggable.inherit({
    _setupDraggingInfo: function() {
        if(this._dragInfo) {
            return;
        }

        let $sourceElement = this._getSourceElement();

        this._dragInfo = {
            fromIndex: $sourceElement.index(),
            itemPoints: this._getItemPoints()
        };
    },

    _clearDragInfo: function() {
        this._dragInfo = null;
    },

    _movePlaceholder: function(e) {
        let itemPoints = this._dragInfo && this._dragInfo.itemPoints;

        if(!itemPoints) {
            return;
        }

        let isVertical = this.option("itemOrientation") === "vertical",
            axisName = isVertical ? "top" : "left",
            cursorPosition = isVertical ? e.pageY : e.pageX;

        for(let i = 0; i < itemPoints.length; i++) {
            let itemPoint = itemPoints[i],
                centerPosition = itemPoints[i + 1] && (itemPoint[axisName] + itemPoints[i + 1][axisName]) / 2;

            if(centerPosition > cursorPosition) {
                this._updatePlaceholderPosition(e, itemPoint);
                break;
            } else if(centerPosition === undefined) {
                this._updatePlaceholderPosition(e, itemPoint, true);
                break;
            }
        }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            clone: true,
            /**
             * @name dxSortableOptions.filter
             * @type string
             * @default "> *"
             */
            filter: "> *",
            /**
             * @name dxSortableOptions.itemOrientation
             * @type Enums.Orientation
             * @default "vertical"
             */
            itemOrientation: "vertical",
            /**
             * @name dxSortableOptions.placeholderTemplate
             * @type template|function
             * @type_function_return string|Node|jQuery
             * @default undefined
             */
            placeholderTemplate: undefined,
            /**
             * @name dxSortableOptions.onDragChange
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @action
             * @hidden
             */
            onDragChange: null
        });
    },

    _init: function() {
        this.callBase();
    },

    _resetPlaceholder: function() {
        if(this._$placeholderElement) {
            let needToRemove = !this._$placeholderElement.hasClass(this._addWidgetPrefix(SOURCE_CLASS));

            if(needToRemove) {
                this._$placeholderElement.remove();
            } else {
                this._togglePlaceholderClass(false);
            }
        }
        this._$placeholderElement = null;
    },

    _getPlaceholderTemplate: function() {
        let sourceDraggable = this._getSourceDraggable();

        return sourceDraggable.option("placeholderTemplate");
    },

    _createPlaceholder: function() {
        let $placeholderContainer = this._getSourceElement(),
            placeholderTemplate = this._getPlaceholderTemplate();

        if(placeholderTemplate) {
            $placeholderContainer = $("<div>");
            placeholderTemplate = this._getTemplate(placeholderTemplate);
            placeholderTemplate.render({
                container: getPublicElement($placeholderContainer)
            });
        }

        this._$placeholderElement = $placeholderContainer;
        this._togglePlaceholderClass(true);

        return $placeholderContainer;
    },

    _togglePlaceholderClass: function(value) {
        this._$placeholderElement && this._$placeholderElement.toggleClass(this._addWidgetPrefix(PLACEHOLDER_CLASS), value);
    },

    _getItems: function() {
        let itemsSelector = this._getItemsSelector();

        return this.$element().find(itemsSelector).not("." + this._addWidgetPrefix(PLACEHOLDER_CLASS)).toArray();
    },

    _isValidPoint: function($items, itemPointIndex) {
        let hasPlaceholderTemplate = !!this.option("placeholderTemplate");

        if(!hasPlaceholderTemplate) {
            return true;
        }

        let $draggableItem = this._getDraggableElement(),
            draggableItemIndex = $items.indexOf($draggableItem.get(0));

        return draggableItemIndex === -1 || itemPointIndex !== draggableItemIndex && itemPointIndex !== (draggableItemIndex + 1);
    },

    _getItemPoints: function() {
        let result,
            isVertical = this.option("itemOrientation") === "vertical",
            $items = this._getItems();

        result = $items.map((item, index) => {
            let offset = $(item).offset();

            return {
                left: offset.left,
                top: offset.top,
                index: index,
                $item: $(item),
                width: $(item).outerWidth(),
                height: $(item).outerHeight(),
                isValid: this._isValidPoint($items, index)
            };
        });

        if(result.length) {
            let lastItem = result[result.length - 1];

            result.push({
                index: result.length,
                top: isVertical ? lastItem.top + lastItem.height : lastItem.top,
                left: !isVertical ? lastItem.left + lastItem.width : lastItem.left,
                isValid: this._isValidPoint($items, result.length)
            });
        }

        return result;
    },

    _dragStartHandler: function(e) {
        this.callBase.apply(this, arguments);

        if(e.cancel === true) {
            return;
        }

        this._setupDraggingInfo();
    },

    _dragMoveHandler: function(e) {
        this.callBase.apply(this, arguments);

        if(e.cancel === true) {
            return;
        }

        let currentDraggable = this._getCurrentDraggable();
        currentDraggable._movePlaceholder(e);
    },

    _dragEnterHandler: function() {
        // TODO remove code after fix enter/leave events
        let sourceDraggable = this._getSourceDraggable();
        sourceDraggable._resetPlaceholder();

        this.callBase.apply(this, arguments);
        this._setupDraggingInfo();
    },

    _dragLeaveHandler: function() {
        let currentDraggable = this._getCurrentDraggable();
        currentDraggable._clearDragInfo();
        currentDraggable._resetPlaceholder();

        this.callBase.apply(this, arguments);
    },

    _togglePlaceholder: function(value) {
        this._$placeholderElement && this._$placeholderElement.toggle(value);
    },

    _updatePlaceholderPosition: function(e, itemPoint, isLastPosition) {
        let eventArgs,
            fromIndex = this._dragInfo.fromIndex,
            sourceDraggable = this._getSourceDraggable();

        this._dragInfo.toIndex = Math.max(sourceDraggable !== this || fromIndex > itemPoint.index ? itemPoint.index : itemPoint.index - 1, 0);
        this._dragInfo.targetItemPoint = itemPoint;

        eventArgs = extend(this._getEventArgs(), {
            event: e
        });
        this._getAction("onDragChange")(eventArgs);

        if(eventArgs.cancel || eventArgs.cancel === undefined && !itemPoint.isValid) {
            this._togglePlaceholder(false);
            return;
        }

        let $placeholderElement = this._$placeholderElement || this._createPlaceholder();

        this._togglePlaceholder(true);
        this._moveItem($placeholderElement, itemPoint.$item, isLastPosition);
        this._dragInfo.itemPoints = this._getItemPoints();
    },

    _moveItem: function($targetItem, $item, isLastPosition) {
        if(isLastPosition) {
            this.$element().append($targetItem);
        } else {
            $targetItem.insertBefore($item);
        }
    },

    _dropItem: function($sourceElement, sourceDraggable) {
        let hasPlaceholderTemplate = !!sourceDraggable.option("placeholderTemplate");

        if(hasPlaceholderTemplate) {
            let $targetItemElement = this._dragInfo.targetItemPoint.$item;

            this._moveItem($sourceElement, $targetItemElement, !$targetItemElement);
        }
    },

    _getEventArgs: function() {
        let sourceElement = getPublicElement(this._getSourceElement()),
            fromIndex = this._dragInfo && this._dragInfo.fromIndex,
            toIndex = this._dragInfo && this._dragInfo.toIndex;

        return {
            fromIndex: fromIndex,
            toIndex: toIndex,
            sourceElement: sourceElement
        };
    },

    _getDragEndArgs: function() {
        return extend(this.callBase.apply(this, arguments), this._getEventArgs());
    },

    _dragEndHandler: function(e) {
        let $sourceElement = this._getSourceElement(),
            sourceDraggable = this._getSourceDraggable(),
            currentDraggable = this._getCurrentDraggable();

        this._resetPlaceholder();
        currentDraggable._resetPlaceholder();

        if(this.callBase.apply(this, arguments)) {
            currentDraggable._dropItem($sourceElement, sourceDraggable);
        }

        this._clearDragInfo();
        currentDraggable._clearDragInfo();
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "onDragChange":
                this["_" + name + "Action"] = this._createActionByOption(name);
                break;
            case "itemOrientation":
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent(SORTABLE, Sortable);

module.exports = Sortable;
