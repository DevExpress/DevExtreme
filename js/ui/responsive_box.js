"use strict";

var $ = require("../core/renderer"),
    commonUtils = require("../core/utils/common"),
    typeUtils = require("../core/utils/type"),
    errors = require("./widget/ui.errors"),
    windowUtils = require("../core/utils/window"),
    iteratorUtils = require("../core/utils/iterator"),
    extend = require("../core/utils/extend").extend,
    registerComponent = require("../core/component_registrator"),
    Box = require("./box"),
    CollectionWidget = require("./collection/ui.collection_widget.edit");

var RESPONSIVE_BOX_CLASS = "dx-responsivebox",
    SCREEN_SIZE_CLASS_PREFIX = RESPONSIVE_BOX_CLASS + "-screen-",
    BOX_ITEM_CLASS = "dx-box-item",
    BOX_ITEM_DATA_KEY = "dxBoxItemData";

/**
* @name dxResponsiveBox
* @publicName dxResponsiveBox
* @type object
* @inherits CollectionWidget
* @groupName Navigation and Layouting
* @module ui/responsive_box
* @export default
*/
var ResponsiveBox = CollectionWidget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxResponsiveBoxOptions_rows
            * @publicName rows
            * @type Array
            */
            /**
            * @name dxResponsiveBoxOptions_rows_baseSize
            * @publicName baseSize
            * @type number | string
            * @acceptValues 'auto'
            * @default 0
            */
            /**
            * @name dxResponsiveBoxOptions_rows_ratio
            * @publicName ratio
            * @type number
            * @default 1
            */
            /**
            * @name dxResponsiveBoxOptions_rows_screen
            * @publicName screen
            * @type string
            * @default undefined
            */
            rows: [],

            /**
            * @name dxResponsiveBoxOptions_cols
            * @publicName cols
            * @type array
            */
            /**
            * @name dxResponsiveBoxOptions_cols_baseSize
            * @publicName baseSize
            * @type number | string
            * @acceptValues 'auto'
            * @default 0
            */
            /**
            * @name dxResponsiveBoxOptions_cols_ratio
            * @publicName ratio
            * @type number
            * @default 1
            */
            /**
            * @name dxResponsiveBoxOptions_cols_screen
            * @publicName screen
            * @type string
            * @default undefined
            */
            cols: [],

            /**
            * @name dxResponsiveBoxOptions_screenByWidth
            * @publicName screenByWidth
            * @type function
            * @default null
            */
            screenByWidth: null,

            /**
            * @name dxResponsiveBoxOptions_singleColumnScreen
            * @publicName singleColumnScreen
            * @type string
            * @default ""
            */
            singleColumnScreen: "",

            /**
            * @name dxResponsiveBoxOptions_height
            * @publicName height
            * @default '100%'
            * @extend_doc
            */
            height: "100%",

            /**
            * @name dxResponsiveBoxOptions_width
            * @publicName width
            * @default '100%'
            * @extend_doc
            */
            width: "100%",

            /**
            * @name dxResponsiveBoxOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @hidden
            * @extend_doc
            */
            activeStateEnabled: false,

            /**
            * @name dxResponsiveBoxOptions_focusStateEnabled
            * @publicName focusStateEnabled
            * @hidden
            * @extend_doc
            */
            focusStateEnabled: false,

            onItemStateChanged: undefined,

            /**
            * @name dxResponsiveBoxOptions_accessKey
            * @publicName accessKey
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxResponsiveBoxOptions_hint
            * @publicName hint
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxResponsiveBoxOptions_noDataText
            * @publicName noDataText
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxResponsiveBoxOptions_onSelectionChanged
            * @publicName onSelectionChanged
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxResponsiveBoxOptions_selectedIndex
            * @publicName selectedIndex
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxResponsiveBoxOptions_selectedItem
            * @publicName selectedItem
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxResponsiveBoxOptions_selectedItems
            * @publicName selectedItems
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxResponsiveBoxOptions_selectedItemKeys
            * @publicName selectedItemKeys
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxResponsiveBoxOptions_keyExpr
            * @publicName keyExpr
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxResponsiveBoxOptions_tabIndex
            * @publicName tabIndex
            * @hidden
            * @extend_doc
            */

            onLayoutChanged: null,
            currentScreenFactor: undefined,

            _layoutStrategy: undefined

        });
    },

    _init: function() {
        if(!this.option("screenByWidth")) {
            this._options.screenByWidth = windowUtils.defaultScreenFactorFunc;
        }

        this.callBase();
        this._initLayoutChangedAction();
    },

    _initLayoutChangedAction: function() {
        this._layoutChangedAction = this._createActionByOption("onLayoutChanged", {
            excludeValidators: ["disabled", "readonly"]
        });
    },

    _itemClass: function() {
        return BOX_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return BOX_ITEM_DATA_KEY;
    },

    _render: function() {
        this.callBase();
        this.element().addClass(RESPONSIVE_BOX_CLASS);

        // NOTE: Fallback box strategy
        this._updateRootBox();
    },

    _updateRootBox: function() {
        clearTimeout(this._updateTimer);

        this._updateTimer = setTimeout((function() {
            if(this._$root) {
                this._$root.triggerHandler("dxupdate");
            }
        }).bind(this));
    },

    _renderItems: function() {
        this._setScreenSize();

        this._screenItems = this._itemsByScreen();

        this._prepareGrid();
        this._spreadItems();
        this._layoutItems();
        this._linkNodeToItem();
    },

    _setScreenSize: function() {
        var currentScreen = this._getCurrentScreen();

        this._removeScreenSizeClass();

        this.element().addClass(SCREEN_SIZE_CLASS_PREFIX + currentScreen);
        this.option("currentScreenFactor", currentScreen);
    },

    _removeScreenSizeClass: function() {
        var currentScreenFactor = this.option("currentScreenFactor");

        currentScreenFactor && this.element().removeClass(SCREEN_SIZE_CLASS_PREFIX + currentScreenFactor);
    },

    _prepareGrid: function() {
        var grid = this._grid = [];

        this._prepareRowsAndCols();

        $.each(this._rows, (function() {
            var row = [];
            grid.push(row);

            $.each(this._cols, (function() {
                row.push(this._createEmptyCell());
            }).bind(this));
        }).bind(this));
    },

    _prepareRowsAndCols: function() {
        if(this._isSingleColumnScreen()) {
            this._prepareSingleColumnScreenItems();
            this._rows = this._defaultSizeConfig(this._screenItems.length);
            this._cols = this._defaultSizeConfig(1);
        } else {
            this._rows = this._sizesByScreen(this.option("rows"));
            this._cols = this._sizesByScreen(this.option("cols"));
        }
    },

    _isSingleColumnScreen: function() {
        return this._screenRegExp().test(this.option("singleColumnScreen"))
            || !this.option("rows").length || !this.option("cols").length;
    },

    _prepareSingleColumnScreenItems: function() {
        this._screenItems.sort(function(item1, item2) {
            return (item1.location.row - item2.location.row) || (item1.location.col - item2.location.col);
        });

        $.each(this._screenItems, function(index, item) {
            extend(item.location, { row: index, col: 0, rowspan: 1, colspan: 1 });
        });
    },

    _sizesByScreen: function(sizeConfigs) {
        return iteratorUtils.map(this._filterByScreen(sizeConfigs), (function(sizeConfig) {
            return extend(this._defaultSizeConfig(), sizeConfig);
        }).bind(this));
    },

    _defaultSizeConfig: function(size) {
        var defaultSizeConfig = { ratio: 1, baseSize: 0, minSize: 0, maxSize: 0 };
        if(!arguments.length) {
            return defaultSizeConfig;
        }

        var result = [];
        for(var i = 0; i < size; i++) {
            result.push(defaultSizeConfig);
        }
        return result;
    },

    _filterByScreen: function(items) {
        var screenRegExp = this._screenRegExp();

        return commonUtils.grep(items, function(item) {
            return !item.screen || screenRegExp.test(item.screen);
        });
    },

    _screenRegExp: function() {
        var screen = this._getCurrentScreen();
        return new RegExp("(^|\\s)" + screen + "($|\\s)", "i");
    },

    _getCurrentScreen: function() {
        var width = this._screenWidth();
        return this.option("screenByWidth")(width);
    },

    _screenWidth: function() {
        return $(window).width();
    },

    _createEmptyCell: function() {
        return {
            item: {},
            location: { colspan: 1, rowspan: 1 }
        };
    },

    _spreadItems: function() {
        $.each(this._screenItems, (function(_, itemInfo) {
            var location = itemInfo.location || {};
            var itemCol = location.col;
            var itemRow = location.row;
            var row = this._grid[itemRow];
            var itemCell = row && row[itemCol];

            this._occupyCells(itemCell, itemInfo);
        }).bind(this));
    },

    _itemsByScreen: function() {
        return iteratorUtils.map(this.option("items"), (function(item) {
            var locations = item.location || {};
            locations = typeUtils.isPlainObject(locations) ? [locations] : locations;

            return iteratorUtils.map(this._filterByScreen(locations), function(location) {
                return {
                    item: item,
                    location: extend({ rowspan: 1, colspan: 1 }, location)
                };
            });
        }).bind(this));
    },

    _occupyCells: function(itemCell, itemInfo) {
        if(!itemCell || this._isItemCellOccupied(itemCell, itemInfo)) {
            return;
        }

        extend(itemCell, itemInfo);
        this._markSpanningCell(itemCell);
    },

    _isItemCellOccupied: function(itemCell, itemInfo) {
        if(!typeUtils.isEmptyObject(itemCell.item)) {
            return true;
        }

        var result = false;
        this._loopOverSpanning(itemInfo.location, function(cell) {
            result = result || !typeUtils.isEmptyObject(cell.item);
        });
        return result;
    },

    _loopOverSpanning: function(location, callback) {
        var rowEnd = location.row + location.rowspan - 1;
        var colEnd = location.col + location.colspan - 1;
        var boundRowEnd = Math.min(rowEnd, this._rows.length - 1);
        var boundColEnd = Math.min(colEnd, this._cols.length - 1);
        location.rowspan -= rowEnd - boundRowEnd;
        location.colspan -= colEnd - boundColEnd;

        for(var rowIndex = location.row; rowIndex <= boundRowEnd; rowIndex++) {
            for(var colIndex = location.col; colIndex <= boundColEnd; colIndex++) {
                if((rowIndex !== location.row) || (colIndex !== location.col)) {
                    callback(this._grid[rowIndex][colIndex]);
                }
            }
        }
    },

    _markSpanningCell: function(itemCell) {
        this._loopOverSpanning(itemCell.location, function(cell) {
            extend(cell, {
                item: itemCell.item,
                spanningCell: itemCell
            });
        });
    },

    _linkNodeToItem: function() {
        $.each(this._itemElements(), function(_, itemNode) {
            var $item = $(itemNode),
                item = $item.data(BOX_ITEM_DATA_KEY);
            if(!item.box) {
                item.node = $item.children();
            }
        });
    },

    _layoutItems: function() {
        var rowsCount = this._grid.length;
        var colsCount = rowsCount && this._grid[0].length;

        if(!rowsCount && !colsCount) {
            return;
        }

        var result = this._layoutBlock({
            direction: "col",
            row: { start: 0, end: rowsCount - 1 },
            col: { start: 0, end: colsCount - 1 }
        });

        var rootBox = this._prepareBoxConfig(result.box || { direction: "row", items: [extend(result, { ratio: 1 })] });
        extend(rootBox, this._rootBoxConfig());

        this._$root = $("<div>").appendTo(this._itemContainer());
        this._createComponent(this._$root, Box, rootBox);
    },

    _rootBoxConfig: function() {
        return extend({
            width: "100%",
            height: "100%",
            itemTemplate: this.option("itemTemplate"),
            itemHoldTimeout: this.option("itemHoldTimeout"),
            onItemHold: this._createActionByOption("onItemHold"),
            onItemClick: this._createActionByOption("onItemClick"),
            onItemContextMenu: this._createActionByOption("onItemContextMenu"),
            onItemRendered: this._createActionByOption("onItemRendered")
        }, { _layoutStrategy: this.option("_layoutStrategy") });
    },

    _prepareBoxConfig: function(config) {
        return extend(config || {}, {
            crossAlign: "stretch",
            onItemStateChanged: this.option("onItemStateChanged")
        });
    },

    _layoutBlock: function(options) {
        if(this._isSingleItem(options)) {
            return this._itemByCell(options.row.start, options.col.start);
        }

        return this._layoutDirection(options);
    },

    _isSingleItem: function(options) {
        var firstCellLocation = this._grid[options.row.start][options.col.start].location;
        var isItemRowSpanned = (options.row.end - options.row.start) === (firstCellLocation.rowspan - 1);
        var isItemColSpanned = (options.col.end - options.col.start) === (firstCellLocation.colspan - 1);

        return isItemRowSpanned && isItemColSpanned;
    },

    _itemByCell: function(rowIndex, colIndex) {
        var itemCell = this._grid[rowIndex][colIndex];
        return itemCell.spanningCell ? null : itemCell.item;
    },

    _layoutDirection: function(options) {
        var items = [];
        var direction = options.direction;
        var crossDirection = this._crossDirection(direction);

        var block;
        while((block = this._nextBlock(options))) {

            if(this._isBlockIndivisible(options.prevBlockOptions, block)) {
                throw errors.Error("E1025");
            }

            var item = this._layoutBlock({
                direction: crossDirection,
                row: block.row,
                col: block.col,
                prevBlockOptions: options
            });

            if(item) {
                extend(item, this._blockSize(block, crossDirection));
                items.push(item);
            }

            options[crossDirection].start = block[crossDirection].end + 1;
        }

        return {
            box: this._prepareBoxConfig({ direction: direction, items: items })
        };
    },

    _isBlockIndivisible: function(options, block) {
        return options &&
            options.col.start === block.col.start &&
            options.col.end === block.col.end &&
            options.row.start === block.row.start &&
            options.row.end === block.row.end;
    },

    _crossDirection: function(direction) {
        return direction === "col" ? "row" : "col";
    },

    _nextBlock: function(options) {
        var direction = options.direction;
        var crossDirection = this._crossDirection(direction);
        var startIndex = options[direction].start;
        var endIndex = options[direction].end;
        var crossStartIndex = options[crossDirection].start;

        if(crossStartIndex > options[crossDirection].end) {
            return null;
        }

        var crossSpan = 1;
        for(var crossIndex = crossStartIndex; crossIndex < crossStartIndex + crossSpan; crossIndex++) {

            var lineCrossSpan = 1;
            for(var index = startIndex; index <= endIndex; index++) {
                var cell = this._cellByDirection(direction, index, crossIndex);
                lineCrossSpan = Math.max(lineCrossSpan, cell.location[crossDirection + "span"]);
            }

            var lineCrossEndIndex = crossIndex + lineCrossSpan;
            var crossEndIndex = crossStartIndex + crossSpan;
            if(lineCrossEndIndex > crossEndIndex) {
                crossSpan += lineCrossEndIndex - crossEndIndex;
            }
        }

        var result = {};
        result[direction] = { start: startIndex, end: endIndex };
        result[crossDirection] = { start: crossStartIndex, end: (crossStartIndex + crossSpan - 1) };
        return result;
    },

    _cellByDirection: function(direction, index, crossIndex) {
        return direction === "col"
            ? this._grid[crossIndex][index]
            : this._grid[index][crossIndex];
    },

    _blockSize: function(block, direction) {
        var sizeConfigs = (direction === "row") ? this._rows : this._cols;

        var result = {
            ratio: 0,
            baseSize: 0,
            minSize: 0,
            maxSize: 0
        };

        for(var index = block[direction].start; index <= block[direction].end; index++) {
            var sizeConfig = sizeConfigs[index];
            result.ratio += sizeConfig.ratio;
            result.baseSize += sizeConfig.baseSize;
            result.minSize += sizeConfig.minSize;
            result.maxSize += sizeConfig.maxSize;
        }

        result.minSize = result.minSize ? result.minSize : "auto";
        result.maxSize = result.maxSize ? result.maxSize : "auto";

        this._isSingleColumnScreen() && (result.baseSize = 'auto');

        return result;
    },

    _update: function() {
        var $existingRoot = this._$root;
        this._renderItems();
        $existingRoot && $existingRoot.detach();
        this._saveAssistantRoot($existingRoot);
        this._layoutChangedAction();
        this._updateRootBox();
    },

    _saveAssistantRoot: function($root) {
        this._assistantRoots = this._assistantRoots || [];
        this._assistantRoots.push($root);
    },

    _dispose: function() {
        clearTimeout(this._updateTimer);
        this._cleanUnusedRoots();
        this.callBase.apply(this, arguments);
    },

    _cleanUnusedRoots: function() {
        if(!this._assistantRoots) {
            return;
        }

        $.each(this._assistantRoots, function(_, item) {
            $(item).remove();
        });
    },

    _clearItemNodeTemplates: function() {
        $.each(this.option("items"), function() {
            delete this.node;
        });
    },

    _toggleVisibility: function(visible) {
        this.callBase(visible);
        if(visible) {
            this._updateRootBox();
        }
    },

    _attachClickEvent: commonUtils.noop,

    _optionChanged: function(args) {
        switch(args.name) {
            case "rows":
            case "cols":
            case "screenByWidth":
            case "_layoutStrategy":
            case "singleColumnScreen":
                this._clearItemNodeTemplates();
                this._invalidate();
                break;
            case "width":
            case "height":
                this.callBase(args);
                this._update();
                break;
            case "onLayoutChanged":
                this._initLayoutChangedAction();
                break;
            case "itemTemplate":
                this._clearItemNodeTemplates();
                this.callBase(args);
                break;
            case "currentScreenFactor":
                break;
            default:
                this.callBase(args);
        }
    },

    _dimensionChanged: function() {
        if(this._getCurrentScreen() !== this.option("currentScreenFactor")) {
            this._update();
        }
    },

    repaint: function() {
        this._update();
    }

    /**
    * @name dxResponsiveBoxMethods_registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @extend_doc
    */

    /**
    * @name dxResponsiveBoxMethods_focus
    * @publicName focus()
    * @hidden
    * @extend_doc
    */
});

/**
* @name dxResponsiveBoxItemTemplate_location
* @publicName location
* @type object|array
*/
/**
* @name dxResponsiveBoxItemTemplate_location_row
* @publicName row
* @type number
*/
/**
* @name dxResponsiveBoxItemTemplate_location_col
* @publicName col
* @type number
*/
/**
* @name dxResponsiveBoxItemTemplate_location_rowspan
* @publicName rowspan
* @type number
* @default undefined
*/
/**
* @name dxResponsiveBoxItemTemplate_location_colspan
* @publicName colspan
* @type number
* @default undefined
*/
/**
* @name dxResponsiveBoxItemTemplate_location_screen
* @publicName screen
* @type string
* @default undefined
*/

registerComponent("dxResponsiveBox", ResponsiveBox);

module.exports = ResponsiveBox;
