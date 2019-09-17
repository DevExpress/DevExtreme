import $ from "../core/renderer";
import registerComponent from "../core/component_registrator";
import { extend } from "../core/utils/extend";
import Draggable from "./draggable";
import { getPublicElement } from "../core/utils/dom";
import translator from "../animation/translator";

var SORTABLE = "dxSortable",

    PLACEHOLDER_CLASS = "placeholder";

/**
* @name dxSortable
* @inherits DraggableBase
* @hasTranscludedContent
* @module ui/sortable
* @export default
*/

var Sortable = Draggable.inherit({
    _setOptionsByReference: function() {
        this.callBase.apply(this, arguments);

        extend(this._optionsByReference, {
            targetItemPoint: true
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            clone: true,
            /**
             * @name dxSortableOptions.filter
             * @type string
             * @default "> *"
             * @hidden
             */
            filter: "> *",
            /**
             * @name dxSortableOptions.itemOrientation
             * @type Enums.Orientation
             * @default "vertical"
             */
            itemOrientation: "vertical",
            /**
             * @name dxSortableOptions.dropFeedbackMode
             * @type Enums.DropFeedbackMode
             * @default "push"
             */
            dropFeedbackMode: "push",
            allowDropInside: false,
            /**
             * @name dxSortableOptions.onDragChange
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @action
             * @hidden
             */
            onDragChange: null,
            fromIndex: null,
            toIndex: null,
            inside: false,
            itemPoints: null,
            targetItemPoint: null
        });
    },

    reset: function() {
        this.option({
            targetItemPoint: null,
            toIndex: null,
            inside: false,
            fromIndex: null
        });

        if(this._$placeholderElement) {
            this._$placeholderElement.remove();
        }
        this._$placeholderElement = null;
    },

    _dragStartHandler: function(e) {
        this.callBase.apply(this, arguments);

        if(e.cancel === true) {
            return;
        }

        let $sourceElement = this._getSourceElement();

        this._updateItemPoints();
        this.option("fromIndex", $sourceElement.index());
    },

    _dragEnterHandler: function() {
        this.callBase.apply(this, arguments);

        this._updateItemPoints();
        this.option("fromIndex", -1);
    },

    dragEnter: function() {
        this.option("toIndex", -1);
    },

    dragLeave: function() {
        this.option("toIndex", null);
    },

    dragEnd: function() {
        let $sourceElement = this._getSourceElement(),
            sourceDraggable = this._getSourceDraggable(),
            isIndicateMode = this._isIndicateMode(),
            isSourceDraggable = sourceDraggable.NAME !== this.NAME;

        if(isIndicateMode || isSourceDraggable) {
            if(isSourceDraggable) {
                translator.resetPosition($sourceElement);
            }

            // TODO test
            $sourceElement.show();

            let targetItemPoint = this.option("targetItemPoint");

            if(targetItemPoint) {
                this._moveItem($sourceElement, targetItemPoint.$item);
            }
        }
    },

    dragMove: function(e) {
        let itemPoints = this.option("itemPoints");

        if(!itemPoints) {
            return;
        }

        let isVertical = this._isVerticalOrientation(),
            axisName = isVertical ? "top" : "left",
            cursorPosition = isVertical ? e.pageY : e.pageX;

        for(let i = 0; i < itemPoints.length; i++) {
            let itemPoint = itemPoints[i],
                centerPosition = itemPoints[i + 1] && (itemPoint[axisName] + itemPoints[i + 1][axisName]) / 2;

            if(centerPosition > cursorPosition) {
                this._updatePlaceholderPosition(e, itemPoint);
                break;
            } else if(centerPosition === undefined) {
                this._updatePlaceholderPosition(e, itemPoint);
                break;
            }
        }
    },

    _isIndicateMode: function() {
        return this.option("dropFeedbackMode") === "indicate" || this.option("allowDropInside");
    },

    _createPlaceholder: function() {
        let sourceDraggable = this._getSourceDraggable(),
            isSourceDraggable = sourceDraggable.NAME !== this.NAME,
            $placeholderContainer;

        if(isSourceDraggable) {
            $placeholderContainer = this._getSourceElement().clone();
            translator.resetPosition($placeholderContainer);
        } else if(this._isIndicateMode()) {
            $placeholderContainer = $("<div>")
                .addClass(this._addWidgetPrefix(PLACEHOLDER_CLASS))
                .appendTo(this._getContainer());
        }

        this._$placeholderElement = $placeholderContainer;

        return $placeholderContainer;
    },

    _getItems: function() {
        let itemsSelector = this._getItemsSelector();

        return this.$element().find(itemsSelector).not("." + this._addWidgetPrefix(PLACEHOLDER_CLASS)).toArray();
    },

    _isValidPoint: function($items, itemPointIndex, inside) {
        if(!this._isIndicateMode()) {
            return true;
        }

        let $draggableItem = this._getDraggableElement(),
            draggableItemIndex = $items.indexOf($draggableItem.get(0));

        return draggableItemIndex === -1 || itemPointIndex !== draggableItemIndex && (inside || itemPointIndex !== (draggableItemIndex + 1));
    },

    _getItemPoints: function() {
        let result,
            isVertical = this._isVerticalOrientation(),
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

            if(this.option("allowDropInside")) {
                let points = result;
                result = [];
                for(let i = 0; i < points.length; i++) {
                    result.push(points[i]);
                    if(points[i + 1]) {
                        result.push(extend({}, points[i], {
                            inside: true,
                            top: Math.floor((points[i].top + points[i + 1].top) / 2),
                            left: Math.floor((points[i].left + points[i + 1].left) / 2),
                            isValid: this._isValidPoint($items, i, true)
                        }));
                    }
                }
            }
        } else {
            result.push({
                index: 0,
                isValid: true
            });
        }

        return result;
    },

    _updateItemPoints: function() {
        this.option("itemPoints", this._getItemPoints());
    },

    _togglePlaceholder: function(value) {
        this._$placeholderElement && this._$placeholderElement.toggle(value);
    },

    _isVerticalOrientation: function() {
        return this.option("itemOrientation") === "vertical";
    },

    _updatePlaceholderPosition: function(e, itemPoint) {
        let sourceDraggable = this._getSourceDraggable(),
            isAnotherDraggable = sourceDraggable !== this,
            fromIndex = this.option("fromIndex"),
            toIndex = Math.max(isAnotherDraggable || fromIndex >= itemPoint.index || itemPoint.inside ? itemPoint.index : itemPoint.index - 1, 0);

        let eventArgs = extend(this._getEventArgs(), {
            event: e,
            toIndex,
            inside: itemPoint.inside
        });

        this._getAction("onDragChange")(eventArgs);

        if(eventArgs.cancel || eventArgs.cancel === undefined && !itemPoint.isValid) {
            this.option({
                targetItemPoint: null,
                toIndex: null,
                inside: false
            });
            return;
        }

        this.option({
            targetItemPoint: itemPoint,
            toIndex: eventArgs.toIndex,
            inside: eventArgs.inside
        });

        this._updateItemPoints();
    },

    _updatePlaceholderSizes: function($placeholderElement, itemPoint) {
        var isDragInside = Boolean(itemPoint.inside),
            $item = itemPoint.$item || this._getSourceElement(),
            isVertical = this._isVerticalOrientation(),
            width = "",
            height = "";

        $placeholderElement.toggleClass(this._addWidgetPrefix("placeholder-inside"), isDragInside);

        if(isVertical || isDragInside) {
            width = $item.outerWidth();
        }
        if(!isVertical || isDragInside) {
            height = $item.outerHeight();
        }

        $placeholderElement.css({ width, height });
    },

    _moveItem: function($targetItem, $item) {
        if(!$item) {
            $targetItem.appendTo(this.$element());
        } else {
            $targetItem.insertBefore($item);
        }
    },

    _getEventArgs: function() {
        let sourceElement = getPublicElement(this._getSourceElement());

        return {
            fromIndex: this.option("fromIndex"),
            toIndex: this.option("toIndex"),
            inside: this.option("inside"),
            sourceElement: sourceElement
        };
    },

    _getDragEndArgs: function() {
        var args = this.callBase.apply(this, arguments);

        return extend(args, this._getEventArgs());
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "onDragChange":
                this["_" + name + "Action"] = this._createActionByOption(name);
                break;
            case "itemOrientation":
            case "allowDropInside":
            case "dropFeedbackMode":
            case "itemPoints":
            case "fromIndex":
            case "inside":
                break;
            case "targetItemPoint":
                this._optionChangedTargetItemPoint(args);
                break;
            case "toIndex":
                this._optionChangedToIndex(args);
                break;
            default:
                this.callBase(args);
        }
    },
    _optionChangedTargetItemPoint: function(args) {
        let targetItemPoint = args.value;

        if(targetItemPoint) {
            let $placeholderElement = this._$placeholderElement || this._createPlaceholder();
            if(this._isIndicateMode()) {
                this._updatePlaceholderSizes($placeholderElement, targetItemPoint);
            }
            this._moveItem($placeholderElement || this._getSourceElement(), targetItemPoint.$item);
        }
    },
    _toggleDragSourceClass: function(value) {
        this.callBase.apply(this, arguments);
        if(!this._isIndicateMode()) {
            this._$sourceElement && this._$sourceElement.toggleClass(this._addWidgetPrefix("source-hidden"), value);
        }
    },
    _optionChangedToIndex: function(args) {
        this._togglePlaceholder(args.value !== null && args.value >= 0);

        if(!this._isIndicateMode()) {
            var targetDraggable = this._getTargetDraggable();
            var isTargetSortable = targetDraggable.NAME === this.NAME;
            this._$sourceElement && this._$sourceElement.toggle(isTargetSortable && !targetDraggable._isIndicateMode() || this.option("toIndex") !== -1);
        }
    }
});

registerComponent(SORTABLE, Sortable);

module.exports = Sortable;
