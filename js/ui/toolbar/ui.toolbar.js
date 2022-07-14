import { getWidth, getOuterWidth, getHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { isMaterial, waitWebFont } from '../themes';
import { grep, deferRender } from '../../core/utils/common';
import { isPlainObject, isDefined } from '../../core/utils/type';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { getBoundingRect } from '../../core/utils/position';
import AsyncCollectionWidget from '../collection/ui.collection_widget.async';
import { BindableTemplate } from '../../core/templates/bindable_template';
import fx from '../../animation/fx';
import ToolbarDropDownMenu from './ui.toolbar.drop_down_menu';
import { toggleItemFocusableElementTabIndex } from './ui.toolbar.utils';

import { TOOLBAR_CLASS } from './constants';

// STYLE toolbar

const TOOLBAR_BEFORE_CLASS = 'dx-toolbar-before';
const TOOLBAR_CENTER_CLASS = 'dx-toolbar-center';
const TOOLBAR_AFTER_CLASS = 'dx-toolbar-after';
const TOOLBAR_MINI_CLASS = 'dx-toolbar-mini';
const TOOLBAR_ITEM_CLASS = 'dx-toolbar-item';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_BUTTON_CLASS = 'dx-toolbar-button';
const TOOLBAR_ITEMS_CONTAINER_CLASS = 'dx-toolbar-items-container';
const TOOLBAR_GROUP_CLASS = 'dx-toolbar-group';
const TOOLBAR_COMPACT_CLASS = 'dx-toolbar-compact';
const TOOLBAR_AUTO_HIDE_ITEM_CLASS = 'dx-toolbar-item-auto-hide';
const TOOLBAR_AUTO_HIDE_TEXT_CLASS = 'dx-toolbar-text-auto-hide';
const TOOLBAR_HIDDEN_ITEM = 'dx-toolbar-item-invisible';
const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';
const TEXT_BUTTON_MODE = 'text';

const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

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
        return this._$toolbarItemsContainer.find([
            `.${TOOLBAR_BEFORE_CLASS}`,
            `.${TOOLBAR_CENTER_CLASS}`,
            `.${TOOLBAR_AFTER_CLASS}`,
        ].join(','));
    }

    _itemClass() {
        return TOOLBAR_ITEM_CLASS;
    }

    _itemDataKey() {
        return TOOLBAR_ITEM_DATA_KEY;
    }

    _buttonClass() {
        return TOOLBAR_BUTTON_CLASS;
    }

    _dimensionChanged(dimension) {
        if(dimension === 'height') {
            return;
        }

        this._arrangeItems();
        this._applyCompactMode();

        this._menu.renderMenuItems();
    }

    _initMarkup() {
        this._renderToolbar();
        this._renderSections();

        super._initMarkup();

        this.setAria('role', 'toolbar');

        this._updateFocusableItemsTabIndex();
        this._renderMenu();
    }

    _renderMenu() {
        this._renderMenuStrategy();
        deferRender(() => {
            this._menu.render();
        });
    }

    _renderMenuStrategy() {
        if(!this._menu) {
            this._menu = new ToolbarDropDownMenu(this);
        }
    }

    _waitParentAnimationFinished() {
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
    }

    _render() {
        super._render();
        this._renderItemsAsync();

        if(isMaterial()) {
            Promise.all([
                this._waitParentAnimationFinished(),
                this._checkWebFontForLabelsLoaded()
            ]).then(this._dimensionChanged.bind(this));
        }
    }

    _postProcessRenderItems() {
        this._hideOverflowItems();
        this._menu._updateMenuVisibility();

        this._arrangeItems();

        deferRender(() => {
            this._menu.renderMenuItems();
        });
    }

    _arrangeItems() {
        if(this.$element().is(':hidden')) {
            return;
        }

        this._$centerSection.css({
            margin: '0 auto',
            float: 'none'
        });

        each(this._restoreItems || [], function(_, obj) {
            $(obj.container).append(obj.item);
        });
        this._restoreItems = [];

        const elementWidth = getWidth(this.$element());

        this._hideOverflowItems(elementWidth);

        const beforeRect = getBoundingRect(this._$beforeSection.get(0));
        const afterRect = getBoundingRect(this._$afterSection.get(0));

        this._alignCenterSection(beforeRect, afterRect, elementWidth);

        const $label = this._$toolbarItemsContainer.find(`.${TOOLBAR_LABEL_CLASS}`).eq(0);
        const $section = $label.parent();

        if(!$label.length) {
            return;
        }

        const labelOffset = beforeRect.width ? beforeRect.width : $label.position().left;
        const widthBeforeSection = $section.hasClass(TOOLBAR_BEFORE_CLASS) ? 0 : labelOffset;
        const widthAfterSection = $section.hasClass(TOOLBAR_AFTER_CLASS) ? 0 : afterRect.width;
        let elemsAtSectionWidth = 0;

        $section.children().not(`.${TOOLBAR_LABEL_CLASS}`).each(function() {
            elemsAtSectionWidth += getOuterWidth(this);
        });

        const freeSpace = elementWidth - elemsAtSectionWidth;
        const sectionMaxWidth = Math.max(freeSpace - widthBeforeSection - widthAfterSection, 0);

        if($section.hasClass(TOOLBAR_BEFORE_CLASS)) {
            this._alignSection(this._$beforeSection, sectionMaxWidth);
        } else {
            const labelPaddings = getOuterWidth($label) - getWidth($label);
            $label.css('maxWidth', sectionMaxWidth - labelPaddings);
        }
    }

    _hideOverflowItems(elementWidth) {
        const overflowItems = this.$element().find(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}`);

        if(!overflowItems.length) {
            return;
        }

        elementWidth = elementWidth || getWidth(this.$element());
        $(overflowItems).removeClass(TOOLBAR_HIDDEN_ITEM);

        let itemsWidth = this._getItemsWidth();

        while(overflowItems.length && elementWidth < itemsWidth) {
            const $item = overflowItems.eq(-1);
            itemsWidth -= getOuterWidth($item);
            $item.addClass(TOOLBAR_HIDDEN_ITEM);
            overflowItems.splice(-1, 1);
        }
    }

    _getItemsWidth() {
        return this._getSummaryItemsWidth([this._$beforeSection, this._$centerSection, this._$afterSection]);
    }

    _renderToolbar() {
        this.$element()
            .addClass(TOOLBAR_CLASS)
            .toggleClass(TOOLBAR_MULTILINE_CLASS, this.option('multiline'));

        this._$toolbarItemsContainer = $('<div>')
            .addClass(TOOLBAR_ITEMS_CONTAINER_CLASS)
            .appendTo(this.$element());
    }

    _renderSections() {
        const $container = this._$toolbarItemsContainer;
        const that = this;
        each(['before', 'center', 'after'], function() {
            const sectionClass = 'dx-toolbar-' + this;
            let $section = $container.find(`.${sectionClass}`);

            if(!$section.length) {
                that['_$' + this + 'Section'] = $section = $('<div>')
                    .addClass(sectionClass)
                    .appendTo($container);
            }
        });
    }

    _checkWebFontForLabelsLoaded() {
        const $labels = this.$element().find(`.${TOOLBAR_LABEL_CLASS}`);
        const promises = [];
        $labels.each((_, label) => {
            const text = $(label).text();
            const fontWeight = $(label).css('fontWeight');
            promises.push(waitWebFont(text, fontWeight));
        });
        return Promise.all(promises);
    }

    _alignCenterSection(beforeRect, afterRect, elementWidth) {
        this._alignSection(this._$centerSection, elementWidth - beforeRect.width - afterRect.width);

        const isRTL = this.option('rtlEnabled');
        const leftRect = isRTL ? afterRect : beforeRect;
        const rightRect = isRTL ? beforeRect : afterRect;
        const centerRect = getBoundingRect(this._$centerSection.get(0));

        if(leftRect.right > centerRect.left || centerRect.right > rightRect.left) {
            this._$centerSection.css({
                marginLeft: leftRect.width,
                marginRight: rightRect.width,
                float: leftRect.width > rightRect.width ? 'none' : 'right'
            });
        }
    }

    _alignSection($section, maxWidth) {
        const $labels = $section.find(`.${TOOLBAR_LABEL_CLASS}`);
        let labels = $labels.toArray();

        maxWidth = maxWidth - this._getCurrentLabelsPaddings(labels);

        const currentWidth = this._getCurrentLabelsWidth(labels);
        const difference = Math.abs(currentWidth - maxWidth);

        if(maxWidth < currentWidth) {
            labels = labels.reverse();
            this._alignSectionLabels(labels, difference, false);
        } else {
            this._alignSectionLabels(labels, difference, true);
        }
    }

    _alignSectionLabels(labels, difference, expanding) {
        const getRealLabelWidth = function(label) { return getBoundingRect(label).width; };

        for(let i = 0; i < labels.length; i++) {
            const $label = $(labels[i]);
            const currentLabelWidth = Math.ceil(getRealLabelWidth(labels[i]));
            let labelMaxWidth;

            if(expanding) {
                $label.css('maxWidth', 'inherit');
            }

            const possibleLabelWidth = Math.ceil(expanding ? getRealLabelWidth(labels[i]) : currentLabelWidth);

            if(possibleLabelWidth < difference) {
                labelMaxWidth = expanding ? possibleLabelWidth : 0;
                difference = difference - possibleLabelWidth;
            } else {
                labelMaxWidth = expanding ? currentLabelWidth + difference : currentLabelWidth - difference;
                $label.css('maxWidth', labelMaxWidth);
                break;
            }

            $label.css('maxWidth', labelMaxWidth);
        }
    }

    _applyCompactMode() {
        const $element = this.$element();
        $element.removeClass(TOOLBAR_COMPACT_CLASS);

        if(this.option('compactMode') && this._getSummaryItemsWidth(this.itemElements(), true) > getWidth($element)) {
            $element.addClass(TOOLBAR_COMPACT_CLASS);
        }
    }

    _getCurrentLabelsWidth(labels) {
        let width = 0;

        labels.forEach(function(label, index) {
            width += getOuterWidth(label);
        });

        return width;
    }

    _getCurrentLabelsPaddings(labels) {
        let padding = 0;

        labels.forEach(function(label, index) {
            padding += (getOuterWidth(label) - getWidth(label));
        });

        return padding;
    }

    _renderItem(index, item, itemContainer, $after) {
        const location = item.location || 'center';
        const container = itemContainer || this['_$' + location + 'Section'];
        const itemHasText = !!(item.text || item.html);
        const itemElement = super._renderItem(index, item, container, $after);

        itemElement
            .toggleClass(this._buttonClass(), !itemHasText)
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

            that._$toolbarItemsContainer.find('.dx-toolbar-' + location).append($container);
        });
    }

    _renderItems(items) {
        const grouped = this.option('grouped') && items.length && items[0].items;
        grouped ? this._renderGroupedItems() : super._renderItems(items);
    }

    _getToolbarItems() {
        return grep(this.option('items') || [], (item) => {
            return !this._isMenuItem(item);
        });
    }

    _getMenuItems() {
        const that = this;
        const menuItems = grep(this.option('items') || [], function(item) {
            return that._isMenuItem(item);
        });

        const $hiddenItems = this._itemContainer()
            .children(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}.${TOOLBAR_HIDDEN_ITEM}`)
            .not(`.${INVISIBLE_STATE_CLASS}`);
        this._restoreItems = this._restoreItems || [];

        const overflowItems = [].slice.call($hiddenItems).map((item) => {
            const itemData = that._getItemData(item);
            const $itemContainer = $(item).children();
            const $itemMarkup = $itemContainer.children();

            return extend({
                menuItemTemplate: function() {
                    that._restoreItems.push({
                        container: $itemContainer,
                        item: $itemMarkup
                    });

                    const $container = $('<div>').addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
                    return $container.append($itemMarkup);
                }
            }, itemData);
        });

        return [...overflowItems, ...menuItems];
    }

    _renderContentImpl() {
        const items = this._getToolbarItems();

        this.$element().toggleClass(TOOLBAR_MINI_CLASS, items.length === 0);

        if(this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount));
        } else {
            this._renderItems(items);
        }

        this._applyCompactMode();
    }

    _renderEmptyMessage() {}

    _clean() {
        this._$toolbarItemsContainer.children().empty();
        this.$element().empty();
    }

    _visibilityChanged(visible) {
        if(visible) {
            this._arrangeItems();
        }
    }

    _isVisible() {
        return getWidth(this.$element()) > 0 && getHeight(this.$element()) > 0;
    }

    _getIndexByItem(item) {
        return this._getToolbarItems().indexOf(item);
    }

    _isMenuItem(itemData) {
        return itemData.location === 'menu' || itemData.locateInMenu === 'always';
    }

    _isToolbarItem(itemData) {
        return itemData.location === undefined || itemData.locateInMenu === 'never';
    }

    _updateFocusableItemsTabIndex() {
        this._getToolbarItems().forEach(item => toggleItemFocusableElementTabIndex(this, item));
    }

    _itemOptionChanged(item, property, value) {
        if(this._isMenuItem(item)) {
            this._menu.itemOption(item, property, value);
        } else if(this._isToolbarItem(item)) {
            super._itemOptionChanged.apply(this, [item, property, value]);
            this._arrangeItems();
        } else {
            super._itemOptionChanged.apply(this, [item, property, value]);
            this._arrangeItems();
            this._menu.renderMenuItems();
        }

        if(property === 'disabled' || property === 'options.disabled') {
            toggleItemFocusableElementTabIndex(this, item);
        }

        if(property === 'location') {
            this.repaint();
        }
    }

    _optionChanged({ name, value }) {
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
            case 'compactMode':
                this._applyCompactMode();
                break;
            case 'grouped':
                break;
            case 'disabled':
                this._changeMenuOption('disabled', value);
                super._optionChanged.apply(this, arguments);

                this._updateFocusableItemsTabIndex();
                break;
            case 'overflowMenuVisible':
                this._changeMenuOption('opened', value);
                break;
            case 'onItemClick':
                this._changeMenuOption(name, value);
                super._optionChanged.apply(this, arguments);
                break;
            case 'menuContainer':
                this._changeMenuOption('container', value);
                break;
            case 'menuItemTemplate':
                this._changeMenuOption('itemTemplate', this._getTemplate(value));
                break;
            default:
                super._optionChanged.apply(this, arguments);
        }
    }

    _changeMenuOption(name, value) {
        this._menu.widgetOption(name, value);
    }

    _dispose() {
        super._dispose();
        clearTimeout(this._waitParentAnimationTimeout);
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

