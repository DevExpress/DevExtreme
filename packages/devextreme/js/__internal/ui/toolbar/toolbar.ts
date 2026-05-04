import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Item } from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';

import { MultiLineStrategy } from './strategy/toolbar.multiline';
import { SingleLineStrategy } from './strategy/toolbar.singleline';
import type { ToolbarBaseProperties } from './toolbar.base';
import ToolbarBase from './toolbar.base';
import { resolveItemFocusTarget } from './toolbar.utils';

const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';
const TOOLBAR_AUTO_HIDE_TEXT_CLASS = 'dx-toolbar-text-auto-hide';
const TOOLBAR_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const TOOLBAR_ITEM_INVISIBLE_CLASS = 'dx-toolbar-item-invisible';
const KBN_NAMESPACE = 'toolbar-keyboard-nav';

export interface Properties extends ToolbarBaseProperties {
  menuContainer?: string | Element | undefined;
  overflowMenuVisible?: boolean;
}

class Toolbar extends ToolbarBase<Properties> {
  _layoutStrategy!: MultiLineStrategy | SingleLineStrategy;

  _activeItemIndex = 0;

  // True when focus has moved into the active item's widget (ButtonGroup, etc.).
  // Arrow keys pass through to the widget; Esc returns to toolbar navigation.
  _insideActiveItem = false;

  _keyboardNavHandler: EventListener | undefined;

  _keyboardNavContainer: Element | undefined;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      menuItemTemplate: 'menuItem',
      overflowMenuVisible: false,
      multiline: false,
    };
  }

  _isMultiline(): boolean | undefined {
    const { multiline } = this.option();
    return multiline;
  }

  _dimensionChanged(dimension?: 'height' | 'width'): void {
    if (dimension === 'height') {
      return;
    }

    super._dimensionChanged();

    this._layoutStrategy._dimensionChanged();
    this._syncRovingTabIndex();
  }

  _initMarkup(): void {
    this._activeItemIndex = 0;

    super._initMarkup();

    this._attachKeyboardNavigation();
    this._updateFocusableItemsTabIndex();

    this._layoutStrategy._initMarkup();
  }

  _renderToolbar(): void {
    super._renderToolbar();

    this._renderLayoutStrategy();
  }

  _itemContainer(): dxElementWrapper {
    if (this._isMultiline()) {
      return this._$toolbarItemsContainer;
    }

    return super._itemContainer();
  }

  _renderLayoutStrategy(): void {
    this.$element().toggleClass(TOOLBAR_MULTILINE_CLASS, this._isMultiline());

    this._layoutStrategy = this._isMultiline()
      ? new MultiLineStrategy(this)
      : new SingleLineStrategy(this);
  }

  _renderSections(): void {
    if (this._isMultiline()) {
      return;
    }

    super._renderSections();
  }

  _postProcessRenderItems(): void {
    this._layoutStrategy._hideOverflowItems();
    this._layoutStrategy._updateMenuVisibility();

    super._postProcessRenderItems();

    this._layoutStrategy._renderMenuItems();

    this._syncRovingTabIndex();
  }

  _renderItem(
    index: number,
    itemData: Item,
    $container: dxElementWrapper,
    $itemToReplace: dxElementWrapper,
  ): dxElementWrapper {
    const $itemElement = super._renderItem(index, itemData, $container, $itemToReplace);

    this._layoutStrategy._renderItem(itemData, $itemElement);

    const { widget, showText } = itemData;

    if (widget === 'dxButton' && showText === 'inMenu') {
      $itemElement.toggleClass(TOOLBAR_AUTO_HIDE_TEXT_CLASS);
    }

    return $itemElement;
  }

  // for filemanager
  _getItemsWidth(): number {
    return this._layoutStrategy._getItemsWidth();
  }

  // for filemanager
  _getMenuItems(): Item[] {
    return this._layoutStrategy._getMenuItems();
  }

  _getToolbarItems(): Item[] {
    return this._layoutStrategy._getToolbarItems();
  }

  _arrangeItems(): void {
    if (this.$element().is(':hidden')) {
      return;
    }

    const elementWidth = this._layoutStrategy._arrangeItems();

    if (!this._isMultiline()) {
      super._arrangeItems(elementWidth as number);
    }
  }

  _itemOptionChanged(
    item: Item,
    property: keyof Item,
    value: unknown,
    prevValue: unknown,
  ): void {
    if (!this._isMenuItem(item)) {
      super._itemOptionChanged(item, property, value, prevValue);
    }

    this._layoutStrategy._itemOptionChanged(item, property, value);
    // @ts-expect-error ts-error
    if (property === 'disabled' || property === 'options.disabled') {
      this._syncRovingTabIndex();
    }

    if (property === 'location') {
      this.repaint();
    }
  }

  _updateFocusableItemsTabIndex(): void {
    this._syncRovingTabIndex();
  }

  /**
   * Returns the focus targets of all enabled widget items visible in the toolbar,
   * plus the overflow "More" button if present. Used for roving tabindex navigation.
   */
  _getFocusableItems(): dxElementWrapper[] {
    const result: dxElementWrapper[] = [];
    const toolbarDisabled = !!this.option('disabled');

    this._getToolbarItems().forEach((item) => {
      const $item = this._findItemElementByItem(item);
      if (!$item.length) return;

      const itemData = this._getItemData($item);
      if ($item.hasClass(TOOLBAR_ITEM_INVISIBLE_CLASS)) return; // collapsed into overflow
      const isDisabled = !!(itemData.options?.disabled ?? itemData.disabled ?? toolbarDisabled);
      if (isDisabled) return;

      const $focusTarget = resolveItemFocusTarget($item, itemData);
      if ($focusTarget) {
        result.push($focusTarget);
      }
    });

    const $overflowTarget = this._getOverflowButtonFocusTarget();
    if ($overflowTarget && !toolbarDisabled) {
      result.push($overflowTarget);
    }

    return result;
  }

  /**
   * Returns the focus target of the overflow "More" button, or undefined if
   * the toolbar is multiline or the button is hidden.
   */
  _getOverflowButtonFocusTarget(): dxElementWrapper | undefined {
    if (this._isMultiline()) return undefined;

    const $menuContainer = this._$toolbarItemsContainer?.find(`.${TOOLBAR_MENU_CONTAINER_CLASS}`);
    if (!$menuContainer?.length || $menuContainer.hasClass(INVISIBLE_STATE_CLASS)) {
      return undefined;
    }

    const $button = $menuContainer.find('.dx-button');
    return $button.length ? $button.first() : undefined;
  }

  /**
   * Applies the roving tabindex: sets tabIndex=0 on the active item's focus target,
   * tabIndex=-1 on all others.
   */
  _syncRovingTabIndex(): void {
    this._getToolbarItems().forEach((item) => {
      const $item = this._findItemElementByItem(item);
      if (!$item.length) return;
      const itemData = this._getItemData($item);
      resolveItemFocusTarget($item, itemData)?.attr('tabIndex', -1);
    });

    this._getOverflowButtonFocusTarget()?.attr('tabIndex', -1);

    const focusableItems = this._getFocusableItems();
    if (!focusableItems.length) return;

    if (this._activeItemIndex >= focusableItems.length) {
      this._activeItemIndex = focusableItems.length - 1;
    }

    focusableItems[this._activeItemIndex].attr('tabIndex', 0);
  }

  /** Moves focus to the item at the given index and updates the roving tabindex. */
  _setActiveItem(index: number): void {
    const focusableItems = this._getFocusableItems();
    if (!focusableItems.length || index < 0 || index >= focusableItems.length) return;

    this._activeItemIndex = index;
    this._syncRovingTabIndex();
    (focusableItems[index].get(0) as HTMLElement | undefined)?.focus();
  }

  _attachKeyboardNavigation(): void {
    const container = this._$toolbarItemsContainer.get(0);
    // Use capture phase so we intercept before inner widgets (e.g. ButtonGroup)
    // stop propagation on their own arrow-key handlers.
    this._keyboardNavHandler = (e: Event): void => {
      this._handleKeyboardNavigation(e as KeyboardEvent);
    };
    container.addEventListener('keydown', this._keyboardNavHandler, true);
    this._keyboardNavContainer = container;
    eventsEngine.on(container, addNamespace('focusin', KBN_NAMESPACE), (e): void => { this._handleFocusIn(e); });
  }

  _detachKeyboardNavigation(): void {
    if (this._keyboardNavContainer) {
      if (this._keyboardNavHandler) {
        this._keyboardNavContainer.removeEventListener('keydown', this._keyboardNavHandler, true);
      }
      eventsEngine.off(this._keyboardNavContainer, addNamespace('focusin', KBN_NAMESPACE));
      this._keyboardNavContainer = undefined;
      this._keyboardNavHandler = undefined;
    }
  }

  _handleKeyboardNavigation(e: KeyboardEvent): void {
    const key = normalizeKeyName(e as Parameters<typeof normalizeKeyName>[0]);
    if (!key) return;

    const focusableItems = this._getFocusableItems();

    // Esc: exit "inside widget" mode → return focus to the toolbar-level focus target.
    if (key === 'escape') {
      if (this._insideActiveItem) {
        this._insideActiveItem = false;
        const $target = focusableItems[this._activeItemIndex];
        ($target?.get(0) as HTMLElement | undefined)?.focus();
        e.stopPropagation();
      }
      return;
    }

    // While inside a widget, pass all keys through.
    if (this._insideActiveItem) return;

    // Toolbar level: only act when focus is on one of our focus targets.
    const targetEl = e.target as Element;
    const isOnToolbarItem = focusableItems.some(($ft) => {
      const el = $ft.get(0);
      return el === targetEl || el?.contains(targetEl);
    });
    if (!isOnToolbarItem) return;

    if (key === 'enter' || key === 'space') {
      const activeEl = focusableItems[this._activeItemIndex]?.get(0) as HTMLElement | undefined;
      if (!activeEl) return;

      // Standalone ButtonGroup (not DropDownButton): intercept Enter/Space to prevent
      // immediate button activation. Enter navigation mode and focus the first button.
      const isStandaloneButtonGroup = activeEl.classList.contains('dx-buttongroup')
        && !activeEl.closest('.dx-dropdownbutton');
      if (!isStandaloneButtonGroup) return; // For Button, DropDownButton, etc.: pass through.

      e.preventDefault();
      e.stopPropagation();
      const firstBtn = activeEl.querySelector<HTMLElement>('.dx-button:not(.dx-state-disabled)');
      if (!firstBtn) return;
      this._insideActiveItem = true;
      firstBtn.focus();
      return;
    }

    // Arrow / Home / End: navigate between toolbar items.
    const isVertical = this.$element().attr('aria-orientation') === 'vertical';
    const isRTL = !!this.option('rtlEnabled');

    let direction: 'next' | 'prev' | 'first' | 'last' | null = null;

    if (key === 'home') {
      direction = 'first';
    } else if (key === 'end') {
      direction = 'last';
    } else if (!isVertical) {
      if (key === 'rightArrow') direction = isRTL ? 'prev' : 'next';
      else if (key === 'leftArrow') direction = isRTL ? 'next' : 'prev';
    } else if (key === 'downArrow') {
      direction = 'next';
    } else if (key === 'upArrow') {
      direction = 'prev';
    }

    if (direction === null) return;

    e.preventDefault();
    e.stopPropagation();

    if (!focusableItems.length) return;

    let newIndex = this._activeItemIndex;

    switch (direction) {
      case 'next':
        newIndex = Math.min(this._activeItemIndex + 1, focusableItems.length - 1);
        break;
      case 'prev':
        newIndex = Math.max(this._activeItemIndex - 1, 0);
        break;
      case 'first':
        newIndex = 0;
        break;
      case 'last':
        newIndex = focusableItems.length - 1;
        break;
      default:
        break;
    }

    if (newIndex !== this._activeItemIndex) {
      this._setActiveItem(newIndex);
    }
  }

  /**
   * After a DropDownButton opens its popup via keyboard (Enter), moves focus to
   * the first focusable element inside the popup overlay so the user can navigate
   * the list with arrow keys without needing to Tab.
   */
  _focusOpenDropDownPopup(): void {
    // Exclude wrappers that DevExtreme has hidden (they stay in the DOM).
    const popupFocusTarget = document.querySelector<HTMLElement>(
      '.dx-dropdownbutton-popup-wrapper:not([aria-hidden="true"]) [tabindex="0"]',
    );
    popupFocusTarget?.focus();
  }

  _handleFocusIn(e: { target: EventTarget | null }): void {
    const targetEl = e.target as Element;
    const focusableItems = this._getFocusableItems();

    // Reset "inside widget" mode when focus comes back to a toolbar-level focus target.
    const index = focusableItems.findIndex(($ft) => {
      const el = $ft.get(0) as Element | undefined;
      return el === targetEl || (!!el && el.contains(targetEl));
    });

    if (index === -1) return;

    // If focus returns to the top-level focus target (not a child button inside ButtonGroup),
    // exit inside-widget mode.
    const isOnFocusTarget = focusableItems[index]?.get(0) === targetEl;
    if (isOnFocusTarget) {
      this._insideActiveItem = false;
    }

    if (index !== this._activeItemIndex) {
      this._activeItemIndex = index;
      this._syncRovingTabIndex();
    }
  }

  _isMenuItem(itemData: Item): boolean {
    return itemData.locateInMenu === 'always';
  }

  _isToolbarItem(itemData: Item): boolean {
    return itemData.location === undefined || itemData.locateInMenu === 'never';
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    this._layoutStrategy._optionChanged(name, value);

    switch (name) {
      case 'menuContainer':
      case 'menuItemTemplate':
      case 'overflowMenuVisible':
        break;
      case 'multiline':
        this._invalidate();
        break;
      case 'disabled':
        super._optionChanged(args);

        this._updateFocusableItemsTabIndex();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _dispose(): void {
    this._detachKeyboardNavigation();
    super._dispose();
  }

  // it is not public
  updateDimensions(): void {
    this._dimensionChanged();
  }
}

registerComponent('dxToolbar', Toolbar);

export default Toolbar;
