import Widget from './internal/widget';

const CLASS = {
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
    itemElements: Selector;
    name: string = 'dxMultiView';

    constructor(id: string) {
        super(id);

        this.itemElements = this.element.find(`.${CLASS.item}`);
    }

    getItem (index: number = 0): Item {
        return new Item(this.itemElements.nth(index));
    }
}
