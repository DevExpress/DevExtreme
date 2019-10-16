import Widget from './internal/widget';

const CLASS = {
    tabs: "dx-tabs",
    item: "dx-tab",
    focused: "dx-state-focused"
};

class Item {
    element: Selector;
    isFocused: Promise<boolean>;

    constructor (element: Selector) {
        this.element = element;
        this.isFocused = element.hasClass(CLASS.focused);
    }
};

export default class Tabs extends Widget {
    itemElements: Selector;
    name: string = 'dxTabs';
    
    constructor(id: string) {
        super(id);

        this.itemElements = this.element.find(`.${CLASS.item}`);
    }

    getItem (index: number = 0): Item {
        return new Item(this.itemElements.nth(index));
    }
}
