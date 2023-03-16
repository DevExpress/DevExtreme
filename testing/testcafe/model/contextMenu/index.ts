import { ClientFunction, Selector } from 'testcafe';
import Widget from '../internal/widget';
import Overlay from '../overlay';
import { WidgetName } from '../../helpers/createWidget';

const CLASS = {
  contextMenu: 'dx-context-menu',
  item: 'dx-menu-item',
  overlay: 'dx-overlay',
};

export default class ContextMenu extends Widget {
  items: Selector;

  overlay: Overlay;

  constructor(id: string | Selector) {
    super(id);

    this.items = Selector(`.${CLASS.contextMenu}`).find(`.${CLASS.item}`);
    this.overlay = new Overlay(`.${CLASS.overlay}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxContextMenu'; }

  // eslint-disable-next-line class-methods-use-this
  getElement(id: string | Selector): Selector {
    return Selector(id);
  }

  getItemCount(): Promise<number> {
    return this.items.count;
  }

  show(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).show(); },
      { dependencies: { getInstance } },
    )();
  }
}
