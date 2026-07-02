import eventsEngine from '@js/common/core/events/core/events_engine';
import $ from '@js/core/renderer';
import { restoreFocus, saveFocusedElementInfo, setTabIndex } from '@js/ui/shared/accessibility';

const NOT_FOCUSABLE_TAB_INDEX = '-1';

export interface RovingTabIndexComponent {
  option: (optionName?: string) => unknown;
  element: () => Element | undefined;
}

export interface RovingTabIndexOptions {
  component: RovingTabIndexComponent;
  getItems: () => HTMLElement[];
  scrollToItem?: (item: HTMLElement) => void;
}

export class RovingTabIndex {
  private focusedItemIndex = 0;

  constructor(private readonly options: RovingTabIndexOptions) {}

  getItems(): HTMLElement[] {
    return this.options.getItems() ?? [];
  }

  getFocusedItemIndex(): number {
    return this.getNormalizedItemIndex(this.getItems());
  }

  getFocusedItem(): HTMLElement | undefined {
    const items = this.getItems();

    return items[this.getNormalizedItemIndex(items)];
  }

  updateTabIndexes(): void {
    const items = this.getItems();

    if (!items.length) {
      return;
    }

    this.focusedItemIndex = this.getNormalizedItemIndex(items);

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

    this.focusedItemIndex = index;
    this.updateTabIndexes();

    const item = items[index];

    this.options.scrollToItem?.(item);
    // @ts-expect-error ts-error
    eventsEngine.trigger($(item), 'focus');
  }

  handleFocusIn(item: HTMLElement): void {
    const index = this.getItems().indexOf(item);

    if (index >= 0 && index !== this.focusedItemIndex) {
      this.focusedItemIndex = index;
      this.updateTabIndexes();
    }
  }

  saveFocus(): void {
    const item = this.getFocusedItem();

    if (item) {
      saveFocusedElementInfo(item, this.options.component);
    }
  }

  restoreFocus(): void {
    restoreFocus(this.options.component);
  }

  reset(): void {
    this.focusedItemIndex = 0;
  }

  private getNormalizedItemIndex(items: HTMLElement[]): number {
    if (!items.length) {
      return -1;
    }

    return Math.min(Math.max(this.focusedItemIndex, 0), items.length - 1);
  }
}
