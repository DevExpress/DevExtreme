import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import {
  deferRender,
  // @ts-expect-error
  grep,
} from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getWidth } from '@js/core/utils/size';
import type { Item } from '@js/ui/toolbar';
import DropDownMenu from '@ts/ui/toolbar/internal/m_toolbar.menu';
import type Toolbar from '@ts/ui/toolbar/m_toolbar';

const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';

const TOOLBAR_BUTTON_CLASS = 'dx-toolbar-button';

const TOOLBAR_AUTO_HIDE_ITEM_CLASS = 'dx-toolbar-item-auto-hide';
const TOOLBAR_HIDDEN_ITEM = 'dx-toolbar-item-invisible';

export class SingleLineStrategy {
  _toolbar: Toolbar;

  _restoreItems?: {
    container: dxElementWrapper;
    item: dxElementWrapper;
  }[];

  _menu?: DropDownMenu;

  _$overflowMenuContainer!: dxElementWrapper;

  constructor(toolbar) {
    this._toolbar = toolbar;
  }

  _initMarkup(): void {
    deferRender(() => {
      this._renderOverflowMenu();
      this._renderMenuItems();
    });
  }

  _renderOverflowMenu(): void {
    if (!this._hasVisibleMenuItems()) {
      return;
    }

    this._renderMenuButtonContainer();

    const $menu = $('<div>').appendTo(this._overflowMenuContainer());

    const itemClickAction = this._toolbar._createActionByOption('onItemClick');
    const menuItemTemplate = this._toolbar._getTemplateByOption('menuItemTemplate');

    this._menu = this._toolbar._createComponent($menu, DropDownMenu, {
      // @ts-expect-error
      disabled: this._toolbar.option('disabled'),
      itemTemplate: () => menuItemTemplate,
      onItemClick: (e) => { itemClickAction(e); },
      // @ts-expect-error
      container: this._toolbar.option('menuContainer'),
      onOptionChanged: ({ name, value }) => {
        if (name === 'opened') {
          this._toolbar.option('overflowMenuVisible', value);
        }
        if (name === 'items') {
          this._updateMenuVisibility(value);
        }
      },
    });
  }

  renderMenuItems(): void {
    if (!this._menu) {
      this._renderOverflowMenu();
    }

    this._menu && this._menu.option('items', this._getMenuItems());
    // @ts-expect-error
    if (this._menu && !this._menu.option('items').length) {
      this._menu.option('opened', false);
    }
  }

  _renderMenuButtonContainer(): void {
    // @ts-expect-error
    this._$overflowMenuContainer = $('<div>').appendTo(this._toolbar._$afterSection)
      .addClass(TOOLBAR_BUTTON_CLASS)
      .addClass(TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS);
  }

  _overflowMenuContainer(): dxElementWrapper {
    return this._$overflowMenuContainer;
  }

  _updateMenuVisibility(menuItems?: Item[]): void {
    const items = menuItems ?? this._getMenuItems();
    const isMenuVisible = items.length && this._hasVisibleMenuItems(items);
    this._toggleMenuVisibility(isMenuVisible);
  }

  _toggleMenuVisibility(value) {
    if (!this._overflowMenuContainer()) {
      return;
    }

    this._overflowMenuContainer().toggleClass(INVISIBLE_STATE_CLASS, !value);
  }

  _renderMenuItems(): void {
    deferRender(() => {
      this.renderMenuItems();
    });
  }

  _dimensionChanged(): void {
    this.renderMenuItems();
  }

  _getToolbarItems() {
    return grep(this._toolbar.option('items') ?? [], (item) => !this._toolbar._isMenuItem(item));
  }

  _getHiddenItems() {
    return this._toolbar._itemContainer()
      .children(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}.${TOOLBAR_HIDDEN_ITEM}`)
      .not(`.${INVISIBLE_STATE_CLASS}`);
  }

  _getMenuItems() {
    const menuItems = grep(this._toolbar.option('items') ?? [], (item) => this._toolbar._isMenuItem(item));

    const $hiddenItems = this._getHiddenItems();

    this._restoreItems = this._restoreItems ?? [];

    const overflowItems = [].slice.call($hiddenItems).map((hiddenItem) => {
      const itemData = this._toolbar._getItemData(hiddenItem);
      const $itemContainer = $(hiddenItem);
      const $itemMarkup = $itemContainer.children();

      return extend({
        menuItemTemplate: () => {
          // @ts-expect-error
          this._restoreItems.push({
            container: $itemContainer,
            item: $itemMarkup,
          });

          const $container = $('<div>').addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
          return $container.append($itemMarkup);
        },
      }, itemData);
    });

    return [...overflowItems, ...menuItems];
  }

  _hasVisibleMenuItems(items?: any) {
    const menuItems = items ?? this._toolbar.option('items');
    let result = false;

    const optionGetter = compileGetter('visible');
    const overflowGetter = compileGetter('locateInMenu');

    each(menuItems, (index, item) => {
      // @ts-expect-error
      const itemVisible = optionGetter(item, { functionsAsIs: true });
      // @ts-expect-error
      const itemOverflow = overflowGetter(item, { functionsAsIs: true });

      if (itemVisible !== false && (itemOverflow === 'auto' || itemOverflow === 'always') || item.location === 'menu') {
        result = true;
      }
    });

    return result;
  }

  _arrangeItems(): number {
    // @ts-expect-error
    this._toolbar._$centerSection.css({
      margin: '0 auto',
      float: 'none',
    });

    each(this._restoreItems ?? [], (_, obj) => {
      $(obj.container).append(obj.item);
    });
    this._restoreItems = [];

    const elementWidth = getWidth(this._toolbar.$element());
    this._hideOverflowItems(elementWidth);

    return elementWidth;
  }

  _hideOverflowItems(width?: number): void {
    const overflowItems = this._toolbar.$element().find(`.${TOOLBAR_AUTO_HIDE_ITEM_CLASS}`);

    if (!overflowItems.length) {
      return;
    }

    const elementWidth = width ?? getWidth(this._toolbar.$element());
    $(overflowItems).removeClass(TOOLBAR_HIDDEN_ITEM);

    let itemsWidth = this._getItemsWidth();

    while (overflowItems.length && elementWidth < itemsWidth) {
      const $item = overflowItems.eq(-1);
      $item.addClass(TOOLBAR_HIDDEN_ITEM);
      itemsWidth = this._getItemsWidth();
      overflowItems.splice(-1, 1);
    }
  }

  _getItemsWidth(): number {
    // @ts-expect-error
    return this._toolbar._getSummaryItemsSize('width', [this._toolbar._$beforeSection, this._toolbar._$centerSection, this._toolbar._$afterSection]);
  }

  _itemOptionChanged(item, property, value): void {
    if (property === 'disabled' || property === 'options.disabled') {
      if (this._toolbar._isMenuItem(item)) {
        this._menu?._itemOptionChanged(item, property, value);
        return;
      }
    }

    this.renderMenuItems();
  }

  _renderItem(item, itemElement): void {
    if (item.locateInMenu === 'auto') {
      itemElement.addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
    }
  }

  _optionChanged(name, value): void {
    // eslint-disable-next-line default-case
    switch (name) {
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
