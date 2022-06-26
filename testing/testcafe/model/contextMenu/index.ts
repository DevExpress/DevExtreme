import { ClientFunction, Selector } from 'testcafe';
import Widget from '../internal/widget';
import Overlay from './overlay';
import OverlayWrapper from './overlay/wrapper';

const CLASS = {
  contextMenu: 'dx-context-menu',
  item: 'dx-menu-item',
};

export default class ContextMenu extends Widget {
  name = 'dxContextMenu';

  items: Selector;

  overlay: Overlay;

  overlayWrapper: OverlayWrapper;

  constructor(id: string | Selector) {
    super(id);

    this.items = Selector(`.${CLASS.contextMenu}`).find(`.${CLASS.item}`);
    this.overlay = new Overlay();
    this.overlayWrapper = new OverlayWrapper();
  }

  // eslint-disable-next-line class-methods-use-this
  getElement(id: string | Selector): Selector {
    return Selector(id);
  }

  getItemCount(): Promise<number> {
    return this.items.count;
  }

  apiShow(value: number): Promise<void> {
    const getInstance = this.getInstance() as any;

    return ClientFunction(
      () => { getInstance().show(value); },
      { dependencies: { getInstance, value } },
    )();
  }
}
