import $ from '../core/renderer';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { hasWindow } from '../core/utils/window';
import { dasherize } from '../core/utils/inflector';
import { isDefined } from '../core/utils/type';
import { normalizeStyleProp, styleProp, stylePropPrefix, setStyle } from '../core/utils/style';
import { each } from '../core/utils/iterator';
import CollectionWidgetItem from './collection/item';
import CollectionWidget from './collection/ui.collection_widget.edit';

// STYLE box

const BOX_CLASS = 'dx-box';
const BOX_FLEX_CLASS = 'dx-box-flex';
const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_DATA_KEY = 'dxBoxItemData';

const SHRINK = 1;
const MINSIZE_MAP = {
    'row': 'minWidth',
    'col': 'minHeight'
};
const MAXSIZE_MAP = {
    'row': 'maxWidth',
    'col': 'maxHeight'
};
const FLEX_JUSTIFY_CONTENT_MAP = {
    'start': 'flex-start',
    'end': 'flex-end',
    'center': 'center',
    'space-between': 'space-between',
    'space-around': 'space-around'
};
const FLEX_ALIGN_ITEMS_MAP = {
    'start': 'flex-start',
    'end': 'flex-end',
    'center': 'center',
    'stretch': 'stretch'
};
const FLEX_DIRECTION_MAP = {
    'row': 'row',
    'col': 'column'
};

const setFlexProp = (element, prop, value) => {
    // NOTE: workaround for jQuery version < 1.11.1 (T181692)
    value = normalizeStyleProp(prop, value);
    element.style[styleProp(prop)] = value;

    // NOTE: workaround for Domino issue https://github.com/fgnass/domino/issues/119
    if(!hasWindow()) {
        if(value === '' || !isDefined(value)) {
            return;
        }

        const cssName = dasherize(prop);
        const styleExpr = cssName + ': ' + value + ';';

        setStyle(element, styleExpr);
    }
};

class BoxItem extends CollectionWidgetItem {
    _renderVisible(value, oldValue) {
        super._renderVisible(value);
        if(isDefined(oldValue)) {
            this._options.fireItemStateChangedAction({
                name: 'visible',
                state: value,
                oldState: oldValue
            });
        }
    }
}

class LayoutStrategy {
    constructor($element, option) {
        this._$element = $element;
        this._option = option;
    }

    renderBox() {
        this._$element.css({
            display: stylePropPrefix('flexDirection') + 'flex'
        });
        setFlexProp(this._$element.get(0), 'flexDirection', FLEX_DIRECTION_MAP[this._option('direction')]);
    }

    renderAlign() {
        this._$element.css({
            justifyContent: this._normalizedAlign()
        });
    }

    _normalizedAlign() {
        const align = this._option('align');
        return (align in FLEX_JUSTIFY_CONTENT_MAP) ? FLEX_JUSTIFY_CONTENT_MAP[align] : align;
    }

    renderCrossAlign() {
        this._$element.css({
            alignItems: this._normalizedCrossAlign()
        });
    }

    _normalizedCrossAlign() {
        const crossAlign = this._option('crossAlign');
        return (crossAlign in FLEX_ALIGN_ITEMS_MAP) ? FLEX_ALIGN_ITEMS_MAP[crossAlign] : crossAlign;
    }

    renderItems($items) {
        const flexPropPrefix = stylePropPrefix('flexDirection');
        const direction = this._option('direction');

        each($items, function() {
            const $item = $(this);
            const item = $item.data(BOX_ITEM_DATA_KEY);

            $item.css({ display: flexPropPrefix + 'flex' })
                .css(MAXSIZE_MAP[direction], item.maxSize || 'none')
                .css(MINSIZE_MAP[direction], item.minSize || '0');

            setFlexProp($item.get(0), 'flexBasis', item.baseSize || 0);
            setFlexProp($item.get(0), 'flexGrow', item.ratio);
            setFlexProp($item.get(0), 'flexShrink', isDefined(item.shrink) ? item.shrink : SHRINK);

            $item.children().each((_, itemContent) => {
                $(itemContent).css({
                    width: 'auto',
                    height: 'auto',
                    display: stylePropPrefix('flexDirection') + 'flex',
                    flexBasis: 0
                });

                setFlexProp(itemContent, 'flexGrow', 1);
                setFlexProp(itemContent, 'flexDirection', $(itemContent)[0].style.flexDirection || 'column');
            });
        });
    }
}

class Box extends CollectionWidget {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            direction: 'row',

            align: 'start',

            crossAlign: 'stretch',

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
        });
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
        this.$element().addClass(BOX_FLEX_CLASS);
        this._initLayout();
        this._initBoxQueue();
    }

    _initLayout() {
        this._layout = new LayoutStrategy(this.$element(), this.option.bind(this));
    }

    _initBoxQueue() {
        this._queue = this.option('_queue') || [];
    }

    _queueIsNotEmpty() {
        return this.option('_queue') ? false : !!this._queue.length;
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
        this._onItemStateChanged = this._createActionByOption('onItemStateChanged');
    }

    _renderAlign() {
        this._layout.renderAlign();
        this._layout.renderCrossAlign();
    }

    _renderItems(items) {
        super._renderItems(items);

        while(this._queueIsNotEmpty()) {
            const item = this._shiftItemFromQueue();
            this._createComponent(item.$item, Box, extend({
                itemTemplate: this.option('itemTemplate'),
                itemHoldTimeout: this.option('itemHoldTimeout'),
                onItemHold: this.option('onItemHold'),
                onItemClick: this.option('onItemClick'),
                onItemContextMenu: this.option('onItemContextMenu'),
                onItemRendered: this.option('onItemRendered'),
                _queue: this._queue
            }, item.config));
        }

        this._layout.renderItems(this._itemElements());
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

    _itemOptionChanged(item, property, value, oldValue) {
        if(property === 'visible') {
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
            case '_queue':
            case 'direction':
                this._invalidate();
                break;
            case 'align':
                this._layout.renderAlign();
                break;
            case 'crossAlign':
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

    /**
    * @name dxBox.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxBox.focus
    * @publicName focus()
    * @hidden
    */
}

Box.ItemClass = BoxItem;

registerComponent('dxBox', Box);

export default Box;

/**
 * @name dxBoxItem
 * @inherits CollectionWidgetItem
 * @type object
 */
