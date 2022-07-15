import { getWidth, getHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { isMaterial, waitWebFont } from '../themes';
import { deferRender } from '../../core/utils/common';
import { isPlainObject, isDefined } from '../../core/utils/type';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import AsyncCollectionWidget from '../collection/ui.collection_widget.async';
import { BindableTemplate } from '../../core/templates/bindable_template';
import fx from '../../animation/fx';
import { toggleItemFocusableElementTabIndex } from './ui.toolbar.utils';

import { TOOLBAR_CLASS } from './constants';
import { MultiLineStrategy } from './strategy/toolbar.multiline';
import { SingleLineStrategy } from './strategy/toolbar.singleLine';

// STYLE toolbar

const TOOLBAR_MINI_CLASS = 'dx-toolbar-mini';
const TOOLBAR_ITEM_CLASS = 'dx-toolbar-item';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_BUTTON_CLASS = 'dx-toolbar-button';
const TOOLBAR_ITEMS_CONTAINER_CLASS = 'dx-toolbar-items-container';
const TOOLBAR_GROUP_CLASS = 'dx-toolbar-group';
const TOOLBAR_AUTO_HIDE_ITEM_CLASS = 'dx-toolbar-item-auto-hide';
const TOOLBAR_AUTO_HIDE_TEXT_CLASS = 'dx-toolbar-text-auto-hide';
const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';


const TEXT_BUTTON_MODE = 'text';

const DEFAULT_BUTTON_TYPE = 'default';
const DEFAULT_DROPDOWNBUTTON_STYLING_MODE = 'contained';

const TOOLBAR_ITEM_DATA_KEY = 'dxToolbarItemDataKey';

class Toolbar extends AsyncCollectionWidget {
    _getSynchronizableOptionsForCreateComponent() {
        return super._getSynchronizableOptionsForCreateComponent().filter(item => item !== 'disabled');
    }

    _initTemplates() {
        super._initTemplates();
        const template = new BindableTemplate(function($container, data, rawModel) {
            if(isPlainObject(data)) {
                const { text, html, widget } = data;

                if(text) {
                    $container.text(text).wrapInner('<div>');
                }

                if(html) {
                    $container.html(html);
                }

                if(widget === 'dxDropDownButton') {
                    data.options = data.options || {};

                    if(!isDefined(data.options.stylingMode)) {
                        data.options.stylingMode = this.option('useFlatButtons') ? TEXT_BUTTON_MODE : DEFAULT_DROPDOWNBUTTON_STYLING_MODE;
                    }
                }

                if(widget === 'dxButton') {
                    if(this.option('useFlatButtons')) {
                        data.options = data.options || {};
                        data.options.stylingMode = data.options.stylingMode || TEXT_BUTTON_MODE;
                    }

                    if(this.option('useDefaultButtons')) {
                        data.options = data.options || {};
                        data.options.type = data.options.type || DEFAULT_BUTTON_TYPE;
                    }
                }
            } else {
                $container.text(String(data));
            }

            this._getTemplate('dx-polymorph-widget').render({
                container: $container,
                model: rawModel,
                parent: this
            });
        }.bind(this), ['text', 'html', 'widget', 'options'], this.option('integrationOptions.watchMethod'));

        this._templateManager.addDefaultTemplates({
            item: template,
            menuItem: template,
        });
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            renderAs: 'topToolbar',
            grouped: false,
            useFlatButtons: false,
            useDefaultButtons: false,
            multiline: false,
            menuItemTemplate: 'menuItem',
            menuContainer: undefined,
            overflowMenuVisible: false,

            /**
            * @name dxToolbarOptions.selectedIndex
            * @type number
            * @default -1
            * @hidden
            */

            /**
            * @name dxToolbarOptions.activeStateEnabled
            * @hidden
            */

            /**
            * @name dxToolbarOptions.focusStateEnabled
            * @hidden
            */

            /**
            * @name dxToolbarOptions.accessKey
            * @hidden
            */

            /**
            * @name dxToolbarOptions.tabIndex
            * @hidden
            */

            /**
            * @name dxToolbarOptions.selectedItems
            * @hidden
            */

            /**
            * @name dxToolbarOptions.selectedItemKeys
            * @hidden
            */

            /**
            * @name dxToolbarOptions.keyExpr
            * @hidden
            */

            /**
            * @name dxToolbarOptions.selectedItem
            * @hidden
            */

            /**
            * @name dxToolbarOptions.onSelectionChanged
            * @action
            * @hidden
            */
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device: function() {
                    return isMaterial();
                },
                options: {
                    useFlatButtons: true
                }
            }
        ]);
    }

    _itemContainer() {
        return this._layoutStrategy._itemContainer();
    }

    _itemClass() {
        return TOOLBAR_ITEM_CLASS;
    }

    _itemDataKey() {
        return TOOLBAR_ITEM_DATA_KEY;
    }

    _initMarkup() {
        this._renderToolbar();
        this._renderLayoutStrategy();

        super._initMarkup();

        this._updateFocusableItemsTabIndex();
        this._renderOverflowMenu();
    }

    _renderToolbar() {
        this.$element()
            .addClass(TOOLBAR_CLASS);

        this._$itemsContainer = $('<div>')
            .addClass(TOOLBAR_ITEMS_CONTAINER_CLASS)
            .appendTo(this.$element());

        this.setAria('role', 'toolbar');
    }

    _renderLayoutStrategy() {
        this._createLayoutStrategy();
    }

    _createLayoutStrategy() {
        this._layoutStrategy = this.option('multiline')
            ? new MultiLineStrategy(this)
            : new SingleLineStrategy(this);
    }

    _renderOverflowMenu() {
        this._layoutStrategy._renderOverflowMenu?.();
    }

    _render() {
        super._render();

        this._renderItemsAsync();

        this._updateDimensionsInMaterial();
    }

    _postProcessRenderItems() {
        this._layoutStrategy._hideOverflowItems?.();
        this._layoutStrategy._updateMenuVisibility?.();

        this._layoutStrategy._arrangeItems?.();

        deferRender(() => {
            this._layoutStrategy.renderMenuItems?.();
        });
    }

    _renderItem(index, item, itemContainer, $after) {
        const location = item.location || 'center';
        const container = itemContainer || this['_$' + location + 'Section'];
        const itemHasText = !!(item.text || item.html);
        const itemElement = super._renderItem(index, item, container, $after);

        itemElement
            .toggleClass(TOOLBAR_BUTTON_CLASS, !itemHasText)
            .toggleClass(TOOLBAR_LABEL_CLASS, itemHasText)
            .addClass(item.cssClass);

        if(item.locateInMenu === 'auto') {
            itemElement.addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
        }

        if(item.widget === 'dxButton' && item.showText === 'inMenu') {
            itemElement.toggleClass(TOOLBAR_AUTO_HIDE_TEXT_CLASS);
        }

        return itemElement;
    }

    _renderGroupedItems() {
        const that = this;

        each(this.option('items'), function(groupIndex, group) {
            const groupItems = group.items;
            const $container = $('<div>').addClass(TOOLBAR_GROUP_CLASS);
            const location = group.location || 'center';

            if(!groupItems || !groupItems.length) {
                return;
            }

            each(groupItems, function(itemIndex, item) {
                that._renderItem(itemIndex, item, $container, null);
            });

            that._$itemsContainer.find('.dx-toolbar-' + location).append($container);
        });
    }

    _renderItems(items) {
        const grouped = this.option('grouped') && items.length && items[0].items;
        grouped ? this._renderGroupedItems() : super._renderItems(items);
    }

    _getToolbarItems() {
        return this._layoutStrategy._getItems();
    }

    _renderContentImpl() {
        const items = this._getToolbarItems();

        this.$element().toggleClass(TOOLBAR_MINI_CLASS, items.length === 0);

        if(this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount));
        } else {
            this._renderItems(items);
        }

        this._layoutStrategy._applyCompactMode();
    }

    _renderEmptyMessage() {}

    _clean() {
        this._$itemsContainer.children().empty();
        this.$element().empty();
    }

    _visibilityChanged(visible) {
        if(visible) {
            this._layoutStrategy._arrangeItems?.();
        }
    }

    _isVisible() {
        return getWidth(this.$element()) > 0 && getHeight(this.$element()) > 0;
    }

    _getIndexByItem(item) {
        return this._getToolbarItems().indexOf(item);
    }

    _isToolbarItem(itemData) {
        return itemData.location === undefined || itemData.locateInMenu === 'never';
    }

    _updateFocusableItemsTabIndex() {
        this._getToolbarItems().forEach(item => toggleItemFocusableElementTabIndex(this, item));
    }

    _itemOptionChanged(item, property, value) {
        if(this._layoutStrategy._isMenuItem(item)) {
            if(property === 'disabled' || property === 'options.disabled') {
                this._layoutStrategy._dropDownMenu?._itemOptionChanged(item, property, value);
            } else {
                this._layoutStrategy.renderMenuItems();
            }
        } else if(this._isToolbarItem(item)) {
            super._itemOptionChanged.apply(this, [item, property, value]);
            this._layoutStrategy._arrangeItems();
        } else {
            super._itemOptionChanged.apply(this, [item, property, value]);
            this._layoutStrategy._arrangeItems();
            this._layoutStrategy.renderMenuItems(); // TODO
        }

        if(property === 'disabled' || property === 'options.disabled') {
            toggleItemFocusableElementTabIndex(this, item);
        }

        if(property === 'location') {
            this.repaint();
        }
    }

    _optionChanged({ name, value }) {
        this._layoutStrategy._optionChanged?.(name, value);

        switch(name) {
            case 'width':
                super._optionChanged.apply(this, arguments);
                this._dimensionChanged();
                break;
            case 'multiline':
                this.$element().toggleClass(TOOLBAR_MULTILINE_CLASS, value);
                break;
            case 'renderAs':
            case 'useFlatButtons':
            case 'useDefaultButtons':
                this._invalidate();
                break;
            case 'grouped':
                break;
            case 'disabled':
                super._optionChanged.apply(this, arguments);

                this._updateFocusableItemsTabIndex();
                break;
            case 'overflowMenuVisible':
                break;
            case 'onItemClick':
                super._optionChanged.apply(this, arguments);
                break;
            case 'menuContainer':
                break;
            case 'menuItemTemplate':
                break;
            default:
                super._optionChanged.apply(this, arguments);
        }
    }

    _dimensionChanged(dimension) {
        if(dimension === 'height') {
            return;
        }

        this._layoutStrategy._arrangeItems?.();
        this._layoutStrategy._applyCompactMode?.();

        this._layoutStrategy.renderMenuItems?.();
    }

    _dispose() {
        super._dispose();
        clearTimeout(this._waitParentAnimationTimeout);
    }

    _updateDimensionsInMaterial() {
        if(isMaterial()) {
            const _waitParentAnimationFinished = () => {
                const $element = this.$element();
                const timeout = 15;
                return new Promise(resolve => {
                    const check = () => {
                        let readyToResolve = true;
                        $element.parents().each((_, parent) => {
                            if(fx.isAnimating($(parent))) {
                                readyToResolve = false;
                                return false;
                            }
                        });
                        if(readyToResolve) {
                            resolve();
                        }
                        return readyToResolve;
                    };
                    const runCheck = () => {
                        clearTimeout(this._waitParentAnimationTimeout);
                        this._waitParentAnimationTimeout = setTimeout(() => check() || runCheck(), timeout);
                    };
                    runCheck();
                });
            };

            const _checkWebFontForLabelsLoaded = () => {
                const $element = this.$element();
                const $labels = $element.find(`.${TOOLBAR_LABEL_CLASS}`);
                const promises = [];
                $labels.each((_, label) => {
                    const text = $(label).text();
                    const fontWeight = $(label).css('fontWeight');
                    promises.push(waitWebFont(text, fontWeight));
                });
                return Promise.all(promises);
            };

            Promise.all([
                _waitParentAnimationFinished(),
                _checkWebFontForLabelsLoaded(),
            ]).then(() => { this._dimensionChanged(); });
        }
    }

    updateDimensions() {
        this._dimensionChanged();
    }

    /**
     * @name dxToolbar.registerKeyHandler
     * @publicName registerKeyHandler(key, handler)
     * @hidden
    */

    /**
     * @name dxToolbar.focus
     * @publicName focus()
     * @hidden
    */
}

registerComponent('dxToolbar', Toolbar);

export default Toolbar;

/**
 * @name dxToolbarItem
 * @inherits CollectionWidgetItem
 * @type object
 */

