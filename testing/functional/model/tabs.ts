import Widget from './internal/widget';
import { Selector, ClientFunction } from 'testcafe';

const CLASS = {
    tabs: "dx-tabs",
    item: "dx-tab",
    focused: "dx-state-focused"
};

class Item {
    element: Selector;
    isFocused: Promise<boolean>;
    text: Promise<string>;

    constructor (element: Selector) {
        this.element = element;
        this.isFocused = element.hasClass(CLASS.focused);
    }
};

export default class Tabs extends Widget {
    element: Selector;
    items: Selector;
    isFocused: Promise<boolean>;

    name: string = 'dxTabs';

    constructor (id: string|Selector) {
        super(id);

        this.element = Selector(`.${CLASS.tabs}`);
        this.isFocused = this.element.hasClass(CLASS.focused);
        this.items = this.element.find(`.${CLASS.item}`);
    }

    getItem (index: number = 0): Item {
        return new Item(this.items.nth(index));
    }
}