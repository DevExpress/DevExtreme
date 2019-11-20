import $ from "../core/renderer";
import registerComponent from "../core/component_registrator";
import { extend } from "../core/utils/extend";
import Draggable from "./draggable";
import { getPublicElement } from "../core/utils/dom";
import translator from "../animation/translator";
import fx from "../animation/fx";

var SORTABLE = "dxSortable",

    PLACEHOLDER_CLASS = "placeholder",
    CLONE_CLASS = "clone";

/**
* @name dxSortable
* @inherits DraggableBase
* @hasTranscludedContent
* @module ui/sortable
* @export default
*/

var Sortable = Draggable.inherit({
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
             * @name dxSortableOptions.dropFeedbackMode
             * @type Enums.DropFeedbackMode
             * @default "push"
             */
            dropFeedbackMode: "push",
            /**
             * @name dxSortableOptions.allowDropInsideItem
             * @type boolean
             * @default false
             */
            allowDropInsideItem: false,
            /**
             * @name dxSortableOptions.allowReordering
             * @type boolean
             * @default true
             */
            allowReordering: true,
            /**
             * @name dxSortableOptions.moveItemOnDrop
             * @type boolean
             * @default false
             */
            moveItemOnDrop: false,
            /**
             * @name dxSortableOptions.dragTemplate
             * @type template|function
             * @type_function_param1 dragInfo:object
             * @type_function_param1_field1 itemData:any
             * @type_function_param1_field2 itemElement:dxElement
             * @type_function_param1_field3 fromIndex:number
             * @type_function_param2 containerElement:dxElement
             * @type_function_return string|Node|jQuery
             * @default undefined
             */
            /**
             * @name dxSortableOptions.onDragStart
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 cancel:boolean
             * @type_function_param1_field6 itemData:any
             * @type_function_param1_field7 itemElement:dxElement
             * @type_function_param1_field8 fromIndex:number
             * @type_function_param1_field9 fromData:any
             * @action
             */
            /**
             * @name dxSortableOptions.onDragMove
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 cancel:boolean
             * @type_function_param1_field6 itemData:any
             * @type_function_param1_field7 itemElement:dxElement
             * @type_function_param1_field8 fromIndex:number
             * @type_function_param1_field9 toIndex:number
             * @type_function_param1_field10 fromComponent:dxSortable|dxDraggable
             * @type_function_param1_field11 toComponent:dxSortable|dxDraggable
             * @type_function_param1_field12 fromData:any
             * @type_function_param1_field13 toData:any
             * @type_function_param1_field14 dropInsideItem:boolean
             * @action
             */
            /**
             * @name dxSortableOptions.onDragEnd
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 cancel:boolean
             * @type_function_param1_field6 itemData:any
             * @type_function_param1_field7 itemElement:dxElement
             * @type_function_param1_field8 fromIndex:number
             * @type_function_param1_field9 toIndex:number
             * @type_function_param1_field10 fromComponent:dxSortable|dxDraggable
             * @type_function_param1_field11 toComponent:dxSortable|dxDraggable
             * @type_function_param1_field12 fromData:any
             * @type_function_param1_field13 toData:any
             * @type_function_param1_field14 dropInsideItem:boolean
             * @action
             */
            /**
             * @name dxSortableOptions.onDragChange
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 cancel:boolean
             * @type_function_param1_field6 itemData:any
             * @type_function_param1_field7 itemElement:dxElement
             * @type_function_param1_field8 fromIndex:number
             * @type_function_param1_field9 toIndex:number
             * @type_function_param1_field10 fromComponent:dxSortable|dxDraggable
             * @type_function_param1_field11 toComponent:dxSortable|dxDraggable
             * @type_function_param1_field12 fromData:any
             * @type_function_param1_field13 toData:any
             * @type_function_param1_field14 dropInsideItem:boolean
             * @action
             */
            onDragChange: null,
            /**
             * @name dxSortableOptions.onAdd
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 itemData:any
             * @type_function_param1_field6 itemElement:dxElement
             * @type_function_param1_field7 fromIndex:number
             * @type_function_param1_field8 toIndex:number
             * @type_function_param1_field9 fromComponent:dxSortable|dxDraggable
             * @type_function_param1_field10 toComponent:dxSortable|dxDraggable
             * @type_function_param1_field11 fromData:any
             * @type_function_param1_field12 toData:any
             * @type_function_param1_field13 dropInsideItem:boolean
             * @action
             */
            onAdd: null,
            /**
             * @name dxSortableOptions.onRemove
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 itemData:any
             * @type_function_param1_field6 itemElement:dxElement
             * @type_function_param1_field7 fromIndex:number
             * @type_function_param1_field8 toIndex:number
             * @type_function_param1_field9 fromComponent:dxSortable|dxDraggable
             * @type_function_param1_field10 toComponent:dxSortable|dxDraggable
             * @type_function_param1_field11 fromData:any
             * @type_function_param1_field12 toData:any
             * @action
             */
            onRemove: null,
            /**
             * @name dxSortableOptions.onReorder
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 itemData:any
             * @type_function_param1_field6 itemElement:dxElement
             * @type_function_param1_field7 fromIndex:number
             * @type_function_param1_field8 toIndex:number
             * @type_function_param1_field9 fromComponent:dxSortable|dxDraggable
             * @type_function_param1_field10 toComponent:dxSortable|dxDraggable
             * @type_function_param1_field11 fromData:any
             * @type_function_param1_field12 toData:any
             * @type_function_param1_field13 dropInsideItem:boolean
             * @action
             */
            onReorder: null,
            /**
             * @name dxSortableOptions.onPlaceholderPrepared
             * @type function(e)
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 cancel:boolean
             * @type_function_param1_field6 itemData:any
             * @type_function_param1_field7 itemElement:dxElement
             * @type_function_param1_field8 fromIndex:number
             * @type_function_param1_field9 toIndex:number
             * @type_function_param1_field10 fromData:any
             * @type_function_param1_field11 toData:any
             * @type_function_param1_field12 dropInsideItem:boolean
             * @action
             * @hidden
             */
            onPlaceholderPrepared: null,
            animation: {
                type: "slide",
                duration: 300
            },
            fromIndex: null,
            toIndex: null,
            dropInsideItem: false,
            itemPoints: null
        });
    },

    reset: function() {
        this.option({
            dropInsideItem: false,
            toIndex: null,
            fromIndex: null
        });

        if(this._$placeholderElement) {
            this._$placeholderElement.remove();
        }
        this._$placeholderElement = null;

        if(!this._isIndicateMode() && this._$modifiedItem) {
            this._$modifiedItem.css("marginBottom", this._modifiedItemMargin);
            this._$modifiedItem = null;
        }
    },

    _dragStartHandler: function(e) {
        this.callBase.apply(this, arguments);

        if(e.cancel === true) {
            return;
        }

        let $sourceElement = this._getSourceElement();

        this._updateItemPoints();
        this.option("fromIndex", this._getElementIndex($sourceElement));
    },

    _dragEnterHandler: function() {
        this.callBase.apply(this, arguments);

        if(this === this._getSourceDraggable()) {
            return;
        }

        this._updateItemPoints();
        this.option("fromIndex", -1);

        if(!this._isIndicateMode()) {
            let itemPoints = this.option("itemPoints"),
                lastItemPoint = itemPoints[itemPoints.length - 1];

            if(lastItemPoint) {
                let $element = this.$element(),
                    $sourceElement = this._getSourceElement(),
                    isVertical = this._isVerticalOrientation(),
                    sourceElementSize = isVertical ? $sourceElement.outerHeight(true) : $sourceElement.outerWidth(true),
                    scrollSize = $element.get(0)[isVertical ? "scrollHeight" : "scrollWidth"],
                    scrollPosition = $element.get(0)[isVertical ? "scrollTop" : "scrollLeft"],
                    positionProp = isVertical ? "top" : "left",
                    lastPointPosition = lastItemPoint[positionProp],
                    elementPosition = $element.offset()[positionProp],
                    freeSize = elementPosition + scrollSize - scrollPosition - lastPointPosition;

                if(freeSize < sourceElementSize) {
                    if(isVertical) {
                        let $lastItem = $(this._getItems()).last();

                        this._$modifiedItem = $lastItem;
                        this._modifiedItemMargin = $lastItem.get(0).style.marginBottom;

                        $lastItem.css("marginBottom", sourceElementSize - freeSize);

                        let $sortable = $lastItem.closest(".dx-sortable"),
                            sortable = $sortable.data("dxScrollable") || $sortable.data("dxScrollView");

                        sortable && sortable.update();
                    }
                }
            }
        }
    },

    dragEnter: function() {
        if(this === this._getTargetDraggable()) {
            this.option("toIndex", this.option("fromIndex"));
        } else {
            this.option("toIndex", -1);
        }
    },

    dragLeave: function() {
        if(this === this._getTargetDraggable()) {
            this.option("toIndex", -1);
        } else {
            this.option("toIndex", this.option("fromIndex"));
        }
    },

    dragEnd: function(sourceEvent) {
        let $sourceElement = this._getSourceElement(),
            sourceDraggable = this._getSourceDraggable(),
            isSourceDraggable = sourceDraggable.NAME !== this.NAME,
            toIndex = this.option("toIndex");

        if(toIndex !== null && toIndex >= 0) {
            let cancelAdd,
                cancelRemove;

            if(sourceDraggable !== this) {
                cancelAdd = this._fireAddEvent(sourceEvent);

                if(!cancelAdd) {
                    cancelRemove = this._fireRemoveEvent(sourceEvent);
                }
            }

            if(isSourceDraggable) {
                translator.resetPosition($sourceElement);
            }
            if(this.option("moveItemOnDrop")) {
                !cancelAdd && this._moveItem($sourceElement, toIndex, cancelRemove);
            }

            if(sourceDraggable === this) {
                this._fireReorderEvent(sourceEvent);
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
            cursorPosition = isVertical ? e.pageY : e.pageX,
            itemPoint;

        for(let i = itemPoints.length - 1; i >= 0; i--) {
            let centerPosition = itemPoints[i + 1] && (itemPoints[i][axisName] + itemPoints[i + 1][axisName]) / 2;

            if(centerPosition > cursorPosition || centerPosition === undefined) {
                itemPoint = itemPoints[i];
            } else {
                break;
            }
        }
        if(itemPoint) {
            this._updatePlaceholderPosition(e, itemPoint);

            if(this.verticalScrollHelper.isScrolling() && this._isIndicateMode()) {
                this._movePlaceholder();
            }
        }
    },

    _isIndicateMode: function() {
        return this.option("dropFeedbackMode") === "indicate" || this.option("allowDropInsideItem");
    },

    _createPlaceholder: function() {
        let $placeholderContainer;

        if(this._isIndicateMode()) {
            $placeholderContainer = $("<div>")
                .addClass(this._addWidgetPrefix(PLACEHOLDER_CLASS))
                .insertBefore(this._getSourceDraggable()._$dragElement);
        }

        this._$placeholderElement = $placeholderContainer;

        return $placeholderContainer;
    },

    _getItems: function() {
        let itemsSelector = this._getItemsSelector();

        return this._$content()
            .find(itemsSelector)
            .not("." + this._addWidgetPrefix(PLACEHOLDER_CLASS))
            .not("." + this._addWidgetPrefix(CLONE_CLASS))
            .toArray();
    },

    _allowReordering: function() {
        let sourceDraggable = this._getSourceDraggable(),
            targetDraggable = this._getTargetDraggable();

        return sourceDraggable !== targetDraggable || this.option("allowReordering");
    },

    _isValidPoint: function($items, itemPointIndex, dropInsideItem) {
        let allowReordering = dropInsideItem || this._allowReordering();

        if(!allowReordering && itemPointIndex !== 0) {
            return false;
        }

        if(!this._isIndicateMode()) {
            return true;
        }

        let $draggableItem = this._getDraggableElement(),
            draggableItemIndex = $items.indexOf($draggableItem.get(0));

        return draggableItemIndex === -1 || itemPointIndex !== draggableItemIndex && (dropInsideItem || itemPointIndex !== (draggableItemIndex + 1));
    },

    _getItemPoints: function() {
        let that = this,
            result,
            isVertical = that._isVerticalOrientation(),
            $items = that._getItems();

        result = $items.map((item, index) => {
            let offset = $(item).offset(),
                left = that._makeLeftCorrection(offset.left);

            return {
                dropInsideItem: false,
                left,
                top: offset.top,
                index: index,
                $item: $(item),
                width: $(item).outerWidth(),
                height: $(item).outerHeight(),
                isValid: that._isValidPoint($items, index)
            };
        });

        if(result.length) {
            let lastItem = result[result.length - 1];

            result.push({
                dropInsideItem: false,
                index: result.length,
                top: isVertical ? lastItem.top + lastItem.height : lastItem.top,
                left: !isVertical ? lastItem.left + lastItem.width : lastItem.left,
                isValid: this._isValidPoint($items, result.length)
            });

            if(this.option("allowDropInsideItem")) {
                let points = result;
                result = [];
                for(let i = 0; i < points.length; i++) {
                    result.push(points[i]);
                    if(points[i + 1]) {
                        result.push(extend({}, points[i], {
                            dropInsideItem: true,
                            top: Math.floor((points[i].top + points[i + 1].top) / 2),
                            left: Math.floor((points[i].left + points[i + 1].left) / 2),
                            isValid: this._isValidPoint($items, i, true)
                        }));
                    }
                }
            }
        } else {
            result.push({
                dropInsideItem: false,
                index: 0,
                isValid: true
            });
        }

        return result;
    },

    _updateItemPoints: function() {
        this.option("itemPoints", this._getItemPoints());
    },

    _getElementIndex: function($itemElement) {
        return this._getItems().indexOf($itemElement.get(0));
    },

    _getDragTemplateArgs: function($element) {
        let args = this.callBase.apply(this, arguments);

        args.model.fromIndex = this._getElementIndex($element);

        return args;
    },

    _togglePlaceholder: function(value) {
        this._$placeholderElement && this._$placeholderElement.toggle(value);
    },

    _isVerticalOrientation: function() {
        return this.option("itemOrientation") === "vertical";
    },

    _normalizeToIndex: function(toIndex, dropInsideItem) {
        let isAnotherDraggable = this._getSourceDraggable() !== this._getTargetDraggable(),
            fromIndex = this.option("fromIndex");

        if(toIndex === null) {
            return fromIndex;
        }

        return Math.max(isAnotherDraggable || fromIndex >= toIndex || dropInsideItem ? toIndex : toIndex - 1, 0);
    },

    _updatePlaceholderPosition: function(e, itemPoint) {
        let sourceDraggable = this._getSourceDraggable(),
            toIndex = this._normalizeToIndex(itemPoint.index, itemPoint.dropInsideItem);

        let eventArgs = extend(this._getEventArgs(e), {
            toIndex,
            dropInsideItem: itemPoint.dropInsideItem
        });

        itemPoint.isValid && this._getAction("onDragChange")(eventArgs);

        if(eventArgs.cancel || !itemPoint.isValid) {
            if(!itemPoint.isValid) {
                this.option({
                    dropInsideItem: false,
                    toIndex: null
                });
            }
            return;
        }

        this.option({
            dropInsideItem: itemPoint.dropInsideItem,
            toIndex: itemPoint.index
        });
        this._getAction("onPlaceholderPrepared")(extend(this._getEventArgs(e), {
            placeholderElement: getPublicElement(this._$placeholderElement),
            dragElement: getPublicElement(sourceDraggable._$dragElement)
        }));

        this._updateItemPoints();
    },

    _updatePlaceholderSizes: function($placeholderElement, itemElement) {
        var that = this,
            dropInsideItem = that.option("dropInsideItem"),
            $item = itemElement ? $(itemElement) : that._getSourceElement(),
            isVertical = that._isVerticalOrientation(),
            width = "",
            height = "";

        $placeholderElement.toggleClass(that._addWidgetPrefix("placeholder-inside"), dropInsideItem);

        if(isVertical || dropInsideItem) {
            width = $item.outerWidth();
        }
        if(!isVertical || dropInsideItem) {
            height = $item.outerHeight();
        }

        var hasScrollable = $item.parents().toArray().some(function(element) {
            let $element = $(element);

            if(that.horizontalScrollHelper.isScrollable($element)) {
                width = $element.width();
                that._$scrollable = $element;

                return true;
            }
        });

        if(!hasScrollable) {
            that._$scrollable = null;
        }

        $placeholderElement.css("width", width);
        $placeholderElement.css("height", height);
    },

    _moveItem: function($itemElement, index, cancelRemove) {
        let $prevTargetItemElement,
            $itemElements = this._getItems(),
            $targetItemElement = $itemElements[index],
            sourceDraggable = this._getSourceDraggable();

        if(cancelRemove) {
            $itemElement = $itemElement.clone();
            sourceDraggable._toggleDragSourceClass(false, $itemElement);
        }

        if(!$targetItemElement) {
            $prevTargetItemElement = $itemElements[index - 1];
        }

        this._moveItemCore($itemElement, $targetItemElement, $prevTargetItemElement);
    },

    _moveItemCore: function($targetItem, item, prevItem) {
        if(!item && !prevItem) {
            $targetItem.appendTo(this.$element());
        } else if(prevItem) {
            $targetItem.insertAfter($(prevItem));
        } else {
            $targetItem.insertBefore($(item));
        }
    },

    _getDragStartArgs: function(e, $itemElement) {
        return extend(this.callBase.apply(this, arguments), {
            fromIndex: this._getElementIndex($itemElement)
        });
    },

    _getEventArgs: function(e) {
        let sourceDraggable = this._getSourceDraggable(),
            targetDraggable = this._getTargetDraggable(),
            dropInsideItem = targetDraggable.option("dropInsideItem");

        return extend(this.callBase.apply(this, arguments), {
            fromIndex: sourceDraggable.option("fromIndex"),
            toIndex: this._normalizeToIndex(targetDraggable.option("toIndex"), dropInsideItem),
            dropInsideItem: dropInsideItem
        });
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "onDragChange":
            case "onPlaceholderPrepared":
            case "onAdd":
            case "onRemove":
            case "onReorder":
                this["_" + name + "Action"] = this._createActionByOption(name);
                break;
            case "itemOrientation":
            case "allowDropInsideItem":
            case "moveItemOnDrop":
            case "dropFeedbackMode":
            case "itemPoints":
            case "fromIndex":
            case "animation":
            case "allowReordering":
                break;
            case "dropInsideItem":
                this._optionChangedDropInsideItem(args);
                break;
            case "toIndex":
                this._optionChangedToIndex(args);
                break;
            default:
                this.callBase(args);
        }
    },

    _optionChangedDropInsideItem: function(args) {
        if(this._isIndicateMode() && this._$placeholderElement) {
            let toIndex = this.option("toIndex"),
                itemElement = this._getItems()[toIndex];

            this._updatePlaceholderSizes(this._$placeholderElement, itemElement);
        }
    },

    _isPositionVisible: function(position) {
        var $element = this.$element(),
            scrollContainer;

        if($element.css("overflow") !== "hidden") {
            scrollContainer = $element.get(0);
        } else {
            $element.parents().each(function() {
                if($(this).css("overflow") !== "visible") {
                    scrollContainer = this;
                    return false;
                }
            });
        }

        if(scrollContainer) {
            let clientRect = scrollContainer.getBoundingClientRect(),
                isVerticalOrientation = this._isVerticalOrientation(),
                start = isVerticalOrientation ? "top" : "left",
                end = isVerticalOrientation ? "bottom" : "right";

            if(position[start] < clientRect[start] || position[start] > clientRect[end]) {
                return false;
            }
        }

        return true;
    },

    _optionChangedToIndex: function(args) {
        let toIndex = args.value;

        if(this._isIndicateMode()) {
            let showPlaceholder = toIndex !== null && toIndex >= 0;

            this._togglePlaceholder(showPlaceholder);

            if(showPlaceholder) {
                this._movePlaceholder();
            }
        } else {
            this._moveItems(args.previousValue, args.value);
        }
    },

    _makeLeftCorrection: function(left) {
        var that = this;

        if(that._$scrollable && that._$scrollable.scrollLeft() > 0) {
            return that._$scrollable.offset().left;
        }

        return left;
    },

    _movePlaceholder: function() {
        let that = this,
            $placeholderElement = that._$placeholderElement || that._createPlaceholder(),
            items = that._getItems(),
            toIndex = that.option("toIndex"),
            itemElement = items[toIndex],
            prevItemElement = items[toIndex - 1],
            isVerticalOrientation = that._isVerticalOrientation(),
            position = null;

        that._updatePlaceholderSizes($placeholderElement, itemElement);

        if(itemElement) {
            position = $(itemElement).offset();
        } else if(prevItemElement) {
            position = $(prevItemElement).offset();
            position.top += isVerticalOrientation ? $(prevItemElement).outerHeight(true) : $(prevItemElement).outerWidth(true);
        }

        if(position && !that._isPositionVisible(position)) {
            position = null;
        }

        if(position) {
            position.left = that._makeLeftCorrection(position.left);

            that._move(position, $placeholderElement);
        }

        $placeholderElement.toggle(!!position);
    },

    _getPositions: function(items, elementSize, fromIndex, toIndex) {
        let positions = [];

        for(let i = 0; i < items.length; i++) {
            let position = 0;

            if(toIndex === null || fromIndex === null) {
                positions.push(position);
                continue;
            }

            if(fromIndex === -1) {
                if(i >= toIndex) {
                    position = elementSize;
                }
            } else if(toIndex === -1) {
                if(i > fromIndex) {
                    position = -elementSize;
                }
            } else if(fromIndex < toIndex) {
                if(i > fromIndex && i < toIndex) {
                    position = -elementSize;
                }
            } else if(fromIndex > toIndex) {
                if(i >= toIndex && i < fromIndex) {
                    position = elementSize;
                }
            }
            positions.push(position);
        }

        return positions;
    },

    _moveItems: function(prevToIndex, toIndex) {
        let fromIndex = this.option("fromIndex"),
            isVerticalOrientation = this._isVerticalOrientation(),
            positionPropName = isVerticalOrientation ? "top" : "left",
            $draggableItem = this._getDraggableElement(),
            elementSize = isVerticalOrientation ? ($draggableItem.outerHeight() + $draggableItem.outerHeight(true)) / 2 : ($draggableItem.outerWidth() + $draggableItem.outerWidth(true)) / 2,
            items = this._getItems(),
            prevPositions = this._getPositions(items, elementSize, fromIndex, prevToIndex),
            positions = this._getPositions(items, elementSize, fromIndex, toIndex),
            animationConfig = this.option("animation");

        for(let i = 0; i < items.length; i++) {
            let $item = $(items[i]),
                prevPosition = prevPositions[i],
                position = positions[i];

            if(toIndex === null || fromIndex === null) {
                fx.stop($item);
                translator.resetPosition($item);
            } else if(prevPosition !== position) {
                fx.stop($item);
                fx.animate($item, extend({}, animationConfig, {
                    to: { [positionPropName]: position }
                }));
            }
        }
    },

    _toggleDragSourceClass: function(value, $element) {
        let $sourceElement = $element || this._$sourceElement;

        this.callBase.apply(this, arguments);
        if(!this._isIndicateMode()) {
            $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix("source-hidden"), value);
        }
    },

    _dispose: function() {
        this.reset();
        this.callBase();
    },

    _fireAddEvent: function(sourceEvent) {
        let args = this._getEventArgs(sourceEvent);

        this._getAction("onAdd")(args);

        return args.cancel;
    },

    _fireRemoveEvent: function(sourceEvent) {
        let sourceDraggable = this._getSourceDraggable(),
            args = this._getEventArgs(sourceEvent);

        sourceDraggable._getAction("onRemove")(args);

        return args.cancel;
    },

    _fireReorderEvent: function(sourceEvent) {
        let args = this._getEventArgs(sourceEvent);

        this._getAction("onReorder")(args);
    }
});

registerComponent(SORTABLE, Sortable);

module.exports = Sortable;
