import { ClientFunction, Selector } from 'testcafe';
import Widget from '../internal/widget';
import Overlay from '../overlay';
import type { WidgetName } from '../types';

const CLASS = {
  contextMenu: 'dx-context-menu',
  item: 'dx-menu-item',
  itemList: 'dx-menu-items-container',
  overlay: 'dx-overlay',
  itemText: 'dx-menu-item-text',
};

export default class ContextMenu extends Widget {
  items: Selector;

  overlay: Overlay;

  isOpened: Promise<boolean>;

  contextMenu: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.items = Selector(`.${CLASS.contextMenu}`).find(`.${CLASS.item}`);
    this.contextMenu = Selector(`.${CLASS.contextMenu}`);
    this.overlay = new Overlay(`.${CLASS.overlay}`);
    this.isOpened = this.overlay.isVisible();
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxContextMenu'; }

  // eslint-disable-next-line class-methods-use-this
  getElement(id: string | Selector): Selector {
    return Selector(id);
  }

  getItemByText(text: string): Selector {
    return this.findItemByText(text);
  }

  getItemByIndex(index: number): Selector {
    return this.items.nth(index);
  }

  getItemCount(): Promise<number> {
    return this.items.count;
  }

  getItemByOrder(order: number): Selector {
    return this.contextMenu.find(`.${CLASS.itemList}`).child(order);
  }

  show(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).show(); },
      { dependencies: { getInstance } },
    )();
  }

  private findItemByText(text: string): Selector {
    const span = this.element.find(`.${CLASS.itemText}`);
    return span.withExactText(text).parent();
  }
}
