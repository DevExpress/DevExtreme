import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error
import { asyncNoop, noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isObject, isPlainObject } from '@js/core/utils/type';
import type { dxMenuBaseOptions } from '@js/ui/context_menu/ui.menu_base';
import type { Item } from '@js/ui/menu';
import { render } from '@js/ui/widget/utils.ink_ripple';
import HierarchicalCollectionWidget from '@ts/ui/collection/hierarchical';
import MenuItem from '@ts/ui/collection/m_item';
import MenuBaseEditStrategy from '@ts/ui/context_menu/m_menu_base.edit.strategy';

const DX_MENU_CLASS = 'dx-menu';
const DX_MENU_NO_ICONS_CLASS = `${DX_MENU_CLASS}-no-icons`;
const DX_MENU_BASE_CLASS = 'dx-menu-base';
const ITEM_CLASS = `${DX_MENU_CLASS}-item`;
const DX_ITEM_CONTENT_CLASS = `${ITEM_CLASS}-content`;
const DX_MENU_SELECTED_ITEM_CLASS = `${ITEM_CLASS}-selected`;
const DX_MENU_ITEM_WRAPPER_CLASS = `${ITEM_CLASS}-wrapper`;
const DX_MENU_ITEMS_CONTAINER_CLASS = `${DX_MENU_CLASS}-items-container`;
const DX_MENU_ITEM_EXPANDED_CLASS = `${ITEM_CLASS}-expanded`;
const DX_MENU_SEPARATOR_CLASS = `${DX_MENU_CLASS}-separator`;
const DX_MENU_ITEM_LAST_GROUP_ITEM = `${DX_MENU_CLASS}-last-group-item`;
const DX_ITEM_HAS_TEXT = `${ITEM_CLASS}-has-text`;
const DX_ITEM_HAS_ICON = `${ITEM_CLASS}-has-icon`;
const DX_ITEM_HAS_SUBMENU = `${ITEM_CLASS}-has-submenu`;
const DX_MENU_ITEM_POPOUT_CLASS = `${ITEM_CLASS}-popout`;
const DX_MENU_ITEM_POPOUT_CONTAINER_CLASS = `${DX_MENU_ITEM_POPOUT_CLASS}-container`;
const DX_MENU_ITEM_CAPTION_CLASS = `${ITEM_CLASS}-text`;
const SINGLE_SELECTION_MODE = 'single';
const DEFAULT_DELAY = { show: 50, hide: 300 };
const DX_MENU_ITEM_CAPTION_URL_CLASS = `${DX_MENU_ITEM_CAPTION_CLASS}-with-url`;
const DX_ICON_WITH_URL_CLASS = 'dx-icon-with-url';
const ITEM_URL_CLASS = 'dx-item-url';

export type Properties = dxMenuBaseOptions<MenuBase, Item>;

class MenuBase extends HierarchicalCollectionWidget<Properties> {
  static ItemClass = MenuItem;

  _editStrategy?: MenuBaseEditStrategy;

  hasIcons?: boolean;

  _inkRipple?: {
    showWave: (args: any) => void;
    hideWave: (args: any) => void;
  };

  _showSubmenusTimeout?: any;

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      items: [],
      cssClass: '',
      activeStateEnabled: true,
      showSubmenuMode: {
        name: 'onHover',
        delay: {
          show: 50,
          hide: 300,
        },
      },
      animation: {
        show: {
          type: 'fade',
          from: 0,
          to: 1,
          duration: 100,
        },
        hide: {
          type: 'fade',
          from: 1,
          to: 0,
          duration: 100,
        },
      },
      selectByClick: false,
      focusOnSelectedItem: false,
      keyExpr: null,
      _itemAttributes: { role: 'menuitem' },
      useInkRipple: false,
    });
  }

  _itemDataKey(): string {
    return 'dxMenuItemDataKey';
  }

  _itemClass(): string {
    return ITEM_CLASS;
  }

  _setAriaSelectionAttribute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $itemElement: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSelected: string,
  ): void {}

  _selectedItemClass(): string {
    return DX_MENU_SELECTED_ITEM_CLASS;
  }

  _widgetClass(): string {
    return DX_MENU_BASE_CLASS;
  }

  _focusTarget() {
    return this._itemContainer();
  }

  _clean(): void {
    this.option('focusedElement', null);

    super._clean();
  }

  _supportedKeys() {
    const selectItem = () => {
      // @ts-expect-error
      const $item = $(this.option('focusedElement'));

      if (!$item.length || !this._isSelectionEnabled()) {
        return;
      }

      this.selectItem($item[0]);
    };
    return extend(super._supportedKeys(), {
      space: selectItem,
      pageUp: noop,
      pageDown: noop,
    });
  }

  _isSelectionEnabled(): boolean {
    const { selectionMode } = this.option();

    return selectionMode === SINGLE_SELECTION_MODE;
  }

  _init(): void {
    // @ts-expect-error
    this._activeStateUnit = `.${ITEM_CLASS}`;
    super._init();
    this._renderSelectedItem();
    this._initActions();
  }

  _getLinkContainer(
    iconContainer: dxElementWrapper,
    textContainer: dxElementWrapper,
    itemData: Item,
  ): dxElementWrapper {
    const { linkAttr, url } = itemData;

    iconContainer?.addClass(DX_ICON_WITH_URL_CLASS);
    textContainer?.addClass(DX_MENU_ITEM_CAPTION_URL_CLASS);

    return super._getLinkContainer(iconContainer, textContainer, { linkAttr, url });
  }

  _addContent($container: dxElementWrapper, itemData: Item): void {
    const { html, url } = itemData;

    if (url) {
      $container.html(html);
      const link = this._getLinkContainer(
        this._getIconContainer(itemData),
        this._getTextContainer(itemData),
        itemData,
      );
      $container.append(link);
    } else {
      super._addContent($container, itemData);
    }

    $container.append(this._getPopoutContainer(itemData));
    this._addContentClasses(itemData, $container.parent());
  }

  _getTextContainer(itemData: Item): dxElementWrapper {
    const { text } = itemData;
    if (!text) {
      // @ts-expect-error
      return;
    }
    const $itemContainer = $('<span>').addClass(DX_MENU_ITEM_CAPTION_CLASS);
    const itemText = isPlainObject(itemData) ? text : String(itemData);
    return $itemContainer.text(itemText);
  }

  _getItemExtraPropNames(): string[] {
    return ['url', 'linkAttr'];
  }

  _getPopoutContainer(itemData: Item): dxElementWrapper {
    const { items } = itemData;
    let $popOutContainer;

    if (items && items.length) {
      const $popOutImage = $('<div>').addClass(DX_MENU_ITEM_POPOUT_CLASS);
      $popOutContainer = $('<span>').addClass(DX_MENU_ITEM_POPOUT_CONTAINER_CLASS).append($popOutImage);
    }

    return $popOutContainer;
  }

  _getDataAdapterOptions() {
    return {
      rootValue: 0,
      multipleSelection: false,
      recursiveSelection: false,
      recursiveExpansion: false,
      searchValue: '',
    };
  }

  _selectByItem(selectedItem): void {
    if (!selectedItem) return;

    const nodeToSelect = this._dataAdapter.getNodeByItem(selectedItem);
    this._dataAdapter.toggleSelection(nodeToSelect.internalFields.key, true);
  }

  _renderSelectedItem(): void {
    const selectedKeys = this._dataAdapter.getSelectedNodesKeys();
    const selectedKey = selectedKeys.length && selectedKeys[0];
    const selectedItem = this.option('selectedItem');

    if (!selectedKey) {
      this._selectByItem(selectedItem);
      return;
    }

    const node = this._dataAdapter.getNodeByKey(selectedKey);

    if (node.selectable === false) return;

    if (!selectedItem) {
      this.option('selectedItem', node.internalFields.item);
      return;
    }

    if (selectedItem !== node.internalFields.item) {
      this._dataAdapter.toggleSelection(selectedKey, false);
      this._selectByItem(selectedItem);
    }
  }

  _initActions(): void {}

  _initMarkup(): void {
    super._initMarkup();
    this.option('useInkRipple') && this._renderInkRipple();
  }

  _renderInkRipple(): void {
    this._inkRipple = render();
  }

  _toggleActiveState($element: dxElementWrapper, value, e): void {
    // @ts-expect-error
    super._toggleActiveState.apply(this, arguments);

    if (!this._inkRipple) {
      return;
    }

    const config = {
      element: $element,
      event: e,
    };

    if (value) {
      this._inkRipple.showWave(config);
    } else {
      this._inkRipple.hideWave(config);
    }
  }

  _getShowSubmenuMode() {
    const defaultValue = 'onClick';
    let optionValue = this.option('showSubmenuMode');
    // @ts-expect-error
    optionValue = isObject(optionValue) ? optionValue.name : optionValue;

    return this._isDesktopDevice() ? optionValue : defaultValue;
  }

  _initSelectedItems() {}

  _isDesktopDevice() {
    return devices.real().deviceType === 'desktop';
  }

  _initEditStrategy() {
    const Strategy = MenuBaseEditStrategy;
    // @ts-expect-error dxClass inheritance issue
    this._editStrategy = new Strategy(this);
  }

  _addCustomCssClass($element: dxElementWrapper): void {
    // @ts-expect-error
    $element.addClass(this.option('cssClass'));
  }

  _itemWrapperSelector(): string {
    return `.${DX_MENU_ITEM_WRAPPER_CLASS}`;
  }

  _hoverStartHandler(e) {
    const $itemElement = this._getItemElementByEventArgs(e);

    if (!$itemElement || this._isItemDisabled($itemElement)) return;

    e.stopPropagation();
    // @ts-expect-error
    if (this._getShowSubmenuMode() === 'onHover') {
      clearTimeout(this._showSubmenusTimeout);
      this._showSubmenusTimeout = setTimeout(this._showSubmenu.bind(this, $itemElement), this._getSubmenuDelay('show'));
    }
  }

  _getAvailableItems($itemElements?: dxElementWrapper): dxElementWrapper {
    // @ts-expect-error
    return super._getAvailableItems($itemElements).filter(function () {
      // @ts-expect-error
      return $(this).css('visibility') !== 'hidden';
    });
  }

  _isItemDisabled($item) {
    // @ts-expect-error
    return this._disabledGetter($item.data(this._itemDataKey()));
  }

  _showSubmenu($itemElement: dxElementWrapper): void {
    this._addExpandedClass($itemElement);
  }

  _addExpandedClass(itemElement: Element | dxElementWrapper): void {
    $(itemElement).addClass(DX_MENU_ITEM_EXPANDED_CLASS);
  }

  _getSubmenuDelay(action: 'show'): number {
    // @ts-expect-error
    const { delay } = this.option('showSubmenuMode');
    if (!isDefined(delay)) {
      return DEFAULT_DELAY[action];
    }

    return isObject(delay) ? delay[action] : delay;
  }

  // TODO: try to simplify
  _getItemElementByEventArgs(eventArgs): dxElementWrapper {
    let $target = $(eventArgs.target);

    if ($target.hasClass(this._itemClass()) || $target.get(0) === eventArgs.currentTarget) {
      return $target;
    }

    // TODO: move it to inheritors, menuBase don't know about dx-submenu
    while (!$target.hasClass(this._itemClass())) {
      $target = $target.parent();
      if ($target.hasClass('dx-submenu')) {
        // @ts-expect-error
        return null;
      }
    }

    return $target;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _hoverEndHandler(event: unknown): void {
    clearTimeout(this._showSubmenusTimeout);
  }

  _hasSubmenu(node) {
    return node && node.internalFields.childrenKeys.length;
  }

  _renderContentImpl() {
    this._renderItems(this._dataAdapter.getRootNodes());
  }

  _renderItems(
    nodes: Item[],
    submenuContainer?: dxElementWrapper,
  ): void {
    if (!nodes.length) {
      return;
    }

    this.hasIcons = false;

    // @ts-expect-error
    const $nodeContainer = this._renderContainer(this.$element(), submenuContainer);
    let firstVisibleIndex = -1;
    let nextGroupFirstIndex = -1;

    each(nodes, (index, node) => {
      const isVisibleNode = node.visible !== false;

      if (isVisibleNode && firstVisibleIndex < 0) {
        firstVisibleIndex = index;
      }

      const isBeginGroup = firstVisibleIndex < index && (node.beginGroup || index === nextGroupFirstIndex);

      if (isBeginGroup) {
        nextGroupFirstIndex = isVisibleNode ? index : index + 1;
      }

      if (index === nextGroupFirstIndex && firstVisibleIndex < index) {
        this._renderSeparator($nodeContainer);
      }

      this._renderItem(index, node, $nodeContainer);
    });

    if (!this.hasIcons) $nodeContainer.addClass(DX_MENU_NO_ICONS_CLASS);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderContainer($wrapper: dxElementWrapper, submenuContainer?: Element): dxElementWrapper {
    const $container = $('<ul>');

    this.setAria('role', 'none', $container);

    return $container
      .appendTo($wrapper)
      .addClass(DX_MENU_ITEMS_CONTAINER_CLASS);
  }

  _createDOMElement($nodeContainer: dxElementWrapper): dxElementWrapper {
    const $node = $('<li>');

    this.setAria('role', 'none', $node);

    return $node
      .appendTo($nodeContainer)
      .addClass(DX_MENU_ITEM_WRAPPER_CLASS);
  }

  // @ts-expect-error
  _renderItem(
    index: number,
    node: any,
    $nodeContainer: dxElementWrapper,
    $nodeElement?: dxElementWrapper,
  ): void {
    const { items = [] } = this.option();

    const $node = $nodeElement ?? this._createDOMElement($nodeContainer);

    if (items[index + 1] && items[index + 1].beginGroup) {
      $node.addClass(DX_MENU_ITEM_LAST_GROUP_ITEM);
    }

    const $itemFrame = super._renderItem(index, node.internalFields.item, $node);

    if (node.internalFields.item === this.option('selectedItem')) {
      $itemFrame.addClass(DX_MENU_SELECTED_ITEM_CLASS);
    }

    $itemFrame.attr('tabIndex', -1);

    if (this._hasSubmenu(node)) this.setAria('haspopup', 'true', $itemFrame);
  }

  _renderItemFrame(
    index: number,
    itemData: Item,
    $itemContainer: dxElementWrapper,
  ): dxElementWrapper {
    const $itemFrame = $itemContainer.children(`.${ITEM_CLASS}`);

    // @ts-expect-error
    return $itemFrame.length ? $itemFrame : super._renderItemFrame.apply(this, arguments);
  }

  _refreshItem($item: dxElementWrapper, item: Item): void {
    const node = this._dataAdapter.getNodeByItem(item);
    // @ts-expect-error
    const index = $item.data(this._itemIndexKey());
    const $nodeContainer = $item.closest('ul');
    const $nodeElement = $item.closest('li');

    // @ts-expect-error
    this._renderItem(index, node, $nodeContainer, $nodeElement);
  }

  _addContentClasses(itemData: Item, $itemFrame: dxElementWrapper): void {
    const hasText = itemData.text ? !!itemData.text.length : false;
    const hasIcon = !!itemData.icon;
    const hasSubmenu = itemData.items ? !!itemData.items.length : false;

    $itemFrame.toggleClass(DX_ITEM_HAS_TEXT, hasText);
    $itemFrame.toggleClass(DX_ITEM_HAS_ICON, hasIcon);

    if (!this.hasIcons) {
      this.hasIcons = hasIcon;
    }

    $itemFrame.toggleClass(DX_ITEM_HAS_SUBMENU, hasSubmenu);
  }

  _getItemContent($itemFrame: dxElementWrapper): dxElementWrapper {
    let $itemContent = super._getItemContent($itemFrame);

    if (!$itemContent.length) {
      $itemContent = $itemFrame.children(`.${DX_ITEM_CONTENT_CLASS}`);
    }
    return $itemContent;
  }

  _postprocessRenderItem(args): void {
    const $itemElement = $(args.itemElement);
    const selectedIndex = this._dataAdapter.getSelectedNodesKeys();

    // @ts-expect-error
    if (!selectedIndex.length || !this._selectedGetter(args.itemData) || !this._isItemSelectable(args.itemData)) {
      this._setAriaSelectionAttribute($itemElement, 'false');
      return;
    }

    const node = this._dataAdapter.getNodeByItem(args.itemData);

    if (node.internalFields.key === selectedIndex[0]) {
      $itemElement.addClass(this._selectedItemClass());
      this._setAriaSelectionAttribute($itemElement, 'true');
    } else {
      this._setAriaSelectionAttribute($itemElement, 'false');
    }
  }

  _isItemSelectable(item: Item): boolean {
    return item.selectable !== false;
  }

  _renderSeparator($itemsContainer: dxElementWrapper): void {
    $('<li>')
      .appendTo($itemsContainer)
      .addClass(DX_MENU_SEPARATOR_CLASS);
  }

  _itemClickHandler(e) {
    if (e._skipHandling) return;

    // @ts-expect-error
    const itemClickActionHandler = this._createAction(this._updateSubmenuVisibilityOnClick.bind(this));
    this._itemDXEventHandler(e, 'onItemClick', {}, {
      beforeExecute: this._itemClick,
      // @ts-expect-error
      afterExecute: itemClickActionHandler.bind(this),
    });
    e._skipHandling = true;
  }

  _itemClick(actionArgs): void {
    const { event, itemData } = actionArgs.args[0];

    const $itemElement = this._getItemElementByEventArgs(event);
    const link = $itemElement && $itemElement.find(`.${ITEM_URL_CLASS}`).get(0);

    if (itemData.url && link) {
      // @ts-expect-error
      link.click();
    }
  }

  _updateSubmenuVisibilityOnClick(actionArgs): void {
    this._updateSelectedItemOnClick(actionArgs);

    if (this._getShowSubmenuMode() === 'onClick') {
      this._addExpandedClass(actionArgs.args[0].itemElement);
    }
  }

  _updateSelectedItemOnClick(actionArgs) {
    const args = actionArgs.args ? actionArgs.args[0] : actionArgs;

    if (!this._isItemSelectAllowed(args.itemData)) {
      return;
    }

    const selectedItemKey = this._dataAdapter.getSelectedNodesKeys();
    const selectedNode = selectedItemKey.length && this._dataAdapter.getNodeByKey(selectedItemKey[0]);

    if (selectedNode) {
      this._toggleItemSelection(selectedNode, false);
    }

    if (!selectedNode || (selectedNode.internalFields.item !== args.itemData)) {
      this.selectItem(args.itemData);
    } else {
      this._fireSelectionChangeEvent(null, this.option('selectedItem'));
      this._setOptionWithoutOptionChange('selectedItem', null);
    }
  }

  _isItemSelectAllowed(item: Item): boolean | undefined {
    const isSelectByClickEnabled = this._isSelectionEnabled() && this.option('selectByClick');
    return !this._isContainerEmpty()
      && isSelectByClickEnabled
      && this._isItemSelectable(item)
      // @ts-expect-error
      && !this._itemsGetter(item);
  }

  _isContainerEmpty(): boolean {
    return this._itemContainer().is(':empty');
  }

  _syncSelectionOptions() {
    return asyncNoop();
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'showSubmenuMode':
        break;
      case 'selectedItem': {
        const node = this._dataAdapter.getNodeByItem(args.value);
        const selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];

        if (node && node.internalFields.key !== selectedKey) {
          if (node.selectable === false) break;

          if (selectedKey) {
            this._toggleItemSelection(this._dataAdapter.getNodeByKey(selectedKey), false);
          }
          this._toggleItemSelection(node, true);
          this._updateSelectedItems();
        }
        break;
      }
      case 'cssClass':
      case 'position':
      case 'selectByClick':
      case 'animation':
      case 'useInkRipple':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _toggleItemSelection(node, value) {
    const itemElement = this._getElementByItem(node.internalFields.item);
    itemElement && $(itemElement).toggleClass(DX_MENU_SELECTED_ITEM_CLASS);
    this._dataAdapter.toggleSelection(node.internalFields.key, value);
  }

  _getElementByItem(itemData) {
    let result;

    each(this._itemElements(), (_, itemElement) => {
      if ($(itemElement).data(this._itemDataKey()) !== itemData) {
        return true;
      }

      result = itemElement;
      return false;
    });
    return result;
  }

  _updateSelectedItems(
    oldSelection?: Item,
    newSelection?: Item | null,
  ): void {
    if (oldSelection || newSelection) {
      this._fireSelectionChangeEvent(newSelection, oldSelection);
    }
  }

  _fireSelectionChangeEvent(addedSelection, removedSelection): void {
    this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    })({
      addedItems: [addedSelection],
      removedItems: [removedSelection],
    });
  }

  selectItem(itemElement): void {
    const itemData = itemElement.nodeType ? this._getItemData(itemElement) : itemElement;
    const selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];
    const selectedItem = this.option('selectedItem');
    const node = this._dataAdapter.getNodeByItem(itemData);

    if (node.internalFields.key !== selectedKey) {
      if (selectedKey) {
        this._toggleItemSelection(this._dataAdapter.getNodeByKey(selectedKey), false);
      }
      this._toggleItemSelection(node, true);
      this._updateSelectedItems(selectedItem, itemData);
      this._setOptionWithoutOptionChange('selectedItem', itemData);
    }
  }

  unselectItem(itemElement): void {
    const itemData = itemElement.nodeType ? this._getItemData(itemElement) : itemElement;
    const node = this._dataAdapter.getNodeByItem(itemData);
    const selectedItem = this.option('selectedItem');

    if (node.internalFields.selected) {
      this._toggleItemSelection(node, false);
      this._updateSelectedItems(selectedItem, null);
      this._setOptionWithoutOptionChange('selectedItem', null);
    }
  }
}

export default MenuBase;
