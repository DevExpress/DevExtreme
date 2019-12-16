import $ from "../core/renderer";
import eventsEngine from "../events/core/events_engine";
import registerComponent from "../core/component_registrator";
import { extend } from "../core/utils/extend";
import { noop } from "../core/utils/common";
import windowUtils from "../core/utils/window";
import inflector from "../core/utils/inflector";
import { isDefined } from "../core/utils/type";
import styleUtils from "../core/utils/style";
import { each } from "../core/utils/iterator";
import browser from "../core/utils/browser";
import CollectionWidgetItem from "./collection/item";
import CollectionWidget from "./collection/ui.collection_widget.edit";

const BOX_CLASS = "dx-box";
const BOX_SELECTOR = ".dx-box";
const BOX_ITEM_CLASS = "dx-box-item";
const BOX_ITEM_DATA_KEY = "dxBoxItemData";

const MINSIZE_MAP = {
    "row": "minWidth",
    "col": "minHeight"
};
const MAXSIZE_MAP = {
    "row": "maxWidth",
    "col": "maxHeight"
};
const SHRINK = 1;

// NEW FLEXBOX STRATEGY
const FLEX_JUSTIFY_CONTENT_MAP = {
    "start": "flex-start",
    "end": "flex-end",
    "center": "center",
    "space-between": "space-between",
    "space-around": "space-around"
};
const FLEX_ALIGN_ITEMS_MAP = {
    "start": "flex-start",
    "end": "flex-end",
    "center": "center",
    "stretch": "stretch"
};
const FLEX_DIRECTION_MAP = {
    "row": "row",
    "col": "column"
};

// FALLBACK STRATEGY FOR IE
const setFlexProp = (element, prop, value) => {
    // NOTE: workaround for jQuery version < 1.11.1 (T181692)
    value = styleUtils.normalizeStyleProp(prop, value);
    element.style[styleUtils.styleProp(prop)] = value;

    // NOTE: workaround for Domino issue https://github.com/fgnass/domino/issues/119
    if(!windowUtils.hasWindow()) {
        if(value === "" || !isDefined(value)) {
            return;
        }

        const cssName = inflector.dasherize(prop);
        const styleExpr = cssName + ": " + value + ";";

        if(!element.attributes.style) {
            element.setAttribute("style", styleExpr);
        } else if(element.attributes.style.value.indexOf(styleExpr) < 0) {
            element.attributes.style.value += " " + styleExpr;
        }
    }
};
const BOX_EVENTNAMESPACE = "dxBox";
const UPDATE_EVENT = "dxupdate." + BOX_EVENTNAMESPACE;

const FALLBACK_BOX_ITEM = "dx-box-fallback-item";
const FALLBACK_WRAP_MAP = {
    "row": "nowrap",
    "col": "normal"
};
const FALLBACK_MAIN_SIZE_MAP = {
    "row": "width",
    "col": "height"
};
const FALLBACK_CROSS_SIZE_MAP = {
    "row": "height",
    "col": "width"
};
const FALLBACK_PRE_MARGIN_MAP = {
    "row": "marginLeft",
    "col": "marginTop"
};
const FALLBACK_POST_MARGIN_MAP = {
    "row": "marginRight",
    "col": "marginBottom"
};
const FALLBACK_CROSS_PRE_MARGIN_MAP = {
    "row": "marginTop",
    "col": "marginLeft"
};
const FALLBACK_CROSS_POST_MARGIN_MAP = {
    "row": "marginBottom",
    "col": "marginRight"
};
const MARGINS_RTL_FLIP_MAP = {
    "marginLeft": "marginRight",
    "marginRight": "marginLeft"
};

class BoxItem extends CollectionWidgetItem {
    _renderVisible(value, oldValue) {
        super._renderVisible(value);
        if(isDefined(oldValue)) {
            this._options.fireItemStateChangedAction({
                name: "visible",
                state: value,
                oldState: oldValue
            });
        }
    }
}

class FlexLayoutStrategy {
    constructor($element, option) {
        this._$element = $element;
        this._option = option;
        this.initSize = noop;
        this.update = noop;
    }

    renderBox() {
        this._$element.css({
            display: styleUtils.stylePropPrefix("flexDirection") + "flex"
        });
        setFlexProp(this._$element.get(0), "flexDirection", FLEX_DIRECTION_MAP[this._option("direction")]);
    }

    renderAlign() {
        this._$element.css({
            justifyContent: this._normalizedAlign()
        });
    }

    _normalizedAlign() {
        const align = this._option("align");
        return (align in FLEX_JUSTIFY_CONTENT_MAP) ? FLEX_JUSTIFY_CONTENT_MAP[align] : align;
    }

    renderCrossAlign() {
        this._$element.css({
            alignItems: this._normalizedCrossAlign()
        });
    }

    _normalizedCrossAlign() {
        const crossAlign = this._option("crossAlign");
        return (crossAlign in FLEX_ALIGN_ITEMS_MAP) ? FLEX_ALIGN_ITEMS_MAP[crossAlign] : crossAlign;
    }

    renderItems($items) {
        const flexPropPrefix = styleUtils.stylePropPrefix("flexDirection");
        const direction = this._option("direction");

        each($items, function() {
            const $item = $(this);
            const item = $item.data(BOX_ITEM_DATA_KEY);

            $item.css({ display: flexPropPrefix + "flex" })
                .css(MAXSIZE_MAP[direction], item.maxSize || "none")
                .css(MINSIZE_MAP[direction], item.minSize || "0");

            setFlexProp($item.get(0), "flexBasis", item.baseSize || 0);
            setFlexProp($item.get(0), "flexGrow", item.ratio);
            setFlexProp($item.get(0), "flexShrink", isDefined(item.shrink) ? item.shrink : SHRINK);

            $item.children().each((_, itemContent) => {
                $(itemContent).css({
                    width: "auto",
                    height: "auto",
                    display: styleUtils.stylePropPrefix("flexDirection") + "flex",
                    flexBasis: 0
                });

                setFlexProp(itemContent, "flexGrow", 1);
                setFlexProp(itemContent, "flexDirection", $(itemContent)[0].style.flexDirection || "column");
            });
        });
    }
}

// Deprecated in 19.2 (T823974)
class FallbackLayoutStrategy {
    constructor($element, option) {
        this._$element = $element;
        this._option = option;
    }

    renderBox() {
        this._$element.css({
            fontSize: 0,
            whiteSpace: FALLBACK_WRAP_MAP[this._option("direction")],
            verticalAlign: "top"
        });

        eventsEngine.off(this._$element, UPDATE_EVENT);
        eventsEngine.on(this._$element, UPDATE_EVENT, this.update.bind(this));
    }

    renderAlign() {
        const $items = this._$items;

        if(!$items) {
            return;
        }

        const align = this._option("align");
        const totalItemSize = this.totalItemSize;
        const direction = this._option("direction");
        const boxSize = this._$element[FALLBACK_MAIN_SIZE_MAP[direction]]();
        const freeSpace = boxSize - totalItemSize;

        let shift = 0;

        // NOTE: clear margins
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
    }

    _setItemsMargins($items, direction, shift) {
        $items
            .css(this._chooseMarginSide(FALLBACK_PRE_MARGIN_MAP[direction]), shift)
            .css(this._chooseMarginSide(FALLBACK_POST_MARGIN_MAP[direction]), shift);
    }

    renderCrossAlign() {
        const $items = this._$items;

        if(!$items) {
            return;
        }

        const crossAlign = this._option("crossAlign");
        const direction = this._option("direction");
        const size = this._$element[FALLBACK_CROSS_SIZE_MAP[direction]]();

        const that = this;

        switch(crossAlign) {
            case "start":
                break;
            case "end":
                each($items, function() {
                    const $item = $(this),
                        itemSize = $item[FALLBACK_CROSS_SIZE_MAP[direction]](),
                        shift = size - itemSize;
                    $item.css(that._chooseMarginSide(FALLBACK_CROSS_PRE_MARGIN_MAP[direction]), shift);
                });
                break;
            case "center":
                each($items, function() {
                    const $item = $(this),
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
    }

    _chooseMarginSide(value) {
        if(!this._option("rtlEnabled")) {
            return value;
        }

        return MARGINS_RTL_FLIP_MAP[value] || value;
    }

    renderItems($items) {
        this._$items = $items;

        const direction = this._option("direction");

        let totalRatio = 0;
        let totalWeightedShrink = 0;
        let totalBaseSize = 0;

        each($items, (_, item) => {
            const $item = $(item);

            $item.css({
                display: "inline-block",
                verticalAlign: "top"
            });

            $item[FALLBACK_MAIN_SIZE_MAP[direction]]("auto");

            $item.removeClass(FALLBACK_BOX_ITEM);

            const itemData = $item.data(BOX_ITEM_DATA_KEY);
            const ratio = itemData.ratio || 0;
            const size = this._baseSize($item);
            const shrink = isDefined(itemData.shrink) ? itemData.shrink : SHRINK;

            totalRatio += ratio;
            totalWeightedShrink += shrink * size;
            totalBaseSize += size;
        });

        const freeSpaceSize = this._boxSize() - totalBaseSize;
        const itemSize = $item => {
            const itemData = $item.data(BOX_ITEM_DATA_KEY),
                size = this._baseSize($item),
                factor = (freeSpaceSize >= 0) ? itemData.ratio || 0 : (isDefined(itemData.shrink) ? itemData.shrink : SHRINK) * size,
                totalFactor = (freeSpaceSize >= 0) ? totalRatio : totalWeightedShrink,
                shift = totalFactor ? Math.round(freeSpaceSize * factor / totalFactor) : 0;

            return size + shift;
        };

        let totalItemSize = 0;
        each($items, (_, item) => {
            const $item = $(item);
            const itemData = $(item).data(BOX_ITEM_DATA_KEY);
            const size = itemSize($item);

            totalItemSize += size;

            $item
                .css(MAXSIZE_MAP[direction], itemData.maxSize || "none")
                .css(MINSIZE_MAP[direction], itemData.minSize || "0")
                .css(FALLBACK_MAIN_SIZE_MAP[direction], size);

            $item.addClass(FALLBACK_BOX_ITEM);
        });

        this.totalItemSize = totalItemSize;
    }

    _baseSize(item) {
        const itemData = $(item).data(BOX_ITEM_DATA_KEY);
        return itemData.baseSize == null ? 0 : (itemData.baseSize === "auto" ? this._contentSize(item) : this._parseSize(itemData.baseSize));
    }

    _contentSize(item) {
        return $(item)[FALLBACK_MAIN_SIZE_MAP[this._option("direction")]]();
    }

    _parseSize(size) {
        return String(size).match(/.+%$/) ? 0.01 * parseFloat(size) * this._boxSizeValue : size;
    }

    _boxSize(value) {
        if(!arguments.length) {
            this._boxSizeValue = this._boxSizeValue || this._totalBaseSize();
            return this._boxSizeValue;
        }

        this._boxSizeValue = value;
    }

    _totalBaseSize() {
        let result = 0;
        each(this._$items, (_, item) => {
            result += this._baseSize(item);
        });

        return result;
    }

    initSize() {
        this._boxSize(this._$element[FALLBACK_MAIN_SIZE_MAP[this._option("direction")]]());
    }

    update() {
        if(!this._$items || this._$element.is(":hidden")) {
            return;
        }

        this._$items.detach();
        this.initSize();
        this._$element.append(this._$items);

        this.renderItems(this._$items);
        this.renderAlign();
        this.renderCrossAlign();

        const element = this._$element.get(0);

        this._$items.find(BOX_SELECTOR).each(function() {
            if(element === $(this).parent().closest(BOX_SELECTOR).get(0)) {
                eventsEngine.triggerHandler(this, UPDATE_EVENT);
            }
        });
    }
}

/**
* @name dxBox
* @inherits CollectionWidget
* @module ui/box
* @export default
*/
class Box extends CollectionWidget {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxBoxOptions.direction
            * @type Enums.BoxDirection
            * @default 'row'
            */
            direction: "row",

            /**
            * @name dxBoxOptions.align
            * @type Enums.BoxAlign
            * @default 'start'
            */
            align: "start",

            /**
            * @name dxBoxOptions.crossAlign
            * @type Enums.BoxCrossAlign
            * @default 'start'
            */
            crossAlign: "stretch",

            /**
            * @name dxBoxOptions.activeStateEnabled
            * @hidden
            */
            activeStateEnabled: false,

            /**
            * @name dxBoxOptions.focusStateEnabled
            * @hidden
            */
            focusStateEnabled: false,

            onItemStateChanged: undefined,

            _layoutStrategy: "flex",

            _queue: undefined

            /**
            * @name dxBoxOptions.hint
            * @hidden
            */
            /**
            * @name dxBoxOptions.noDataText
            * @hidden
            */
            /**
            * @name dxBoxOptions.onSelectionChanged
            * @action
            * @hidden
            */
            /**
            * @name dxBoxOptions.selectedIndex
            * @hidden
            */
            /**
            * @name dxBoxOptions.selectedItem
            * @hidden
            */
            /**
            * @name dxBoxOptions.selectedItems
            * @hidden
            */
            /**
            * @name dxBoxOptions.selectedItemKeys
            * @hidden
            */
            /**
            * @name dxBoxOptions.keyExpr
            * @hidden
            */
            /**
            * @name dxBoxOptions.tabIndex
            * @hidden
            */
            /**
            * @name dxBoxOptions.accessKey
            * @hidden
            */

            /**
             * @name dxBoxOptions.dataSource
             * @type string|Array<string,dxBoxItem,object>|DataSource|DataSourceOptions
             * @default null
             */

            /**
             * @name dxBoxOptions.items
             * @type Array<string, dxBoxItem, object>
             * @fires dxBoxOptions.onOptionChanged
             */
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device: function() {
                    return browser["msie"];
                },
                options: {
                    _layoutStrategy: "fallback"
                }
            }
        ]);
    }

    _itemClass() {
        return BOX_ITEM_CLASS;
    }

    _itemDataKey() {
        return BOX_ITEM_DATA_KEY;
    }

    _itemElements() {
        return this._itemContainer().children(this._itemSelector());
    }

    _init() {
        super._init();
        this.$element().addClass(`${BOX_CLASS}-${this.option("_layoutStrategy")}`);
        this._initLayout();
        this._initBoxQueue();
    }

    _initLayout() {
        this._layout = (this.option("_layoutStrategy") === "fallback") ?
            new FallbackLayoutStrategy(this.$element(), this.option.bind(this)) :
            new FlexLayoutStrategy(this.$element(), this.option.bind(this));
    }

    _initBoxQueue() {
        this._queue = this.option("_queue") || [];
    }

    _queueIsNotEmpty() {
        return this.option("_queue") ? false : !!this._queue.length;
    }

    _pushItemToQueue($item, config) {
        this._queue.push({ $item: $item, config: config });
    }

    _shiftItemFromQueue() {
        return this._queue.shift();
    }

    _initMarkup() {
        this.$element().addClass(BOX_CLASS);
        this._layout.renderBox();
        super._initMarkup();
        this._renderAlign();
        this._renderActions();
    }

    _renderActions() {
        this._onItemStateChanged = this._createActionByOption("onItemStateChanged");
    }

    _renderAlign() {
        this._layout.renderAlign();
        this._layout.renderCrossAlign();
    }

    _renderItems(items) {
        this._layout.initSize();
        super._renderItems(items);

        while(this._queueIsNotEmpty()) {
            const item = this._shiftItemFromQueue();
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

        this._updateTimer = setTimeout(() => {
            if(!this._isUpdated) {
                this._layout.update();
            }
            this._isUpdated = false;
            this._updateTimer = null;
        });
    }

    _renderItemContent(args) {
        const $itemNode = args.itemData && args.itemData.node;
        if($itemNode) {
            return this._renderItemContentByNode(args, $itemNode);
        }

        return super._renderItemContent(args);
    }

    _postprocessRenderItem(args) {
        const boxConfig = args.itemData.box;
        if(!boxConfig) {
            return;
        }

        this._pushItemToQueue(args.itemContent, boxConfig);
    }

    _createItemByTemplate(itemTemplate, args) {
        if(args.itemData.box) {
            return itemTemplate.source ? itemTemplate.source() : $();
        }
        return super._createItemByTemplate(itemTemplate, args);
    }

    _visibilityChanged(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    }

    _dimensionChanged() {
        if(this._updateTimer) {
            return;
        }

        this._isUpdated = true;
        this._layout.update();
    }

    _dispose() {
        clearTimeout(this._updateTimer);
        super._dispose.apply(this, arguments);
    }

    _itemOptionChanged(item, property, value, oldValue) {
        if(property === "visible") {
            this._onItemStateChanged({
                name: property,
                state: value,
                oldState: oldValue !== false
            });
        }
        super._itemOptionChanged(item, property, value);
    }

    _optionChanged(args) {
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
                super._optionChanged(args);
        }
    }

    _itemOptions() {
        const options = super._itemOptions();

        options.fireItemStateChangedAction = e => {
            this._onItemStateChanged(e);
        };

        return options;
    }

    repaint() {
        this._dimensionChanged();
    }

    /**
    * @name dxBoxMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxBoxMethods.focus
    * @publicName focus()
    * @hidden
    */
}
/**
* @name dxBoxItem
* @inherits CollectionWidgetItem
* @type object
*/
/**
* @name dxBoxItem.ratio
* @type number
* @default 0
*/
/**
* @name dxBoxItem.baseSize
* @type number | Enums.Mode
* @default 0
*/
/**
* @name dxBoxItem.shrink
* @type number
* @default 1
*/
/**
* @name dxBoxItem.box
* @type dxBoxOptions
* @default undefined
*/


Box.ItemClass = BoxItem;

registerComponent("dxBox", Box);

module.exports = Box;
