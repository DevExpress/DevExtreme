
import { getWidth, getOuterWidth } from '../../../core/utils/size';
import $ from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';
import { grep, deferRender } from '../../../core/utils/common';
import { extend } from '../../../core/utils/extend';
import DropDownMenu from '../internal/ui.toolbar.menu';
import { compileGetter } from '../../../core/utils/data';

const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';

const TOOLBAR_BUTTON_CLASS = 'dx-toolbar-button';

const TOOLBAR_AUTO_HIDE_ITEM_CLASS = 'dx-toolbar-item-auto-hide';
const TOOLBAR_HIDDEN_ITEM = 'dx-toolbar-item-invisible';

export class SingleLineStrategy {
    constructor(toolbar) {
        this._toolbar = toolbar;
    }

    _initMarkup() {
        deferRender(() => {
            this._renderOverflowMenu();
            this._renderMenuItems();
        });
    }

    _renderOverflowMenu() {
        if(!this._hasVisibleMenuItems()) {
            return;
        }

        this._renderMenuButtonContainer();

        const $menu = $('<div>').appendTo(this._overflowMenuContainer());

        const itemClickAction = this._toolbar._createActionByOption('onItemClick');
        const menuItemTemplate = this._toolbar._getTemplateByOption('menuItemTemplate');

        this._menu = this._toolbar._createComponent($menu, DropDownMenu, {
            disabled: this._toolbar.option('disabled'),
            itemTemplate: () => menuItemTemplate,
            onItemClick: (e) => { itemClickAction(e); },
            container: this._toolbar.option('menuContainer'),
            onOptionChanged: ({ name, value }) => {
                if(name === 'opened') {
                    this._toolbar.option('overflowMenuVisible', value);
                }
                if(name === 'items') {
                    this._updateMenuVisibility(value);
                }
            },
        });
    }

    renderMenuItems() {
        if(!this._menu) {
            this._renderOverflowMenu();
        }

        this._menu && this._menu.option('items', this._getMenuItems());

        if(this._menu && !this._menu.option('items').length) {
            this._menu.option('opened', false);
        }
    }

    _renderMenuButtonContainer() {
        this._$overflowMenuContainer = $('<div>').appendTo(this._toolbar._$afterSection)
            .addClass(TOOLBAR_BUTTON_CLASS)
            .addClass(TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS);
    }

    _overflowMenuContainer() {
        return this._$overflowMenuContainer;
    }

    _updateMenuVisibility(menuItems) {
        const items = menuItems ?? this._getMenuItems();
        const isMenuVisible = items.length && this._hasVisibleMenuItems(items);
        this._toggleMenuVisibility(isMenuVisible);
    }

    _toggleMenuVisibility(value) {
        if(!this._overflowMenuContainer()) {
            return;
        }

        this._overflowMenuContainer().toggleClass(INVISIBLE_STATE_CLASS, !value);
    }

    _renderMenuItems() {
        deferRender(() => {
            this.renderMenuItems();
        });
    }

    _dimensionChanged() {
        this.renderMenuItems();
    }

    _getToolbarItems() {
        return grep(this._toolbar.option('items') ?? [], (item) => {
            return !this._toolbar._isMenuItem(item);
        });
    }

    _getMenuItems() {
        const menuItems = grep(this._toolbar.option('items') ?? [], (item) => {
            return this._toolbar._isMenuItem(item);
        });

        const $hiddenItems = this._toolbar._itemContainer()
            .children(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}.${TOOLBAR_HIDDEN_ITEM}`)
            .not(`.${INVISIBLE_STATE_CLASS}`);

        this._restoreItems = this._restoreItems ?? [];

        const overflowItems = [].slice.call($hiddenItems).map((item) => {
            const itemData = this._toolbar._getItemData(item);
            const $itemContainer = $(item);
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

    _hasVisibleMenuItems(items) {
        const menuItems = items ?? this._toolbar.option('items');
        let result = false;

        const optionGetter = compileGetter('visible');
        const overflowGetter = compileGetter('locateInMenu');

        each(menuItems, function(index, item) {
            const itemVisible = optionGetter(item, { functionsAsIs: true });
            const itemOverflow = overflowGetter(item, { functionsAsIs: true });

            if(itemVisible !== false && (itemOverflow === 'auto' || itemOverflow === 'always') || item.location === 'menu') {
                result = true;
            }
        });

        return result;
    }

    _arrangeItems() {
        this._toolbar._$centerSection.css({
            margin: '0 auto',
            float: 'none'
        });

        each(this._restoreItems ?? [], function(_, obj) {
            $(obj.container).append(obj.item);
        });
        this._restoreItems = [];

        const elementWidth = getWidth(this._toolbar.$element());
        this._hideOverflowItems(elementWidth);

        return elementWidth;
    }

    _hideOverflowItems(elementWidth) {
        const overflowItems = this._toolbar.$element().find(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}`);

        if(!overflowItems.length) {
            return;
        }

        elementWidth = elementWidth ?? getWidth(this._toolbar.$element());
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
        return this._toolbar._getSummaryItemsWidth([this._toolbar._$beforeSection, this._toolbar._$centerSection, this._toolbar._$afterSection]);
    }

    _itemOptionChanged(item, property, value) {
        if(this._toolbar._isMenuItem(item)) {
            if(property === 'disabled' || property === 'options.disabled') {
                this._menu?._itemOptionChanged(item, property, value);
                return;
            }
        }

        this.renderMenuItems();
    }

    _renderItem(item, itemElement) {
        if(item.locateInMenu === 'auto') {
            itemElement.addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
        }
    }

    _optionChanged(name, value) {
        switch(name) {
            case 'disabled':
                this._menu?.option(name, value);
                break;
            case 'overflowMenuVisible':
                this._menu?.option('opened', value);
                break;
            case 'onItemClick':
                this._menu?.option(name, value);
                break;
            case 'menuContainer':
                this._menu?.option('container', value);
                break;
            case 'menuItemTemplate':
                this._menu?.option('itemTemplate', value);
                break;
        }

    }
}
