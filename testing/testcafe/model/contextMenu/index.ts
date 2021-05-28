import { Selector } from 'testcafe';
import Widget from '../internal/widget';
import Overlay from './overlay';
import OverlayWrapper from './overlay/wrapper';

const CLASS = {
  contextMenu: 'dx-context-menu',
  item: 'dx-menu-item',
};

export default class ContextMenu extends Widget {
  items: Selector;

  overlay: Overlay;

  overlayWrapper: OverlayWrapper;

  name = 'dxContextMenu';

  constructor(id: string | Selector) {
    super(id);

    this.items = Selector(`.${CLASS.contextMenu}`).find(`.${CLASS.item}`);
    this.overlay = new Overlay();
    this.overlayWrapper = new OverlayWrapper();
  }

  async getItemCount(): Promise<number> {
    return this.items.count;
  }
}
