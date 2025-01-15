export const CLASS = {
    header: 'dx-cardview-card-header',
    content: 'dx-cardview-content',
    field: 'dx-cardview-field',
    fieldName: 'dx-cardview-field-name',
    fieldValue: 'dx-cardview-field-value',
}

export default class Card {
    element: Selector;

    constructor(selector: Selector) {
      this.element = selector;
    }

    getFieldCaptionCell(fieldCaption: String): Selector {
        return this.element.find(`.${CLASS.fieldName}`).withText(fieldCaption + ':');
    }

    getFieldValueCell(fieldCaption: String): Selector {
        return this.getFieldCaptionCell(fieldCaption).nextSibling();
    }
}
