var $ = require("../core/renderer"),
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    inflector = require("../core/utils/inflector"),
    iteratorUtils = require("../core/utils/iterator"),
    isDefined = require("../core/utils/type").isDefined,
    extend = require("../core/utils/extend").extend,
    windowUtils = require("../core/utils/window"),
    getPublicElement = require("../core/utils/dom").getPublicElement,
    deferRender = require("../core/utils/common").deferRender,
    ScrollView = require("./scroll_view"),
    CollectionWidget = require("./collection/ui.collection_widget.edit");

var TILEVIEW_CLASS = "dx-tileview",
    TILEVIEW_CONTAINER_CLASS = "dx-tileview-wrapper",
    TILEVIEW_ITEM_CLASS = "dx-tile",
    TILEVIEW_ITEM_SELECTOR = "." + TILEVIEW_ITEM_CLASS,

    TILEVIEW_ITEM_DATA_KEY = "dxTileData";

var CONFIGS = {
    "horizontal": {
        itemMainRatio: "widthRatio",
        itemCrossRatio: "heightRatio",
        baseItemMainDimension: "baseItemWidth",
        baseItemCrossDimension: "baseItemHeight",
        mainDimension: "width",
        crossDimension: "height",
        mainPosition: "left",
        crossPosition: "top"
    },
    "vertical": {
        itemMainRatio: "heightRatio",
        itemCrossRatio: "widthRatio",
        baseItemMainDimension: "baseItemHeight",
        baseItemCrossDimension: "baseItemWidth",
        mainDimension: "height",
        crossDimension: "width",
        mainPosition: "top",
        crossPosition: "left"
    }
};

/**
* @name dxTileView
* @inherits CollectionWidget
* @module ui/tile_view
* @export default
*/
var TileView = CollectionWidget.inherit({

    _activeStateUnit: TILEVIEW_ITEM_SELECTOR,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            items: null,

            /**
             * @name dxTileViewOptions.items
             * @type Array<string, dxTileViewItem, object>
             * @fires dxTileViewOptions.onOptionChanged
             */

            /**
            * @name dxTileViewOptions.direction
            * @type Enums.Orientation
            * @default 'horizontal'
            */
            direction: "horizontal",

            /**
             * @name dxTileViewOptions.hoverStateEnabled
             * @type boolean
             * @default true
             */
            hoverStateEnabled: true,

            /**
            * @name dxTileViewOptions.showScrollbar
            * @type boolean
            * @default false
            */
            showScrollbar: false,

            /**
            * @name dxTileViewOptions.height
            * @type number|string
            * @default 500
            */
            height: 500,

            /**
            * @name dxTileViewOptions.baseItemWidth
            * @type number
            * @default 100
            */
            baseItemWidth: 100,

            /**
            * @name dxTileViewOptions.baseItemHeight
            * @type number
            * @default 100
            */
            baseItemHeight: 100,

            /**
            * @name dxTileViewOptions.itemMargin
            * @type number
            * @default 20
            */
            itemMargin: 20,

            /**
             * @name dxTileViewOptions.activeStateEnabled
             * @type boolean
             * @default true
             */
            activeStateEnabled: true,

            indicateLoading: true

            /**
            * @name dxTileViewItem
            * @inherits CollectionWidgetItem
            * @type object
            */

            /**
            * @name dxTileViewItem.widthRatio
            * @type number
            * @default 1
            */

            /**
            * @name dxTileViewItem.heightRatio
            * @type number
            * @default 1
            */

            /**
            * @name dxTileViewOptions.height
            * @type number|string|function
            * @default 500
            * @type_function_return number|string
            */

            /**
            * @name dxTileViewOptions.selectedIndex
            * @hidden
            */

            /**
            * @name dxTileViewOptions.selectedItem
            * @hidden
            */

            /**
            * @name dxTileViewOptions.selectedItems
            * @hidden
            */

            /**
            * @name dxTileViewOptions.selectedItemKeys
            * @hidden
            */

            /**
             * @name dxTileViewOptions.keyExpr
             * @hidden
             */

            /**
            * @name dxTileViewOptions.onSelectionChanged
            * @action
            * @hidden
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxTileViewOptions.focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    */
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _itemClass: function() {
        return TILEVIEW_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return TILEVIEW_ITEM_DATA_KEY;
    },

    _itemContainer: function() {
        return this._$container;
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(TILEVIEW_CLASS);
        this._initScrollView();
    },

    _dataSourceLoadingChangedHandler: function(isLoading) {
        var scrollView = this._scrollView;

        if(!scrollView || !scrollView.startLoading) {
            return;
        }

        if(isLoading && this.option("indicateLoading")) {
            scrollView.startLoading();
        } else {
            scrollView.finishLoading();
        }
    },

    _hideLoadingIfLoadIndicationOff: function() {
        if(!this.option("indicateLoading")) {
            this._dataSourceLoadingChangedHandler(false);
        }
    },

    _initScrollView: function() {
        this._scrollView = this._createComponent(this.$element(), ScrollView, {
            direction: this.option("direction"),
            scrollByContent: true,
            useKeyboard: false,
            showScrollbar: this.option("showScrollbar")
        });

        this._$container = $(this._scrollView.content());
        this._$container.addClass(TILEVIEW_CONTAINER_CLASS);

        this._scrollView.option("onUpdated", this._renderGeometry.bind(this));
    },

    _initMarkup: function() {
        this.callBase();

        deferRender(function() {
            this._cellsPerDimension = 1;

            this._renderGeometry();
            this._updateScrollView();
            this._fireContentReadyAction();
        }.bind(this));
    },

    _updateScrollView: function() {
        this._scrollView.option("direction", this.option("direction"));
        this._scrollView.update();
        this._indicateLoadingIfAlreadyStarted();
    },

    _indicateLoadingIfAlreadyStarted: function() {
        if(this._isDataSourceLoading()) {
            this._dataSourceLoadingChangedHandler(true);
        }
    },

    _renderGeometry: function() {
        this._config = CONFIGS[this.option("direction")];

        var items = this.option("items") || [],
            config = this._config,
            itemMargin = this.option("itemMargin"),
            maxItemCrossRatio = Math.max.apply(Math, iteratorUtils.map(items || [], function(item) {
                return Math.round(item[config.itemCrossRatio] || 1);
            }));

        var crossDimensionValue = windowUtils.hasWindow() ?
            this.$element()[config.crossDimension]() : parseInt(this.$element().get(0).style[config.crossDimension]);

        this._cellsPerDimension = Math.floor(crossDimensionValue / (this.option(config.baseItemCrossDimension) + itemMargin));
        this._cellsPerDimension = Math.max(this._cellsPerDimension, maxItemCrossRatio);
        this._cells = [];
        this._cells.push(new Array(this._cellsPerDimension));

        this._arrangeItems(items);
        if(windowUtils.hasWindow()) {
            this._$container[config.mainDimension](this._cells.length * this.option(config.baseItemMainDimension) + (this._cells.length + 1) * itemMargin);
        }
    },

    _arrangeItems: function(items) {
        var config = this._config,
            itemMainRatio = config.itemMainRatio,
            itemCrossRatio = config.itemCrossRatio,
            mainPosition = config.mainPosition;

        this._itemsPositions = [];

        iteratorUtils.each(items, (function(index, item) {
            var currentItem = {};
            currentItem[itemMainRatio] = item[itemMainRatio] || 1;
            currentItem[itemCrossRatio] = item[itemCrossRatio] || 1;
            currentItem.index = index;

            currentItem[itemMainRatio] = (currentItem[itemMainRatio] <= 0) ? 0 : Math.round(currentItem[config.itemMainRatio]);
            currentItem[itemCrossRatio] = (currentItem[itemCrossRatio] <= 0) ? 0 : Math.round(currentItem[config.itemCrossRatio]);

            var itemPosition = this._getItemPosition(currentItem);

            if(itemPosition[mainPosition] === -1) {
                itemPosition[mainPosition] = this._cells.push(new Array(this._cellsPerDimension)) - 1;
            }

            this._occupyCells(currentItem, itemPosition);

            this._arrangeItem(currentItem, itemPosition);

            this._itemsPositions.push(itemPosition);
        }).bind(this));
    },

    _getItemPosition: function(item) {
        var config = this._config,
            mainPosition = config.mainPosition,
            crossPosition = config.crossPosition;

        var position = {};
        position[mainPosition] = -1;
        position[crossPosition] = 0;

        for(var main = 0; main < this._cells.length; main++) {
            for(var cross = 0; cross < this._cellsPerDimension; cross++) {
                if(this._itemFit(main, cross, item)) {
                    position[mainPosition] = main;
                    position[crossPosition] = cross;
                    break;
                }
            }

            if(position[mainPosition] > -1) {
                break;
            }
        }

        return position;
    },

    _itemFit: function(mainPosition, crossPosition, item) {
        var result = true,

            config = this._config,
            itemRatioMain = item[config.itemMainRatio],
            itemRatioCross = item[config.itemCrossRatio];

        if(crossPosition + itemRatioCross > this._cellsPerDimension) {
            return false;
        }

        for(var main = mainPosition; main < mainPosition + itemRatioMain; main++) {
            for(var cross = crossPosition; cross < crossPosition + itemRatioCross; cross++) {
                if(this._cells.length - 1 < main) {
                    this._cells.push(new Array(this._cellsPerDimension));
                } else if(this._cells[main][cross] !== undefined) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    },

    _occupyCells: function(item, itemPosition) {
        var config = this._config,
            itemPositionMain = itemPosition[config.mainPosition],
            itemPositionCross = itemPosition[config.crossPosition],
            itemRatioMain = item[config.itemMainRatio],
            itemRatioCross = item[config.itemCrossRatio];

        for(var main = itemPositionMain; main < itemPositionMain + itemRatioMain; main++) {
            for(var cross = itemPositionCross; cross < itemPositionCross + itemRatioCross; cross++) {
                this._cells[main][cross] = item.index;
            }
        }
    },

    _arrangeItem: function(item, itemPosition) {
        var config = this._config,
            itemPositionMain = itemPosition[config.mainPosition],
            itemPositionCross = itemPosition[config.crossPosition],
            itemRatioMain = item[config.itemMainRatio],
            itemRatioCross = item[config.itemCrossRatio],
            baseItemCross = this.option(config.baseItemCrossDimension),
            baseItemMain = this.option(config.baseItemMainDimension),
            itemMargin = this.option("itemMargin");


        var cssProps = { display: (itemRatioMain <= 0 || itemRatioCross <= 0) ? "none" : "" },
            mainDimension = itemRatioMain * baseItemMain + (itemRatioMain - 1) * itemMargin,
            crossDimension = itemRatioCross * baseItemCross + (itemRatioCross - 1) * itemMargin;
        cssProps[config.mainDimension] = mainDimension < 0 ? 0 : mainDimension;
        cssProps[config.crossDimension] = crossDimension < 0 ? 0 : crossDimension;
        cssProps[config.mainPosition] = itemPositionMain * baseItemMain + (itemPositionMain + 1) * itemMargin;
        cssProps[config.crossPosition] = itemPositionCross * baseItemCross + (itemPositionCross + 1) * itemMargin;

        if(this.option("rtlEnabled")) {
            var offsetCorrection = this._$container.width(),
                baseItemWidth = this.option("baseItemWidth"),
                itemPositionX = itemPosition.left,
                offsetPosition = itemPositionX * baseItemWidth,
                itemBaseOffset = baseItemWidth + itemMargin,
                itemWidth = itemBaseOffset * item.widthRatio,
                subItemMargins = itemPositionX * itemMargin;

            cssProps.left = offsetCorrection - (offsetPosition + itemWidth + subItemMargins);
        }

        this._itemElements().eq(item.index).css(cssProps);
    },

    _moveFocus: function(location) {
        var FOCUS_UP = "up",
            FOCUS_DOWN = "down",
            FOCUS_LEFT = this.option("rtlEnabled") ? "right" : "left",
            FOCUS_RIGHT = this.option("rtlEnabled") ? "left" : "right",
            FOCUS_PAGE_UP = "pageup",
            FOCUS_PAGE_DOWN = "pagedown";

        var horizontalDirection = this.option("direction") === "horizontal",
            cells = this._cells,
            index = $(this.option("focusedElement")).index(),
            targetCol = this._itemsPositions[index].left,
            targetRow = this._itemsPositions[index].top;

        var colCount = (horizontalDirection ? cells : cells[0]).length;
        var rowCount = (horizontalDirection ? cells[0] : cells).length;
        var getCell = function(col, row) {
            if(horizontalDirection) {
                return cells[col][row];
            }
            return cells[row][col];
        };

        switch(location) {
            case FOCUS_PAGE_UP:
            case FOCUS_UP:
                while(targetRow > 0 && index === getCell(targetCol, targetRow)) {
                    targetRow--;
                }

                if(targetRow < 0) {
                    targetRow = 0;
                }
                break;
            case FOCUS_PAGE_DOWN:
            case FOCUS_DOWN:
                while(targetRow < rowCount && index === getCell(targetCol, targetRow)) {
                    targetRow++;
                }

                if(targetRow === rowCount) {
                    targetRow = rowCount - 1;
                }
                break;
            case FOCUS_RIGHT:
                while(targetCol < colCount && index === getCell(targetCol, targetRow)) {
                    targetCol++;
                }

                if(targetCol === colCount) {
                    targetCol = colCount - 1;
                }
                break;
            case FOCUS_LEFT:
                while(targetCol >= 0 && index === getCell(targetCol, targetRow)) {
                    targetCol--;
                }

                if(targetCol < 0) {
                    targetCol = 0;
                }
                break;
            default:
                this.callBase.apply(this, arguments);
                return;
        }

        var newTargetIndex = getCell(targetCol, targetRow);
        if(!isDefined(newTargetIndex)) {
            return;
        }

        var $newTarget = this._itemElements().eq(newTargetIndex);
        this.option("focusedElement", getPublicElement($newTarget));
        this._scrollToItem($newTarget);
    },

    _scrollToItem: function($itemElement) {
        if(!$itemElement.length) {
            return;
        }

        var config = this._config,
            outerMainProp = "outer" + inflector.captionize(config.mainDimension),
            itemMargin = this.option("itemMargin"),
            itemPosition = $itemElement.position()[config.mainPosition],
            itemDimension = $itemElement[outerMainProp](),
            itemTail = itemPosition + itemDimension,
            scrollPosition = this.scrollPosition(),
            clientWidth = this.$element()[outerMainProp]();

        if(scrollPosition <= itemPosition && itemTail <= scrollPosition + clientWidth) {
            return;
        }

        if(scrollPosition > itemPosition) {
            this._scrollView.scrollTo(itemPosition - itemMargin);
        } else {
            this._scrollView.scrollTo(itemPosition + itemDimension - clientWidth + itemMargin);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "items":
                this.callBase(args);
                this._renderGeometry();
                this._updateScrollView();
                break;
            case "showScrollbar":
                this._initScrollView();
                break;
            case "disabled":
                this._scrollView.option("disabled", args.value);
                this.callBase(args);
                break;
            case "baseItemWidth":
            case "baseItemHeight":
            case "itemMargin":
                this._renderGeometry();
                break;
            case "width":
            case "height":
                this.callBase(args);
                this._renderGeometry();
                this._updateScrollView();
                break;
            case "direction":
                this._renderGeometry();
                this._updateScrollView();
                break;
            case "indicateLoading":
                this._hideLoadingIfLoadIndicationOff();
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxtileviewmethods.scrollPosition
    * @publicName scrollPosition()
    * @return numeric
    */
    scrollPosition: function() {
        return this._scrollView.scrollOffset()[this._config.mainPosition];
    }

});

registerComponent("dxTileView", TileView);

module.exports = TileView;
