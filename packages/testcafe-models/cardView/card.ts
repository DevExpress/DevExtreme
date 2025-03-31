export const CLASS = {
    header: 'dx-cardview-card-header',
    content: 'dx-cardview-content',
    field: 'dx-cardview-field',
    fieldName: 'dx-cardview-field-name',
    fieldValue: 'dx-cardview-field-value',
    toolbarItem: 'dx-toolbar-item',
    toolbarItemContent: 'dx-toolbar-item-content',
    selectCheckbox: 'dx-cardview-select-checkbox',
    selectCard: 'dx-cardview-card-selection',
    checkbox: 'dx-checkbox',
}

export default class Card {
    isSelected: Promise<boolean>;

    element: Selector;

    constructor(selector: Selector) {
      this.element = selector;
      this.isSelected = this.element.hasClass(CLASS.selectCard);
    }

    getToolbarItemContent(index: number): Selector {
        return this.element.find(`.${CLASS.toolbarItem}`).nth(index).child(`.${CLASS.toolbarItemContent}`);
    }

    getSelectCheckbox(): Selector {
        return this.element.find(`.${CLASS.selectCheckbox} .${CLASS.checkbox}`);
    }

    getFieldCaptionCell(fieldCaption: String): Selector {
        return this.element.find(`.${CLASS.fieldName}`).withText(fieldCaption + ':');
    }

    getFieldValueCell(fieldCaption: String): Selector {
        return this.getFieldCaptionCell(fieldCaption).nextSibling();
    }
}
