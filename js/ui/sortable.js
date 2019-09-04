import $ from "../core/renderer";
import registerComponent from "../core/component_registrator";
import { extend } from "../core/utils/extend";
import Draggable from "./draggable";
import { getPublicElement } from "../core/utils/dom";
import { getWindow } from "../core/utils/window";

var SORTABLE = "dxSortable",
    DEFAULT_ITEMS = "> *";

var Sortable = Draggable.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            orientation: "vertical",
            clone: true
        });
    },

    _init: function() {
        this.callBase();
    },

    _getItemsSelector: function() {
        return this.callBase() || DEFAULT_ITEMS;
    },

    _removePlaceholderElement: function() {
        if(this._$placeholderElement && !this._$placeholderElement.hasClass(this._addWidgetPrefix("source"))) {
            this._$placeholderElement.remove();
        }
    },

    _createPlaceholder: function(e) {
        let $item = $(e.target),
            $placeholderContainer = $item,
            placeholderTemplate = this.option("placeholderTemplate");

        if(placeholderTemplate) {
            $placeholderContainer = $("<div>");

            placeholderTemplate = this._getTemplate(placeholderTemplate);
            $(placeholderTemplate.render({
                container: getPublicElement($placeholderContainer)
            }));
        }

        return this._$placeholderElement = $placeholderContainer;
    },

    _togglePlaceholderClass: function(value) {
        this._$placeholderElement && this._$placeholderElement.toggleClass(this._addWidgetPrefix("placeholder"), value);
    },

    _getItems: function(e) {
        let itemsSelector = this._getItemsSelector();

        return this.$element().find(itemsSelector).not("." + this._addWidgetPrefix("placeholder")).toArray();
    },

    _isValidPoint: function($items, itemPointIndex) {
        let hasPlaceholderTemplate = !!this.option("placeholderTemplate");

        if(!hasPlaceholderTemplate) {
            return true;
        }

        let $draggableItem = this._getDraggableElement(),
            draggableItemIndex = $items.indexOf($draggableItem.get(0));

        return itemPointIndex !== draggableItemIndex && itemPointIndex !== (draggableItemIndex + 1);
    },

    _getItemPoints: function(e) {
        let result,
            isVertical = this.option("orientation") === "vertical",
            $items = this._getItems(e);

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

        this._createPlaceholder(e);
        this._togglePlaceholderClass(true);
        this._itemPoints = this._getItemPoints(e);
    },

    _dragHandler: function(e) {
        this.callBase.apply(this, arguments);

        if(e.cancel === true) {
            return;
        }

        this._movePlaceholder(e);
    },

    _movePlaceholder: function(e) {
        if(!this._itemPoints) {
            return;
        }

        let i,
            positionChanged,
            isVertical = this.option("orientation") === "vertical",
            axisName = isVertical ? "top" : "left",
            cursorPosition = isVertical ? e.pageY : e.pageX,
            itemPoints = this._itemPoints;

        for(i = 0; i < itemPoints.length; i++) {
            let itemPoint = itemPoints[i],
                centerPosition = itemPoints[i + 1] && (itemPoint[axisName] + itemPoints[i + 1][axisName]) / 2;

            if(centerPosition > cursorPosition) {
                if(itemPoint.isValid) {
                    this._$placeholderElement.insertBefore(itemPoint.$item);
                    positionChanged = true;
                } else {
                    this._$placeholderElement.detach();
                }
                break;
            } else if(centerPosition === undefined) {
                if(itemPoint.isValid) {
                    this.$element().append(this._$placeholderElement);
                    positionChanged = true;
                } else {
                    this._$placeholderElement.detach();
                }
                break;
            }
        }

        if(positionChanged) {
            this._getAction("onDragChange")({ event: e });
        }
    },

    _isVerticalOrientation: function(point) {
        return "inline";
    },

    _updateItemPosition: function() {
        let hasPlaceholderTemplate = !!this.option("placeholderTemplate");

        if(hasPlaceholderTemplate && this._$placeholderElement) {
            let isDomElement = this._$placeholderElement.closest(getWindow().document).length;

            if(isDomElement) {
                this._$placeholderElement.replaceWith(this._$sourceElement);
            }
        }
    },

    _dragEndHandler: function(e) {
        this._updateItemPosition();
        this._togglePlaceholderClass(false);
        this._removePlaceholderElement();
        this._itemPoints = null;
        this.callBase.apply(this, arguments);
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "onDragChange":
                this["_" + name + "Action"] = this._createActionByOption(name);
                break;
            case "orientation":
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent(SORTABLE, Sortable);

module.exports = Sortable;
