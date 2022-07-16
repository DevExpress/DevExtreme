import { getWidth, getOuterWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import { grep, deferRender } from '../../core/utils/common';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import ToolbarDropDownMenu from './ui.toolbar.drop_down_menu';
import ToolbarBase from './ui.toolbar.base';
import { ChildDefaultTemplate } from '../../core/templates/child_default_template';
import { toggleItemFocusableElementTabIndex } from './ui.toolbar.utils';

// STYLE toolbar

const TOOLBAR_AUTO_HIDE_ITEM_CLASS = 'dx-toolbar-item-auto-hide';
const TOOLBAR_AUTO_HIDE_TEXT_CLASS = 'dx-toolbar-text-auto-hide';
const TOOLBAR_HIDDEN_ITEM = 'dx-toolbar-item-invisible';


class Toolbar extends ToolbarBase {

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {

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
            * @name dxToolbarOptions.height
            * @hidden
            */

            /**
            * @name dxToolbarOptions.onSelectionChanged
            * @action
            * @hidden
            */
        });

    }

    updateDimensions() {
        this._dimensionChanged();
    }

    _dimensionChanged(dimension) {
        if(dimension === 'height') {
            return;
        }

        super._dimensionChanged();
        this._menu.renderMenuItems();
    }

    _initTemplates() {
        super._initTemplates();
        this._templateManager.addDefaultTemplates({
            actionSheetItem: new ChildDefaultTemplate('item')
        });
    }

    _initMarkup() {
        super._initMarkup();

        this._updateFocusableItemsTabIndex();
        this._renderMenu();
    }

    _postProcessRenderItems() {
        this._hideOverflowItems();
        this._menu._updateMenuVisibility();

        super._postProcessRenderItems();

        deferRender(() => {
            this._menu.renderMenuItems();
        });
    }

    _renderItem(index, item, itemContainer, $after) {
        const itemElement = super._renderItem(index, item, itemContainer, $after);

        if(item.locateInMenu === 'auto') {
            itemElement.addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
        }

        if(item.widget === 'dxButton' && item.showText === 'inMenu') {
            itemElement.toggleClass(TOOLBAR_AUTO_HIDE_TEXT_CLASS);
        }

        return itemElement;
    }

    _getItemsWidth() {
        return this._getSummaryItemsWidth([this._$beforeSection, this._$centerSection, this._$afterSection]);
    }

    _hideOverflowItems(elementWidth) {
        const overflowItems = this.$element().find(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}`);

        if(!overflowItems.length) {
            return;
        }

        elementWidth = elementWidth ?? getWidth(this.$element());
        $(overflowItems).removeClass(TOOLBAR_HIDDEN_ITEM);

        let itemsWidth = this._getItemsWidth();

        while(overflowItems.length && elementWidth < itemsWidth) {
            const $item = overflowItems.eq(-1);
            itemsWidth -= getOuterWidth($item);
            $item.addClass(TOOLBAR_HIDDEN_ITEM);
            overflowItems.splice(-1, 1);
        }
    }

    _getMenuItems() {
        const menuItems = grep(this.option('items') ?? [], (item) => {
            return this._isMenuItem(item);
        });

        const $hiddenItems = this._itemContainer()
            .children(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}.${TOOLBAR_HIDDEN_ITEM}`)
            .not('.dx-state-invisible');

        this._restoreItems = this._restoreItems ?? [];

        const overflowItems = [].slice.call($hiddenItems).map((item) => {
            const itemData = this._getItemData(item);
            const $itemContainer = $(item).children();
            const $itemMarkup = $itemContainer.children();

            return extend({
                menuItemTemplate: () => {
                    this._restoreItems.push({
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

    _getToolbarItems() {
        return grep(this.option('items') ?? [], (item) => {
            return !this._isMenuItem(item);
        });
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

    _arrangeItems() {
        if(this.$element().is(':hidden')) {
            return;
        }

        this._$centerSection.css({
            margin: '0 auto',
            float: 'none'
        });

        each(this._restoreItems ?? [], function(_, obj) {
            $(obj.container).append(obj.item);
        });
        this._restoreItems = [];

        const elementWidth = getWidth(this.$element());

        this._hideOverflowItems(elementWidth);
        super._arrangeItems(elementWidth);
    }

    _itemOptionChanged(item, property, value) {
        if(this._isMenuItem(item)) {
            this._menu.itemOption(item, property, value);
        } else if(this._isToolbarItem(item)) {
            super._itemOptionChanged(item, property, value);
        } else {
            super._itemOptionChanged(item, property, value);
            this._menu.renderMenuItems();
        }

        if(property === 'disabled' || property === 'options.disabled') {
            toggleItemFocusableElementTabIndex(this, item);
        }

        if(property === 'location') {
            this.repaint();
        }
    }

    _updateFocusableItemsTabIndex() {
        this._getToolbarItems().forEach(item => toggleItemFocusableElementTabIndex(this, item));
    }

    _isMenuItem(itemData) {
        return itemData.location === 'menu' || itemData.locateInMenu === 'always';
    }

    _isToolbarItem(itemData) {
        return itemData.location === undefined || itemData.locateInMenu === 'never';
    }

    _optionChanged({ name, value }) {
        switch(name) {
            case 'menuItemTemplate':
                this._changeMenuOption('itemTemplate', this._getTemplate(value));
                break;
            case 'onItemClick':
                this._changeMenuOption(name, value);
                super._optionChanged.apply(this, arguments);
                break;
            case 'menuContainer':
                this._changeMenuOption('container', value);
                break;
            case 'overflowMenuVisible':
                this._changeMenuOption('opened', value);
                break;
            case 'disabled':
                this._changeMenuOption('disabled', value);
                super._optionChanged.apply(this, arguments);

                this._updateFocusableItemsTabIndex();
                break;
            default:
                super._optionChanged.apply(this, arguments);
        }
    }

    _changeMenuOption(name, value) {
        this._menu.widgetOption(name, value);
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
