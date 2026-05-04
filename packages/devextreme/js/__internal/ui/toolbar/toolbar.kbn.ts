 import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item } from '@js/ui/toolbar';

import type Toolbar from './toolbar';

const EVENT_NAMESPACE = 'dxToolbarKBN';

const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const TOOLBAR_ITEM_INVISIBLE_CLASS = 'dx-toolbar-item-invisible';
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';

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

  private _isAttached = false;

  // Native capture-phase handler + element reference, kept for removeEventListener.
  private _captureKeydownHandler: ((e: KeyboardEvent) => void) | null = null;

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

      result.push({ $toolbarItem: $item, $focusTarget });
    });

    // Include the overflow ("More") button if it exists and is visible.
    const $overflowContainer = toolbar.$element()
      .find('.dx-toolbar-menu-container')
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
   * For complex items (SelectBox, TextBox) the Arrow keys are intentionally consumed here
   * so that toolbar navigation takes precedence over widget-internal navigation.
   *
   * NOTE (PROBLEM-1): This means ButtonGroup internal arrow navigation is suppressed
   * while it acts as a toolbar item. Revisit when template-mode (Enter/Esc) is implemented.
   */
  private _handleKeyDown(e: KeyboardEvent): void {
    const items = this._getFocusableItems();
    if (!items.length) return;

    const rovingItem = items[this._rovingIndex];
    if (!rovingItem) return;

    // Only act when focus is anywhere inside the current roving toolbar item.
    const activeEl = document.activeElement;
    if (!rovingItem.$toolbarItem.get(0).contains(activeEl)) return;

    const isVertical = ((this._toolbar.option as unknown as (key: string) => unknown)('orientation')) === 'vertical';

    const isRTL = !!(this._toolbar.option as unknown as (key: string) => unknown)('rtlEnabled');

    const nextKey = isVertical ? 'ArrowDown' : (isRTL ? 'ArrowLeft' : 'ArrowRight');
    const prevKey = isVertical ? 'ArrowUp' : (isRTL ? 'ArrowRight' : 'ArrowLeft');

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        e.stopPropagation();
        this._moveByOffset(1, items);
        break;

      case prevKey:
        e.preventDefault();
        e.stopPropagation();
        this._moveByOffset(-1, items);
        break;

      case 'Home':
        e.preventDefault();
        e.stopPropagation();
        this._moveTo(0, items);
        break;

      case 'End':
        e.preventDefault();
        e.stopPropagation();
        this._moveTo(items.length - 1, items);
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
  private _moveByOffset(offset: number, items: FocusableItem[]): void {
    const newIndex = this._rovingIndex + offset;
    // KBN-8: non-wrapping — silently ignore out-of-range moves.
    if (newIndex >= 0 && newIndex < items.length) {
      this._moveTo(newIndex, items);
    }
  }

  private _moveTo(index: number, items: FocusableItem[]): void {
    if (index < 0 || index >= items.length) return;
    this._rovingIndex = index;
    this._applyRovingTabindex(items);
    const el = items[index].$focusTarget.get(0) as HTMLElement | undefined;
    el?.focus();
  }
}
