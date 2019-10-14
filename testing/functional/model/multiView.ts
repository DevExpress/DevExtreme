import Widget from './internal/widget';
import { Selector, ClientFunction } from 'testcafe';

const CLASS = {
    multiview: "dx-multiview",
    item: "dx-multiview-item",
    focused: "dx-state-focused"
};

class Item {
    element: Selector;
    isFocused: Promise<boolean>;
    text: Promise<string>;

    constructor (element: Selector) {
        this.element = element;
        debugger
        this.isFocused = element.hasClass(CLASS.focused);
    }
};

export default class MultiView extends Widget {
    element: Selector;
    items: Selector;

    name: string = 'dxMultiView';

    constructor (id: string|Selector) {
        super(id);

        this.element = Selector(`.${CLASS.multiview}`);
        this.items = this.element.find(`.${CLASS.item}`);
    }

    getItem (index: number = 0): Item {
        debugger
        return new Item(this.items.nth(index));
    }
}