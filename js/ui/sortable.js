import $ from "../core/renderer";
import registerComponent from "../core/component_registrator";
import { extend } from "../core/utils/extend";
import Draggable from "./draggable";
import { getPublicElement } from "../core/utils/dom";
import translator from "../animation/translator";

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
    dropItem: function() {
        let $sourceElement = this._getSourceElement(),
            sourceDraggable = this._getSourceDraggable(),
            isIndicateMode = this._isIndicateMode(),
            isSourceDraggable = sourceDraggable.NAME !== this.NAME;

        if(isIndicateMode || isSourceDraggable) {
            let dragInfo = this._dragInfo;
            let $targetItemElement = dragInfo && dragInfo.targetItemPoint && dragInfo.targetItemPoint.$item;

            if(isSourceDraggable) {
                translator.resetPosition($sourceElement);
            }

            this._moveItem($sourceElement, $targetItemElement);
        }
    },

    clearDragInfo: function() {
        this._dragInfo = null;
    },

    movePlaceholder: function(e) {
        let itemPoints = this._dragInfo && this._dragInfo.itemPoints;

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

    resetPlaceholder: function() {
        this._togglePlaceholderClass(false);
        if(this._$placeholderElement) {
            let needToRemove = !this._$placeholderElement.hasClass(this._addWidgetPrefix(SOURCE_CLASS));

            if(needToRemove) {
                this._$placeholderElement.remove();
            }
        }
        this._$placeholderElement = null;
    },

    setupDraggingInfo: function() {
        if(this._dragInfo) {
            return;
        }

        let $sourceElement = this._getSourceElement();

        this._dragInfo = {
            fromIndex: $sourceElement.index(),
            itemPoints: this._getItemPoints()
        };
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
            onDragChange: null
        });
    },

    _init: function() {
        this.callBase();
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
            $placeholderContainer = $("<div>").appendTo(this._getContainer());
        }

        this._$placeholderElement = $placeholderContainer;
        this._togglePlaceholderClass(true);

        return $placeholderContainer;
    },

    _togglePlaceholderClass: function(value) {
        if(this._$placeholderElement) {
            this._$placeholderElement && this._$placeholderElement.toggleClass(this._addWidgetPrefix(PLACEHOLDER_CLASS), value);
        } else {
            if(!this._isIndicateMode()) {
                this._getSourceElement().toggleClass(this._addWidgetPrefix("source-hidden"), value);
            }
        }
    },

    _getItems: function() {
        let itemsSelector = this._getItemsSelector();

        return this.$element().find(itemsSelector).not("." + this._addWidgetPrefix(PLACEHOLDER_CLASS)).not("." + this._addWidgetPrefix("source-hidden")).toArray();
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

    _dragStartHandler: function(e) {
        this.callBase.apply(this, arguments);

        if(e.cancel === true) {
            return;
        }

        this.setupDraggingInfo();
    },

    _togglePlaceholder: function(value) {
        this._$placeholderElement && this._$placeholderElement.toggle(value);
    },

    _isVerticalOrientation: function() {
        return this.option("itemOrientation") === "vertical";
    },

    _updatePlaceholderPosition: function(e, itemPoint) {
        let eventArgs,
            sourceDraggable = this._getSourceDraggable(),
            dragInfo = this._dragInfo,
            isAnotherDraggable = sourceDraggable !== this,
            fromIndex = dragInfo.fromIndex,
            showPlaceholder = this._isIndicateMode() || itemPoint.inside;

        dragInfo.inside = itemPoint.inside;
        dragInfo.toIndex = Math.max(isAnotherDraggable || fromIndex >= itemPoint.index || itemPoint.inside ? itemPoint.index : itemPoint.index - 1, 0);
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

        if(showPlaceholder) {
            // tests
            this._updatePlaceholderSizes($placeholderElement, itemPoint);

            if(!this._getSourceDraggable()._isIndicateMode()) {
                this._getSourceElement().hide();
            }
            // return;
        } else {
            this._togglePlaceholder(false);
            this._getSourceElement().show();
        }

        this._moveItem($placeholderElement || this._getSourceElement(), itemPoint.$item);

        this._dragInfo.itemPoints = this._getItemPoints();
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
        let sourceElement = getPublicElement(this._getSourceElement()),
            dragInfo = this._dragInfo || {};

        return {
            fromIndex: dragInfo.fromIndex,
            toIndex: dragInfo.toIndex,
            inside: dragInfo.inside,
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
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent(SORTABLE, Sortable);

module.exports = Sortable;
