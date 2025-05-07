import type { PositionConfig } from '@js/common/core/animation';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { end as hoverEventEnd } from '@js/common/core/events/hover';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getOuterWidth } from '@js/core/utils/size';
import { isDefined, isObject, isPlainObject } from '@js/core/utils/type';
import Button from '@js/ui/button';
import type { Item } from '@js/ui/menu';
import type { Properties as OverlayProperties } from '@js/ui/overlay';
import type dxOverlay from '@js/ui/overlay';
import Overlay from '@js/ui/overlay/ui.overlay';
import TreeView from '@js/ui/tree_view';
import MenuBase from '@ts/ui/context_menu/m_menu_base';
import { getElementMaxHeightByWindow } from '@ts/ui/overlay/m_utils';

import Submenu from './m_submenu';

const DX_MENU_CLASS = 'dx-menu';
const DX_MENU_VERTICAL_CLASS = `${DX_MENU_CLASS}-vertical`;
const DX_MENU_HORIZONTAL_CLASS = `${DX_MENU_CLASS}-horizontal`;
const DX_MENU_ITEM_CLASS = `${DX_MENU_CLASS}-item`;
const DX_MENU_ITEMS_CONTAINER_CLASS = `${DX_MENU_CLASS}-items-container`;
const DX_MENU_ITEM_EXPANDED_CLASS = `${DX_MENU_ITEM_CLASS}-expanded`;
const DX_CONTEXT_MENU_CLASS = 'dx-context-menu';
const DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS = `${DX_CONTEXT_MENU_CLASS}-container-border`;
const DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = 'dx-context-menu-content-delimiter';
const DX_SUBMENU_CLASS = 'dx-submenu';

const DX_STATE_DISABLED_CLASS = 'dx-state-disabled';
const DX_STATE_HOVER_CLASS = 'dx-state-hover';
const DX_STATE_ACTIVE_CLASS = 'dx-state-active';

const DX_ADAPTIVE_MODE_CLASS = `${DX_MENU_CLASS}-adaptive-mode`;
const DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS = `${DX_MENU_CLASS}-hamburger-button`;
const DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS = `${DX_ADAPTIVE_MODE_CLASS}-overlay-wrapper`;

const FOCUS_UP = 'up';
const FOCUS_DOWN = 'down';
const FOCUS_LEFT = 'left';
const FOCUS_RIGHT = 'right';

const SHOW_SUBMENU_OPERATION = 'showSubmenu';
const NEXTITEM_OPERATION = 'nextItem';
const PREVITEM_OPERATION = 'prevItem';

const DEFAULT_DELAY = {
  show: 50,
  hide: 300,
};

const ACTIONS = ['onSubmenuShowing', 'onSubmenuShown', 'onSubmenuHiding', 'onSubmenuHidden', 'onItemContextMenu', 'onItemClick', 'onSelectionChanged', 'onItemRendered'];

class Menu extends MenuBase {
  // Temporary solution. Move to component level
  public NAME!: string;

  _submenus!: Submenu[];

  _visibleSubmenu?: Submenu;

  _overlay!: dxOverlay<OverlayProperties>;

  _treeView!: TreeView;

  _hamburger?: Button;

  _$adaptiveContainer?: dxElementWrapper;

  _menuItemsWidth!: number;

  _hoveredRootItem?: dxElementWrapper;

  _showSubmenuTimer?: any;

  _hideSubmenuTimer?: any;

  _resizeEventTimer?: any;

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      orientation: 'horizontal',
      submenuDirection: 'auto',
      showFirstSubmenuMode: {
        name: 'onClick',
        delay: {
          show: 50,
          hide: 300,
        },
      },
      hideSubmenuOnMouseLeave: false,
      onSubmenuShowing: null,
      onSubmenuShown: null,
      onSubmenuHiding: null,
      onSubmenuHidden: null,
      adaptivityEnabled: false,
    });
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      animation: true,
      selectedItem: true,
    });
  }

  _itemElements() {
    const rootMenuElements = super._itemElements();
    const submenuElements = this._submenuItemElements();
    // @ts-expect-error
    return rootMenuElements.add(submenuElements);
  }

  _submenuItemElements() {
    let elements = [];

    const itemSelector = `.${DX_MENU_ITEM_CLASS}`;
    const currentSubmenu = this._submenus.length && this._submenus[0];

    if (currentSubmenu && currentSubmenu.itemsContainer()) {
      elements = currentSubmenu.itemsContainer().find(itemSelector);
    }

    return elements;
  }

  _focusTarget(): dxElementWrapper {
    return this.$element();
  }

  _isMenuHorizontal(): boolean {
    // @ts-expect-error
    return this.option('orientation') === 'horizontal';
  }

  _moveFocus(location) {
    const $items = this._getAvailableItems();
    const isMenuHorizontal = this._isMenuHorizontal();
    const $activeItem = this._getActiveItem(true);
    let argument;
    let operation;
    let navigationAction;
    let $newTarget;

    switch (location) {
      case FOCUS_UP:
        operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(PREVITEM_OPERATION);
        argument = isMenuHorizontal ? $activeItem : $items;
        navigationAction = this._getKeyboardNavigationAction(operation, argument);
        $newTarget = navigationAction();
        break;
      case FOCUS_DOWN:
        operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(NEXTITEM_OPERATION);
        argument = isMenuHorizontal ? $activeItem : $items;
        navigationAction = this._getKeyboardNavigationAction(operation, argument);
        $newTarget = navigationAction();
        break;
      case FOCUS_RIGHT:
        operation = isMenuHorizontal ? this._getItemsNavigationOperation(NEXTITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
        argument = isMenuHorizontal ? $items : $activeItem;
        navigationAction = this._getKeyboardNavigationAction(operation, argument);
        $newTarget = navigationAction();
        break;
      case FOCUS_LEFT:
        operation = isMenuHorizontal ? this._getItemsNavigationOperation(PREVITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
        argument = isMenuHorizontal ? $items : $activeItem;
        navigationAction = this._getKeyboardNavigationAction(operation, argument);
        $newTarget = navigationAction();
        break;
      default:
        return super._moveFocus(location);
    }

    if ($newTarget && $newTarget.length !== 0) {
      this.option('focusedElement', getPublicElement($newTarget));
    }
  }

  _getItemsNavigationOperation(operation) {
    let navOperation = operation;

    if (this.option('rtlEnabled')) {
      navOperation = operation === PREVITEM_OPERATION ? NEXTITEM_OPERATION : PREVITEM_OPERATION;
    }

    return navOperation;
  }

  _getKeyboardNavigationAction(operation, argument) {
    let action = noop;

    // eslint-disable-next-line default-case
    switch (operation) {
      case SHOW_SUBMENU_OPERATION:
        if (!argument.hasClass(DX_STATE_DISABLED_CLASS)) {
          action = this._showSubmenu.bind(this, argument);
        }
        break;
      case NEXTITEM_OPERATION:
        action = this._nextItem.bind(this, argument);
        break;
      case PREVITEM_OPERATION:
        action = this._prevItem.bind(this, argument);
        break;
    }

    return action;
  }

  _clean() {
    super._clean();
    this.option('templatesRenderAsynchronously') && clearTimeout(this._resizeEventTimer);
  }

  _visibilityChanged(visible) {
    if (visible) {
      if (!this._menuItemsWidth) {
        this._updateItemsWidthCache();
      }
      this._dimensionChanged();
    }
  }

  _isAdaptivityEnabled(): boolean {
    // @ts-expect-error
    return this.option('adaptivityEnabled') && this.option('orientation') === 'horizontal';
  }

  _updateItemsWidthCache(): void {
    const $menuItems = this.$element().find('ul').first().children('li')
      .children(`.${DX_MENU_ITEM_CLASS}`);
    this._menuItemsWidth = this._getSummaryItemsSize('width', $menuItems, true);
  }

  _dimensionChanged(): void {
    if (!this._isAdaptivityEnabled()) {
      return;
    }

    const containerWidth = getOuterWidth(this.$element());
    this._toggleAdaptiveMode(this._menuItemsWidth > containerWidth);
  }

  _init(): void {
    super._init();
    this._submenus = [];
  }

  _initActions(): void {
    this._actions = {};

    each(ACTIONS, (index, action) => {
      this._actions[action] = this._createActionByOption(action);
    });
  }

  _initMarkup(): void {
    // @ts-expect-error
    this._visibleSubmenu = null;

    this.$element().addClass(DX_MENU_CLASS);

    super._initMarkup();
    this._addCustomCssClass(this.$element());

    this.setAria('role', 'menubar');
  }

  _setAriaRole(state: boolean): void {
    const role = this._isAdaptivityEnabled() && state ? undefined : 'menubar';
    this.setAria({ role });
  }

  _render(): void {
    super._render();
    this._initAdaptivity();
  }

  _isTargetOutOfComponent(relatedTarget): boolean {
    const isInsideRootMenu = $(relatedTarget).closest(`.${DX_MENU_CLASS}`).length !== 0;
    const isInsideContextMenu = $(relatedTarget).closest(`.${DX_CONTEXT_MENU_CLASS}`).length !== 0;

    const isTargetOutOfComponent = !(isInsideRootMenu || isInsideContextMenu);

    return isTargetOutOfComponent;
  }

  _focusOutHandler(e) {
    const { relatedTarget } = e;

    if (relatedTarget) {
      const isTargetOutside = this._isTargetOutOfComponent(relatedTarget);

      if (isTargetOutside) {
        this._hideVisibleSubmenu();
      }
    }

    super._focusOutHandler(e);
  }

  _renderHamburgerButton(): dxElementWrapper {
    // @ts-expect-error
    this._hamburger = new Button($('<div>').addClass(DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS), {
      icon: 'menu',
      activeStateEnabled: false,
      onClick: this._toggleTreeView.bind(this),
    });

    return this._hamburger.$element();
  }

  _toggleTreeView(state): void {
    if (isPlainObject(state)) {
      state = !this._overlay.option('visible');
    }
    this._overlay.option('visible', state);
    if (state) {
      this._treeView.focus();
    }
    this._toggleHamburgerActiveState(state);
  }

  _toggleHamburgerActiveState(state) {
    this._hamburger && this._hamburger.$element().toggleClass(DX_STATE_ACTIVE_CLASS, state);
  }

  _toggleAdaptiveMode(state: boolean): void {
    const $menuItemsContainer = this.$element().find(`.${DX_MENU_HORIZONTAL_CLASS}`);
    const $adaptiveElements = this.$element().find(`.${DX_ADAPTIVE_MODE_CLASS}`);

    if (state) {
      this._hideVisibleSubmenu();
    } else {
      this._treeView && this._treeView.collapseAll();
      this._overlay && this._toggleTreeView(state);
    }

    this._setAriaRole(state);
    // @ts-expect-error
    $menuItemsContainer.toggle(!state);
    // @ts-expect-error
    $adaptiveElements.toggle(state);
  }

  _removeAdaptivity() {
    if (!this._$adaptiveContainer) {
      return;
    }
    this._toggleAdaptiveMode(false);
    this._$adaptiveContainer.remove();
    // @ts-expect-error
    this._$adaptiveContainer = null;
    // @ts-expect-error
    this._treeView = null;
    // @ts-expect-error
    this._hamburger = null;
    // @ts-expect-error
    this._overlay = null;
  }

  _treeviewItemClickHandler(e) {
    this._actions.onItemClick(e);

    if (!e.node.children.length) {
      this._toggleTreeView(false);
    }
  }

  _getAdaptiveOverlayOptions(): OverlayProperties {
    const rtl = this.option('rtlEnabled');
    const position = rtl ? 'right' : 'left';

    return {
      _ignoreFunctionValueDeprecation: true,
      maxHeight: () => getElementMaxHeightByWindow(this.$element()),
      deferRendering: false,
      shading: false,
      // @ts-expect-error
      animation: false,
      hideOnParentScroll: true,
      onHidden: () => {
        this._toggleHamburgerActiveState(false);
      },
      height: 'auto',
      hideOnOutsideClick(e) {
        return !$(e.target).closest(`.${DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS}`).length;
      },
      position: {
        collision: 'flipfit',
        at: `bottom ${position}`,
        my: `top ${position}`,
        // @ts-expect-error
        of: this._hamburger.$element(),
      },
    };
  }

  _getTreeViewOptions() {
    const menuOptions = {};
    const optionsToTransfer = [
      'rtlEnabled', 'width', 'accessKey', 'activeStateEnabled', 'animation', 'dataSource',
      'disabled', 'displayExpr', 'displayExpr', 'focusStateEnabled', 'hint', 'hoverStateEnabled',
      'itemsExpr', 'items', 'itemTemplate', 'selectedExpr',
      'selectionMode', 'tabIndex', 'visible',
    ];
    each(optionsToTransfer, (_, option) => {
      menuOptions[option] = this.option(option);
    });

    const actionsToTransfer = ['onItemContextMenu', 'onSelectionChanged', 'onItemRendered'];
    each(actionsToTransfer, (_, actionName) => {
      menuOptions[actionName] = (e) => {
        this._actions[actionName](e);
      };
    });

    return extend(menuOptions, {
      // @ts-expect-error
      dataSource: this.getDataSource(),
      animationEnabled: !!this.option('animation'),
      onItemClick: this._treeviewItemClickHandler.bind(this),
      onItemExpanded: (e) => {
        this._overlay.repaint();
        this._actions.onSubmenuShown(e);
      },
      onItemCollapsed: (e) => {
        this._overlay.repaint();
        this._actions.onSubmenuHidden(e);
      },
      selectNodesRecursive: false,
      selectByClick: this.option('selectByClick'),
      expandEvent: 'click',
      _supportItemUrl: true,
    });
  }

  _initAdaptivity() {
    if (!this._isAdaptivityEnabled()) return;

    this._$adaptiveContainer = $('<div>').addClass(DX_ADAPTIVE_MODE_CLASS);

    const $hamburger = this._renderHamburgerButton();

    this._treeView = this._createComponent($('<div>'), TreeView, this._getTreeViewOptions());
    // @ts-expect-error
    this._overlay = this._createComponent($('<div>'), Overlay, this._getAdaptiveOverlayOptions());
    // @ts-expect-error
    this._overlay.$content()
      .append(this._treeView.$element())
      .addClass(DX_ADAPTIVE_MODE_CLASS)
      .addClass(this.option('cssClass'));

    // @ts-expect-error
    this._overlay.$wrapper().addClass(DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS);

    this._$adaptiveContainer.append($hamburger);
    this._$adaptiveContainer.append(this._overlay.$element());

    this.$element().append(this._$adaptiveContainer);

    this._updateItemsWidthCache();
    this._dimensionChanged();
  }

  _getDelay(delayType: 'show' | 'hide') {
    // @ts-expect-error
    const { delay } = this.option('showFirstSubmenuMode');

    if (!isDefined(delay)) {
      return DEFAULT_DELAY[delayType];
    }
    return isObject(delay) ? delay[delayType] : delay;
  }

  _keyboardHandler(e): boolean {
    return super._keyboardHandler(e, !!this._visibleSubmenu);
  }

  _renderContainer(): dxElementWrapper {
    const $wrapper = $('<div>');

    $wrapper
      .appendTo(this.$element())
      .addClass(this._isMenuHorizontal() ? DX_MENU_HORIZONTAL_CLASS : DX_MENU_VERTICAL_CLASS);

    return super._renderContainer($wrapper);
  }

  _renderSubmenuItems(node, $itemFrame): Submenu {
    const submenu = this._createSubmenu(node, $itemFrame);

    this._submenus.push(submenu);
    this._renderBorderElement($itemFrame);
    return submenu;
  }

  _getKeyboardListeners() {
    return super._getKeyboardListeners().concat(this._visibleSubmenu);
  }

  _createSubmenu(node, $rootItem: dxElementWrapper): Submenu {
    const $submenuContainer = $('<div>').addClass(DX_CONTEXT_MENU_CLASS)
      .appendTo($rootItem);

    const items = this._getChildNodes(node);
    const subMenu = this._createComponent($submenuContainer, Submenu, extend(this._getSubmenuOptions(), {
      _dataAdapter: this._dataAdapter,
      _parentKey: node.internalFields.key,
      items,
      onHoverStart: this._clearTimeouts.bind(this),
      position: this.getSubmenuPosition($rootItem),
    }));

    this._attachSubmenuHandlers($rootItem, subMenu);

    return subMenu;
  }

  _getSubmenuOptions() {
    const $submenuTarget = $('<div>');
    const isMenuHorizontal = this._isMenuHorizontal();

    return {
      itemTemplate: this.option('itemTemplate'),
      target: $submenuTarget,
      orientation: this.option('orientation'),
      selectionMode: this.option('selectionMode'),
      cssClass: this.option('cssClass'),
      selectByClick: this.option('selectByClick'),
      hoverStateEnabled: this.option('hoverStateEnabled'),
      activeStateEnabled: this.option('activeStateEnabled'),
      focusStateEnabled: this.option('focusStateEnabled'),
      animation: this.option('animation'),
      showSubmenuMode: this.option('showSubmenuMode'),
      displayExpr: this.option('displayExpr'),
      disabledExpr: this.option('disabledExpr'),
      selectedExpr: this.option('selectedExpr'),
      itemsExpr: this.option('itemsExpr'),
      onFocusedItemChanged: (e) => {
        if (!e.component.option('visible')) {
          return;
        }
        this.option('focusedElement', e.component.option('focusedElement'));
      },
      onSelectionChanged: this._nestedItemOnSelectionChangedHandler.bind(this),
      onItemClick: this._nestedItemOnItemClickHandler.bind(this),
      onItemRendered: this._nestedItemOnItemRenderedHandler.bind(this),
      onLeftFirstItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, PREVITEM_OPERATION),
      onLeftLastItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION),
      onCloseRootSubmenu: this._moveMainMenuFocus.bind(this, isMenuHorizontal ? PREVITEM_OPERATION : null),
      onExpandLastSubmenu: isMenuHorizontal ? this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION) : null,
    };
  }

  _getShowFirstSubmenuMode() {
    if (!this._isDesktopDevice()) {
      return 'onClick';
    }

    const optionValue = this.option('showFirstSubmenuMode');

    // @ts-expect-error
    return isObject(optionValue) ? optionValue.name : optionValue;
  }

  _moveMainMenuFocus(direction) {
    const $items = this._getAvailableItems();
    const itemCount = $items.length;
    const $currentItem = $items.filter(`.${DX_MENU_ITEM_EXPANDED_CLASS}`).eq(0);
    let itemIndex = $items.index($currentItem);

    this._hideSubmenu(this._visibleSubmenu);

    itemIndex += direction === PREVITEM_OPERATION ? -1 : 1;

    if (itemIndex >= itemCount) {
      itemIndex = 0;
    } else if (itemIndex < 0) {
      itemIndex = itemCount - 1;
    }

    const $newItem = $items.eq(itemIndex);

    this.option('focusedElement', getPublicElement($newItem));
  }

  _nestedItemOnSelectionChangedHandler(args) {
    const selectedItem = args.addedItems.length && args.addedItems[0];
    const submenu = Submenu.getInstance(args.element);
    const { onSelectionChanged } = this._actions;

    onSelectionChanged(args);

    selectedItem && this._clearSelectionInSubmenus(selectedItem[0], submenu);
    this._clearRootSelection();
    this._setOptionWithoutOptionChange('selectedItem', selectedItem);
  }

  _clearSelectionInSubmenus(item, targetSubmenu) {
    const cleanAllSubmenus = !arguments.length;

    each(this._submenus, (index, submenu) => {
      const $submenu = submenu._itemContainer();
      const isOtherItem = !$submenu.is(targetSubmenu && targetSubmenu._itemContainer());
      const $selectedItem = $submenu.find(`.${this._selectedItemClass()}`);

      if ((isOtherItem && $selectedItem.length) || cleanAllSubmenus) {
        $selectedItem.removeClass(this._selectedItemClass());
        const selectedItemData = this._getItemData($selectedItem);

        if (selectedItemData) {
          selectedItemData.selected = false;
        }

        submenu._clearSelectedItems();
      }
    });
  }

  _clearRootSelection(): void {
    const $prevSelectedItem = this.$element().find(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`).first().children()
      .children()
      .filter(`.${this._selectedItemClass()}`);

    if ($prevSelectedItem.length) {
      const prevSelectedItemData = this._getItemData($prevSelectedItem);
      prevSelectedItemData.selected = false;
      $prevSelectedItem.removeClass(this._selectedItemClass());
    }
  }

  _nestedItemOnItemClickHandler(e): void {
    this._actions.onItemClick(e);
  }

  _nestedItemOnItemRenderedHandler(e): void {
    this._actions.onItemRendered(e);
  }

  _attachSubmenuHandlers($menuAnchorItem, submenu) {
    const $submenuOverlayContent = submenu.getOverlayContent();
    const submenus = $submenuOverlayContent.find(`.${DX_SUBMENU_CLASS}`);
    const submenuMouseLeaveName = addNamespace(hoverEventEnd, `${this.NAME}_submenu`);

    submenu.option({
      onShowing: this._submenuOnShowingHandler.bind(this, $menuAnchorItem, submenu),
      onShown: this._submenuOnShownHandler.bind(this, $menuAnchorItem, submenu),
      onHiding: this._submenuOnHidingHandler.bind(this, $menuAnchorItem, submenu),
      onHidden: this._submenuOnHiddenHandler.bind(this, $menuAnchorItem, submenu),
    });

    each(submenus, (index, submenu) => {
      eventsEngine.off(submenu, submenuMouseLeaveName);
      eventsEngine.on(submenu, submenuMouseLeaveName, null, this._submenuMouseLeaveHandler.bind(this, $menuAnchorItem));
    });
  }

  _submenuOnShowingHandler($menuAnchorItem, submenu, { rootItem }) {
    const $border = $menuAnchorItem.children(`.${DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS}`);
    const params = this._getVisibilityChangeEventParams(rootItem, submenu, $menuAnchorItem);

    this._actions.onSubmenuShowing(params);

    $border.show();

    $menuAnchorItem.addClass(DX_MENU_ITEM_EXPANDED_CLASS);
  }

  _submenuOnShownHandler($menuAnchorItem, submenu, { rootItem }) {
    const params = this._getVisibilityChangeEventParams(rootItem, submenu, $menuAnchorItem);

    this._actions.onSubmenuShown(params);
  }

  _submenuOnHidingHandler($menuAnchorItem, submenu, eventArgs) {
    const $border = $menuAnchorItem.children(`.${DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS}`);
    const params = this._getVisibilityChangeEventParams(eventArgs.rootItem, submenu, $menuAnchorItem, true);

    eventArgs.itemData = params.itemData;
    eventArgs.rootItem = params.rootItem;
    eventArgs.submenuContainer = params.submenuContainer;
    eventArgs.submenu = params.submenu;

    this._actions.onSubmenuHiding(eventArgs);

    if (!eventArgs.cancel) {
      // @ts-expect-error
      if (this._visibleSubmenu === submenu) this._visibleSubmenu = null;
      $border.hide();
      $menuAnchorItem.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
    }
  }

  _submenuOnHiddenHandler($menuAnchorItem, submenu, { rootItem }) {
    const params = this._getVisibilityChangeEventParams(rootItem, submenu, $menuAnchorItem, true);

    this._actions.onSubmenuHidden(params);
  }

  _getVisibilityChangeEventParams(submenuItem, submenu, $menuAnchorItem, isHide?: boolean) {
    let itemData;
    let $submenuContainer;

    if (submenuItem) {
      const anchor = isHide ? $(submenuItem).closest(`.${DX_MENU_ITEM_CLASS}`)[0] : submenuItem;

      itemData = this._getItemData(anchor);
      $submenuContainer = $(anchor).find(`.${DX_SUBMENU_CLASS}`).first();
    } else {
      const $overlayContent = $(submenu._overlay.content());

      itemData = this._getItemData($menuAnchorItem);
      $submenuContainer = $overlayContent.find(`.${DX_SUBMENU_CLASS}`).first();
    }

    return {
      itemData,
      rootItem: getPublicElement($menuAnchorItem),
      submenuContainer: getPublicElement($submenuContainer),
      submenu,
    };
  }

  _submenuMouseLeaveHandler($rootItem: dxElementWrapper, eventArgs): void {
    const target = $(eventArgs.relatedTarget).parents(`.${DX_CONTEXT_MENU_CLASS}`)[0];
    const contextMenu = this._getSubmenuByRootElement($rootItem).getOverlayContent()[0];

    if (this.option('hideSubmenuOnMouseLeave') && target !== contextMenu) {
      this._clearTimeouts();
      setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay('hide'));
    }
  }

  _hideSubmenuAfterTimeout() {
    if (!this._visibleSubmenu) {
      return;
    }

    // @ts-expect-error
    const isRootItemHovered = $(this._visibleSubmenu.$element().context).hasClass(DX_STATE_HOVER_CLASS);
    const isSubmenuItemHovered = this._visibleSubmenu.getOverlayContent().find(`.${DX_STATE_HOVER_CLASS}`).length;
    const hoveredElementFromSubMenu = this._visibleSubmenu.getOverlayContent().get(0).querySelector(':hover');

    if (!hoveredElementFromSubMenu && !isSubmenuItemHovered && !isRootItemHovered) {
      this._visibleSubmenu.hide();
    }
  }

  _getSubmenuByRootElement($rootItem: dxElementWrapper): Submenu {
    if (!$rootItem) {
      // @ts-expect-error
      return false;
    }

    const $submenu = $rootItem.children(`.${DX_CONTEXT_MENU_CLASS}`);

    return $submenu.length && Submenu.getInstance($submenu);
  }

  getSubmenuPosition($rootItem) {
    const isHorizontalMenu = this._isMenuHorizontal();
    // @ts-expect-error
    const submenuDirection = this.option('submenuDirection').toLowerCase();
    const rtlEnabled = this.option('rtlEnabled');
    const submenuPosition: PositionConfig = {
      collision: 'flip',
      of: $rootItem,
      // @ts-expect-error
      precise: true,
    };

    switch (submenuDirection) {
      case 'leftortop':
        submenuPosition.at = 'left top';
        submenuPosition.my = isHorizontalMenu ? 'left bottom' : 'right top';
        break;
      case 'rightorbottom':
        submenuPosition.at = isHorizontalMenu ? 'left bottom' : 'right top';
        submenuPosition.my = 'left top';
        break;
      default:
        if (isHorizontalMenu) {
          submenuPosition.at = rtlEnabled ? 'right bottom' : 'left bottom';
          submenuPosition.my = rtlEnabled ? 'right top' : 'left top';
        } else {
          submenuPosition.at = rtlEnabled ? 'left top' : 'right top';
          submenuPosition.my = rtlEnabled ? 'right top' : 'left top';
        }
        break;
    }

    return submenuPosition;
  }

  _renderBorderElement($item: dxElementWrapper): void {
    $('<div>')
      .appendTo($item)
      .addClass(DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS)
      .hide();
  }

  _itemPointerDownHandler(e): void {
    const $target = $(e.target);
    const $closestItem = $target.closest(this._itemElements());

    if ($closestItem.hasClass('dx-menu-item-has-submenu')) {
      this.option('focusedElement', null);
      return;
    }

    super._itemPointerDownHandler(e);
  }

  _hoverStartHandler(e) {
    const mouseMoveEventName = addNamespace(pointerEvents.move, this.NAME);
    const $item = this._getItemElementByEventArgs(e);
    const node = this._dataAdapter.getNodeByItem(this._getItemData($item));
    const isSelectionActive = isDefined(e.buttons) && e.buttons === 1 || !isDefined(e.buttons) && e.which === 1;

    if (this._isItemDisabled($item)) {
      return;
    }

    eventsEngine.off($item, mouseMoveEventName);

    if (!this._hasChildren(node)) {
      this._showSubmenuTimer = setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay('hide'));
      return;
    }

    if (this._getShowFirstSubmenuMode() === 'onHover' && !isSelectionActive) {
      const submenu = this._getSubmenuByElement($item);

      this._clearTimeouts();

      if (!submenu.isOverlayVisible()) {
        eventsEngine.on($item, mouseMoveEventName, this._itemMouseMoveHandler.bind(this));
        this._showSubmenuTimer = this._getDelay('hide');
      }
    }
  }

  _hoverEndHandler(eventArg): void {
    const $item = this._getItemElementByEventArgs(eventArg);
    const relatedTarget = $(eventArg.relatedTarget);

    super._hoverEndHandler(eventArg);
    this._clearTimeouts();

    if (this._isItemDisabled($item)) {
      return;
    }

    if (relatedTarget.hasClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS)) {
      return;
    }

    if (this.option('hideSubmenuOnMouseLeave') && !relatedTarget.hasClass(DX_MENU_ITEMS_CONTAINER_CLASS)) {
      this._hideSubmenuTimer = setTimeout(() => { this._hideSubmenuAfterTimeout(); }, this._getDelay('hide'));
    }
  }

  _hideVisibleSubmenu(): boolean {
    if (!this._visibleSubmenu) {
      return false;
    }

    this._hideSubmenu(this._visibleSubmenu);
    return true;
  }

  _showSubmenu($itemElement): void {
    const submenu = this._getSubmenuByElement($itemElement);

    if (this._visibleSubmenu !== submenu) {
      this._hideVisibleSubmenu();
    }

    if (submenu) {
      this._clearTimeouts();
      this.focus();

      submenu.show();
      this.option('focusedElement', submenu.option('focusedElement'));
    }

    this._visibleSubmenu = submenu;
    this._hoveredRootItem = $itemElement;
  }

  _hideSubmenu(submenu) {
    if (submenu) {
      submenu.hide();
    }

    if (this._visibleSubmenu === submenu) {
      // @ts-expect-error
      this._visibleSubmenu = null;
    }
    // @ts-expect-error
    this._hoveredRootItem = null;
  }

  _itemMouseMoveHandler(e) {
    // todo: replace mousemove with hover event
    if (e.pointers && e.pointers.length) {
      return;
    }

    const $item = $(e.currentTarget);

    if (!isDefined(this._showSubmenuTimer)) {
      return;
    }

    this._clearTimeouts();

    this._showSubmenuTimer = setTimeout(() => {
      const submenu = this._getSubmenuByElement($item);

      if (submenu && !submenu.isOverlayVisible()) {
        this._showSubmenu($item);
      }
    }, this._getDelay('show'));
  }

  _clearTimeouts(): void {
    clearTimeout(this._hideSubmenuTimer);
    clearTimeout(this._showSubmenuTimer);
  }

  _getSubmenuByElement($itemElement: dxElementWrapper, itemData?: Item): Submenu {
    const submenu = this._getSubmenuByRootElement($itemElement);

    if (submenu) {
      return submenu;
    }
    itemData = itemData ?? this._getItemData($itemElement);

    const node = this._dataAdapter.getNodeByItem(itemData);
    // @ts-expect-error
    return this._hasChildren(node) && this._renderSubmenuItems(node, $itemElement);
  }

  _updateSubmenuVisibilityOnClick(actionArgs) {
    const args = actionArgs.args.length && actionArgs.args[0];

    // @ts-expect-error
    if (!args || this._disabledGetter(args.itemData)) {
      return;
    }

    const $itemElement = $(args.itemElement);
    const currentSubmenu = this._getSubmenuByElement($itemElement, args.itemData);

    this._updateSelectedItemOnClick(actionArgs);

    if (this._visibleSubmenu) {
      if (this._visibleSubmenu === currentSubmenu) {
        // @ts-expect-error
        if (this.option('showFirstSubmenuMode') === 'onClick') this._hideSubmenu(this._visibleSubmenu);
        return;
      }
      this._hideSubmenu(this._visibleSubmenu);
    }

    if (!currentSubmenu) {
      return;
    }

    if (!currentSubmenu.isOverlayVisible()) {
      this._showSubmenu($itemElement);
    }
  }

  _optionChanged(args) {
    if (ACTIONS.includes(args.name)) {
      this._initActions();
      return;
    }

    switch (args.name) {
      case 'orientation':
      case 'submenuDirection':
        this._invalidate();
        break;
      case 'showFirstSubmenuMode':
      case 'hideSubmenuOnMouseLeave':
        break;
      case 'showSubmenuMode':
        this._changeSubmenusOption(args.name, args.value);
        break;
      case 'adaptivityEnabled':
        args.value ? this._initAdaptivity() : this._removeAdaptivity();
        break;
      case 'width':
        if (this._isAdaptivityEnabled()) {
          this._treeView.option(args.name, args.value);
          this._overlay.option(args.name, args.value);
        }
        super._optionChanged(args);
        this._dimensionChanged();
        break;
      case 'animation':
        if (this._isAdaptivityEnabled()) {
          this._treeView.option('animationEnabled', !!args.value);
        }
        super._optionChanged(args);
        break;
      default:
        if (this._isAdaptivityEnabled() && ((args.name === args.fullName) || (args.name === 'items'))) {
          // TODO: if(args.name === 'items') this._treeView.option('items', this.option('items')) or treeView.repaint() ?
          this._treeView.option(args.fullName, args.value);
        }
        super._optionChanged(args);
    }
  }

  _changeSubmenusOption(name, value): void {
    each(this._submenus, (index, submenu) => {
      submenu.option(name, value);
    });
  }

  selectItem(itemElement): void {
    this._hideSubmenu(this._visibleSubmenu);
    super.selectItem(itemElement);
  }

  unselectItem(itemElement): void {
    this._hideSubmenu(this._visibleSubmenu);
    super.unselectItem(itemElement);
  }
}

registerComponent('dxMenu', Menu);

export default Menu;
