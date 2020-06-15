import Widget from '../internal/widget';
import TabItem from './item';

const CLASS = {
    item: 'dx-tab'
};
export default class Tabs extends Widget {
    itemElements: Selector;
    name: string = 'dxTabs';

    constructor(id: string) {
        super(id);

        this.itemElements = this.element.find(`.${CLASS.item}`);
    }

    getItem(index: number = 0): TabItem {
        return new TabItem(this.itemElements.nth(index));
    }
}
