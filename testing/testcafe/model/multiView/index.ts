import Widget from '../internal/widget';
import MultiViewItem from './item';

const CLASS = {
    item: 'dx-multiview-item',
};

export default class MultiView extends Widget {
    itemElements: Selector;
    name: string = 'dxMultiView';

    constructor(id: string) {
        super(id);

        this.itemElements = this.element.find(`.${CLASS.item}`);
    }

    getItem(index: number = 0): MultiViewItem {
        return new MultiViewItem(this.itemElements.nth(index));
    }
}
