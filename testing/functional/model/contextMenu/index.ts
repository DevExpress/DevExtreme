import Widget from '../internal/widget';
import { Selector } from 'testcafe';
import Overlay from './overlay';
import OverlayWrapper from './overlay/wrapper';

const CLASS = {
    contextMenu: 'dx-context-menu',
    item: 'dx-menu-item'
};

export default class ContextMenu extends Widget {
    items: Selector;
    overlay: Overlay;
    overlayWrapper: OverlayWrapper;

    name: string = 'dxContextMenu';

    constructor(id: string|Selector) {
        super(id);

        this.items = Selector(`.${CLASS.contextMenu}`).find(`.${CLASS.item}`);
        this.overlay = new Overlay();
        this.overlayWrapper = new OverlayWrapper();
    }

    getItemCount() {
        return this.items.count;
    }
}
