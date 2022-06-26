import { ClientFunction, Selector } from 'testcafe';
import Widget from '../internal/widget';
import Overlay from './overlay';
import OverlayWrapper from './overlay/wrapper';
import { getComponentInstance } from '../../helpers/multi-platform-test';

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

  apiShow(): Promise<void> {
    const getInstance = this.getInstance() as any;

    return ClientFunction(
      () => { getInstance().show(); },
      { dependencies: { getInstance } },
    )();
  }

  getInstance(): () => Promise<unknown> {
    return getComponentInstance(this.platform, this.element, this.name);
  }
}
