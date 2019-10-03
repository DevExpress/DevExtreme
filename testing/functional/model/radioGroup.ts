import Widget from './internal/widget';

const CLASS = {
    collection: 'dx-collection',
    disabled: 'dx-state-disabled',
    focused: 'dx-state-focused',
    icon: 'dx-radiobutton-icon',
    item: 'dx-item',
    itemContent: 'dx-item-content',
    radioButton: 'dx-radiobutton',
    radioButtonChecked: 'dx-radiobutton-checked'
};

class RadioButton {
    element: Selector;
    isChecked: Promise<boolean>;
    isFocused: Promise<boolean>;

    constructor (item: Selector) {
        this.element = item.find(`.${CLASS.icon}`);
        this.isChecked = item.hasClass(CLASS.radioButtonChecked);
        this.isFocused = item.hasClass(CLASS.focused);
    }
}

class Item {
    content: Selector;
    element: Selector;
    radioButton: RadioButton;
    text: Promise<string>;

    constructor (element: Selector) {
        this.content = element.find(`.${CLASS.itemContent}`);
        this.element = element;
        this.radioButton = new RadioButton(element);
        this.text = element.textContent;
    }
};

export default class RadioGroup extends Widget {
    items: Selector;

    name: string = 'dxRadioGroup';

    constructor (id: string|Selector) {
        super(id);

        this.items = this.element.child(`.${CLASS.collection}`).child(`.${CLASS.item}`);
    }

    getItem (index: number = 0): Item {
        return new Item(this.items.nth(index));
    }
}
