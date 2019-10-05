import Widget from './internal/widget';
import { ClientFunction } from "testcafe";

const CLASS = {
    checkbox: 'dx-checkbox',
    checkboxChecked: 'dx-checkbox-checked',
    disabled: 'dx-state-disabled',
    focused: 'dx-state-focused',
    group: 'dx-list-group',
    groupHeader: 'dx-list-group-header',
    item: 'dx-list-item',
    radioButton: 'dx-radiobutton',
    radioButtonChecked: 'dx-radiobutton-checked',
    reorderHandle: 'dx-list-reorder-handle',
    search: 'dx-list-search',
    selectAllItem: 'dx-list-select-all'
};

class Item {
    element: Selector;
    isDisabled:  Promise<boolean>;
    isFocused: Promise<boolean>;
    isOpened: Promise<boolean>;
    text: Promise<string>;

    constructor (element: Selector) {
        this.element = element;
    }
};

export default class ContextMenu extends Widget {
    items: Selector;
    getContextMenuInstance: ClientFunction<any>;

    name: string = 'dxContextMenu';

    constructor (id: string|Selector) {
        super(id);

        this.items = this.element.find(`.${CLASS.item}`);
        
        const contextMenu =  this.element;

        this.getContextMenuInstance = ClientFunction(
            () => $(contextMenu())['dxContextMenu']('instance'),
            { dependencies: { contextMenu }}
        );
    }

    getItem (index: number = 0): Item {
        return new Item(this.items.nth(index));
    }
}
