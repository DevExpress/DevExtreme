import type { PositionConfig } from '@js/common/core/animation';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { end as hoverEventEnd } from '@js/common/core/events/hover';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils';
import registerComponent from '@js/core/component_registrator';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getOuterWidth } from '@js/core/utils/size';
import { isDefined, isObject } from '@js/core/utils/type';
import type { DxEvent, EventInfo } from '@js/events';
import Button from '@js/ui/button';
import type dxMenuBase from '@js/ui/context_menu/ui.menu_base';
import type {
  Item,
  ItemClickEvent,
  ItemContextMenuEvent,
  ItemRenderedEvent,
  Properties,
  SelectionChangedEvent,
  SubmenuHiddenEvent,
  SubmenuHidingEvent,
  SubmenuShowingEvent,
  SubmenuShowMode,
  SubmenuShownEvent,
} from '@js/ui/menu';
import type { Properties as OverlayProperties } from '@js/ui/overlay';
import Overlay from '@js/ui/overlay/ui.overlay';
import type {
  ItemClickEvent as TreeViewItemClickEvent,
  ItemCollapsedEvent as TreeViewItemCollapsedEvent,
  ItemExpandedEvent as TreeViewItemExpandedEvent,
} from '@js/ui/tree_view';
import TreeView from '@js/ui/tree_view';
import type { OptionChanged } from '@ts/core/widget/types';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import type {
  ClickEvent,
  HoverEvent,
  ItemClickActionArguments,
  MenuBaseProperties,
} from '@ts/ui/context_menu/menu_base';
import MenuBase from '@ts/ui/context_menu/menu_base';
import type { InternalNode } from '@ts/ui/hierarchical_collection/data_converter';
import { getElementMaxHeightByWindow } from '@ts/ui/overlay/utils';
import type { TreeViewBaseProperties } from '@ts/ui/tree_view/tree_view.base';

import type { SubmenuProperties } from './submenu';
import Submenu from './submenu';

const DX_MENU_CLASS = 'dx-menu';
const DX_MENU_VERTICAL_CLASS = `${DX_MENU_CLASS}-vertical`;
const DX_MENU_HORIZONTAL_CLASS = `${DX_MENU_CLASS}-horizontal`;
export const DX_MENU_ITEM_CLASS = `${DX_MENU_CLASS}-item`;
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
const NEXT_ITEM_OPERATION = 'nextItem';
const PREV_ITEM_OPERATION = 'prevItem';

const DEFAULT_DELAY = {
  show: 50,
  hide: 300,
};

const ACTIONS = [
  'onSubmenuShowing',
  'onSubmenuShown',
  'onSubmenuHiding',
  'onSubmenuHidden',
  'onItemContextMenu',
  'onItemClick',
  'onSelectionChanged',
  'onItemRendered',
] as const;

type MenuNode = InternalNode & Item;
interface SubmenuVisibilityChangeEventParams {
  cancel?: boolean;
  itemData?: Item;
  rootItem: Element;
  submenuContainer: Element;
  submenu: Submenu;
}

interface MenuActions {
  onSubmenuShowing?: (e: SubmenuShowingEvent | SubmenuVisibilityChangeEventParams) => void;
  onSubmenuShown?: (e: SubmenuShownEvent | SubmenuVisibilityChangeEventParams) => void;
  onSubmenuHiding?: (e: SubmenuHidingEvent | SubmenuVisibilityChangeEventParams) => void;
  onSubmenuHidden?: (e: SubmenuHiddenEvent | SubmenuVisibilityChangeEventParams) => void;
  onItemContextMenu?: (e: ItemContextMenuEvent) => void;
  onItemClick?: (e: ItemClickEvent) => void;
  onSelectionChanged?: (e: SelectionChangedEvent) => void;
  onItemRendered?: (e: ItemRenderedEvent) => void;
}

type MenuPropertiesKeys = Exclude<keyof Properties, keyof MenuBaseProperties>;

interface MenuProperties extends
  MenuBaseProperties,
  Pick<Properties, MenuPropertiesKeys> {
  templatesRenderAsynchronously?: boolean;
}

class Menu extends MenuBase<MenuProperties> {
  // Temporary solution. Move to component level
  public NAME!: string;

  _submenus!: Submenu[];

  _visibleSubmenu?: Submenu | null;

  _overlay!: Overlay | null;

  _treeView!: TreeView | null;

  _hamburger?: Button | null;

  _$adaptiveContainer?: dxElementWrapper | null;

  _menuItemsWidth!: number;

  _hoveredRootItem?: dxElementWrapper | null;

  // eslint-disable-next-line no-restricted-globals
  _showSubmenuTimer?: ReturnType<typeof setTimeout> | number;

  // eslint-disable-next-line no-restricted-globals
  _hideSubmenuTimer?: ReturnType<typeof setTimeout>;

  // eslint-disable-next-line no-restricted-globals
  _resizeEventTimer?: ReturnType<typeof setTimeout>;

  // @ts-expect-error ts-error
  _actions!: MenuActions;

  _getDefaultOptions(): MenuProperties {
    return {
      ...super._getDefaultOptions(),
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
      // @ts-expect-error ts-error
      onSubmenuShowing: null,
      // @ts-expect-error ts-error
      onSubmenuShown: null,
      // @ts-expect-error ts-error
      onSubmenuHiding: null,
      // @ts-expect-error ts-error
      onSubmenuHidden: null,
      adaptivityEnabled: false,
    };
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      animation: true,
      selectedItem: true,
    });
  }

  _itemElements(): dxElementWrapper {
    const rootMenuElements = super._itemElements();
    const submenuElements = this._submenuItemElements();

    // @ts-expect-error ts-error
    return rootMenuElements.add(submenuElements);
  }

  _submenuItemElements(): dxElementWrapper {
    const itemSelector = `.${DX_MENU_ITEM_CLASS}`;
    const currentSubmenu = this._submenus.length && this._submenus[0];

    if (currentSubmenu && currentSubmenu.itemsContainer()) {
      return currentSubmenu.itemsContainer()?.find(itemSelector) ?? $();
    }

    return $();
  }

  _focusTarget(): dxElementWrapper {
    return this.$element();
  }

  _isMenuHorizontal(): boolean {
    const { orientation } = this.option();

    return orientation === 'horizontal';
  }

  // eslint-disable-next-line consistent-return,@typescript-eslint/no-invalid-void-type
  _moveFocus(location: string): boolean | undefined | void {
    const $items = this._getAvailableItems();
    const isMenuHorizontal = this._isMenuHorizontal();
    const $activeItem = this._getActiveItem(true);

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let $argument: dxElementWrapper;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let operation: string;

    switch (location) {
      case FOCUS_UP:
        operation = isMenuHorizontal
          ? SHOW_SUBMENU_OPERATION
          : this._getItemsNavigationOperation(PREV_ITEM_OPERATION);
        $argument = isMenuHorizontal ? $activeItem : $items;
        break;
      case FOCUS_DOWN:
        operation = isMenuHorizontal
          ? SHOW_SUBMENU_OPERATION
          : this._getItemsNavigationOperation(NEXT_ITEM_OPERATION);
        $argument = isMenuHorizontal ? $activeItem : $items;
        break;
      case FOCUS_RIGHT:
        operation = isMenuHorizontal
          ? this._getItemsNavigationOperation(NEXT_ITEM_OPERATION)
          : SHOW_SUBMENU_OPERATION;
        $argument = isMenuHorizontal ? $items : $activeItem;
        break;
      case FOCUS_LEFT:
        operation = isMenuHorizontal
          ? this._getItemsNavigationOperation(PREV_ITEM_OPERATION)
          : SHOW_SUBMENU_OPERATION;
        $argument = isMenuHorizontal ? $items : $activeItem;
        break;
      default:
        return super._moveFocus(location);
    }

    const navigationAction = this._getKeyboardNavigationAction(operation, $argument);
    const $newTarget = navigationAction();

    if ($newTarget && $newTarget.length !== 0) {
      this.option('focusedElement', getPublicElement($newTarget));
    }
  }

  _getItemsNavigationOperation(operation: string): string {
    const { rtlEnabled } = this.option();

    if (rtlEnabled) {
      return operation === PREV_ITEM_OPERATION ? NEXT_ITEM_OPERATION : PREV_ITEM_OPERATION;
    }

    return operation;
  }

  _getKeyboardNavigationAction(
    operation: string,
    argument: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ): () => dxElementWrapper | void {
    let action = noop;

    switch (operation) {
      case SHOW_SUBMENU_OPERATION:
        if (!argument.hasClass(DX_STATE_DISABLED_CLASS)) {
          action = this._showSubmenu.bind(this, argument);
        }
        break;
      case NEXT_ITEM_OPERATION:
        action = this._nextItem.bind(this, argument);
        break;
      case PREV_ITEM_OPERATION:
        action = this._prevItem.bind(this, argument);
        break;
      default:
        break;
    }

    return action;
  }

  _clean(): void {
    super._clean();

    const { templatesRenderAsynchronously } = this.option();

    if (templatesRenderAsynchronously) {
      clearTimeout(this._resizeEventTimer);
    }
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      if (!this._menuItemsWidth) {
        this._updateItemsWidthCache();
      }
      this._dimensionChanged();
    }
  }

  _isAdaptivityEnabled(): boolean {
    const { adaptivityEnabled, orientation } = this.option();

    return !!adaptivityEnabled && orientation === 'horizontal';
  }

  _updateItemsWidthCache(): void {
    const $menuItems = this.$element()
      .find('ul')
      .first()
      .children('li')
      .children(`.${DX_MENU_ITEM_CLASS}`);

    this._menuItemsWidth = this._getSummaryItemsSize('width', $menuItems, true);
  }

  _dimensionChanged(): void {
    if (!this._isAdaptivityEnabled()) {
      return;
    }

    const containerWidth: number = getOuterWidth(this.$element());
    this._toggleAdaptiveMode(this._menuItemsWidth > containerWidth);
  }

  _init(): void {
    super._init();
    this._submenus = [];
  }

  _initActions(): void {
    this._actions = {};

    each(ACTIONS, (_index: number, action: typeof ACTIONS[number]) => {
      this._actions[action] = this._createActionByOption(action);
    });
  }

  _initMarkup(): void {
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

  _isTargetOutOfComponent(relatedTarget: Element): boolean {
    const isInsideRootMenu = $(relatedTarget).closest(`.${DX_MENU_CLASS}`).length !== 0;
    const isInsideContextMenu = $(relatedTarget).closest(`.${DX_CONTEXT_MENU_CLASS}`).length !== 0;

    return !(isInsideRootMenu || isInsideContextMenu);
  }

  _focusOutHandler(e: DxEvent<FocusEvent>): void {
    const { relatedTarget } = e;

    if (relatedTarget) {
      const isTargetOutside = this._isTargetOutOfComponent(relatedTarget as Element);

      if (isTargetOutside) {
        this._hideVisibleSubmenu();
      }
    }

    super._focusOutHandler(e);
  }

  _renderHamburgerButton(): dxElementWrapper {
    // @ts-expect-error ts-error
    this._hamburger = new Button($('<div>').addClass(DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS), {
      icon: 'menu',
      activeStateEnabled: false,
      onClick: (): void => {
        this._toggleTreeView();
      },
    });

    return this._hamburger.$element();
  }

  _toggleTreeView(visible?: boolean): void {
    const isTreeViewVisible = visible ?? !this._overlay?.option()?.visible;

    this._overlay?.option('visible', isTreeViewVisible);

    if (isTreeViewVisible) {
      this._treeView?.focus();
    }
    this._toggleHamburgerActiveState(isTreeViewVisible);
  }

  _toggleHamburgerActiveState(isActive: boolean): void {
    this._hamburger?.$element().toggleClass(DX_STATE_ACTIVE_CLASS, isActive);
  }

  _toggleAdaptiveMode(isAdaptive: boolean): void {
    const $menuItemsContainer = this.$element().find(`.${DX_MENU_HORIZONTAL_CLASS}`);
    const $adaptiveElements = this.$element().find(`.${DX_ADAPTIVE_MODE_CLASS}`);

    if (isAdaptive) {
      this._hideVisibleSubmenu();
    } else {
      this._treeView?.collapseAll();
      if (this._overlay) {
        this._toggleTreeView(isAdaptive);
      }
    }

    this._setAriaRole(isAdaptive);
    $menuItemsContainer.toggle(!isAdaptive);
    $adaptiveElements.toggle(isAdaptive);
  }

  _removeAdaptivity(): void {
    if (!this._$adaptiveContainer) {
      return;
    }
    this._toggleAdaptiveMode(false);
    this._$adaptiveContainer.remove();
    this._$adaptiveContainer = null;
    this._treeView = null;
    this._hamburger = null;
    this._overlay = null;
  }

  _treeviewItemClickHandler(e: TreeViewItemClickEvent): void {
    // @ts-expect-error ts-error
    this._actions.onItemClick(e);

    if (!e.node?.children?.length) {
      this._toggleTreeView(false);
    }
  }

  _getAdaptiveOverlayOptions(): OverlayProperties {
    const { rtlEnabled } = this.option();
    const position = rtlEnabled ? 'right' : 'left';

    return {
      _ignoreFunctionValueDeprecation: true,
      // @ts-expect-error ts-error
      maxHeight: () => getElementMaxHeightByWindow(this.$element()),
      deferRendering: false,
      shading: false,
      // @ts-expect-error ts-error
      animation: false,
      hideOnParentScroll: true,
      onHidden: (): void => {
        this._toggleHamburgerActiveState(false);
      },
      height: 'auto',
      hideOnOutsideClick(e: DxEvent): boolean {
        return !$(e.target).closest(`.${DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS}`).length;
      },
      position: {
        collision: 'flipfit',
        at: `bottom ${position}`,
        my: `top ${position}`,
        of: this._hamburger?.$element(),
      },
    };
  }

  _getTreeViewOptions(): TreeViewBaseProperties {
    const menuOptions = {};
    const optionsToTransfer = [
      'rtlEnabled', 'width', 'accessKey', 'activeStateEnabled', 'animation', 'dataSource',
      'disabled', 'displayExpr', 'displayExpr', 'focusStateEnabled', 'hint', 'hoverStateEnabled',
      'itemsExpr', 'items', 'itemTemplate', 'selectedExpr',
      'selectionMode', 'tabIndex', 'visible',
    ];
    each(optionsToTransfer, (_index: number, option: string) => {
      menuOptions[option] = this.option(option);
    });

    const actionsToTransfer = ['onItemContextMenu', 'onSelectionChanged', 'onItemRendered'];
    each(actionsToTransfer, (_index: number, actionName: string) => {
      menuOptions[actionName] = (e: DxEvent): void => {
        this._actions[actionName](e);
      };
    });

    const { animation, selectByClick } = this.option();

    return {
      ...menuOptions,
      // @ts-expect-error ts-error
      dataSource: this.getDataSource(),
      animationEnabled: !!animation,
      onItemClick: this._treeviewItemClickHandler.bind(this),
      onItemExpanded: (e: TreeViewItemExpandedEvent): void => {
        this._overlay?.repaint();
        // @ts-expect-error ts-error
        this._actions.onSubmenuShown?.(e);
      },
      onItemCollapsed: (e: TreeViewItemCollapsedEvent): void => {
        this._overlay?.repaint();
        // @ts-expect-error ts-error
        this._actions.onSubmenuHidden?.(e);
      },
      selectNodesRecursive: false,
      selectByClick,
      expandEvent: 'click',
      _supportItemUrl: true,
    };
  }

  _initAdaptivity(): void {
    if (!this._isAdaptivityEnabled()) {
      return;
    }

    const { cssClass } = this.option();

    const $hamburger = this._renderHamburgerButton();
    this._treeView = this._createComponent($('<div>'), TreeView, this._getTreeViewOptions());
    this._overlay = this._createComponent($('<div>'), Overlay, this._getAdaptiveOverlayOptions());
    this._overlay.$content()
      ?.append(this._treeView.$element())
      .addClass(DX_ADAPTIVE_MODE_CLASS)
      // @ts-expect-error ts-error
      .addClass(cssClass);

    this._overlay.$wrapper()?.addClass(DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS);

    this._$adaptiveContainer = $('<div>').addClass(DX_ADAPTIVE_MODE_CLASS);
    this._$adaptiveContainer.append($hamburger);
    this._$adaptiveContainer.append(this._overlay.$element());

    this.$element().append(this._$adaptiveContainer);

    this._updateItemsWidthCache();
    this._dimensionChanged();
  }

  _getDelay(delayType: 'show' | 'hide'): number {
    const { showFirstSubmenuMode } = this.option();
    const delay = isObject(showFirstSubmenuMode) ? showFirstSubmenuMode.delay : undefined;

    if (!isDefined(delay)) {
      return DEFAULT_DELAY[delayType];
    }
    return isObject(delay) ? delay[delayType] ?? DEFAULT_DELAY[delayType] : delay;
  }

  _keyboardHandler(e: KeyboardKeyDownEvent): boolean {
    return super._keyboardHandler(e, !!this._visibleSubmenu);
  }

  _renderContainer(): dxElementWrapper {
    const $wrapper = $('<div>');

    $wrapper
      .appendTo(this.$element())
      .addClass(this._isMenuHorizontal() ? DX_MENU_HORIZONTAL_CLASS : DX_MENU_VERTICAL_CLASS);

    return super._renderContainer($wrapper);
  }

  _renderSubmenuItems(node: MenuNode, $itemFrame: dxElementWrapper): Submenu {
    const submenu = this._createSubmenu(node, $itemFrame);

    this._submenus.push(submenu);
    this._renderBorderElement($itemFrame);
    return submenu;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getKeyboardListeners(): any[] {
    return super._getKeyboardListeners().concat(this._visibleSubmenu);
  }

  _createSubmenu(node: MenuNode, $rootItem: dxElementWrapper): Submenu {
    const $submenuContainer = $('<div>')
      .addClass(DX_CONTEXT_MENU_CLASS)
      .appendTo($rootItem);

    const items = this._getChildNodes(node);
    const subMenu = this._createComponent(
      $submenuContainer,
      Submenu,
      {
        ...this._getSubmenuOptions(),
        _dataAdapter: this._dataAdapter,
        _parentKey: node.internalFields.key,
        items,
        onHoverStart: this._clearTimeouts.bind(this),
        position: this.getSubmenuPosition($rootItem),
      },
    );

    this._attachSubmenuHandlers($rootItem, subMenu);

    return subMenu;
  }

  _getSubmenuOptions(): SubmenuProperties {
    const $submenuTarget = $('<div>');
    const isMenuHorizontal = this._isMenuHorizontal();
    const {
      itemTemplate,
      orientation,
      selectionMode,
      cssClass,
      selectByClick,
      hoverStateEnabled,
      activeStateEnabled,
      focusStateEnabled,
      animation,
      showSubmenuMode,
      displayExpr,
      disabledExpr,
      selectedExpr,
      itemsExpr,
    } = this.option();

    return {
      itemTemplate,
      // @ts-expect-error ts-error
      target: $submenuTarget,
      orientation,
      selectionMode,
      cssClass,
      selectByClick,
      hoverStateEnabled,
      activeStateEnabled,
      focusStateEnabled,
      animation,
      showSubmenuMode,
      displayExpr,
      disabledExpr,
      selectedExpr,
      itemsExpr,
      onFocusedItemChanged: (e: EventInfo<dxMenuBase<SubmenuProperties>>): void => {
        const { visible, focusedElement } = e.component.option();

        if (!visible) {
          return;
        }

        this.option('focusedElement', focusedElement);
      },
      // @ts-expect-error ts-error
      onSelectionChanged: this._nestedItemOnSelectionChangedHandler.bind(this),
      // @ts-expect-error ts-error
      onItemClick: this._nestedItemOnItemClickHandler.bind(this),
      // @ts-expect-error ts-error
      onItemRendered: this._nestedItemOnItemRenderedHandler.bind(this),
      onLeftFirstItem:
        isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, PREV_ITEM_OPERATION),
      onLeftLastItem:
        isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, NEXT_ITEM_OPERATION),
      onCloseRootSubmenu:
        this._moveMainMenuFocus.bind(this, isMenuHorizontal ? PREV_ITEM_OPERATION : null),
      onExpandLastSubmenu:
        isMenuHorizontal ? this._moveMainMenuFocus.bind(this, NEXT_ITEM_OPERATION) : null,
    };
  }

  _getShowFirstSubmenuMode(): SubmenuShowMode | undefined {
    if (!this._isDesktopDevice()) {
      return 'onClick';
    }

    const { showFirstSubmenuMode: optionValue } = this.option();

    return isObject(optionValue) ? optionValue.name : optionValue;
  }

  _moveMainMenuFocus(
    direction: typeof PREV_ITEM_OPERATION | typeof NEXT_ITEM_OPERATION | null,
  ): void {
    const $items = this._getAvailableItems();
    const itemCount = $items.length;
    const $currentItem = $items.filter(`.${DX_MENU_ITEM_EXPANDED_CLASS}`).eq(0);
    let itemIndex = $items.index($currentItem);

    this._hideSubmenu(this._visibleSubmenu);

    itemIndex += direction === PREV_ITEM_OPERATION ? -1 : 1;

    if (itemIndex >= itemCount) {
      itemIndex = 0;
    } else if (itemIndex < 0) {
      itemIndex = itemCount - 1;
    }

    const $newItem = $items.eq(itemIndex);

    this.option('focusedElement', getPublicElement($newItem));
  }

  _nestedItemOnSelectionChangedHandler(args: SelectionChangedEvent): void {
    const selectedItem = args.addedItems.length && args.addedItems[0];
    const submenu: Submenu = Submenu.getInstance(args.element);
    const { onSelectionChanged } = this._actions;

    onSelectionChanged?.(args);

    if (selectedItem) {
      this._clearSelectionInSubmenus(submenu);
    }
    this._clearRootSelection();
    this._setOptionWithoutOptionChange('selectedItem', selectedItem);
  }

  _clearSelectionInSubmenus(targetSubmenu: Submenu): void {
    const cleanAllSubmenus = !arguments.length;

    each(this._submenus, (_index: number, submenu: Submenu) => {
      const $submenu = submenu._itemContainer();
      const isOtherItem = !$submenu.is(targetSubmenu?._itemContainer());
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

  _nestedItemOnItemClickHandler(e: ItemClickEvent): void {
    this._actions.onItemClick?.(e);
  }

  _nestedItemOnItemRenderedHandler(e: ItemRenderedEvent): void {
    this._actions.onItemRendered?.(e);
  }

  _attachSubmenuHandlers($menuAnchorItem: dxElementWrapper, submenu: Submenu): void {
    const $submenuOverlayContent = submenu.getOverlayContent();
    const submenus = $submenuOverlayContent?.find(`.${DX_SUBMENU_CLASS}`);
    const submenuMouseLeaveName = addNamespace(hoverEventEnd, `${this.NAME}_submenu`);

    submenu.option({
      onShowing: this._submenuOnShowingHandler.bind(this, $menuAnchorItem, submenu),
      onShown: this._submenuOnShownHandler.bind(this, $menuAnchorItem, submenu),
      onHiding: this._submenuOnHidingHandler.bind(this, $menuAnchorItem, submenu),
      onHidden: this._submenuOnHiddenHandler.bind(this, $menuAnchorItem, submenu),
    });

    each(submenus, (_index: number, subMenu: Submenu) => {
      eventsEngine.off(subMenu, submenuMouseLeaveName);
      eventsEngine.on(
        subMenu,
        submenuMouseLeaveName,
        null,
        this._submenuMouseLeaveHandler.bind(this, $menuAnchorItem),
      );
    });
  }

  _submenuOnShowingHandler(
    $menuAnchorItem: dxElementWrapper,
    submenu: Submenu,
    { rootItem }: SubmenuShowingEvent,
  ): void {
    const $border = $menuAnchorItem.children(`.${DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS}`);
    const params = this._getVisibilityChangeEventParams(rootItem, submenu, $menuAnchorItem);

    this._actions.onSubmenuShowing?.(params);

    $border.show();

    $menuAnchorItem.addClass(DX_MENU_ITEM_EXPANDED_CLASS);
  }

  _submenuOnShownHandler(
    $menuAnchorItem: dxElementWrapper,
    submenu: Submenu,
    { rootItem }: SubmenuShownEvent,
  ): void {
    const params = this._getVisibilityChangeEventParams(rootItem, submenu, $menuAnchorItem);

    this._actions.onSubmenuShown?.(params);
  }

  _submenuOnHidingHandler(
    $menuAnchorItem: dxElementWrapper,
    submenu: Submenu,
    eventArgs: SubmenuHidingEvent | SubmenuVisibilityChangeEventParams,
  ): void {
    const $border = $menuAnchorItem.children(`.${DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS}`);
    const params = this._getVisibilityChangeEventParams(
      eventArgs.rootItem,
      submenu,
      $menuAnchorItem,
      true,
    );

    // @ts-expect-error ts-error
    // noinspection JSConstantReassignment
    eventArgs.itemData = params.itemData;
    // @ts-expect-error ts-error
    // noinspection JSConstantReassignment
    eventArgs.rootItem = params.rootItem;
    // @ts-expect-error ts-error
    // noinspection JSConstantReassignment
    eventArgs.submenuContainer = params.submenuContainer;
    // @ts-expect-error ts-error
    eventArgs.submenu = params.submenu;

    this._actions.onSubmenuHiding?.(eventArgs);

    if (eventArgs.cancel) {
      return;
    }

    const { focusedElement } = this.option();
    const submenuContainerElement = $(eventArgs.submenuContainer).get(0);
    const focusedDomElement = $(focusedElement).get(0);
    const isFocusedElementInsideSubmenu = focusedDomElement && submenuContainerElement
      ? submenuContainerElement.contains(focusedDomElement)
      : false;

    if (isFocusedElementInsideSubmenu) {
      this.option('focusedElement', getPublicElement($menuAnchorItem));
    }

    const isVisibleSubmenuHiding = this._visibleSubmenu === submenu;

    if (isVisibleSubmenuHiding) {
      this._visibleSubmenu = null;
    }

    $border.hide();
    $menuAnchorItem.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
  }

  _submenuOnHiddenHandler(
    $menuAnchorItem: dxElementWrapper,
    submenu: Submenu,
    { rootItem }: SubmenuHiddenEvent,
  ): void {
    const params = this._getVisibilityChangeEventParams(rootItem, submenu, $menuAnchorItem, true);

    this._actions.onSubmenuHidden?.(params);
  }

  _getVisibilityChangeEventParams(
    submenuItem: Element | undefined,
    submenu: Submenu,
    $menuAnchorItem: dxElementWrapper,
    isHide?: boolean,
  ): SubmenuVisibilityChangeEventParams {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let itemData: Item | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let $submenuContainer: dxElementWrapper | undefined;

    if (submenuItem) {
      const anchor = isHide ? $(submenuItem).closest(`.${DX_MENU_ITEM_CLASS}`)[0] : submenuItem;

      itemData = this._getItemData(anchor);
      $submenuContainer = $(anchor).find(`.${DX_SUBMENU_CLASS}`).first();
    } else {
      const $overlayContent = $(submenu._overlay?.content());

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

  _submenuMouseLeaveHandler($rootItem: dxElementWrapper, eventArgs: HoverEvent): void {
    const target: dxElementWrapper = $(eventArgs.relatedTarget as Element).parents(`.${DX_CONTEXT_MENU_CLASS}`)[0];
    const submenu = this._getSubmenuByRootElement($rootItem);
    const contextMenu: dxElementWrapper | undefined = submenu?.getOverlayContent()?.[0];
    const { hideSubmenuOnMouseLeave } = this.option();

    if (hideSubmenuOnMouseLeave && target !== contextMenu) {
      this._clearTimeouts();
      // eslint-disable-next-line no-restricted-globals
      setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay('hide'));
    }
  }

  _hideSubmenuAfterTimeout(): void {
    if (!this._visibleSubmenu) {
      return;
    }

    // @ts-expect-error ts-error
    const isRootItemHovered = $(this._visibleSubmenu.$element().context)
      .hasClass(DX_STATE_HOVER_CLASS);
    const isSubmenuItemHovered = this._visibleSubmenu.getOverlayContent()?.find(`.${DX_STATE_HOVER_CLASS}`).length;
    const hoveredElementFromSubMenu = this._visibleSubmenu.getOverlayContent()?.get(0).querySelector(':hover');

    if (!hoveredElementFromSubMenu && !isSubmenuItemHovered && !isRootItemHovered) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._visibleSubmenu.hide();
    }
  }

  _getSubmenuByRootElement($rootItem: dxElementWrapper): Submenu | undefined {
    if (!$rootItem) {
      return undefined;
    }

    const $submenu = $rootItem.children(`.${DX_CONTEXT_MENU_CLASS}`);

    if (!$submenu.length) {
      return undefined;
    }

    return Submenu.getInstance($submenu);
  }

  getSubmenuPosition($rootItem: dxElementWrapper): PositionConfig {
    const { submenuDirection: submenuDirectionOption, rtlEnabled } = this.option();

    const isHorizontalMenu = this._isMenuHorizontal();
    const submenuDirection = submenuDirectionOption?.toLowerCase();
    const submenuPosition: PositionConfig = {
      collision: 'flip',
      // @ts-expect-error ts-error
      of: $rootItem,
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

  _itemPointerHandler(e: ClickEvent): void {
    const $target = $(e.target);
    const $closestItem = $target.closest(this._itemElements());

    if ($closestItem.hasClass('dx-menu-item-has-submenu')) {
      this.option('focusedElement', null);
      return;
    }

    super._itemPointerHandler(e);
  }

  _hoverStartHandler(e: HoverEvent): void {
    const mouseMoveEventName = addNamespace(pointerEvents.move, this.NAME);
    const $item = this._getItemElementByEventArgs(e);

    if (!$item || this._isItemDisabled($item)) {
      return;
    }

    const node = this._dataAdapter.getNodeByItem(this._getItemData($item));
    const isSelectionActive = (isDefined(e.buttons) && e.buttons === 1)
      || (!isDefined(e.buttons) && e.which === 1);

    eventsEngine.off($item, mouseMoveEventName);

    if (!this._hasChildren(node)) {
      // eslint-disable-next-line no-restricted-globals
      this._showSubmenuTimer = setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay('hide'));
      return;
    }

    if (this._getShowFirstSubmenuMode() === 'onHover' && !isSelectionActive) {
      const submenu = this._getSubmenuByElement($item);

      this._clearTimeouts();

      if (!submenu?.isOverlayVisible()) {
        eventsEngine.on($item, mouseMoveEventName, this._itemMouseMoveHandler.bind(this));
        this._showSubmenuTimer = this._getDelay('hide');
      }
    }
  }

  _hoverEndHandler(eventArg: HoverEvent): void {
    const $item = this._getItemElementByEventArgs(eventArg);
    const relatedTarget = $(eventArg.relatedTarget as Element);

    super._hoverEndHandler(eventArg);
    this._clearTimeouts();

    if (!$item || this._isItemDisabled($item)) {
      return;
    }

    if (relatedTarget.hasClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS)) {
      return;
    }

    const { hideSubmenuOnMouseLeave } = this.option();

    if (hideSubmenuOnMouseLeave && !relatedTarget.hasClass(DX_MENU_ITEMS_CONTAINER_CLASS)) {
      // eslint-disable-next-line no-restricted-globals
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

  _showSubmenu($itemElement: dxElementWrapper): void {
    const submenu = this._getSubmenuByElement($itemElement);

    if (this._visibleSubmenu !== submenu) {
      this._hideVisibleSubmenu();
    }

    if (submenu) {
      this._clearTimeouts();
      this.focus();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      submenu.show();

      const { focusedElement } = submenu.option();

      this.option('focusedElement', focusedElement);
    }

    this._visibleSubmenu = submenu;
    this._hoveredRootItem = $itemElement;
  }

  _hideSubmenu(submenu: Submenu | null | undefined): void {
    if (submenu) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      submenu.hide();
    }

    if (this._visibleSubmenu === submenu) {
      this._visibleSubmenu = null;
    }

    this._hoveredRootItem = null;
  }

  _itemMouseMoveHandler(e: DxEvent<HoverEvent>): void {
    // todo: replace mousemove with hover event
    // @ts-expect-error ts-error
    if (e.pointers?.length) {
      return;
    }

    const $item = $(e.currentTarget);

    if (!isDefined(this._showSubmenuTimer)) {
      return;
    }

    this._clearTimeouts();

    // eslint-disable-next-line no-restricted-globals
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

  _getSubmenuByElement($itemElement: dxElementWrapper, itemData?: Item): Submenu | undefined {
    const submenu = this._getSubmenuByRootElement($itemElement);

    if (submenu) {
      return submenu;
    }

    const node = this._dataAdapter.getNodeByItem(itemData ?? this._getItemData($itemElement));

    if (node && this._hasChildren(node)) {
      return this._renderSubmenuItems(node, $itemElement);
    }

    return undefined;
  }

  _updateSubmenuVisibilityOnClick(actionArgs: ItemClickActionArguments): void {
    const args = actionArgs.args?.[0];

    // @ts-expect-error ts-error
    if (!args || this._disabledGetter(args.itemData)) {
      return;
    }

    const $itemElement = $(args.itemElement);
    const currentSubmenu = this._getSubmenuByElement($itemElement, args.itemData);

    this._updateSelectedItemOnClick(actionArgs);

    if (this._visibleSubmenu) {
      if (this._visibleSubmenu === currentSubmenu) {
        const { showFirstSubmenuMode } = this.option();

        if (showFirstSubmenuMode === 'onClick') {
          this._hideSubmenu(this._visibleSubmenu);
        }
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

  _optionChanged(args: OptionChanged<MenuProperties>): void {
    if (ACTIONS.includes(args.name as typeof ACTIONS[number])) {
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
        this._changeSubmenusOption(args);
        break;
      case 'adaptivityEnabled':
        if (args.value) {
          this._initAdaptivity();
        } else {
          this._removeAdaptivity();
        }
        break;
      case 'width':
        if (this._isAdaptivityEnabled()) {
          this._treeView?.option(args.name, args.value);
          this._overlay?.option(args.name, args.value);
        }
        super._optionChanged(args);
        this._dimensionChanged();
        break;
      case 'animation':
        if (this._isAdaptivityEnabled()) {
          this._treeView?.option('animationEnabled', !!args.value);
        }
        super._optionChanged(args);
        break;
      default:
        if (this._isAdaptivityEnabled() && ((args.name === args.fullName) || (args.name === 'items'))) {
          this._treeView?.option(args.fullName, args.value);
        }
        super._optionChanged(args);
    }
  }

  _changeSubmenusOption({ name, value }: OptionChanged<SubmenuProperties>): void {
    each(this._submenus, (_index: number, submenu: Submenu) => {
      submenu.option(name, value);
    });
  }

  selectItem(itemElement: Element): void {
    this._hideSubmenu(this._visibleSubmenu);
    super.selectItem(itemElement);
  }

  unselectItem(itemElement: Element): void {
    this._hideSubmenu(this._visibleSubmenu);
    super.unselectItem(itemElement);
  }
}

registerComponent('dxMenu', Menu);

export default Menu;
