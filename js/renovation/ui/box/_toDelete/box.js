import $ from '../core/renderer';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { noop } from '../core/utils/common';
import { hasWindow } from '../core/utils/window';
import { dasherize } from '../core/utils/inflector';
import { isDefined } from '../core/utils/type';
import { normalizeStyleProp, styleProp, stylePropPrefix } from '../core/utils/style';
import { each } from '../core/utils/iterator';
import browser from '../core/utils/browser';
import CollectionWidgetItem from './collection/item';
import CollectionWidget from './collection/ui.collection_widget.edit';

// STYLE box

const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_DATA_KEY = 'dxBoxItemData';

const MINSIZE_MAP = {
    'row': 'minWidth',
    'col': 'minHeight'
};
const MAXSIZE_MAP = {
    'row': 'maxWidth',
    'col': 'maxHeight'
};
const SHRINK = 1;

// NEW FLEXBOX STRATEGY

// FALLBACK STRATEGY FOR IE
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

        if(!element.attributes.style) {
            element.setAttribute('style', styleExpr);
        } else if(element.attributes.style.value.indexOf(styleExpr) < 0) {
            element.attributes.style.value += ' ' + styleExpr;
        }
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

class FlexLayoutStrategy {
    constructor($element, option) {
        this._$element = $element;
        this._option = option;
        this.initSize = noop;
        this.update = noop;
    }

    renderBox() {

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

            _layoutStrategy: 'flex',

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

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device: function() {
                    return browser['msie'];
                },
                options: {
                    _layoutStrategy: 'fallback'
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
        this._initLayout();
        this._initBoxQueue();
    }

    _initLayout() {
        this._layout = new FlexLayoutStrategy(this.$element(), this.option.bind(this));
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
        this._layout.renderBox();
        super._initMarkup();
        this._renderActions();
    }

    _renderActions() {
        this._onItemStateChanged = this._createActionByOption('onItemStateChanged');
    }

    _renderItems(items) {
        this._layout.initSize();
        super._renderItems(items);

        while(this._queueIsNotEmpty()) {
            const item = this._shiftItemFromQueue();
            this._createComponent(item.$item, Box, extend({
                _layoutStrategy: this.option('_layoutStrategy'),
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
            case '_layoutStrategy':
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

    repaint() {
        this._dimensionChanged();
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
