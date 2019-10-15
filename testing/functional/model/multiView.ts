import Widget from './internal/widget';

const CLASS = {
    multiview: "dx-multiview",
    item: "dx-multiview-item",
    focused: "dx-state-focused"
};

class Item {
    element: Selector;
    isFocused: Promise<boolean>;

    constructor (element: Selector) {
        this.element = element;
        this.isFocused = this.element.hasClass(CLASS.focused);
    }
};

export default class MultiView extends Widget {
    name: string = 'dxMultiView';

    getItem (index: number = 0): Item {
        return new Item(this.element.find(`.${CLASS.item}`).nth(index));
    }
}
