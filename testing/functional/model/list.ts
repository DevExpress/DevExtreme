import { Selector } from 'testcafe';

const CLASS = {
    checkbox: 'dx-checkbox',
    checked: 'dx-checkbox-checked',
    focused: 'dx-state-focused',
    item: 'dx-list-item',
    selectAllItem: 'dx-list-select-all'
};

class CheckBox {
    element: Selector;
    isChecked: Promise<boolean>;
    isFocused: Promise<boolean>;

    constructor (item: Selector) {
        this.element = item.find(`.${CLASS.checkbox}`);
        this.isChecked = this.element.hasClass(CLASS.checked);
        this.isFocused = item.hasClass(CLASS.focused);
    }
};

class Item {
    element: Selector;
    checkBox: CheckBox;
    isFocused: Promise<boolean>;

    constructor (element: Selector) {
        this.element = element;
        this.checkBox = new CheckBox(element);
        this.isFocused = element.hasClass(CLASS.focused);
    }
};

export default class List {
    element: Selector;
    items: Selector;
    selectAll: Item;

    constructor (id: string|Selector) {
        this.element = typeof id === 'string' ? Selector(id) : id;
        this.selectAll = new Item(this.element.find(`.${CLASS.selectAllItem}`));
        this.items = this.element.find(`.${CLASS.item}`);
    }

    getItem (index: number = 0): Item {
        return new Item(this.items.nth(index));
    }
}
