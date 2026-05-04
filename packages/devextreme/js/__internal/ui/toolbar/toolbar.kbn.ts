 import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item } from '@js/ui/toolbar';

import type Toolbar from './toolbar';

const EVENT_NAMESPACE = 'dxToolbarKBN';

const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_ITEM_CLASS = 'dx-buttongroup-item';
const TOOLBAR_ITEM_INVISIBLE_CLASS = 'dx-toolbar-item-invisible';
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const TOOLBAR_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';
const TOOLBAR_MENU_ACTION_CLASS = 'dx-toolbar-menu-action';
const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';

// Widget types that can appear as toolbar items and have a known focus target
const KNOWN_WIDGET_TYPES = [
  'dxAutocomplete',
  'dxButton',
  'dxCheckBox',
  'dxDateBox',
  'dxMenu',
  'dxSelectBox',
  'dxTabs',
  'dxTextBox',
  'dxButtonGroup',
  'dxDropDownButton',
];

interface FocusableItem {
  $toolbarItem: dxElementWrapper;
  $focusTarget: dxElementWrapper;
  itemData?: Item;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWidgetInstance($el: dxElementWrapper): any | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = ($el.data as () => any)();
  const components = data?.dxComponents as string[] | undefined;
  const widgetName = components?.[0];
  if (!widgetName) return null;

  return data[widgetName] ?? null;
}

/**
 * Finds the primary focusable DOM element inside a single toolbar item container.
 *
 * - For known DevExtreme widget types the widget instance's _focusTarget() is used.
 * - For custom template items the first naturally focusable descendant is returned.
 * - Returns null when no focusable element can be found (separators, static labels).
 */
function resolveFocusTarget(
  $toolbarItem: dxElementWrapper,
  itemData: Item,
): dxElementWrapper | null {
  const { widget } = itemData;

  if (widget && KNOWN_WIDGET_TYPES.includes(widget)) {
    const selector = widget.toLowerCase().replace('dx', '.dx-');
    const $widgetRoot = $toolbarItem.find(selector).first();
    if (!$widgetRoot.length) return null;

    const instance = getWidgetInstance($widgetRoot);
    if (!instance) return null;

    let $target: dxElementWrapper | null = instance._focusTarget?.() ?? null;

    if (widget === 'dxDropDownButton') {
      $target = $target?.find(`.${BUTTON_GROUP_CLASS}`) ?? null;
    } else if (!$target?.length) {
      $target = $(instance.element());
    }

    return $target?.length ? $target : null;
  }

  // Custom template: take the first naturally keyboard-reachable element.
  const $generic = $toolbarItem
    .find('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
    .first();

  return $generic.length ? $generic : null;
}

/**
 * Determines whether a toolbar item should participate in roving-tabindex navigation.
 * Separators, hidden items, and disabled items are excluded.
 */
function isItemNavigable(
  $toolbarItem: dxElementWrapper,
  itemData: Item,
  toolbarDisabled: boolean,
): boolean {
  if (toolbarDisabled) return false;
  if (itemData.disabled ?? (itemData.options as Record<string, unknown> | undefined)?.disabled) {
    return false;
  }
  if ($toolbarItem.hasClass(TOOLBAR_ITEM_INVISIBLE_CLASS)) return false;
  if ($toolbarItem.hasClass(STATE_INVISIBLE_CLASS)) return false;
  if ($toolbarItem.css('display') === 'none') return false;
  return true;
}

/**
 * ToolbarKBN — manages roving-tabindex keyboard navigation for a toolbar.
 *
 * Lifecycle:
 *   1. Instantiate: `new ToolbarKBN(toolbar)`
 *   2. Call `attach()` once the toolbar DOM is ready.
 *   3. Call `refresh()` whenever the item set or disabled state changes.
 *   4. Call `detach()` on toolbar dispose.
 */
export class ToolbarKBN {
  private readonly _toolbar: Toolbar;

  /** Index into the list returned by `_getFocusableItems()` that currently holds tabindex=0. */
  private _rovingIndex = 0;

  /** Virtual focus index within the overflow popup rows (-1 = none). */
  private _popupFocusIdx = -1;

  /** Tracks whether popup was open last time _getPopupRows() was called (to reset on re-open). */
  private _wasPopupOpen = false;

  private _isAttached = false;

  // Native capture-phase handler + element reference, kept for removeEventListener.
  private _captureKeydownHandler: ((e: KeyboardEvent) => void) | null = null;

  // Document-level capture handler for overflow popup navigation.
  private _docKeydownHandler: ((e: KeyboardEvent) => void) | null = null;

  private _domEl: HTMLElement | null = null;

  constructor(toolbar: Toolbar) {
    this._toolbar = toolbar;
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  attach(): void {
    if (this._isAttached) return;

    // Use native capture-phase listener so the toolbar KBN fires BEFORE handlers
    // on descendant widgets (e.g. ButtonGroup calls stopPropagation on ArrowRight
    // in the bubble phase, which would prevent this handler from running).
    this._captureKeydownHandler = (e: KeyboardEvent) => { this._handleKeyDown(e); };
    // element() returns a jQuery-like dxElementWrapper; [0] gives the raw DOM node.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._domEl = (this._toolbar.element() as any)[0] as HTMLElement;
    this._domEl.addEventListener('keydown', this._captureKeydownHandler, { capture: true });

    // Document-level capture handler for popup keyboard navigation (Issue 3).
    // Must be document-level because the popup is rendered outside the toolbar DOM.
    this._docKeydownHandler = (e: KeyboardEvent) => { this._handleDocKeyDown(e); };
    document.addEventListener('keydown', this._docKeydownHandler, { capture: true });

    const mousedownEvent = addNamespace('mousedown', EVENT_NAMESPACE);
    eventsEngine.on(
      this._toolbar.element(),
      mousedownEvent,
      (e: MouseEvent) => { this._handleMouseDown(e); },
    );

    this._isAttached = true;
  }

  detach(): void {
    if (!this._isAttached) return;

    if (this._captureKeydownHandler && this._domEl) {
      this._domEl.removeEventListener('keydown', this._captureKeydownHandler, { capture: true });
      this._captureKeydownHandler = null;
      this._domEl = null;
    }

    if (this._docKeydownHandler) {
      document.removeEventListener('keydown', this._docKeydownHandler, { capture: true });
      this._docKeydownHandler = null;
    }

    eventsEngine.off(this._toolbar.element(), `.${EVENT_NAMESPACE}`);
    this._isAttached = false;
  }

  /**
   * Re-scans focusable items and applies roving tabindex.
   * Call after every markup change (items added/removed/disabled).
   */
  refresh(): void {
    const items = this._getFocusableItems();
    if (items.length === 0) return;

    // Clamp the stored index so it remains valid after item set changes.
    this._rovingIndex = Math.max(0, Math.min(this._rovingIndex, items.length - 1));
    this._applyRovingTabindex(items);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private _getFocusableItems(): FocusableItem[] {
    const toolbar = this._toolbar;
    const toolbarDisabled = !!toolbar.option('disabled');
    const result: FocusableItem[] = [];

    toolbar._getToolbarItems().forEach((itemData) => {
      const $item = toolbar._findItemElementByItem(itemData);
      if (!$item.length) return;
      if (!isItemNavigable($item, itemData, toolbarDisabled)) return;

      const $focusTarget = resolveFocusTarget($item, itemData);
      if (!$focusTarget?.length) return;

      result.push({ $toolbarItem: $item, $focusTarget, itemData });
    });

    // Include the overflow ("More") button if it exists and is visible.
    const $overflowContainer = toolbar.$element()
      .find(`.${TOOLBAR_MENU_CONTAINER_CLASS}`)
      .not(`.${STATE_INVISIBLE_CLASS}`)
      .first();

    if ($overflowContainer.length) {
      const $btn = $overflowContainer.find('.dx-button').first();
      if ($btn.length) {
        result.push({ $toolbarItem: $overflowContainer, $focusTarget: $btn });
      }
    }

    return result;
  }

  private _applyRovingTabindex(items?: FocusableItem[]): void {
    const focusableItems = items ?? this._getFocusableItems();
    focusableItems.forEach(({ $focusTarget }, index) => {
      $focusTarget.attr('tabindex', index === this._rovingIndex ? 0 : -1);
    });
  }

  /**
   * Intercepts Arrow / Home / End keys when focus is inside the current roving item.
   *
   * - Issue 2: Blocks navigation while a SelectBox dropdown is open.
   * - Issue 1: Passes Left/Right through to ButtonGroup for internal navigation;
   *   only intercepts at the first/last button boundary to exit the group.
   */
  private _handleKeyDown(e: KeyboardEvent): void {
    const items = this._getFocusableItems();
    if (!items.length) return;

    const rovingItem = items[this._rovingIndex];
    if (!rovingItem) return;

    // Only act when focus is anywhere inside the current roving toolbar item.
    const activeEl = document.activeElement;
    if (!rovingItem.$toolbarItem.get(0).contains(activeEl)) return;

    // Defensive guard: don't do toolbar nav while overflow popup is open.
    if (this._isOverflowPopupOpen()) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isVertical = ((this._toolbar.option as unknown as (key: string) => unknown)('orientation')) === 'vertical';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isRTL = !!(this._toolbar.option as unknown as (key: string) => unknown)('rtlEnabled');

    const nextKey = isVertical ? 'ArrowDown' : (isRTL ? 'ArrowLeft' : 'ArrowRight');
    const prevKey = isVertical ? 'ArrowUp' : (isRTL ? 'ArrowRight' : 'ArrowLeft');

    // Issue 2: block all navigation while a SelectBox in the current item is open.
    if (this._isSelectBoxOpen(rovingItem)) return;

    // Issue 1: ButtonGroup — KBN fully owns Left/Right navigation inside the group.
    // BG's own keyboard handler requires a prior mousedown to activate, which doesn't
    // happen during programmatic or Tab-based focus. KBN manually moves dx-state-focused
    // to track the virtual cursor, and exits to the toolbar at first/last boundaries.
    const bgInstance = this._getButtonGroupInstance(rovingItem);
    if (bgInstance && (e.key === nextKey || e.key === prevKey)) {
      const $bgEl = rovingItem.$toolbarItem.find(`.${BUTTON_GROUP_CLASS}`).first();
      const $allItems = $bgEl.find(`.${BUTTON_GROUP_ITEM_CLASS}`);
      const $focusedItem = $bgEl.find(`.${BUTTON_GROUP_ITEM_CLASS}.dx-state-focused`);
      const isFirst = !$focusedItem.length || $focusedItem.is($allItems.first());
      const isLast = $focusedItem.length > 0 && $focusedItem.is($allItems.last());

      e.preventDefault();
      e.stopPropagation();

      if (e.key === nextKey && isLast) {
        // Exit BG to the right.
        this._moveByOffset(1, items, 1);
      } else if (e.key === prevKey && isFirst) {
        // Exit BG to the left.
        this._moveByOffset(-1, items, -1);
      } else if (e.key === nextKey) {
        // Move virtual focus to the next BG item.
        const $next = $focusedItem.length
          ? $focusedItem.next().filter(`.${BUTTON_GROUP_ITEM_CLASS}`)
          : $allItems.first();
        if ($next.length) {
          $allItems.removeClass('dx-state-focused');
          $next.addClass('dx-state-focused');
        }
      } else {
        // Move virtual focus to the previous BG item.
        const $prev = $focusedItem.length
          ? $focusedItem.prev().filter(`.${BUTTON_GROUP_ITEM_CLASS}`)
          : $allItems.last();
        if ($prev.length) {
          $allItems.removeClass('dx-state-focused');
          $prev.addClass('dx-state-focused');
        }
      }
      return;
    }

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        e.stopPropagation();
        this._moveByOffset(1, items, 1);
        break;

      case prevKey:
        e.preventDefault();
        e.stopPropagation();
        this._moveByOffset(-1, items, -1);
        break;

      case 'Home':
        e.preventDefault();
        e.stopPropagation();
        this._moveTo(0, items, 1);
        break;

      case 'End':
        e.preventDefault();
        e.stopPropagation();
        this._moveTo(items.length - 1, items, -1);
        break;

      default:
        break;
    }
  }

  /** Updates the roving anchor to whichever toolbar item the user clicked. */
  private _handleMouseDown(e: MouseEvent): void {
    const items = this._getFocusableItems();
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].$toolbarItem.get(0).contains(e.target as Element)) {
        this._rovingIndex = i;
        this._applyRovingTabindex(items);
        break;
      }
    }
  }

  /** Moves focus by +1 or -1. Non-wrapping: stops at boundaries. */
  private _moveByOffset(offset: number, items: FocusableItem[], direction?: 1 | -1): void {
    const newIndex = this._rovingIndex + offset;
    // KBN-8: non-wrapping — silently ignore out-of-range moves.
    if (newIndex >= 0 && newIndex < items.length) {
      this._moveTo(newIndex, items, direction ?? (offset > 0 ? 1 : -1));
    }
  }

  /**
   * Moves the roving anchor to `index` and focuses the target element.
   * `direction` (1 = entering from left/top, -1 = entering from right/bottom) controls
   * which ButtonGroup item gets the initial focused-element highlight on entry.
   */
  private _moveTo(index: number, items: FocusableItem[], direction: 1 | -1 = 1): void {
    if (index < 0 || index >= items.length) return;
    this._rovingIndex = index;
    this._applyRovingTabindex(items);
    const item = items[index];
    const el = item.$focusTarget.get(0) as HTMLElement | undefined;
    el?.focus();

    // Issue 1: pre-set ButtonGroup's focused item based on entry direction so the
    // first Left/Right press within the group moves to the correct adjacent button.
    const bgInstance = this._getButtonGroupInstance(item);
    if (bgInstance) {
      const $bgEl = item.$toolbarItem.find(`.${BUTTON_GROUP_CLASS}`).first();
      const $allItems = $bgEl.find(`.${BUTTON_GROUP_ITEM_CLASS}`);
      const $entryItem = direction >= 0 ? $allItems.first() : $allItems.last();
      if ($entryItem.length) {
        // Set via option so ButtonGroup tracks it internally
        bgInstance.option('focusedElement', $entryItem.get(0));
        // Also ensure the visual focused state matches
        $allItems.removeClass('dx-state-focused');
        $entryItem.addClass('dx-state-focused');
      }
    }
  }

  // ─── Issue 1: ButtonGroup helpers ─────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _getButtonGroupInstance(item: FocusableItem): any | null {
    if (item.itemData?.widget !== 'dxButtonGroup') return null;
    const $bg = item.$toolbarItem.find(`.${BUTTON_GROUP_CLASS}`).first();
    return $bg.length ? getWidgetInstance($bg) : null;
  }

  // ─── Issue 2: SelectBox open-state guard ──────────────────────────────────

  private _isSelectBoxOpen(item: FocusableItem): boolean {
    if (item.itemData?.widget !== 'dxSelectBox') return false;
    const $sb = item.$toolbarItem.find('.dx-selectbox').first();
    return !!($sb.length ? getWidgetInstance($sb)?.option('opened') : false);
  }

  // ─── Issue 3: Overflow popup navigation (virtual focus) ───────────────────
  //
  // DevExtreme's overlay captures HTML focus on the dx-overlay-content element
  // whenever anything inside the popup receives .focus(). To work around this,
  // popup navigation is fully virtual: HTML focus stays on the overflow button
  // (inside the toolbar) and dx-state-focused is toggled on list rows as a
  // visual cursor. stopImmediatePropagation at document-capture level is used to
  // prevent the overlay's Tab trap from interfering.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _getDropDownMenuInstance(): any | null {
    const $ddm = this._toolbar.$element().find(`.${DROP_DOWN_MENU_CLASS}`).first();
    return $ddm.length ? getWidgetInstance($ddm) : null;
  }

  private _isOverflowPopupOpen(): boolean {
    return !!this._getDropDownMenuInstance()?.option('opened');
  }

  /**
   * Returns action rows inside the overflow popup, resetting virtual focus
   * index each time the popup is freshly opened.
   */
  private _getPopupRows(): HTMLElement[] {
    const ddm = this._getDropDownMenuInstance();
    const isOpen = !!ddm?.option('opened');
    if (!isOpen) {
      this._wasPopupOpen = false;
      return [];
    }
    if (!this._wasPopupOpen) {
      // Popup just opened — reset virtual cursor and clear any stale class.
      this._popupFocusIdx = -1;
      this._wasPopupOpen = true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const $content = ddm._popup?.$content?.() as dxElementWrapper | undefined;
    const contentEl = $content?.get(0) as HTMLElement | undefined;
    if (!contentEl) return [];
    return Array.from(
      contentEl.querySelectorAll(`.${TOOLBAR_MENU_ACTION_CLASS}`),
    ) as HTMLElement[];
  }

  /** Moves the virtual focus cursor to `idx` and updates dx-state-focused. */
  private _setPopupVirtualFocus(rows: HTMLElement[], idx: number): void {
    rows.forEach((r) => r.classList.remove('dx-state-focused'));
    if (idx >= 0 && rows[idx]) {
      rows[idx].classList.add('dx-state-focused');
    }
    this._popupFocusIdx = idx;
  }

  /** Closes the overflow popup and clears virtual focus state. */
  private _closeOverflowPopup(): void {
    const ddm = this._getDropDownMenuInstance();
    // Clear visual state before closing so rows are clean on next open.
    const rows = this._getPopupRows();
    rows.forEach((r) => r.classList.remove('dx-state-focused'));
    this._popupFocusIdx = -1;
    this._wasPopupOpen = false;
    ddm?.option('opened', false);
  }

  /**
   * Document-level keydown handler (capture phase).
   * When the overflow popup is open this intercepts navigation keys and drives
   * virtual focus — it never calls .focus() on popup items, so the overlay
   * cannot steal HTML focus away from the overflow button.
   */
  private _handleDocKeyDown(e: KeyboardEvent): void {
    if (!this._isOverflowPopupOpen()) return;

    const NAV_KEYS = ['ArrowDown', 'ArrowUp', 'Tab', 'Escape', 'Enter', ' '];
    if (!NAV_KEYS.includes(e.key)) return;

    // Consume the event before any other listener (e.g. the overlay Tab trap).
    e.preventDefault();
    e.stopImmediatePropagation();

    if (e.key === 'Escape') {
      this._closeOverflowPopup();
      // Focus stays on overflow button — no .focus() call needed.
      return;
    }

    const rows = this._getPopupRows();
    if (!rows.length) return;

    if (e.key === 'Enter' || e.key === ' ') {
      // Activate the currently virtually-focused item.
      if (this._popupFocusIdx >= 0 && rows[this._popupFocusIdx]) {
        const clickTarget = rows[this._popupFocusIdx].querySelector<HTMLElement>(
          '[tabindex="0"], button:not([disabled])',
        );
        clickTarget?.click();
      }
      return;
    }

    // ArrowDown / Tab forward → next row; ArrowUp / Shift+Tab → previous row.
    const isDown = e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey);
    const cur = this._popupFocusIdx;
    const next = isDown
      ? (cur === -1 ? 0 : Math.min(cur + 1, rows.length - 1))
      : (cur === -1 ? rows.length - 1 : Math.max(cur - 1, 0));
    this._setPopupVirtualFocus(rows, next);
  }
}
