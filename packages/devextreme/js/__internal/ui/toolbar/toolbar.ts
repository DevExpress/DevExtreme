import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import $, { type dxElementWrapper } from '@js/core/renderer';
import type { Item } from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';

import { MultiLineStrategy } from './strategy/toolbar.multiline';
import { SingleLineStrategy } from './strategy/toolbar.singleline';
import type { ToolbarBaseProperties } from './toolbar.base';
import ToolbarBase from './toolbar.base';
import { resolveItemFocusTarget, TEMPLATE_FOCUSABLE_SELECTOR } from './toolbar.utils';

const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';
const TOOLBAR_AUTO_HIDE_TEXT_CLASS = 'dx-toolbar-text-auto-hide';
const TOOLBAR_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const TOOLBAR_ITEM_CLASS = 'dx-toolbar-item';
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

  // True when the most recent focus change inside the toolbar was triggered by a mouse click.
  // Used to distinguish mouse-initiated focus from keyboard navigation.
  _lastFocusFromMouse = false;

  _keyboardNavHandler: EventListener | undefined;

  _mouseDownHandler: EventListener | undefined;

  _keyboardNavContainer: Element | undefined;

  // Snapshot of the active item captured in _refresh() BEFORE _clean() erases the DOM.
  // Used by _initMarkup() to re-locate the active item after the re-render.
  _pendingSnapshot: { savedIndex: number; data: Item | null; wasOverflow: boolean } | null = null;

  // Document-level keydown handler attached while the overflow menu is open.
  // Handles Esc / Tab from inside the popup (which is outside the toolbar DOM).
  _overflowMenuKeyHandler: EventListener | undefined;

  // True when the overflow menu was closed by Tab (prevents focus being returned to "More" button).
  _overflowMenuClosedByTab = false;

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

  _refresh(): void {
    // Capture the active item's identity from the live DOM *before* _clean() erases it.
    // _initMarkup() is called after _clean(), so it would see an empty container otherwise.
    this._captureActiveItemSnapshot();
    super._refresh();
  }

  /** Snapshots the active item data before the DOM is cleared by _clean(). */
  _captureActiveItemSnapshot(): void {
    const savedIndex = this._activeItemIndex;
    if (typeof savedIndex !== 'number') return;

    const prevFocusItems = this._getFocusableItems();
    if (savedIndex < 0 || savedIndex >= prevFocusItems.length) {
      this._pendingSnapshot = null;
      return;
    }

    const $prevFT = prevFocusItems[savedIndex];
    const $item = $prevFT.closest(`.${TOOLBAR_ITEM_CLASS}`);
    this._pendingSnapshot = $item.length
      ? { savedIndex, data: this._getItemData($item) as Item, wasOverflow: false }
      : { savedIndex, data: null, wasOverflow: true };
  }

  /** Reads active item identity from the live DOM (fallback when _pendingSnapshot is absent). */
  _resolveActiveItemFromDOM(index: number): { data: Item | null; wasOverflow: boolean } {
    const prevFocusItems = this._getFocusableItems();
    if (index < 0 || index >= prevFocusItems.length) {
      return { data: null, wasOverflow: false };
    }
    const $item = prevFocusItems[index].closest(`.${TOOLBAR_ITEM_CLASS}`);
    if ($item.length) {
      return { data: this._getItemData($item) as Item, wasOverflow: false };
    }
    return { data: null, wasOverflow: true };
  }

  _initMarkup(): void {
    // On first render _activeItemIndex is still undefined (class field runs after super()),
    // so we initialise it here only when needed.
    const isFirstRender = typeof this._activeItemIndex !== 'number';
    if (isFirstRender) {
      this._activeItemIndex = 0;
    }

    // Resolve the active item's pre-render identity.
    // _refresh() captures it before _clean(); for the initial render path (no _refresh)
    // we fall back to reading the DOM directly (which is still intact at that point).
    const savedIndex = this._activeItemIndex;
    let activeItemData: Item | null = null;
    let activeWasOverflow = false;

    if (!isFirstRender) {
      const snap = this._pendingSnapshot;
      this._pendingSnapshot = null;

      if (snap !== null) {
        // Use the pre-captured snapshot (DOM may already be empty after _clean()).
        activeItemData = snap.data;
        activeWasOverflow = snap.wasOverflow;
      } else {
        // Fallback: DOM is still intact (non-_refresh re-render path).
        const domSnap = this._resolveActiveItemFromDOM(savedIndex);
        activeItemData = domSnap.data;
        activeWasOverflow = domSnap.wasOverflow;
      }
    }

    super._initMarkup();

    // After re-render: update _activeItemIndex to track the same item.
    if (!isFirstRender) {
      if (activeWasOverflow) {
        if (this._getOverflowButtonFocusTarget()) {
          this._activeItemIndex = this._getFocusableItems().length - 1;
        }
      } else if (activeItemData !== null) {
        const newIndex = this._findFocusItemIndexByData(activeItemData);
        // If item still exists use its new index; otherwise move to the
        // previous item (item was deleted → keep focus near that position).
        this._activeItemIndex = newIndex !== -1 ? newIndex : Math.max(0, savedIndex - 1);
      }
    }

    this._attachKeyboardNavigation();
    this._updateFocusableItemsTabIndex();

    this._layoutStrategy._initMarkup();
  }

  /** Finds the focusable-item index that matches the given item data reference. */
  _findFocusItemIndexByData(data: Item): number {
    const focusItems = this._getFocusableItems();
    for (let i = 0; i < focusItems.length; i += 1) {
      const $item = focusItems[i].closest(`.${TOOLBAR_ITEM_CLASS}`);
      if ($item.length && this._getItemData($item) === data) return i;
    }
    return -1;
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
   * Items are returned in visual (DOM) order, not items-array order, so that items
   * in the 'before' / 'after' sections are navigated in the order the user sees them.
   */
  _getFocusableItems(): dxElementWrapper[] {
    const result: dxElementWrapper[] = [];
    const toolbarDisabled = !!this.option('disabled');

    const toolbarItemDomNodes = this._$toolbarItemsContainer?.find(`.${TOOLBAR_ITEM_CLASS}`).toArray() ?? [];
    toolbarItemDomNodes.forEach((el) => {
      const $item = $(el);
      if ($item.hasClass(TOOLBAR_ITEM_INVISIBLE_CLASS)) return;
      const itemData = this._getItemData($item) as Item;
      const isDisabled = !!(itemData?.options?.disabled ?? itemData?.disabled ?? toolbarDisabled);
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
      const $ft = resolveItemFocusTarget($item, itemData);
      $ft?.attr('tabIndex', -1);
      // For template items: also suppress inner focusables so they don't appear
      // in the global Tab sequence while in toolbar-navigation mode.
      if ($ft?.get(0)?.classList.contains('dx-item-content')) {
        $ft.find(TEMPLATE_FOCUSABLE_SELECTOR).attr('tabindex', '-1');
      }
    });

    this._getOverflowButtonFocusTarget()?.attr('tabIndex', -1);

    const focusableItems = this._getFocusableItems();
    if (!focusableItems.length) return;

    if (this._activeItemIndex < 0 || this._activeItemIndex >= focusableItems.length) {
      this._activeItemIndex = focusableItems.length - 1;
    }

    focusableItems[this._activeItemIndex].attr('tabIndex', 0);

    // Template item in edit mode: restore inner focusables to natural tabindex so
    // the user can Tab through them and interact normally.
    const activeEl = focusableItems[this._activeItemIndex].get(0);
    if (activeEl?.classList.contains('dx-item-content') && this._insideActiveItem) {
      $(activeEl).find(TEMPLATE_FOCUSABLE_SELECTOR).removeAttr('tabindex');
    }
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
    this._mouseDownHandler = (): void => {
      this._lastFocusFromMouse = true;
    };
    container.addEventListener('mousedown', this._mouseDownHandler, true);
    this._keyboardNavContainer = container;
    eventsEngine.on(container, addNamespace('focusin', KBN_NAMESPACE), (e): void => { this._handleFocusIn(e); });
  }

  _detachKeyboardNavigation(): void {
    if (this._keyboardNavContainer) {
      if (this._keyboardNavHandler) {
        this._keyboardNavContainer.removeEventListener('keydown', this._keyboardNavHandler, true);
      }
      if (this._mouseDownHandler) {
        this._keyboardNavContainer.removeEventListener('mousedown', this._mouseDownHandler, true);
        this._mouseDownHandler = undefined;
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
    const activeEl = focusableItems[this._activeItemIndex]?.get(0) as HTMLElement | undefined;

    // ── Esc ──────────────────────────────────────────────────────────────────
    if (key === 'escape') {
      if (this._insideActiveItem) {
        this._insideActiveItem = false;
        const isInsideToolbar = !!this._keyboardNavContainer?.contains(e.target as Element);
        const isActiveSelectBox = !!activeEl?.closest('.dx-selectbox');
        // For inline widgets: refocus and block propagation. For SelectBox: propagate
        // so the SelectBox can close its popup; _handleFocusIn finalises state afterward.
        if (isInsideToolbar && !isActiveSelectBox) {
          activeEl?.focus();
          e.stopPropagation();
        }
      }
      return;
    }

    // ── Widget mode: pass all keys through ───────────────────────────────────
    if (this._insideActiveItem) return;

    // ── Must be on a toolbar-level focus target ───────────────────────────────
    const targetEl = e.target as Element;
    const isOnToolbarItem = focusableItems.some(($ft) => {
      const el = $ft.get(0);
      return el === targetEl || el?.contains(targetEl);
    });
    if (!isOnToolbarItem) return;

    if (!activeEl) return;

    // ── Categorise active item ────────────────────────────────────────────────
    const isInsideDropDownButton = !!activeEl.closest('.dx-dropdownbutton');
    const isInput = activeEl.tagName === 'INPUT';
    const isSelectBox = isInput && !!activeEl.closest('.dx-selectbox');
    const isTextBox = isInput && !isSelectBox;
    const isTemplateContainer = activeEl.classList.contains('dx-item-content');
    const isOverflowButton = !!activeEl.closest('.dx-toolbar-menu-container');

    const isVertical = this.$element().attr('aria-orientation') === 'vertical';
    const isRTL = !!this.option('rtlEnabled');

    // ── Enter / Space ─────────────────────────────────────────────────────────
    if (key === 'enter' || key === 'space') {
      if (isOverflowButton) {
        e.preventDefault();
        e.stopPropagation();
        this._openOverflowMenuAndFocus();
        return;
      }
      if (isInsideDropDownButton) {
        e.preventDefault();
        e.stopPropagation();
        this._openDropDownButtonAndFocus(activeEl);
        return;
      }
      if (isSelectBox) {
        e.preventDefault();
        e.stopPropagation();
        this._openSelectBoxAndFocus(activeEl);
        return;
      }
      if (isTextBox) {
        if (key === 'enter') {
          // Only Enter activates editing mode (not Space).
          this._insideActiveItem = true;
          return; // pass through to input
        }
        // Space: stay in toolbar mode, block insertion.
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // Standalone ButtonGroup or simple Button: pass through unchanged.
      if (isTemplateContainer) {
        if (key === 'enter') {
          e.preventDefault();
          e.stopPropagation();
          this._enterTemplateItem(activeEl);
          return;
        }
        // Space: prevent accidental page scroll, otherwise no-op.
        e.preventDefault();
        return;
      }
      // ButtonGroup or Button: pass through unchanged.
      return;
    }

    // ── ↓ opens popup widgets ─────────────────────────────────────────────────
    if (key === 'downArrow' && !isVertical) {
      if (isOverflowButton) {
        e.preventDefault();
        e.stopPropagation();
        this._openOverflowMenuAndFocus();
        return;
      }
      if (isInsideDropDownButton) {
        e.preventDefault();
        e.stopPropagation();
        this._openDropDownButtonAndFocus(activeEl);
        return;
      }
      if (isSelectBox) {
        e.preventDefault();
        e.stopPropagation();
        this._openSelectBoxAndFocus(activeEl);
        return;
      }
      // ButtonGroup or Button: fall through (ButtonGroup handles ↓ internally).
      return;
    }

    // ── Arrow / Home / End: toolbar navigation ────────────────────────────────
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

    if (direction === null) {
      // For TextBox in toolbar mode: block any key that would produce text input
      // (characters, Backspace, Delete). Tab and F-keys are NOT blocked.
      if (isTextBox) {
        const isTextInputKey = e.key.length === 1 || key === 'backspace' || key === 'del';
        if (isTextInputKey) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      return;
    }

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
   * Opens a DropDownButton popup using its public API and moves focus
   * into the popup's scrollable list.
   */
  _openDropDownButtonAndFocus(focusTarget: HTMLElement): void {
    const dropDownButtonRoot = focusTarget.closest('.dx-dropdownbutton');
    if (!dropDownButtonRoot) return;
    const instance = $(dropDownButtonRoot).data('dxDropDownButton') as unknown as { open: () => void } | undefined;
    if (!instance) return;

    instance.open();
    this._insideActiveItem = true;

    // Popup DOM is created synchronously; focus the scrollable list container.
    const listContainer = document.querySelector<HTMLElement>(
      '.dx-dropdownbutton-popup-wrapper .dx-scrollview-content',
    );
    listContainer?.focus();
  }

  /**
   * Opens a SelectBox dropdown and enters "active item" mode.
   * Focus remains on the SelectBox input; the SelectBox handles arrow-key navigation
   * through its own keyboard listeners once the popup is open.
   * Keeping focus on the input avoids leaking tabindex=0 on popup list items.
   */
  _openSelectBoxAndFocus(focusTarget: HTMLElement): void {
    const selectBoxRoot = focusTarget.closest('.dx-selectbox');
    if (!selectBoxRoot) return;
    const instance = $(selectBoxRoot).data('dxSelectBox') as unknown as { open: () => void } | undefined;
    if (!instance) return;

    instance.open();
    this._insideActiveItem = true;
    // Focus stays on the SelectBox input. The SelectBox widget handles ArrowDown/Up
    // to navigate the list. Esc will be forwarded to the SelectBox to close the popup.
  }

  /**
   * Activates a template item container: enters edit mode so the user can interact
   * with inner focusable elements, and moves focus to the first one.
   */
  _enterTemplateItem(containerEl: HTMLElement): void {
    const firstFocusable = containerEl.querySelector<HTMLElement>(TEMPLATE_FOCUSABLE_SELECTOR);
    if (!firstFocusable) return;
    this._insideActiveItem = true;
    this._syncRovingTabIndex();
    firstFocusable.focus();
  }

  /**
   * Opens the overflow ("More") dropdown menu and moves focus to the first list item.
   * Because the popup is rendered outside the toolbar DOM, a document-level keydown
   * capture listener is attached to handle Esc and Tab while the menu is open.
   */
  _openOverflowMenuAndFocus(): void {
    // Access the DropDownMenu instance through the layout strategy (it is an
    // internal component not registered as a jQuery plugin, so it cannot be
    // retrieved via $(el).data()).
    interface StrategyWithMenu { _menu?: { option: (name: string, val?: unknown) => unknown } }
    const instance = (this._layoutStrategy as unknown as StrategyWithMenu)?._menu;
    if (!instance) return;

    instance.option('opened', true);
    this._insideActiveItem = true;

    // Collect all focusable targets inside the popup list items.
    // We navigate between these with ↑/↓ via our document-level listener.
    // Focusing the scrollview root won't work — ToolbarMenuList has focusStateEnabled=false,
    // so dxList does not apply .dx-state-focused or move focus between items on arrow keys.
    const getFocusableMenuItems = (): HTMLElement[] => {
      const popup = document.querySelector('.dx-dropdownmenu-popup-wrapper');
      if (!popup) return [];
      return [...popup.querySelectorAll<HTMLElement>(
        '.dx-list-item:not(.dx-state-disabled) [tabindex="0"]',
      )];
    };

    // Focus the first item after the popup finishes opening.
    // The popup overlay previously stole focus via its onShown handler, but
    // toolbar.menu.ts now has focusStateEnabled:false on the popup to prevent that.
    // We still defer with rAF to let the popup finish rendering.
    window.requestAnimationFrame(() => {
      getFocusableMenuItems()[0]?.focus();
    });

    // Attach a document-level capture listener to handle Esc/Tab/↑/↓ from the popup.
    // The popup is outside _$toolbarItemsContainer so the toolbar capture handler
    // cannot intercept those events.
    // ALL cleanup is delegated to _optionChanged('overflowMenuVisible') so that
    // item-click and outside-click are handled uniformly.
    this._detachOverflowMenuKeyHandler();
    this._overflowMenuClosedByTab = false;

    this._overflowMenuKeyHandler = (ev: Event): void => {
      const key = normalizeKeyName(ev as Parameters<typeof normalizeKeyName>[0]);

      // If focus has moved into a sub-popup (e.g. SelectBox dropdown) or a nested
      // overlay opened by a widget inside the overflow menu, let that widget handle
      // keyboard events first. We detect this by checking whether focus left the
      // overflow popup wrapper, or whether any overlay other than our own is open.
      const overflowWrapper = document.querySelector('.dx-dropdownmenu-popup-wrapper');
      const ae = document.activeElement as HTMLElement | null;
      const focusInOverflow = !!overflowWrapper && !!ae && overflowWrapper.contains(ae);
      const nestedPopupOpen = !!document.querySelector(
        '.dx-popup-wrapper:not(.dx-dropdownmenu-popup-wrapper)',
      );

      if (key === 'downArrow' || key === 'upArrow') {
        // Don't intercept arrows with modifiers — Alt+↓ opens a SelectBox dropdown,
        // etc. Also skip when a nested popup is open (SelectBox/DropDownBox dropdown)
        // or when focus left the overflow popup entirely.
        const evt = ev as KeyboardEvent;
        if (evt.altKey || evt.ctrlKey || evt.metaKey) return;
        if (nestedPopupOpen || !focusInOverflow) return;

        const menuItems = getFocusableMenuItems();
        if (!menuItems.length) return;
        const currentIdx = menuItems.indexOf(ae);
        if (currentIdx < 0) return; // focus not on a menu item — don't navigate
        let nextIdx = 0;
        if (key === 'downArrow') {
          nextIdx = Math.min(currentIdx + 1, menuItems.length - 1);
        } else {
          nextIdx = Math.max(currentIdx - 1, 0);
        }
        menuItems[nextIdx]?.focus();
        (ev as KeyboardEvent).preventDefault();
        (ev as KeyboardEvent).stopPropagation();
      } else if (key === 'escape') {
        // Don't intercept Escape if a nested popup (SelectBox dropdown) is open —
        // let the widget close its own popup first. A subsequent Escape will then
        // reach us to close the overflow menu.
        if (nestedPopupOpen || !focusInOverflow) return;
        // Close popup; _optionChanged handles cleanup and focus-return.
        instance.option('opened', false);
        (ev as KeyboardEvent).stopPropagation();
        (ev as KeyboardEvent).preventDefault();
      } else if (key === 'tab') {
        // Close popup but let Tab propagate so the browser moves focus naturally.
        this._overflowMenuClosedByTab = true;
        instance.option('opened', false);
        // NOTE: do NOT stopPropagation / preventDefault here.
      }
    };
    document.addEventListener('keydown', this._overflowMenuKeyHandler, true);
  }

  /** Removes the document-level overflow menu keyboard listener if attached. */
  _detachOverflowMenuKeyHandler(): void {
    if (this._overflowMenuKeyHandler) {
      document.removeEventListener('keydown', this._overflowMenuKeyHandler, true);
      this._overflowMenuKeyHandler = undefined;
    }
  }

  /**
   * Cleans up all state when the overflow menu closes (Esc, Tab, item click, or
   * outside click). Called from _optionChanged('overflowMenuVisible').
   */
  _closeOverflowMenuState(): void {
    const wasTab = this._overflowMenuClosedByTab;
    this._insideActiveItem = false;
    this._overflowMenuClosedByTab = false;
    this._detachOverflowMenuKeyHandler();
    if (!wasTab) {
      const $overflowFT = this._getOverflowButtonFocusTarget();
      const el = $overflowFT?.get(0) as HTMLElement | undefined;
      // Defer focus so the popup's hide animation does not intercept focus.
      if (el) {
        setTimeout(() => { el.focus(); }, 0);
      }
    }
  }

  _handleFocusIn(e: { target: EventTarget | null }): void {
    const targetEl = e.target as Element;
    const focusableItems = this._getFocusableItems();

    const index = focusableItems.findIndex(($ft) => {
      const el = $ft.get(0) as Element | undefined;
      return el === targetEl || (!!el && el.contains(targetEl));
    });

    if (index === -1) {
      this._lastFocusFromMouse = false;
      return;
    }

    const focusTargetEl = focusableItems[index]?.get(0) as Element | undefined;
    const isOnFocusTarget = focusTargetEl === targetEl;

    const fromMouse = this._lastFocusFromMouse;
    this._lastFocusFromMouse = false;

    if (isOnFocusTarget) {
      // For a mouse click on a TextBox, immediately activate edit mode so the user can
      // type without pressing Enter first. For all other items, always reset to toolbar mode.
      const isFocusTargetInput = focusTargetEl?.tagName === 'INPUT';
      const isFocusTargetSelectBox = isFocusTargetInput && !!focusTargetEl?.closest?.('.dx-selectbox');
      const isFocusTargetTextBox = isFocusTargetInput && !isFocusTargetSelectBox;

      this._insideActiveItem = fromMouse && isFocusTargetTextBox;
    } else {
      // Focus landed on a child element inside the item (e.g. mouse click on an inner
      // input/button inside a template). Enter edit mode for template containers;
      // reset to toolbar mode for everything else (guards against stale state).
      const isFocusTargetTemplate = !!focusTargetEl?.classList.contains('dx-item-content');
      this._insideActiveItem = isFocusTargetTemplate;
    }

    this._activeItemIndex = index;
    // Always sync to clean up any rogue tabindices set by inner widgets
    // (e.g. dx-list sets tabindex=0 on its scrollview after popup opens).
    this._syncRovingTabIndex();
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
        break;
      case 'overflowMenuVisible':
        // When the overflow menu closes while we are in active-item mode, restore state
        // and return focus to the "More" button (unless menu was closed by Tab, in which
        // case the browser handles focus navigation naturally).
        if (!value && this._insideActiveItem) {
          this._closeOverflowMenuState();
        }
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
    this._detachOverflowMenuKeyHandler();
    super._dispose();
  }

  // it is not public
  updateDimensions(): void {
    this._dimensionChanged();
  }
}

registerComponent('dxToolbar', Toolbar);

export default Toolbar;
