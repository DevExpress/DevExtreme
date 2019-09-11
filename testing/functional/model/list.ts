import { Selector } from 'testcafe';

const CLASS = {
    checkbox: 'dx-checkbox',
    checkboxChecked: 'dx-checkbox-checked',
    focused: 'dx-state-focused',
    group: 'dx-list-group',
    groupHeader: 'dx-list-group-header',
    item: 'dx-list-item',
    radioButton: 'dx-radiobutton',
    radioButtonChecked: 'dx-radiobutton-checked',
    reorderHandle: 'dx-list-reorder-handle',
    selectAllItem: 'dx-list-select-all'
};

class CheckBox {
    element: Selector;
    isChecked: Promise<boolean>;
    isFocused: Promise<boolean>;

    constructor (item: Selector) {
        this.element = item.find(`.${CLASS.checkbox}`);
        this.isChecked = this.element.hasClass(CLASS.checkboxChecked);
        this.isFocused = item.hasClass(CLASS.focused);
    }
};

class RadioButton {
    element: Selector;
    isChecked: Promise<boolean>;
    isFocused: Promise<boolean>;

    constructor (item: Selector) {
        this.element = item.find(`.${CLASS.radioButton}`);
        this.isChecked = this.element.hasClass(CLASS.radioButtonChecked);
        this.isFocused = item.hasClass(CLASS.focused);
    }
}

class Item {
    element: Selector;
    checkBox: CheckBox;
    isFocused: Promise<boolean>;
    radioButton: RadioButton;
    reorderHandle: Selector;
    text: Promise<string>;

    constructor (element: Selector) {
        this.element = element;
        this.checkBox = new CheckBox(element);
        this.isFocused = element.hasClass(CLASS.focused);
        this.radioButton = new RadioButton(element);
        this.reorderHandle = element.find(`.${CLASS.reorderHandle}`);
        this.text = element.textContent;
    }
};

class Group {
    element: Selector;
    header: Selector;
    items: Selector;

    constructor (element: Selector) {
        this.element = element;
        this.header =  element.find(`.${CLASS.groupHeader}`);
        this.items = element.find(`.${CLASS.item}`);
    }

    getItem (index: number = 0): Item {
        return new Item(this.items.nth(index));
    }
}

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

    getGroup(index: number = 0): Group {
        return new Group(this.element.find(`.${CLASS.group}`).nth(index));
    }
}
