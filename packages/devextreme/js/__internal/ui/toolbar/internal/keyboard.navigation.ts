import type { Orientation } from '@js/common';
import { keyboard } from '@js/common/core/events/short';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import { getPublicElement } from '@ts/core/m_element';
import eventsEngine from '@ts/events/core/m_events_engine';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import {
  DROP_DOWN_MENU_BUTTON_CLASS,
  MENU_ITEM_EXPANDED_CLASS,
  TEXTEDITOR_INPUT_CLASS,
} from '@ts/ui/toolbar/constants';
import {
  applyItemTabIndex,
  closeItemComponent,
  getPlainItemFocusTargets,
  isElementInOverlayContent,
  isFocusOnItemAnchor,
  isItemComponentOpened,
} from '@ts/ui/toolbar/internal/roving.utils';
import type ToolbarMenuList from '@ts/ui/toolbar/internal/toolbar.menu.list';
import type ToolbarBase from '@ts/ui/toolbar/toolbar.base';
import {
  getItemFocusTarget as defaultGetItemFocusTarget,
} from '@ts/ui/toolbar/toolbar.utils';

const HORIZONTAL_KEY_LOCATION: Record<string, string> = {
  ArrowRight: 'right',
  ArrowLeft: 'left',
  Home: 'first',
  End: 'last',
};

const VERTICAL_KEY_LOCATION: Record<string, string> = {
  ArrowDown: 'down',
  ArrowUp: 'up',
  Home: 'first',
  End: 'last',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RovingTabIndexHost = ToolbarBase<any> | ToolbarMenuList;

export interface RovingTabIndexOptions {
  itemsSelector: string;
  direction: Orientation;
  onEscape?: () => void;
  onTab?: () => void;
}

export type FocusRestoreTarget = number | 'overflow';

export class RovingTabIndexController {
  private captureHandler?: (e: KeyboardEvent) => void;

  private $prevActiveItem?: dxElementWrapper;

  constructor(
    private readonly host: RovingTabIndexHost,
    private readonly options: RovingTabIndexOptions,
  ) {}

  private get root(): HTMLElement {
    return this.host.$element().get(0) as HTMLElement;
  }

  private getItemTabIndex($item: dxElementWrapper): number {
    const data = this.host._getItemData($item);
    const tabIndex: number | undefined = data?.options?.tabIndex;

    return tabIndex ?? 0;
  }

  private getItemIndex($item: dxElementWrapper): number {
    const index = $item.data(this.host._itemIndexKey());
    // @ts-expect-error ts-error
    return index;
  }

  attach(): void {
    this.detach();
    this.attachCaptureHandler();
  }

  detach(): void {
    this.detachCaptureHandler();
    this.$prevActiveItem = undefined;
  }

  private getKeyToLocation(): Record<string, string> {
    return this.options.direction === 'horizontal'
      ? HORIZONTAL_KEY_LOCATION
      : VERTICAL_KEY_LOCATION;
  }

  private attachCaptureHandler(): void {
    this.captureHandler = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement;

      if (e.key === 'Tab') {
        this.options.onTab?.();
        return;
      }

      const $item = $(target).closest(this.options.itemsSelector);
      const componentOwnsKey = $item.length > 0 && !isFocusOnItemAnchor($item, target);

      if (e.key === 'Escape') {
        this.handleEscape($item, componentOwnsKey, e);
        return;
      }

      if (componentOwnsKey) {
        return;
      }

      this.handleDirectional(target, e);
    };

    this.root.addEventListener('keydown', this.captureHandler, true);
  }

  private handleEscape(
    $item: dxElementWrapper,
    componentOwnsKey: boolean,
    e: KeyboardEvent,
  ): void {
    if (componentOwnsKey) {
      this.handleEscapeInsideComponent($item, e);
      return;
    }

    if (this.options.onEscape) {
      e.preventDefault();
      e.stopPropagation();
      this.options.onEscape();
    }
  }

  private handleDirectional(target: HTMLElement, e: KeyboardEvent): void {
    const location = this.getKeyToLocation()[e.key];

    if (!location) {
      return;
    }

    this.syncFocusedItem(target);

    const $focused = $(this.host.option().focusedElement);
    if ($focused.length && isItemComponentOpened($focused)) {
      return;
    }

    if (this.moveInsidePlainItem(target, location, e)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.host._moveFocus(location);
    this.focusPlainItemEdge(location);
  }

  private detachCaptureHandler(): void {
    if (this.captureHandler) {
      this.root.removeEventListener('keydown', this.captureHandler, true);
      this.captureHandler = undefined;
    }
  }

  private moveInsidePlainItem(
    target: HTMLElement,
    location: string,
    e: KeyboardEvent,
  ): boolean {
    if (!this.isHorizontalArrow(location)) {
      return false;
    }

    const $focused = $(this.host.option().focusedElement);
    const $item = $(target).closest(this.options.itemsSelector);

    if (!$focused.length || $focused.get(0) !== $item.get(0)) {
      return false;
    }

    const $targets = getPlainItemFocusTargets($focused);
    if ($targets.length <= 1) {
      return false;
    }

    const targets = $targets.toArray();
    const currentIndex = targets.findIndex((
      element,
    ) => element === target || element.contains(target));
    if (currentIndex < 0) {
      return false;
    }

    const nextIndex = currentIndex + (location === 'right' ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= targets.length) {
      return false;
    }

    e.preventDefault();
    e.stopPropagation();

    this.focusPlainItemTarget($targets, $(targets[nextIndex]), $focused);

    return true;
  }

  private focusPlainItemEdge(location: string): void {
    if (!this.isHorizontalArrow(location)) {
      return;
    }

    const $focused = $(this.host.option().focusedElement);
    const $targets = getPlainItemFocusTargets($focused);

    if ($targets.length <= 1) {
      return;
    }

    const targets = $targets.toArray();
    const edgeTarget = location === 'left' ? targets[targets.length - 1] : targets[0];

    this.focusPlainItemTarget($targets, $(edgeTarget), $focused);
  }

  private isHorizontalArrow(location: string): boolean {
    return this.options.direction === 'horizontal'
      && (location === 'left' || location === 'right');
  }

  private focusPlainItemTarget(
    $allTargets: dxElementWrapper,
    $next: dxElementWrapper,
    $focused: dxElementWrapper,
  ): void {
    $allTargets.attr('tabIndex', -1);
    $next.attr('tabIndex', this.getItemTabIndex($focused));
    eventsEngine.trigger($next, 'focus');
  }

  private handleEscapeInsideComponent($item: dxElementWrapper, e: KeyboardEvent): void {
    if ($item.find(`.${MENU_ITEM_EXPANDED_CLASS}`).length) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if ($item.length && closeItemComponent($item)) {
      return;
    }

    if ($item.length) {
      this.focusItem($item);
    }
  }

  public handleEnterKey(
    e: DxEvent<KeyboardEvent>,
    ctx: {
      focusedElement: Element | null | undefined;
      activateAtNavLevel: ($focused: dxElementWrapper, e: DxEvent<KeyboardEvent>) => void;
    },
  ): void {
    const target = e.target as HTMLElement;
    const $item = $(ctx.focusedElement);

    if ($item.length && !isFocusOnItemAnchor($item, target)) {
      return;
    }

    ctx.activateAtNavLevel($item, e);
    if (e.defaultPrevented) {
      return;
    }

    if ($item.length) {
      const $textEditor = $item.find(`.${TEXTEDITOR_INPUT_CLASS}`).first();
      if ($textEditor.length) {
        e.preventDefault();
        eventsEngine.trigger($textEditor, 'focus');
      }
    }
  }

  private syncFocusedItem(target: HTMLElement): void {
    let $item = $(target).closest(this.options.itemsSelector);

    if (!$item.length) {
      $item = $(target)
        .find('[tabindex="0"]')
        .closest(this.options.itemsSelector)
        .first();
    }

    if ($item.length && defaultGetItemFocusTarget($item)?.length) {
      this.host.option('focusedElement', getPublicElement($item));
    }
  }

  focusInHandler(e: DxEvent): void {
    const $target = $(e.target as Element);
    const $item = $target.closest(this.options.itemsSelector);

    if ($item.length && defaultGetItemFocusTarget($item)?.length) {
      this.host.option('focusedElement', getPublicElement($item));
    }
  }

  shouldDelegateFocusOut(e: DxEvent<FocusEvent>): boolean {
    const relatedTarget = e.relatedTarget as Element | null;

    if (relatedTarget && this.root.contains(relatedTarget)) {
      return false;
    }

    if (isElementInOverlayContent(relatedTarget)) {
      return false;
    }

    return true;
  }

  focusItem($item: dxElementWrapper): void {
    const $focusTarget = this.host._getItemFocusTarget($item);
    if (!$focusTarget?.length) {
      return;
    }
    eventsEngine.trigger($focusTarget, 'focus');
  }

  updateRovingTabIndex($activeItem?: dxElementWrapper): void {
    const $prev = this.$prevActiveItem;
    const prev = $prev?.get(0);
    const next = $activeItem?.get(0);

    if ($prev && prev && prev !== next && prev.isConnected) {
      applyItemTabIndex($prev, -1);
    }

    if ($activeItem?.length) {
      applyItemTabIndex($activeItem, this.getItemTabIndex($activeItem));
      this.$prevActiveItem = $activeItem;
      return;
    }

    const $first = this.host._getAvailableItems().first();
    if ($first.length) {
      applyItemTabIndex($first, this.getItemTabIndex($first));
      this.$prevActiveItem = $first;
    } else {
      this.$prevActiveItem = undefined;
    }
  }

  resetRovingTabIndex(itemsContainer: dxElementWrapper): void {
    const $allItems = itemsContainer.find(this.options.itemsSelector);
    $allItems.each((_index: number, item: Element): boolean => {
      applyItemTabIndex($(item), -1);
      return true;
    });

    this.$prevActiveItem = undefined;

    const $focused = $(this.host.option().focusedElement);
    const $available = this.host._getAvailableItems();
    const focusedEl = $focused.get(0);
    const isFocusedAvailable = !!focusedEl && $available.toArray().includes(focusedEl);
    const $newActive = isFocusedAvailable ? $focused : $available.first();

    if ($newActive.length) {
      applyItemTabIndex($newActive, this.getItemTabIndex($newActive));
      this.$prevActiveItem = $newActive;
    }
  }

  captureFocusedItem(): FocusRestoreTarget | null | undefined {
    const { root } = this;
    const active = domAdapter.getActiveElement(root);
    const insideToolbar = !!active && active !== root && root.contains(active);

    if (!insideToolbar) {
      const body = domAdapter.getBody();
      return active && active !== body ? null : undefined;
    }

    const $item = $(active).closest(this.options.itemsSelector);
    if (!$item.length) {
      return null;
    }

    const index = this.getItemIndex($item);
    return index ?? 'overflow';
  }

  captureItemIfFocused($item: dxElementWrapper): FocusRestoreTarget | undefined {
    if (!$item?.length) {
      return undefined;
    }

    const active = domAdapter.getActiveElement(this.root);
    if (!active || !$item.get(0)?.contains(active)) {
      return undefined;
    }

    return this.captureFocusedItem() ?? undefined;
  }

  restoreFocus(target: FocusRestoreTarget): void {
    const $available = this.host._getAvailableItems();
    if (!$available.length) {
      return;
    }

    const $target = this.resolveRestoreTarget($available, target);
    if (!$target?.length) {
      return;
    }

    this.updateRovingTabIndex($target);
    this.focusItem($target);
  }

  private resolveRestoreTarget(
    $available: dxElementWrapper,
    target: FocusRestoreTarget,
  ): dxElementWrapper | undefined {
    return target === 'overflow'
      ? this.resolveOverflowTarget($available)
      : this.resolveIndexTarget($available, target);
  }

  private resolveOverflowTarget($available: dxElementWrapper): dxElementWrapper {
    const $overflow = $available.filter(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
    return $overflow.length ? $overflow.first() : $available.first();
  }

  private resolveIndexTarget(
    $available: dxElementWrapper,
    index: number,
  ): dxElementWrapper | undefined {
    const available = $available.toArray();
    const getIndex = (el: Element): number | undefined => this.getItemIndex($(el));

    const exact = available.find((el) => getIndex(el) === index);
    if (exact) {
      return $(exact);
    }

    const sorted = available
      .map((el) => ({ el, elIndex: getIndex(el) }))
      .filter((entry): entry is { el: Element; elIndex: number } => entry.elIndex !== undefined)
      .sort((a, b) => a.elIndex - b.elIndex);

    if (sorted.length) {
      const nearest = sorted.find((entry) => entry.elIndex >= index) ?? sorted[sorted.length - 1];
      return $(nearest.el);
    }

    return $(available[available.length - 1]);
  }
}

export function setupRovingKeyboard(
  host: RovingTabIndexHost,
  options: RovingTabIndexOptions,
): { listenerId: string; navigator: RovingTabIndexController } {
  const listenerId: string = keyboard.on(
    host._keyboardEventBindingTarget(),
    null,
    (opts: KeyboardKeyDownEvent) => host._keyboardHandler(opts),
  );

  const navigator = new RovingTabIndexController(host, options);
  navigator.attach();

  return { listenerId, navigator };
}
