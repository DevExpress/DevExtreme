"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    Class = require("../core/class"),
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    noop = require("../core/utils/common").noop,
    isDefined = require("../core/utils/type").isDefined,
    support = require("../core/utils/support"),
    each = require("../core/utils/iterator").each,
    browser = require("../core/utils/browser"),
    CollectionWidgetItem = require("./collection/item"),
    devices = require("../core/devices"),
    CollectionWidget = require("./collection/ui.collection_widget.edit");

var BOX_CLASS = "dx-box",
    BOX_SELECTOR = ".dx-box",
    BOX_ITEM_CLASS = "dx-box-item",
    BOX_ITEM_DATA_KEY = "dxBoxItemData";

var flexGrowProp = support.styleProp("flexGrow");
var flexShrinkProp = support.styleProp("flexShrink");
var flexPropPrefix = support.stylePropPrefix("flexDirection");

var MINSIZE_MAP = {
    "row": "minWidth",
    "col": "minHeight"
};

var MAXSIZE_MAP = {
    "row": "maxWidth",
    "col": "maxHeight"
};

var SHRINK = 1;


// NEW FLEXBOX STRATEGY

var FLEX_JUSTIFY_CONTENT_MAP = {
    "start": "flex-start",
    "end": "flex-end",
    "center": "center",
    "space-between": "space-between",
    "space-around": "space-around"
};

var FLEX_ALIGN_ITEMS_MAP = {
    "start": "flex-start",
    "end": "flex-end",
    "center": "center",
    "stretch": "stretch"
};

var FLEX_DIRECTION_MAP = {
    "row": "row",
    "col": "column"
};

var BoxItem = CollectionWidgetItem.inherit({
    _renderVisible: function(value, oldValue) {
        this.callBase(value);
        if(isDefined(oldValue)) {
            this._options.fireItemStateChangedAction({
                name: "visible",
                state: value,
                oldState: oldValue
            });
        }
    },
});

var FlexLayoutStrategy = Class.inherit({
    ctor: function($element, option) {
        this._$element = $element;
        this._option = option;
    },

    renderBox: function() {
        this._$element.css({
            display: support.stylePropPrefix("flexDirection") + "flex",
            flexDirection: FLEX_DIRECTION_MAP[this._option("direction")]
        });
    },

    renderAlign: function() {
        this._$element.css({
            justifyContent: this._normalizedAlign()
        });
    },

    _normalizedAlign: function() {
        var align = this._option("align");
        return (align in FLEX_JUSTIFY_CONTENT_MAP) ? FLEX_JUSTIFY_CONTENT_MAP[align] : align;
    },

    renderCrossAlign: function() {
        this._$element.css({
            alignItems: this._normalizedCrossAlign()
        });
    },

    _normalizedCrossAlign: function() {
        var crossAlign = this._option("crossAlign");
        return (crossAlign in FLEX_ALIGN_ITEMS_MAP) ? FLEX_ALIGN_ITEMS_MAP[crossAlign] : crossAlign;
    },

    renderItems: function($items) {
        var direction = this._option("direction");

        each($items, function() {
            var $item = $(this);
            var item = $item.data(BOX_ITEM_DATA_KEY);

            $item.css({ display: flexPropPrefix + "flex", flexBasis: item.baseSize || 0 })
                .css(MAXSIZE_MAP[direction], item.maxSize || "none")
                .css(MINSIZE_MAP[direction], item.minSize || "0");

            // NOTE: workaround for jQuery version < 1.11.1 (T181692)
            var itemStyle = $item.get(0).style;
            itemStyle[flexGrowProp] = item.ratio;
            itemStyle[flexShrinkProp] = isDefined(item.shrink) ? item.shrink : SHRINK;

            $item.children().each(function(_, itemContent) {
                $(itemContent).css({
                    width: "auto",
                    height: "auto",
                    display: support.stylePropPrefix("flexDirection") + "flex",
                    flexDirection: $item.children().css("flexDirection") || "column",
                    flexBasis: 0
                });

                // NOTE: workaround for jQuery version < 1.11.1 (T181692)
                itemContent.style[flexGrowProp] = 1;
            });
        });
    },

    initSize: noop,

    update: noop
});


// FALLBACK STRATEGY FOR IE

var BOX_EVENTNAMESPACE = "dxBox",
    UPDATE_EVENT = "dxupdate." + BOX_EVENTNAMESPACE,
    FALLBACK_BOX_ITEM = "dx-box-fallback-item";

var FALLBACK_WRAP_MAP = {
    "row": "nowrap",
    "col": "normal"
};

var FALLBACK_MAIN_SIZE_MAP = {
    "row": "width",
    "col": "height"
};

var FALLBACK_CROSS_SIZE_MAP = {
    "row": "height",
    "col": "width"
};

var FALLBACK_PRE_MARGIN_MAP = {
    "row": "marginLeft",
    "col": "marginTop"
};

var FALLBACK_POST_MARGIN_MAP = {
    "row": "marginRight",
    "col": "marginBottom"
};

var FALLBACK_CROSS_PRE_MARGIN_MAP = {
    "row": "marginTop",
    "col": "marginLeft"
};

var FALLBACK_CROSS_POST_MARGIN_MAP = {
    "row": "marginBottom",
    "col": "marginRight"
};

var MARGINS_RTL_FLIP_MAP = {
    "marginLeft": "marginRight",
    "marginRight": "marginLeft"
};

var FallbackLayoutStrategy = Class.inherit({
    ctor: function($element, option) {
        this._$element = $element;
        this._option = option;
    },

    renderBox: function() {
        this._$element.css({
            fontSize: 0,
            whiteSpace: FALLBACK_WRAP_MAP[this._option("direction")],
            verticalAlign: "top"
        });

        eventsEngine.off(this._$element, UPDATE_EVENT);
        eventsEngine.on(this._$element, UPDATE_EVENT, this.update.bind(this));
    },

    renderAlign: function() {
        var $items = this._$items;

        if(!$items) {
            return;
        }

        var align = this._option("align"),
            shift = 0,
            totalItemSize = this.totalItemSize,
            direction = this._option("direction"),
            boxSize = this._$element[FALLBACK_MAIN_SIZE_MAP[direction]](),
            freeSpace = boxSize - totalItemSize;

        //NOTE: clear margins
        this._setItemsMargins($items, direction, 0);

        switch(align) {
            case "start":
                break;
            case "end":
                shift = freeSpace;
                $items.first().css(this._chooseMarginSide(FALLBACK_PRE_MARGIN_MAP[direction]), shift);
                break;
            case "center":
                shift = 0.5 * freeSpace;
                $items.first().css(this._chooseMarginSide(FALLBACK_PRE_MARGIN_MAP[direction]), shift);
                $items.last().css(this._chooseMarginSide(FALLBACK_POST_MARGIN_MAP[direction]), shift);
                break;
            case "space-between":
                shift = 0.5 * freeSpace / ($items.length - 1);
                this._setItemsMargins($items, direction, shift);
                $items.first().css(this._chooseMarginSide(FALLBACK_PRE_MARGIN_MAP[direction]), 0);
                $items.last().css(this._chooseMarginSide(FALLBACK_POST_MARGIN_MAP[direction]), 0);
                break;
            case "space-around":
                shift = 0.5 * freeSpace / $items.length;
                this._setItemsMargins($items, direction, shift);
                break;
        }
    },

    _setItemsMargins: function($items, direction, shift) {
        $items
            .css(this._chooseMarginSide(FALLBACK_PRE_MARGIN_MAP[direction]), shift)
            .css(this._chooseMarginSide(FALLBACK_POST_MARGIN_MAP[direction]), shift);
    },

    renderCrossAlign: function() {
        var $items = this._$items;

        if(!$items) {
            return;
        }

        var crossAlign = this._option("crossAlign"),
            direction = this._option("direction"),
            size = this._$element[FALLBACK_CROSS_SIZE_MAP[direction]]();

        var that = this;

        switch(crossAlign) {
            case "start":
                break;
            case "end":
                each($items, function() {
                    var $item = $(this),
                        itemSize = $item[FALLBACK_CROSS_SIZE_MAP[direction]](),
                        shift = size - itemSize;
                    $item.css(that._chooseMarginSide(FALLBACK_CROSS_PRE_MARGIN_MAP[direction]), shift);
                });
                break;
            case "center":
                each($items, function() {
                    var $item = $(this),
                        itemSize = $item[FALLBACK_CROSS_SIZE_MAP[direction]](),
                        shift = 0.5 * (size - itemSize);
                    $item
                        .css(that._chooseMarginSide(FALLBACK_CROSS_PRE_MARGIN_MAP[direction]), shift)
                        .css(that._chooseMarginSide(FALLBACK_CROSS_POST_MARGIN_MAP[direction]), shift);
                });
                break;
            case "stretch":
                $items
                    .css(that._chooseMarginSide(FALLBACK_CROSS_PRE_MARGIN_MAP[direction]), 0)
                    .css(that._chooseMarginSide(FALLBACK_CROSS_POST_MARGIN_MAP[direction]), 0)
                    .css(FALLBACK_CROSS_SIZE_MAP[direction], "100%");
                break;
        }
    },

    _chooseMarginSide: function(value) {
        if(!this._option("rtlEnabled")) {
            return value;
        }

        return MARGINS_RTL_FLIP_MAP[value] || value;
    },

    renderItems: function($items) {
        this._$items = $items;

        var direction = this._option("direction"),
            totalRatio = 0,
            totalWeightedShrink = 0,
            totalBaseSize = 0;

        each($items, (function(_, item) {
            var $item = $(item);

            $item.css({
                display: "inline-block",
                verticalAlign: "top"
            });

            $item[FALLBACK_MAIN_SIZE_MAP[direction]]("auto");

            $item.removeClass(FALLBACK_BOX_ITEM);

            var itemData = $item.data(BOX_ITEM_DATA_KEY),
                ratio = itemData.ratio || 0,
                size = this._baseSize($item),
                shrink = isDefined(itemData.shrink) ? itemData.shrink : SHRINK;

            totalRatio += ratio;
            totalWeightedShrink += shrink * size;
            totalBaseSize += size;
        }).bind(this));


        var freeSpaceSize = this._boxSize() - totalBaseSize;

        var itemSize = (function($item) {
            var itemData = $item.data(BOX_ITEM_DATA_KEY),
                size = this._baseSize($item),
                factor = (freeSpaceSize >= 0) ? itemData.ratio || 0 : (isDefined(itemData.shrink) ? itemData.shrink : SHRINK) * size,
                totalFactor = (freeSpaceSize >= 0) ? totalRatio : totalWeightedShrink,
                shift = totalFactor ? Math.round(freeSpaceSize * factor / totalFactor) : 0;

            return size + shift;
        }).bind(this);

        var totalItemSize = 0;

        each($items, function(_, item) {
            var $item = $(item),
                itemData = $(item).data(BOX_ITEM_DATA_KEY),
                size = itemSize($item);

            totalItemSize += size;

            $item
                .css(MAXSIZE_MAP[direction], itemData.maxSize || "none")
                .css(MINSIZE_MAP[direction], itemData.minSize || "0")
                .css(FALLBACK_MAIN_SIZE_MAP[direction], size);

            $item.addClass(FALLBACK_BOX_ITEM);
        });

        this.totalItemSize = totalItemSize;
    },

    _baseSize: function(item) {
        var itemData = $(item).data(BOX_ITEM_DATA_KEY);
        return itemData.baseSize == null ? 0 : (itemData.baseSize === "auto" ? this._contentSize(item) : this._parseSize(itemData.baseSize));
    },

    _contentSize: function(item) {
        return $(item)[FALLBACK_MAIN_SIZE_MAP[this._option("direction")]]();
    },

    _parseSize: function(size) {
        return String(size).match(/.+%$/) ? 0.01 * parseFloat(size) * this._boxSizeValue : size;
    },

    _boxSize: function(value) {
        if(!arguments.length) {
            this._boxSizeValue = this._boxSizeValue || this._totalBaseSize();
            return this._boxSizeValue;
        }

        this._boxSizeValue = value;
    },

    _totalBaseSize: function() {
        var result = 0;

        each(this._$items, (function(_, item) {
            result += this._baseSize(item);
        }).bind(this));

        return result;
    },

    initSize: function() {
        this._boxSize(this._$element[FALLBACK_MAIN_SIZE_MAP[this._option("direction")]]());
    },

    update: function() {
        if(!this._$items || this._$element.is(":hidden")) {
            return;
        }

        this._$items.detach();
        this.initSize();
        this._$element.append(this._$items);

        this.renderItems(this._$items);
        this.renderAlign();
        this.renderCrossAlign();

        var element = this._$element.get(0);

        this._$items.find(BOX_SELECTOR).each(function() {
            if(element === $(this).parent().closest(BOX_SELECTOR).get(0)) {
                $(this).triggerHandler(UPDATE_EVENT);
            }
        });
    }
});

/**
* @name dxBox
* @publicName dxBox
* @inherits CollectionWidget
* @groupName Navigation and Layouting
* @module ui/box
* @export default
*/
var Box = CollectionWidget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxBoxOptions_direction
            * @publicName direction
            * @type string
            * @default 'row'
            * @acceptValues 'row'|'col'
            */
            direction: "row",

            /**
            * @name dxBoxOptions_align
            * @publicName align
            * @type string
            * @default 'start'
            * @acceptValues 'start'|'end'|'center'|'space-between'|'space-around'
            */
            align: "start",

            /**
            * @name dxBoxOptions_crossAlign
            * @publicName crossAlign
            * @type string
            * @default 'start'
            * @acceptValues 'start'|'end'|'center'|'stretch'
            */
            crossAlign: "stretch",

            /**
            * @name dxBoxOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @hidden
            * @extend_doc
            */
            activeStateEnabled: false,

            /**
            * @name dxBoxOptions_focusStateEnabled
            * @publicName focusStateEnabled
            * @hidden
            * @extend_doc
            */
            focusStateEnabled: false,

            onItemStateChanged: undefined,

            _layoutStrategy: "flex",
            _queue: undefined

            /**
            * @name dxBoxOptions_hint
            * @publicName hint
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxBoxOptions_noDataText
            * @publicName noDataText
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxBoxOptions_onSelectionChanged
            * @publicName onSelectionChanged
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxBoxOptions_selectedIndex
            * @publicName selectedIndex
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxBoxOptions_selectedItem
            * @publicName selectedItem
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxBoxOptions_selectedItems
            * @publicName selectedItems
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxBoxOptions_selectedItemKeys
            * @publicName selectedItemKeys
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxBoxOptions_keyExpr
            * @publicName keyExpr
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxBoxOptions_tabIndex
            * @publicName tabIndex
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxBoxOptions_accessKey
            * @publicName accessKey
            * @hidden
            * @extend_doc
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    var device = devices.real();
                    var isOldAndroid = (device.platform === "android") && (device.version[0] < 4 || (device.version[0] === 4 && device.version[1] < 4)),
                        isOldIos = (device.platform === "ios") && (device.version[0] < 7);
                    return device.platform === "win" || browser["msie"] || isOldAndroid || isOldIos;
                },
                options: {
                    _layoutStrategy: "fallback"
                }
            }
        ]);
    },

    _itemClass: function() {
        return BOX_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return BOX_ITEM_DATA_KEY;
    },

    _itemElements: function() {
        return this._itemContainer().children(this._itemSelector());
    },

    _init: function() {
        this.callBase();
        this.element().addClass(BOX_CLASS + "-" + this.option("_layoutStrategy"));
        this._initLayout();
        this._initBoxQueue();
    },

    _initLayout: function() {
        this._layout = (this.option("_layoutStrategy") === "fallback") ?
            new FallbackLayoutStrategy(this.element(), this.option.bind(this)) :
            new FlexLayoutStrategy(this.element(), this.option.bind(this));
    },

    _initBoxQueue: function() {
        this._queue = this.option("_queue") || [];
    },

    _queueIsNotEmpty: function() {
        return this.option("_queue") ? false : !!this._queue.length;
    },

    _pushItemToQueue: function($item, config) {
        this._queue.push({ $item: $item, config: config });
    },

    _shiftItemFromQueue: function() {
        return this._queue.shift();
    },

    _render: function() {
        this._renderActions();
        this.callBase();
        this.element().addClass(BOX_CLASS);
        this._renderBox();
    },

    _renderActions: function() {
        this._onItemStateChanged = this._createActionByOption("onItemStateChanged");
    },

    _renderBox: function() {
        this._layout.renderBox();
        this._layout.renderAlign();
        this._layout.renderCrossAlign();
    },

    _renderItems: function(items) {
        this._layout.initSize();
        this.callBase(items);

        while(this._queueIsNotEmpty()) {
            var item = this._shiftItemFromQueue();
            this._createComponent(item.$item, Box, extend({
                _layoutStrategy: this.option("_layoutStrategy"),
                itemTemplate: this.option("itemTemplate"),
                itemHoldTimeout: this.option("itemHoldTimeout"),
                onItemHold: this.option("onItemHold"),
                onItemClick: this.option("onItemClick"),
                onItemContextMenu: this.option("onItemContextMenu"),
                onItemRendered: this.option("onItemRendered"),
                _queue: this._queue
            }, item.config));
        }

        this._layout.renderItems(this._itemElements());

        clearTimeout(this._updateTimer);

        this._updateTimer = setTimeout((function() {
            if(!this._isUpdated) {
                this._layout.update();
            }
            this._isUpdated = false;
            this._updateTimer = null;
        }).bind(this));
    },

    _renderItemContent: function(args) {
        var $itemNode = args.itemData && args.itemData.node;
        if($itemNode) {
            return this._renderItemContentByNode(args, $itemNode);
        }

        return this.callBase(args);
    },

    _postprocessRenderItem: function(args) {
        var boxConfig = args.itemData.box;
        if(!boxConfig) {
            return;
        }

        this._pushItemToQueue(args.itemContent, boxConfig);
    },

    _createItemByTemplate: function(itemTemplate, args) {
        if(args.itemData.box) {
            return itemTemplate.source ? itemTemplate.source() : $();
        }
        return this.callBase(itemTemplate, args);
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged: function() {
        if(this._updateTimer) {
            return;
        }

        this._isUpdated = true;
        this._layout.update();
    },

    _dispose: function() {
        clearTimeout(this._updateTimer);
        this.callBase.apply(this, arguments);
    },

    _itemOptionChanged: function(item, property, value, oldValue) {
        if(property === "visible") {
            this._onItemStateChanged({
                name: property,
                state: value,
                oldState: oldValue !== false
            });
        }
        this.callBase(item, property, value);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "_layoutStrategy":
            case "_queue":
            case "direction":
                this._invalidate();
                break;
            case "align":
                this._layout.renderAlign();
                break;
            case "crossAlign":
                this._layout.renderCrossAlign();
                break;
            default:
                this.callBase(args);
        }
    },

    _itemOptions: function() {
        var that = this,
            options = this.callBase();

        options.fireItemStateChangedAction = function(e) {
            that._onItemStateChanged(e);
        };

        return options;
    },

    repaint: function() {
        this._dimensionChanged();
    }

    /**
    * @name dxBoxMethods_registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @extend_doc
    */

    /**
    * @name dxBoxMethods_focus
    * @publicName focus()
    * @hidden
    * @extend_doc
    */
});

/**
* @name dxBoxItemTemplate_ratio
* @publicName ratio
* @type number
* @default 0
*/
/**
* @name dxBoxItemTemplate_baseSize
* @publicName baseSize
* @type number | string
* @acceptValues 'auto'
* @default 0
*/
/**
* @name dxBoxItemTemplate_box
* @publicName box
* @type dxBox options
* @default undefined
*/


Box.ItemClass = BoxItem;

registerComponent("dxBox", Box);

module.exports = Box;
