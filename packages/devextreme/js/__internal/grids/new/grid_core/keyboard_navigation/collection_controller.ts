import domAdapter from '@js/core/dom_adapter';
import type { InfernoKeyboardEvent } from 'inferno';

type IsHandled = 'handled' | 'not_handled';
type KBNEvent = InfernoKeyboardEvent<HTMLElement>;

export class CollectionController {
  public items: HTMLElement[] = [];

  public container?: HTMLElement;

  private focusedElement(): HTMLElement {
    return domAdapter.getActiveElement();
  }

  private isContainerFocused(): boolean {
    return this.focusedElement() === this.container;
  }

  private isItemFocused(): boolean {
    return this.items.includes(this.focusedElement());
  }

  private focusNextItem(direction: 'previous' | 'next'): IsHandled {
    const currentFocusedItemIndex = this.items.indexOf(this.focusedElement());
    const nextIndex = currentFocusedItemIndex + (direction === 'previous' ? -1 : 1);

    if (nextIndex < 0 || nextIndex >= this.items.length) {
      return 'not_handled';
    }

    this.items[nextIndex].focus();
    return 'handled';
  }

  private focusFirstItem(): IsHandled {
    const firstItem = this.items[0];

    if (firstItem) {
      firstItem.focus();
      return 'handled';
    }

    return 'not_handled';
  }

  private handleContainerKey(e: KBNEvent): IsHandled {
    if (e.key === 'Tab') {
      // TODO
    }

    if (e.key === 'Enter') {
      return this.focusFirstItem();
    }

    return 'not_handled';
  }

  private handleItemKey(e: KBNEvent): IsHandled {
    if (e.key === 'Escape') {
      this.container?.focus();
      return 'handled';
    }

    if (e.key === 'Tab') {
      return this.focusNextItem(e.shiftKey ? 'previous' : 'next');
    }

    return 'not_handled';
  }

  private handleKey(e: KBNEvent): IsHandled {
    if (this.isContainerFocused()) {
      return this.handleContainerKey(e);
    }

    if (this.isItemFocused()) {
      return this.handleItemKey(e);
    }

    return 'not_handled';
  }

  public onKeyDown(e: InfernoKeyboardEvent<HTMLElement>): void {
    if (this.handleKey(e) === 'handled') {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
