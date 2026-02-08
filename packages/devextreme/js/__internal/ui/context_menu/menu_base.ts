import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error ts-error
import { asyncNoop, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isDefined, isObject, isPlainObject } from '@js/core/utils/type';
import type {
  DxEvent, ItemInfo, NativeEventInfo, PointerInteractionEvent,
} from '@js/events';
import type { dxMenuBaseOptions } from '@js/ui/context_menu/ui.menu_base';
import type dxMenuBase from '@js/ui/context_menu/ui.menu_base';
import type { dxMenuBaseItem, Item, SubmenuShowMode } from '@js/ui/menu';
import type { ActionArguments } from '@ts/core/m_action';
import { render } from '@ts/core/utils/m_ink_ripple';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { InkRippleEvent, PostprocessRenderItemInfo } from '@ts/ui/collection/collection_widget.base';
import MenuItem from '@ts/ui/collection/item';
import MenuBaseEditStrategy from '@ts/ui/context_menu/menu_base.edit.strategy';
import type DataAdapter from '@ts/ui/hierarchical_collection/data_adapter';
import type { DataAdapterOptions } from '@ts/ui/hierarchical_collection/data_adapter';
import type { InternalNode } from '@ts/ui/hierarchical_collection/data_converter';
import HierarchicalCollectionWidget from '@ts/ui/hierarchical_collection/hierarchical_collection_widget';

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
const DX_MENU_ITEM_DATA_KEY = 'dxMenuItemDataKey';

type ItemClickEvent<TComponent, TItem> =
  NativeEventInfo<TComponent, PointerInteractionEvent>
  & ItemInfo<TItem>;
export type HoverEvent = DxEvent<MouseEvent | PointerEvent>;
export type ClickEvent = DxEvent<PointerInteractionEvent>;
export type ItemClickActionArguments<
  TComponent extends dxMenuBase<MenuBaseProperties> = dxMenuBase<MenuBaseProperties>,
  TItem extends dxMenuBaseItem = dxMenuBaseItem,
> = ActionArguments<
  TComponent,
  ItemClickEvent<TComponent, TItem>
>;
type MenuBaseNode = InternalNode & dxMenuBaseItem;

export interface MenuBaseProperties<
  TItem extends dxMenuBaseItem = dxMenuBaseItem,
  // @ts-expect-error ts-error
> extends dxMenuBaseOptions<MenuBase, TItem> {
  focusedElement?: Element | null;
  useInkRipple?: boolean;
  _dataAdapter: DataAdapter;
}

class MenuBase<
  TProperties extends MenuBaseProperties = MenuBaseProperties,
> extends HierarchicalCollectionWidget<TProperties> {
  static ItemClass = MenuItem;

  _editStrategy!: MenuBaseEditStrategy;

  hasIcons?: boolean;

  // eslint-disable-next-line no-restricted-globals
  _showSubmenusTimeout?: ReturnType<typeof setTimeout>;

  protected _activeStateUnit(): string {
    return `.${ITEM_CLASS}`;
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
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
    };
  }

  _itemDataKey(): string {
    return DX_MENU_ITEM_DATA_KEY;
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

  _focusTarget(): dxElementWrapper {
    return this._itemContainer();
  }

  _clean(): void {
    this.option('focusedElement', null);

    super._clean();
  }

  _supportedKeys(): SupportedKeys {
    const selectItem = (): void => {
      const { focusedElement } = this.option();
      const $item = $(focusedElement);

      if (!$item.length || !this._isSelectionEnabled()) {
        return;
      }

      this.selectItem($item[0]);
    };
    return {
      ...super._supportedKeys(),
      space: selectItem,
      pageUp: noop,
      pageDown: noop,
    };
  }

  _isSelectionEnabled(): boolean {
    const { selectionMode } = this.option();

    return selectionMode === SINGLE_SELECTION_MODE;
  }

  _init(): void {
    super._init();

    this._renderSelectedItem();
    this._initActions();
  }

  _getLinkContainer(
    iconContainer: dxElementWrapper | undefined | null,
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
      return $();
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

    if (!items?.length) {
      return $();
    }

    const $popOutImage = $('<div>').addClass(DX_MENU_ITEM_POPOUT_CLASS);
    const $popOutContainer = $('<span>').addClass(DX_MENU_ITEM_POPOUT_CONTAINER_CLASS);

    $popOutContainer.append($popOutImage);

    return $popOutContainer;
  }

  _getDataAdapterOptions(): Partial<DataAdapterOptions> {
    return {
      rootValue: 0,
      multipleSelection: false,
      recursiveSelection: false,
      recursiveExpansion: false,
      searchValue: '',
    };
  }

  _selectByItem(selectedItem: Item): void {
    if (!selectedItem) {
      return;
    }

    const nodeToSelect = this._dataAdapter.getNodeByItem(selectedItem);

    if (nodeToSelect) {
      this._dataAdapter.toggleSelection(nodeToSelect.internalFields.key, true);
    }
  }

  _renderSelectedItem(): void {
    const selectedKeys = this._dataAdapter.getSelectedNodesKeys();
    const selectedKey = selectedKeys.length && selectedKeys[0];
    const selectedItem = this.option('selectedItem');

    if (!selectedKey) {
      this._selectByItem(selectedItem);
      return;
    }

    const node: MenuBaseNode | null = this._dataAdapter.getNodeByKey(selectedKey);

    if (!node || node.selectable === false) {
      return;
    }

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

    const { useInkRipple } = this.option();

    if (useInkRipple) {
      this._renderInkRipple();
    }
  }

  _renderInkRipple(): void {
    this._inkRipple = render();
  }

  _toggleActiveState(
    $element: dxElementWrapper,
    value: boolean,
    event: InkRippleEvent,
  ): void {
    super._toggleActiveState($element, value);

    if (!this._inkRipple) {
      return;
    }

    const config = {
      element: $element,
      event,
    };

    if (value) {
      this._inkRipple.showWave(config);
    } else {
      this._inkRipple.hideWave(config);
    }
  }

  _getShowSubmenuMode(): SubmenuShowMode | undefined {
    const defaultValue = 'onClick';
    const { showSubmenuMode } = this.option();

    const showMode = isObject(showSubmenuMode) ? showSubmenuMode.name : showSubmenuMode;

    return this._isDesktopDevice() ? showMode : defaultValue;
  }

  _isDesktopDevice(): boolean {
    return devices.real().deviceType === 'desktop';
  }

  _initEditStrategy(): void {
    this._editStrategy = new MenuBaseEditStrategy(this);
  }

  _addCustomCssClass($element: dxElementWrapper): void {
    const { cssClass } = this.option();

    if (cssClass) {
      $element.addClass(cssClass);
    }
  }

  _hoverStartHandler(e: HoverEvent): void {
    const $itemElement = this._getItemElementByEventArgs(e);

    if (!$itemElement || this._isItemDisabled($itemElement)) return;

    e.stopPropagation();

    if (this._getShowSubmenuMode() === 'onHover') {
      const submenuDelay = this._getSubmenuDelay();

      if (submenuDelay === 0) {
        this._showSubmenu($itemElement);
      } else {
        clearTimeout(this._showSubmenusTimeout);
        // eslint-disable-next-line no-restricted-globals
        this._showSubmenusTimeout = setTimeout(
          this._showSubmenu.bind(this, $itemElement),
          submenuDelay,
        );
      }
    }
  }

  _getAvailableItems($itemElements?: dxElementWrapper): dxElementWrapper {
    return super._getAvailableItems($itemElements).filter(
      // @ts-expect-error ts-error
      (_index: number, item: Element) => $(item).css('visibility') !== 'hidden',
    );
  }

  _isItemDisabled($item: dxElementWrapper): boolean {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._disabledGetter($item.data(this._itemDataKey()));
  }

  _showSubmenu($itemElement: dxElementWrapper): void {
    this._addExpandedClass($itemElement);
  }

  _addExpandedClass(itemElement: Element | dxElementWrapper): void {
    $(itemElement).addClass(DX_MENU_ITEM_EXPANDED_CLASS);
  }

  _getSubmenuDelay(): number {
    const { showSubmenuMode } = this.option();
    const delay = isObject(showSubmenuMode) ? showSubmenuMode.delay : undefined;

    if (!isDefined(delay)) {
      return DEFAULT_DELAY.show;
    }

    if (isObject(delay)) {
      return delay.show ?? DEFAULT_DELAY.show;
    }

    return delay;
  }

  _getItemElementByEventArgs(
    eventArgs: DxEvent,
  ): dxElementWrapper | null {
    let $target = $(eventArgs.target);

    if ($target.hasClass(this._itemClass()) || $target.get(0) === eventArgs.currentTarget) {
      return $target;
    }

    // TODO: move it to inheritors, menuBase don't know about dx-submenu
    while (!$target.hasClass(this._itemClass())) {
      $target = $target.parent();
      if ($target.hasClass('dx-submenu')) {
        return null;
      }
    }

    return $target;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _hoverEndHandler(event: HoverEvent): void {
    clearTimeout(this._showSubmenusTimeout);
  }

  _hasSubmenu(node: MenuBaseNode | null): boolean {
    return !!node?.internalFields.childrenKeys.length;
  }

  _renderContentImpl(): void {
    this._renderItems(this._dataAdapter.getRootNodes());
  }

  _renderItems(
    nodes: MenuBaseNode[],
    $submenuContainer?: dxElementWrapper,
  ): void {
    if (!nodes.length) {
      return;
    }

    this.hasIcons = false;

    const $nodeContainer = this._renderContainer(this.$element(), $submenuContainer?.[0]);
    let firstVisibleIndex = -1;
    let nextGroupFirstIndex = -1;

    each(nodes, (index: number, node: MenuBaseNode) => {
      const isVisibleNode = node.visible !== false;

      if (isVisibleNode && firstVisibleIndex < 0) {
        firstVisibleIndex = index;
      }

      const isBeginGroup = firstVisibleIndex < index
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        && (node.beginGroup || index === nextGroupFirstIndex);

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

  _renderItem(
    index: number,
    node: MenuBaseNode,
    $nodeContainer: dxElementWrapper,
    $nodeElement?: dxElementWrapper,
  ): dxElementWrapper {
    const { items = [] } = this.option();

    const $node = $nodeElement ?? this._createDOMElement($nodeContainer);

    if (items[index + 1]?.beginGroup) {
      $node.addClass(DX_MENU_ITEM_LAST_GROUP_ITEM);
    }

    const $itemFrame = super._renderItem(index, node.internalFields.item, $node);

    if (node.internalFields.item === this.option('selectedItem')) {
      $itemFrame.addClass(DX_MENU_SELECTED_ITEM_CLASS);
    }

    $itemFrame.attr('tabIndex', -1);

    if (this._hasSubmenu(node)) this.setAria('haspopup', 'true', $itemFrame);

    return $itemFrame;
  }

  _renderItemFrame(
    index: number,
    itemData: Item,
    $itemContainer: dxElementWrapper,
  ): dxElementWrapper {
    const $itemFrame = $itemContainer.children(`.${ITEM_CLASS}`);

    return $itemFrame.length ? $itemFrame : super._renderItemFrame(index, itemData, $itemContainer);
  }

  _refreshItem($item: dxElementWrapper, item: Item): void {
    const node = this._dataAdapter.getNodeByItem(item);

    if (!node) {
      return;
    }

    // @ts-expect-error ts-error
    const index: number = $item.data(this._itemIndexKey());
    const $nodeContainer = $item.closest('ul');
    const $nodeElement = $item.closest('li');

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

  _postprocessRenderItem(args: PostprocessRenderItemInfo<Item>): void {
    const $itemElement = $(args.itemElement);
    const selectedIndex = this._dataAdapter.getSelectedNodesKeys();

    if (
      !selectedIndex.length
      // @ts-expect-error ts-error
      || !this._selectedGetter(args.itemData)
      || !this._isItemSelectable(args.itemData)
    ) {
      this._setAriaSelectionAttribute($itemElement, 'false');
      return;
    }

    const node = this._dataAdapter.getNodeByItem(args.itemData);

    if (node && node.internalFields.key === selectedIndex[0]) {
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

  _itemClickHandler(e: DxEvent & { _skipHandling?: boolean }): void {
    if (e._skipHandling) return;

    const itemClickActionHandler = this._createAction(
      this._updateSubmenuVisibilityOnClick.bind(this),
    );
    this._itemDXEventHandler(e, 'onItemClick', {}, {
      // @ts-expect-error ts-error
      beforeExecute: this._itemClick,
      afterExecute: itemClickActionHandler.bind(this),
    });

    e._skipHandling = true;
  }

  _isUrlItem(item: Item | dxMenuBaseItem | undefined): item is Item {
    return !!item && 'url' in item && !!item.url;
  }

  _itemClick(actionArgs: ItemClickActionArguments): void {
    const { event, itemData } = actionArgs.args?.[0] ?? {};

    if (!event) {
      return;
    }

    const $itemElement = this._getItemElementByEventArgs(event);
    const link = $itemElement?.find(`.${ITEM_URL_CLASS}`)[0];

    if (!this._isUrlItem(itemData) || !link) {
      return;
    }

    const isNativeLinkClick = $(event.target).closest(`.${ITEM_URL_CLASS}`).length;

    if (isNativeLinkClick) {
      return;
    }

    this._clickByLink(link);
  }

  _updateSubmenuVisibilityOnClick(actionArgs: ItemClickActionArguments): void {
    this._updateSelectedItemOnClick(actionArgs);

    if (this._getShowSubmenuMode() === 'onClick') {
      const itemElement = actionArgs.args?.[0].itemElement;

      if (itemElement) {
        this._addExpandedClass(itemElement);
      }
    }
  }

  _updateSelectedItemOnClick(actionArgs: ItemClickActionArguments): void {
    const args = actionArgs.args ? actionArgs.args[0] : actionArgs;

    const { itemData } = args;

    if (!itemData || !this._isItemSelectAllowed(itemData)) {
      return;
    }

    const selectedItemKey = this._dataAdapter.getSelectedNodesKeys();
    const selectedNode = selectedItemKey.length
      && this._dataAdapter.getNodeByKey(selectedItemKey[0]);

    if (selectedNode) {
      this._toggleItemSelection(selectedNode, false);
    }

    if (!selectedNode || (selectedNode.internalFields.item !== itemData)) {
      this.selectItem(itemData);
    } else {
      this._fireSelectionChangeEvent(null, this.option('selectedItem'));
      this._setOptionWithoutOptionChange('selectedItem', null);
    }
  }

  _isItemSelectAllowed(item: Item): boolean | undefined {
    const { selectByClick } = this.option();
    const isSelectByClickEnabled = this._isSelectionEnabled() && selectByClick;

    return !this._isContainerEmpty()
      && isSelectByClickEnabled
      && this._isItemSelectable(item)
      // @ts-expect-error ts-error
      && !this._itemsGetter(item);
  }

  _isContainerEmpty(): boolean {
    return this._itemContainer().is(':empty');
  }

  _syncSelectionOptions(): DeferredObj<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return asyncNoop();
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    switch (args.name) {
      case 'showSubmenuMode':
        break;
      case 'selectedItem': {
        const node = args.value ? this._dataAdapter.getNodeByItem(args.value) : null;
        const selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];

        if (node && node.internalFields.key !== selectedKey) {
          // @ts-expect-error ts-error
          if (node.selectable === false) break;
          const selectedNode = this._dataAdapter.getNodeByKey(selectedKey);

          if (selectedKey && selectedNode) {
            this._toggleItemSelection(selectedNode, false);
          }
          this._toggleItemSelection(node, true);
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

  _toggleItemSelection(node: MenuBaseNode, value: boolean): void {
    const itemElement = this._getElementByItem(node.internalFields.item);

    if (itemElement) {
      $(itemElement).toggleClass(DX_MENU_SELECTED_ITEM_CLASS);
    }

    this._dataAdapter.toggleSelection(node.internalFields.key, value);
  }

  _getElementByItem(itemData: Item): dxElementWrapper {
    let result: dxElementWrapper = $();

    each(this._itemElements(), (_index: number, $itemElement: dxElementWrapper) => {
      // @ts-expect-error ts-error
      if ($($itemElement).data(this._itemDataKey()) !== itemData) {
        return true;
      }

      result = $itemElement;
      return false;
    });

    return result;
  }

  _updateSelectedItems(): void {}

  _updateSelectedItem(
    addedItem?: Item | null,
    removedItem?: Item,
  ): void {
    if (addedItem || removedItem) {
      this._fireSelectionChangeEvent(addedItem, removedItem);
    }
  }

  _fireSelectionChangeEvent(
    addedItem?: Item | null,
    removedItem?: Item,
  ): void {
    this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    })({
      addedItems: [addedItem],
      removedItems: [removedItem],
    });
  }

  selectItem(itemElement: Element | dxMenuBaseItem): void {
    const isElement = (item: Element | dxMenuBaseItem): item is Element => typeof item === 'object' && 'nodeType' in item && !!item.nodeType;

    const itemData = isElement(itemElement) ? this._getItemData(itemElement) : itemElement;
    const selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];
    const selectedItem = this.option('selectedItem');
    const node = this._dataAdapter.getNodeByItem(itemData);

    if (node && node.internalFields.key !== selectedKey) {
      const selectedNode = this._dataAdapter.getNodeByKey(selectedKey);

      if (selectedKey && selectedNode) {
        this._toggleItemSelection(selectedNode, false);
      }
      this._toggleItemSelection(node, true);
      this._updateSelectedItem(itemData, selectedItem);
      this._setOptionWithoutOptionChange('selectedItem', itemData);
    }
  }

  unselectItem(itemElement: Element): void {
    const itemData = itemElement.nodeType ? this._getItemData(itemElement) : itemElement;
    const node = this._dataAdapter.getNodeByItem(itemData);
    const selectedItem = this.option('selectedItem');

    if (node?.internalFields.selected) {
      this._toggleItemSelection(node, false);
      this._updateSelectedItem(null, selectedItem);
      this._setOptionWithoutOptionChange('selectedItem', null);
    }
  }
}

export default MenuBase;
