import { Selector } from 'testcafe';
import Widget from './internal/widget';

const CLASS = {
    item: 'dx-filterbuilder-item-field',
    popupContent: 'dx-popup-content',
    treeView: 'dx-treeview'
};

class Field {
    element: Selector;
    text: Promise<string>;

    constructor (element: Selector) {
        this.element = element;
        this.text = element.textContent;
    }
};

export default class FilterBuilder extends Widget {
    name: string = 'dxFilterBuilder';

    getField(index: number = 0): Field {
        const fields = this.element.find(`.${CLASS.item}`);
        return new Field(fields.nth(index));
    }

    getPopupTreeView(): Selector {
        return Selector(`.${CLASS.popupContent} .${CLASS.treeView}`)
    }
}
