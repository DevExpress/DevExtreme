import type { DefaultOptionsRule } from '@js/common';
import type { AnimationConfig, PositionConfig } from '@js/common/core/animation';
import { fx } from '@js/common/core/animation';
import animationPosition from '@js/common/core/animation/position';
import type { Cancelable, EventInfo } from '@js/common/core/events';
import { name as contextMenuEventName } from '@js/common/core/events/contextmenu';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import { addNamespace } from '@js/common/core/events/utils';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { contains } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getOuterHeight } from '@js/core/utils/size';
import {
  isDefined, isFunction, isObject, isPlainObject, isRenderer, isString,
} from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type {
  HiddenEvent,
  HidingEvent,
  Item,
  ItemClickEvent,
  PositioningEvent,
  Properties,
  ShowingEvent,
  ShownEvent,
} from '@js/ui/context_menu';
import type dxContextMenu from '@js/ui/context_menu';
import type {
  dxMenuBaseItem,
  SubmenuHiddenEvent,
  SubmenuHidingEvent,
  SubmenuShowingEvent,
  SubmenuShownEvent,
} from '@js/ui/menu';
import type { Properties as OverlayProperties } from '@js/ui/overlay';
import { current as currentTheme, isGeneric } from '@js/ui/themes';
import type { ActionArguments } from '@ts/core/m_action';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { ClickEvent, HoverEvent, MenuBaseProperties } from '@ts/ui/context_menu/menu_base';
import MenuBase from '@ts/ui/context_menu/menu_base';
import type { InternalNode } from '@ts/ui/hierarchical_collection/data_converter';
import Overlay from '@ts/ui/overlay/overlay';
import Scrollable from '@ts/ui/scroll_view/scrollable';

const DX_MENU_CLASS = 'dx-menu';
export const DX_MENU_ITEM_CLASS = `${DX_MENU_CLASS}-item`;
const DX_MENU_ITEM_EXPANDED_CLASS = `${DX_MENU_ITEM_CLASS}-expanded`;
const DX_MENU_PHONE_CLASS = 'dx-menu-phone-overlay';
const DX_MENU_ITEMS_CONTAINER_CLASS = `${DX_MENU_CLASS}-items-container`;
const DX_MENU_ITEM_WRAPPER_CLASS = `${DX_MENU_ITEM_CLASS}-wrapper`;
const DX_SUBMENU_CLASS = 'dx-submenu';
export const DX_CONTEXT_MENU_CLASS = 'dx-context-menu';
const DX_HAS_CONTEXT_MENU_CLASS = 'dx-has-context-menu';
const DX_STATE_DISABLED_CLASS = 'dx-state-disabled';
const DX_STATE_FOCUSED_CLASS = 'dx-state-focused';
const DX_STATE_HOVER_CLASS = 'dx-state-hover';

const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const SCROLLABLE_CLASS = 'dx-scrollable';

const FOCUS_UP = 'up';
const FOCUS_DOWN = 'down';
const FOCUS_LEFT = 'left';
const FOCUS_RIGHT = 'right';
const FOCUS_FIRST = 'first';
const FOCUS_LAST = 'last';

const ACTIONS = [
  'onShowing',
  'onShown',
  'onSubmenuCreated',
  'onHiding',
  'onHidden',
  'onPositioning',
  'onLeftFirstItem',
  'onLeftLastItem',
  'onCloseRootSubmenu',
  'onExpandLastSubmenu',
] as const;
const LOCAL_SUBMENU_DIRECTIONS = [FOCUS_UP, FOCUS_DOWN, FOCUS_FIRST, FOCUS_LAST];
const DEFAULT_SHOW_EVENT = 'dxcontextmenu';
const SUBMENU_PADDING = 10;
const BORDER_WIDTH = 1;

const window = getWindow();

type ContextMenuTarget = string | dxElementWrapper | Element | Window | undefined;
type ContextMenuNode = InternalNode & Item;

type ShowContextMenuEvent = EventInfo<ContextMenu> & {
  target?: ContextMenuTarget;
  event?: DxEvent;
};
type ChatMenuShowingEvent = Cancelable & { jQEvent?: DxEvent };
interface SubmenuCreatedEvent<TItem extends dxMenuBaseItem = dxMenuBaseItem> {
  itemElement: Element;
  submenuElement: Element;
  itemData: TItem;
}
type ItemClickActionArguments =
  ActionArguments<dxContextMenu<ContextMenuProperties>, ItemClickEvent>;

interface ContextMenuActions {
  onShowing?: ((e: ShowingEvent | SubmenuShowingEvent | ChatMenuShowingEvent) => void);
  onShown?: (e: ShownEvent | SubmenuShownEvent) => void;
  onSubmenuCreated?: (e: SubmenuCreatedEvent) => void;
  onHiding?: (e: HidingEvent | SubmenuHidingEvent) => void;
  onHidden?: (e: HiddenEvent | SubmenuHiddenEvent) => void;
  onPositioning?: (e: PositioningEvent) => void;
  onLeftFirstItem?: ($item?: dxElementWrapper) => void;
  onLeftLastItem?: ($item?: dxElementWrapper) => void;
  onCloseRootSubmenu?: ($item?: dxElementWrapper) => void;
  onExpandLastSubmenu?: ($item?: dxElementWrapper) => void;
}

type ContextMenuPropertiesKeys = Exclude<keyof Properties, keyof MenuBaseProperties>;

export interface ContextMenuProperties<
  TItem extends dxMenuBaseItem = Item,
> extends
  MenuBaseProperties<TItem>,
  Pick<Properties<TItem>, ContextMenuPropertiesKeys> {
  hideOnParentScroll?: boolean;
  visualContainer?: string | Element | Window | null;
  overlayContainer?: string | Element | null;
  boundaryOffset?: PositionConfig['boundaryOffset'];
  onSubmenuCreated?: ((e) => void) | null;
  onLeftFirstItem?: ((e) => void) | null;
  onLeftLastItem?: ((e) => void) | null;
  onCloseRootSubmenu?: ((e) => void) | null;
  onExpandLastSubmenu?: ((e) => void) | null;
}

class ContextMenu<
  TProperties extends ContextMenuProperties = ContextMenuProperties,
> extends MenuBase<TProperties> {
  // Temporary solution. Move to component level
  public NAME!: string;

  _shownSubmenus?: dxElementWrapper[];

  _overlay!: Overlay | null;

  _overlayContentId?: string;

  _eventNamespace!: string;

  _showContextMenuEventHandler?: (event: DxEvent) => void;

  // @ts-expect-error ts-error
  _actions!: ContextMenuActions;

  getShowEvent(showEventOption: ContextMenuProperties['showEvent']): string | null {
    if (isObject(showEventOption)) {
      if (showEventOption.name === null) {
        return null;
      }

      return showEventOption.name ?? DEFAULT_SHOW_EVENT;
    }

    return showEventOption ?? null;
  }

  getShowDelay(showEventOption: TProperties['showEvent']): number {
    return isObject(showEventOption) ? showEventOption.delay ?? 0 : 0;
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      showEvent: DEFAULT_SHOW_EVENT,
      hideOnOutsideClick: true,
      position: {
        at: 'top left',
        my: 'top left',
      },
      onShowing: null,
      onShown: null,
      onSubmenuCreated: null,
      onHiding: null,
      onHidden: null,
      onPositioning: null,
      submenuDirection: 'auto',
      visible: false,
      target: undefined,
      onLeftFirstItem: null,
      onLeftLastItem: null,
      onCloseRootSubmenu: null,
      onExpandLastSubmenu: null,
      hideOnParentScroll: true,
      visualContainer: window,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([{
      device: () => !hasWindow(),
      // @ts-expect-error ts-error
      options: {
        animation: null,
      },
    }]);
  }

  _initActions(): void {
    this._actions = {};

    each(ACTIONS, (_index: number, action: typeof ACTIONS[number]) => {
      this._actions[action] = this._createActionByOption(action) || noop;
    });
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      animation: true,
      selectedItem: true,
    });
  }

  _focusInHandler(): void {}

  _itemContainer(): dxElementWrapper {
    return this._overlay ? this._overlay.$content() : $();
  }

  _eventBindingTarget(): dxElementWrapper {
    return this._itemContainer();
  }

  itemsContainer(): dxElementWrapper {
    return this._overlay?.$content() ?? $();
  }

  _supportedKeys(): SupportedKeys {
    const selectItem = (): void => {
      const { focusedElement } = this.option();
      const $item = $(focusedElement);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.hide();

      if (!$item.length || !this._isSelectionEnabled()) {
        return;
      }

      this.selectItem($item[0]);
    };

    return {
      ...super._supportedKeys(),
      space: selectItem,
      escape: (): void => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.hide();
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getActiveItem(_last?: boolean): dxElementWrapper {
    const $availableItems = this._getAvailableItems();

    const $focusedItem = $availableItems.filter(`.${DX_STATE_FOCUSED_CLASS}`);
    const $hoveredItem = $availableItems.filter(`.${DX_STATE_HOVER_CLASS}`);
    const $hoveredItemContainer = $hoveredItem.closest(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);

    if ($hoveredItemContainer.find(`.${DX_MENU_ITEM_CLASS}`).index($focusedItem) >= 0) {
      return $focusedItem;
    }

    if ($hoveredItem.length) {
      return $hoveredItem;
    }

    return super._getActiveItem();
  }

  // eslint-disable-next-line consistent-return, @typescript-eslint/no-invalid-void-type
  _moveFocus(location: string): boolean | undefined | void {
    const $items = this._getItemsByLocation(location);
    const $oldTarget = this._getActiveItem(true);
    const $hoveredItem = this.itemsContainer().find(`.${DX_STATE_HOVER_CLASS}`);
    const { focusedElement, rtlEnabled } = this.option();
    const $focusedItem = $(focusedElement);
    const $activeItemHighlighted = !!($focusedItem.length || $hoveredItem?.length);
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let $newTarget: dxElementWrapper | undefined;

    switch (location) {
      case FOCUS_UP:
        $newTarget = $activeItemHighlighted ? this._prevItem($items) : $oldTarget;
        this._setFocusedElement($newTarget);
        if ($oldTarget.is($items.first())) {
          this._actions.onLeftFirstItem?.($oldTarget);
        }
        break;
      case FOCUS_DOWN:
        $newTarget = $activeItemHighlighted ? this._nextItem($items) : $oldTarget;
        this._setFocusedElement($newTarget);
        if ($oldTarget.is($items.last())) {
          this._actions.onLeftLastItem?.($oldTarget);
        }
        break;
      case FOCUS_RIGHT:
        $newTarget = rtlEnabled
          ? this._hideSubmenuHandler()
          : this._expandSubmenuHandler($items, location);
        this._setFocusedElement($newTarget);
        break;
      case FOCUS_LEFT:
        $newTarget = rtlEnabled
          ? this._expandSubmenuHandler($items, location)
          : this._hideSubmenuHandler();
        this._setFocusedElement($newTarget);
        break;
      case FOCUS_FIRST:
        $newTarget = $items.first();
        this._setFocusedElement($newTarget);
        break;
      case FOCUS_LAST:
        $newTarget = $items.last();
        this._setFocusedElement($newTarget);
        break;
      default:
        return super._moveFocus(location);
    }
  }

  _setFocusedElement($element: dxElementWrapper | undefined): void {
    if ($element && $element.length !== 0) {
      this.option('focusedElement', getPublicElement($element));
      this._scrollToElement($element);
    }
  }

  _scrollToElement($element: dxElementWrapper): void {
    const $scrollableElement = $element.closest(`.${SCROLLABLE_CLASS}`);
    const scrollableInstance: Scrollable = Scrollable.getInstance($scrollableElement.get(0));

    scrollableInstance?.scrollToElement($element);
  }

  _getItemsByLocation(location: string): dxElementWrapper {
    const $activeItem = this._getActiveItem(true);
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let $items: dxElementWrapper | undefined;

    if (LOCAL_SUBMENU_DIRECTIONS.includes(location)) {
      $items = $activeItem
        .closest(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`)
        .children()
        .children();
    }

    $items = this._getAvailableItems($items);

    return $items;
  }

  _getAriaTarget(): dxElementWrapper {
    return this.$element();
  }

  _refreshActiveDescendant(): void {
    if (isDefined(this._overlay)) {
      const $target = this._overlay.$content();
      super._refreshActiveDescendant($target);
    }
  }

  _hideSubmenuHandler(): dxElementWrapper | undefined {
    const $curItem = this._getActiveItem(true);
    const $parentItem = $curItem.parents(`.${DX_MENU_ITEM_EXPANDED_CLASS}`).first();

    if ($parentItem.length) {
      this._hideSubmenusOnSameLevel($parentItem);
      this._hideSubmenu($curItem.closest(`.${DX_SUBMENU_CLASS}`));
      return $parentItem;
    }

    this._actions.onCloseRootSubmenu?.($curItem);

    return undefined;
  }

  _expandSubmenuHandler($items: dxElementWrapper, location: string): dxElementWrapper | undefined {
    const $curItem = this._getActiveItem(true);
    const itemData = this._getItemData($curItem);
    const node = this._dataAdapter.getNodeByItem(itemData);
    const isItemHasSubmenu = this._hasSubmenu(node);
    const $submenu = $curItem.children(`.${DX_SUBMENU_CLASS}`);

    if (isItemHasSubmenu && !$curItem.hasClass(DX_STATE_DISABLED_CLASS)) {
      if (!$submenu.length || $submenu.css('visibility') === 'hidden') {
        this._showSubmenu($curItem);
      }

      return this._nextItem(this._getItemsByLocation(location));
    }

    this._actions.onExpandLastSubmenu?.($curItem);
    return undefined;
  }

  _clean(): void {
    if (this._overlay) {
      this._overlay.$element().remove();
      this._overlay = null;
    }
    this._detachShowContextMenuEvents(this._getTarget());
    this._shownSubmenus = [];
    super._clean();
  }

  _initMarkup(): void {
    this.$element()
      .addClass(DX_HAS_CONTEXT_MENU_CLASS);

    this._eventNamespace = `${this.NAME}${new Guid()}`;

    super._initMarkup();
  }

  _render(): void {
    super._render();

    const { visible } = this.option();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._renderVisibility(visible);
    this._addWidgetClass();
  }

  _isTargetOutOfComponent(relatedTarget: Element): boolean {
    const isInsideContextMenu = $(relatedTarget).closest(`.${DX_CONTEXT_MENU_CLASS}`).length !== 0;

    return !isInsideContextMenu;
  }

  _focusOutHandler(e: DxEvent<FocusEvent>): void {
    const { relatedTarget } = e;

    if (relatedTarget) {
      // ts-expect-error ts-error
      const isTargetOutside = this._isTargetOutOfComponent(relatedTarget as Element);

      if (isTargetOutside) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.hide();
      }
    }

    super._focusOutHandler(e);
  }

  _renderContentImpl(): void {
    this._detachShowContextMenuEvents(this._getTarget());
    this._showContextMenuEventHandler = this._createShowContextMenuEventHandler();
    this._attachShowContextMenuEvents();
  }

  _attachKeyboardEvents(): void {
    if (!this._keyboardListenerId && this._focusTarget().length) {
      super._attachKeyboardEvents();
    }
  }

  _renderContextMenuOverlay(): void {
    if (this._overlay) {
      return;
    }

    const overlayOptions = this._getOverlayOptions();

    this._overlay = this._createComponent($('<div>').appendTo(this.$element()), Overlay, overlayOptions);

    const $overlayContent = this._overlay.$content();
    $overlayContent.addClass(DX_CONTEXT_MENU_CLASS);

    this._addCustomCssClass($overlayContent);
    this._addPlatformDependentClass($overlayContent);
    this._attachContextMenuEvent();
  }

  preventShowingDefaultContextMenuAboveOverlay(): void {
    const $itemContainer = this._itemContainer();
    const eventName = addNamespace(contextMenuEventName, this._eventNamespace);

    eventsEngine.off($itemContainer, eventName, `.${DX_SUBMENU_CLASS}`);
    eventsEngine.on($itemContainer, eventName, `.${DX_SUBMENU_CLASS}`, (e) => {
      e.stopPropagation();
      e.preventDefault();
      eventsEngine.off($itemContainer, eventName, `.${DX_SUBMENU_CLASS}`);
    });
  }

  _itemContextMenuHandler(e: DxEvent & Cancelable): void {
    super._itemContextMenuHandler(e);
    e.stopPropagation();
  }

  _addPlatformDependentClass($element: dxElementWrapper): void {
    if (devices.current().phone) {
      $element.addClass(DX_MENU_PHONE_CLASS);
    }
  }

  _createShowContextMenuEventHandler(): (e: DxEvent) => void {
    const showContextMenuAction = this._createAction((e: ShowContextMenuEvent) => {
      const { showEvent } = this.option();
      const delay = this.getShowDelay(showEvent);

      if (delay) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises,no-restricted-globals
        setTimeout(() => this._show(e.event), delay);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._show(e.event);
      }
    }, { validatingTargetName: 'target' });

    return (e: DxEvent): void => showContextMenuAction({
      event: e,
      target: $(e.currentTarget),
    });
  }

  _detachShowContextMenuEvents(target: ContextMenuTarget, event?: TProperties['showEvent']): void {
    const { showEvent: showEventOption } = this.option();
    const showEvent = this.getShowEvent(event ?? showEventOption);

    if (!showEvent) {
      return;
    }

    const isSelector = isString(target);
    const eventName = addNamespace(showEvent, this._eventNamespace);

    if (isSelector) {
      eventsEngine.off(
        domAdapter.getDocument(),
        eventName,
        target,
        // @ts-expect-error ts-error
        this._showContextMenuEventHandler,
      );
    } else {
      eventsEngine.off($(target), eventName, this._showContextMenuEventHandler);
    }
  }

  _attachShowContextMenuEvents(): void {
    const { showEvent: showEventOption, disabled } = this.option();
    const showEvent = this.getShowEvent(showEventOption);

    if (!showEvent || disabled) {
      return;
    }

    const target = this._getTarget();
    const isSelector = isString(target);
    const eventName = addNamespace(showEvent, this._eventNamespace);

    if (isSelector) {
      eventsEngine.on(
        domAdapter.getDocument(),
        eventName,
        target,
        this._showContextMenuEventHandler,
      );
    } else {
      eventsEngine.on(target, eventName, this._showContextMenuEventHandler);
    }
  }

  _hoverEndHandler(e: HoverEvent): void {
    super._hoverEndHandler(e);
    e.stopPropagation();
  }

  _renderDimensions(): void {}

  _renderContainer($wrapper: dxElementWrapper, submenuContainer?: Element): dxElementWrapper {
    const $holder = submenuContainer ?? this._itemContainer();

    // eslint-disable-next-line no-param-reassign
    $wrapper = $('<div>');

    $wrapper
      .appendTo($holder)
      .addClass(DX_SUBMENU_CLASS)
      .css('visibility', submenuContainer ? 'hidden' : 'visible');

    if (!$wrapper.parent().hasClass(OVERLAY_CONTENT_CLASS)) {
      this._addCustomCssClass($wrapper);
    }

    const $itemsContainer = super._renderContainer($wrapper);

    if (submenuContainer) {
      return $itemsContainer;
    }

    const { width, height } = this.option();

    if (width) {
      return $itemsContainer.css('minWidth', width);
    }
    if (height) {
      return $itemsContainer.css('minHeight', height);
    }

    return $itemsContainer;
  }

  _renderSubmenuItems(node: ContextMenuNode, $itemFrame: dxElementWrapper): void {
    this._renderItems(this._getChildNodes(node), $itemFrame);

    const $submenu = $itemFrame.children(`.${DX_SUBMENU_CLASS}`);

    this._actions.onSubmenuCreated?.({
      itemElement: getPublicElement($itemFrame),
      itemData: node.internalFields.item,
      submenuElement: getPublicElement($submenu),
    });
    this._initScrollable($submenu);
    this.setAria({ role: 'menu' }, $submenu);
  }

  _getOverlayOptions(): OverlayProperties {
    const {
      position,
      focusStateEnabled,
      animation,
      hideOnParentScroll,
      visualContainer,
      overlayContainer,
      boundaryOffset,
    } = this.option();

    return {
      focusStateEnabled,
      animation,
      innerOverlay: true,
      hideOnOutsideClick: (e: ClickEvent): boolean => this._hideOnOutsideClickHandler(e),
      propagateOutsideClick: true,
      hideOnParentScroll,
      deferRendering: false,
      container: overlayContainer,
      position: {
        // @ts-expect-error ts-error
        at: position.at,
        // @ts-expect-error ts-error
        my: position.my,
        of: this._getTarget(),
        collision: 'flipfit',
        boundary: visualContainer,
        boundaryOffset,
      },
      shading: false,
      showTitle: false,
      height: 'auto',
      width: 'auto',
      // @ts-expect-error ts-error
      onShown: this._overlayShownActionHandler.bind(this),
      // @ts-expect-error ts-error
      onHiding: this._overlayHidingActionHandler.bind(this),
      // @ts-expect-error ts-error
      onHidden: this._overlayHiddenActionHandler.bind(this),
      visualContainer,
    };
  }

  _overlayShownActionHandler(arg: ShownEvent): void {
    this._actions.onShown?.(arg);
  }

  _overlayHidingActionHandler(arg: HidingEvent): void {
    this._actions.onHiding?.(arg);

    if (!arg.cancel) {
      this._hideAllShownSubmenus();
      this._setOptionWithoutOptionChange('visible', false);
    }
  }

  _overlayHiddenActionHandler(arg: HiddenEvent): void {
    this._actions.onHidden?.(arg);
  }

  _shouldHideOnOutsideClick(e: ClickEvent): boolean | undefined {
    const { hideOnOutsideClick } = this.option();

    if (isFunction(hideOnOutsideClick)) {
      return hideOnOutsideClick(e);
    }

    return hideOnOutsideClick;
  }

  _hideOnOutsideClickHandler(e: ClickEvent): boolean {
    if (!this._shouldHideOnOutsideClick(e)) {
      return false;
    }
    if (domAdapter.isDocument(e.target)) {
      return true;
    }

    const $activeItemContainer = this._getActiveItemsContainer(e.target);
    const $itemContainers = this._getItemsContainers();
    const $clickedItem = this._searchActiveItem(e.target);

    const $rootItem = this.$element().parents(`.${DX_MENU_ITEM_CLASS}`);
    const isRootItemClicked = $clickedItem[0] === $rootItem[0]
      && !!$clickedItem.length
      && !!$rootItem.length;
    const isInnerOverlayClicked = this._isIncludeOverlay($activeItemContainer, $itemContainers)
      && !!$clickedItem.length;

    if (isInnerOverlayClicked || isRootItemClicked) {
      if (this._getShowSubmenuMode() === 'onClick') {
        this._hideAllShownChildSubmenus($clickedItem);
      }
      return false;
    }
    return true;
  }

  _getActiveItemsContainer(target: Element): dxElementWrapper {
    return $(target).closest(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
  }

  _getItemsContainers(): dxElementWrapper {
    return this._overlay?.$content().find(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`) ?? $();
  }

  _searchActiveItem(target: Element): dxElementWrapper {
    return $(target).closest(`.${DX_MENU_ITEM_CLASS}`).eq(0);
  }

  _isIncludeOverlay($activeOverlay: dxElementWrapper, $allOverlays: dxElementWrapper): boolean {
    let isSame = false;

    each($allOverlays, (_index: number, $overlay: dxElementWrapper) => {
      if ($activeOverlay.is($overlay) && !isSame) {
        isSame = true;
      }
    });

    return isSame;
  }

  _hideAllShownChildSubmenus($clickedItem: dxElementWrapper): void {
    const $submenuElements = $clickedItem.find(`.${DX_SUBMENU_CLASS}`);
    const shownSubmenus = extend([], this._shownSubmenus);

    if ($submenuElements.length > 0) {
      each(shownSubmenus, (index, $submenu) => {
        const $context = this._searchActiveItem($submenu.context).parent();
        if (
          $context.parent().is($clickedItem.parent().parent())
          && !$context.is($clickedItem.parent())
        ) {
          this._hideSubmenu($submenu);
        }
      });
    }
  }

  _initScrollable($container: dxElementWrapper): void {
    this._createComponent($container, Scrollable, {
      useKeyboard: false,
      // @ts-expect-error ts-error
      _onVisibilityChanged: (scrollable: Scrollable) => {
        scrollable.scrollTo(0);
      },
    });
  }

  _setSubMenuHeight(
    $submenu: dxElementWrapper,
    $anchor: ContextMenuTarget,
    isNestedSubmenu: boolean,
  ): void {
    const $itemsContainer = $submenu.find(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
    const contentHeight = getOuterHeight($itemsContainer);
    const maxHeight = this._getMaxHeight($anchor, !isNestedSubmenu);
    const menuHeight = Math.min(contentHeight, maxHeight);

    $submenu.css('height', isNestedSubmenu ? menuHeight : '100%');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getMaxUsableSpace(_offsetTop: number, windowHeight: number, _anchorHeight: number): number {
    return windowHeight;
  }

  _getMaxHeight($anchor: ContextMenuTarget, considerAnchorHeight = true): number {
    const windowHeight: number = getOuterHeight(window);
    const isAnchorRenderer = isRenderer($anchor);
    const document = domAdapter.getDocument();
    const isAnchorDocument = isObject($anchor) && 'length' in $anchor && $anchor.length && $anchor[0] === document;

    if (!isAnchorRenderer || isAnchorDocument) {
      return windowHeight;
    }

    const offsetTop = $anchor?.[0].getBoundingClientRect().top;
    const anchorHeight = getOuterHeight($anchor);
    const availableHeight = considerAnchorHeight
      ? this._getMaxUsableSpace(offsetTop, windowHeight, anchorHeight)
      : Math.max(offsetTop + anchorHeight, windowHeight - offsetTop);

    return availableHeight - SUBMENU_PADDING;
  }

  _dimensionChanged(): void {
    if (!this._shownSubmenus) {
      return;
    }

    this._shownSubmenus.forEach(($submenu) => {
      const $item = $submenu.closest(`.${DX_MENU_ITEM_CLASS}`);

      this._setSubMenuHeight($submenu, $item, true);
      this._scrollToElement($item);

      const submenuPosition = this._getSubmenuPosition($item);
      animationPosition.setup($submenu, submenuPosition);
    });
  }

  _getSubmenuBorderWidth(): number {
    return isGeneric(currentTheme()) ? BORDER_WIDTH : 0;
  }

  _showSubmenu($item: dxElementWrapper): void {
    const node = this._dataAdapter.getNodeByItem(this._getItemData($item));

    this._hideSubmenusOnSameLevel($item);

    if (!this._hasSubmenu(node)) return;

    let $submenu = $item.children(`.${DX_SUBMENU_CLASS}`);
    const isSubmenuRendered = $submenu.length;

    super._showSubmenu($item);

    if (node && !isSubmenuRendered) {
      this._renderSubmenuItems(node, $item);
      $submenu = $item.children(`.${DX_SUBMENU_CLASS}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._planPostRenderActions($submenu);
  }

  _setSubmenuVisible($submenu?: dxElementWrapper): void {
    if (!$submenu) {
      return;
    }

    const $item = $submenu?.closest(`.${DX_MENU_ITEM_CLASS}`);

    this._setSubMenuHeight($submenu, $item, true);

    if (!this._isSubmenuVisible($submenu) && $item) {
      this._drawSubmenu($item);
    }
  }

  _hideSubmenusOnSameLevel($item: dxElementWrapper): void {
    const $expandedItems = $item
      .parent(`.${DX_MENU_ITEM_WRAPPER_CLASS}`).siblings()
      .find(`.${DX_MENU_ITEM_EXPANDED_CLASS}`);

    if ($expandedItems.length) {
      $expandedItems.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
      this._hideSubmenu($expandedItems.find(`.${DX_SUBMENU_CLASS}`));
    }
  }

  _isSubmenuVisible($submenu: dxElementWrapper): boolean {
    return $submenu.css('visibility') === 'visible';
  }

  _drawSubmenu($itemElement: dxElementWrapper): void {
    const { animation: animationOption } = this.option();
    const animation = animationOption ? animationOption.show : {};
    const $submenu = $itemElement.children(`.${DX_SUBMENU_CLASS}`);
    const submenuPosition = this._getSubmenuPosition($itemElement);

    if (this._overlay?.option('visible')) {
      if (!isDefined(this._shownSubmenus)) {
        this._shownSubmenus = [];
      }

      if (!this._shownSubmenus.includes($submenu)) {
        this._shownSubmenus.push($submenu);
      }

      if (animation) {
        fx.stop($submenu.get(0), false);
      }

      animationPosition.setup($submenu, submenuPosition);

      if (animation) {
        if (isPlainObject(animation.to)) {
          // @ts-expect-error ts-error
          animation.to.position = submenuPosition;
        }
        this._animate($submenu.get(0), animation);
      }
      $submenu.css('visibility', 'visible');
    }
  }

  _animate(container: Element, options: AnimationConfig): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate(container, options);
  }

  _getSubmenuPosition($rootItem: dxElementWrapper): PositionConfig {
    const { submenuDirection: submenuDirectionOption, rtlEnabled } = this.option();
    const submenuDirection = submenuDirectionOption?.toLowerCase();
    const $rootItemWrapper = $rootItem.parent(`.${DX_MENU_ITEM_WRAPPER_CLASS}`);

    const position: PositionConfig = {
      collision: 'flip',
      // @ts-expect-error ts-error
      of: $rootItemWrapper,
      // @ts-expect-error ts-error
      offset: { h: 0, v: -1 },
    };

    switch (submenuDirection) {
      case 'left':
        position.at = 'left top';
        position.my = 'right top';
        break;
      case 'right':
        position.at = 'right top';
        position.my = 'left top';
        break;
      default:
        if (rtlEnabled) {
          position.at = 'left top';
          position.my = 'right top';
        } else {
          position.at = 'right top';
          position.my = 'left top';
        }
        break;
    }

    return position;
  }

  // TODO: try to simplify it
  // @ts-expect-error ts-error
  _updateSubmenuVisibilityOnClick(actionArgs: ItemClickActionArguments): void {
    if (!actionArgs.args?.length) {
      return;
    }

    const { itemData, itemElement } = actionArgs.args[0];

    if (!itemData) {
      return;
    }

    const node = this._dataAdapter.getNodeByItem(itemData);

    if (!node) {
      return;
    }

    const $itemElement = $(itemElement);
    let $submenu = $itemElement.find(`.${DX_SUBMENU_CLASS}`);
    const shouldRenderSubmenu = this._hasSubmenu(node) && !$submenu.length;

    if (shouldRenderSubmenu) {
      this._renderSubmenuItems(node, $itemElement);
      $submenu = $itemElement.find(`.${DX_SUBMENU_CLASS}`);
    }

    // @ts-expect-error ts-error
    if ($itemElement.context === $submenu.context && $submenu.css('visibility') === 'visible') {
      return;
    }

    // @ts-expect-error ts-error
    this._updateSelectedItemOnClick(actionArgs);

    // T238943. Give the workaround with e.cancel and remove this hack
    const notCloseMenuOnItemClick = itemData && itemData.closeMenuOnClick === false;
    if (!itemData || itemData.disabled || notCloseMenuOnItemClick) {
      return;
    }

    if ($submenu.length === 0) {
      const $prevSubmenu = $($itemElement.parents(`.${DX_SUBMENU_CLASS}`)[0]);
      this._hideSubmenu($prevSubmenu);
      if (!actionArgs.canceled && this._overlay?.option('visible')) {
        this.option('visible', false);
      }
    } else {
      if (this._shownSubmenus && this._shownSubmenus.length > 0) {
        if (this._shownSubmenus[0].is($submenu)) {
          this._hideSubmenu($submenu); // close to parent?
        }
      }
      this._showSubmenu($itemElement);
    }
  }

  _hideSubmenu($curSubmenu: dxElementWrapper): void {
    const shownSubmenus: dxElementWrapper[] = this._shownSubmenus ?? [];

    each(shownSubmenus, (_index: number, $submenu: dxElementWrapper) => {
      if ($curSubmenu.is($submenu) || contains($curSubmenu[0], $submenu[0])) {
        $submenu.parent().removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
        this._hideSubmenuCore($submenu);
      }
    });
  }

  _hideSubmenuCore($submenu: dxElementWrapper): void {
    const index = (this._shownSubmenus ?? []).indexOf($submenu);
    const { animation: animationOption } = this.option();
    const animation = animationOption ? animationOption.hide : null;

    if (index >= 0) {
      (this._shownSubmenus ?? []).splice(index, 1);
    }

    this._stopAnimate($submenu);
    if (animation) {
      this._animate($submenu.get(0), animation);
    }
    $submenu.css('visibility', 'hidden');

    // @ts-expect-error ts-error
    const scrollableInstance: Scrollable = $submenu.dxScrollable('instance');

    scrollableInstance.scrollTo(0);
    this.option('focusedElement', null);
  }

  _stopAnimate($container: dxElementWrapper): void {
    fx.stop($container.get(0), true);
  }

  _hideAllShownSubmenus(): void {
    const shownSubmenus = extend([], this._shownSubmenus);
    const $expandedItems = this._overlay?.$content().find(`.${DX_MENU_ITEM_EXPANDED_CLASS}`) ?? $();

    $expandedItems.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);

    each(shownSubmenus, (_, $submenu) => {
      this._hideSubmenu($submenu);
    });
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._renderContentImpl();
    }
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value, previousValue } = args;

    if (ACTIONS.includes(name as typeof ACTIONS[number])) {
      this._initActions();
      return;
    }

    switch (name) {
      case 'visible':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._renderVisibility(value as boolean | undefined);
        break;
      case 'disabled':
      case 'position':
      case 'submenuDirection':
        this._invalidate();
        break;
      case 'showEvent':
        if (previousValue) {
          this._detachShowContextMenuEvents(this._getTarget(), previousValue);
        }
        this._invalidate();
        break;
      case 'target':
        if (previousValue) {
          this._detachShowContextMenuEvents(previousValue as ContextMenuProperties['target']);
        }
        this._invalidate();
        break;
      case 'hideOnOutsideClick':
      case 'hideOnParentScroll':
      case 'visualContainer':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _renderVisibility(showing: boolean | undefined): Promise<unknown> {
    return showing ? this._show() : this._hide();
  }

  _toggleVisibility(): void {}

  _show(event?: DxEvent): Promise<unknown> {
    const args: Cancelable & { jQEvent?: DxEvent } = {
      jQEvent: event,
    };
    let promise = Deferred().reject().promise();

    this._actions.onShowing?.(args);

    if (args.cancel) {
      return promise;
    }

    const position = this._positionContextMenu(event);

    if (position) {
      if (!this._overlay) {
        this._renderContextMenuOverlay();
        (this._overlay as unknown as Overlay).$content().addClass(this._widgetClass());
        this._renderFocusState();
        this._attachHoverEvents();
        this._attachClickEvent();
        this._renderItems(this._dataAdapter.getRootNodes());
      }

      const $subMenu = $(this._overlay?.content()).children(`.${DX_SUBMENU_CLASS}`);

      this._setOptionWithoutOptionChange('visible', true);
      this._overlay?.option({
        height: () => this._getMaxHeight(position.of),
        maxHeight: () => {
          const $content = $subMenu.find(`.${DX_MENU_ITEMS_CONTAINER_CLASS}`);
          const outerHeight: number = getOuterHeight($content);
          const borderWidth = this._getSubmenuBorderWidth();

          return outerHeight + borderWidth * 2;
        },
        position,
      });

      if ($subMenu.length) {
        this._setSubMenuHeight($subMenu, position.of, false);
      }

      if (this._overlay) {
        promise = this._overlay.show();
      }

      event?.stopPropagation();

      this._setAriaAttributes();

      // T983617. Prevent the browser's context menu appears on desktop touch screens.
      if (event?.originalEvent?.type === holdEvent.name) {
        this.preventShowingDefaultContextMenuAboveOverlay();
      }
    }

    return promise;
  }

  _renderItems(nodes: ContextMenuNode[], submenuContainer?: dxElementWrapper): void {
    super._renderItems(nodes, submenuContainer);

    const $submenu = $(this._overlay?.content()).children(`.${DX_SUBMENU_CLASS}`);
    if ($submenu.length) {
      this._initScrollable($submenu);
    }
  }

  _setAriaAttributes(): void {
    this._overlayContentId = `dx-${new Guid()}`;

    this.setAria('owns', this._overlayContentId);
    this.setAria({ id: this._overlayContentId, role: 'menu' }, this._overlay?.$content());
  }

  _cleanAriaAttributes(): void {
    if (this._overlay) {
      this.setAria('id', null, this._overlay.$content());
    }
    this.setAria('owns', undefined);
  }

  _getTarget(): ContextMenuTarget {
    const { target, position } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return target || position?.of || $(domAdapter.getDocument());
  }

  _getContextMenuPosition(): PositionConfig | undefined {
    const { position } = this.option();

    return {
      ...position,
      // @ts-expect-error ts-error
      of: this._getTarget(),
    };
  }

  _positionContextMenu(jQEvent?: DxEvent): PositionConfig | null | undefined {
    let position: PositionConfig | null | undefined = this._getContextMenuPosition();
    const isInitialPosition = this._isInitialOptionValue('position');
    const positioningAction = this._createActionByOption('onPositioning');

    if (jQEvent?.preventDefault && isInitialPosition) {
      // @ts-expect-error ts-error
      position.of = jQEvent;
    }

    const actionArgs: Cancelable & {
      event?: Cancelable & DxEvent;
      position?: PositionConfig | null;
    } = {
      position,
      event: jQEvent,
    };

    positioningAction(actionArgs);

    if (actionArgs.cancel) {
      position = null;
    } else if (actionArgs.event) {
      actionArgs.event.cancel = true;
      jQEvent?.preventDefault();
    }

    return position;
  }

  _refresh(): void {
    if (!hasWindow()) {
      super._refresh();
    } else if (this._overlay) {
      const { position: lastPosition } = this._overlay.option();
      super._refresh();
      if (this._overlay) {
        this._overlay.option('position', lastPosition);
      }
    } else {
      super._refresh();
    }
  }

  _hide(): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let promise: Promise<unknown> | undefined;

    if (this._overlay) {
      promise = this._overlay.hide();
      this._setOptionWithoutOptionChange('visible', false);
    }

    this._cleanAriaAttributes();
    this.option('focusedElement', null);

    return promise ?? Deferred().reject().promise();
  }

  toggle(showing: boolean | undefined): Promise<unknown> {
    const { visible } = this.option();

    return this._renderVisibility(showing ?? !visible);
  }

  show(): Promise<unknown> {
    return this.toggle(true);
  }

  hide(): Promise<unknown> {
    return this.toggle(false);
  }

  _postProcessRenderItems($submenu?: dxElementWrapper): void {
    this._setSubmenuVisible($submenu);
  }
}

registerComponent('dxContextMenu', ContextMenu);

export default ContextMenu;
