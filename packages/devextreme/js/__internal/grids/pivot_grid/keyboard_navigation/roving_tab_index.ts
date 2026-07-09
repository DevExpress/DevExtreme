import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { setTabIndex } from '@js/ui/shared/accessibility';

const NOT_FOCUSABLE_TAB_INDEX = '-1';

export interface RovingTabIndexComponentOptions {
  tabindex?: number;
  useLegacyKeyboardNavigation?: boolean;
}

export interface RovingTabIndexComponent {
  option: {
    (): RovingTabIndexComponentOptions;
    (optionName: string): unknown;
  };
  element: () => Element | undefined;
}

export interface RovingTabIndexOptions {
  component: RovingTabIndexComponent;
  getItems: () => HTMLElement[];
  scrollToItem?: (item: HTMLElement) => void;
  getItemId?: (item: HTMLElement) => string | undefined;
}

export class RovingTabIndex {
  private focusedItemIndex = 0;

  private focusedItemId: string | undefined;

  constructor(private readonly options: RovingTabIndexOptions) {}

  getItems(): HTMLElement[] {
    return this.options.getItems() ?? [];
  }

  getFocusedItemIndex(): number {
    return this.getActualItemIndex(this.getItems());
  }

  getFocusedItem(): HTMLElement | undefined {
    const items = this.getItems();

    return items[this.getActualItemIndex(items)];
  }

  updateTabIndexes(): void {
    const items = this.getItems();

    if (!items.length) {
      return;
    }

    this.focusedItemIndex = this.getActualItemIndex(items);

    items.forEach((item, index) => {
      if (index === this.focusedItemIndex) {
        setTabIndex(this.options.component, $(item));
      } else {
        item.setAttribute('tabindex', NOT_FOCUSABLE_TAB_INDEX);
      }
    });
  }

  focusItem(itemOrIndex: HTMLElement | number): void {
    const items = this.getItems();
    const index = typeof itemOrIndex === 'number' ? itemOrIndex : items.indexOf(itemOrIndex);

    if (index < 0 || index >= items.length) {
      return;
    }

    this.setFocusedItem(index, items);
    this.updateTabIndexes();

    const item = items[index];

    this.options.scrollToItem?.(item);
    // scrollToItem positions the scrollable itself, so the native auto-scroll
    // on focus must be suppressed to keep dxScrollable in sync.
    item.focus({ preventScroll: true });
  }

  containsActiveElement(): boolean {
    const activeElement = domAdapter.getActiveElement();

    return this.getItems()
      .some((item) => item === activeElement || item.contains(activeElement));
  }

  refocusFocusedItem(): void {
    this.getFocusedItem()?.focus({ preventScroll: true });
  }

  handleFocusIn(item: HTMLElement): void {
    const items = this.getItems();
    const index = items.indexOf(item);

    if (index >= 0 && index !== this.focusedItemIndex) {
      this.setFocusedItem(index, items);
      this.updateTabIndexes();
    }
  }

  reset(): void {
    this.focusedItemIndex = 0;
    this.focusedItemId = undefined;
  }

  private setFocusedItem(index: number, items: HTMLElement[]): void {
    this.focusedItemIndex = index;
    this.focusedItemId = this.options.getItemId?.(items[index]);
  }

  // Items are re-created on each render, and with virtual scrolling the same
  // logical item can reappear at a different position, so the focused item is
  // re-found by its id first and only then by the stored index.
  private getActualItemIndex(items: HTMLElement[]): number {
    const { getItemId } = this.options;

    if (getItemId && this.focusedItemId !== undefined) {
      const index = items.findIndex((item) => getItemId(item) === this.focusedItemId);

      if (index >= 0) {
        return index;
      }
    }

    return this.getNormalizedItemIndex(items);
  }

  private getNormalizedItemIndex(items: HTMLElement[]): number {
    if (!items.length) {
      return -1;
    }

    return Math.min(Math.max(this.focusedItemIndex, 0), items.length - 1);
  }
}
