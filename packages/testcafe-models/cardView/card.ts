export const CLASS = {
    header: 'dx-cardview-card-header',
    content: 'dx-cardview-content',
    field: 'dx-cardview-field',
    fieldCaption: 'dx-cardview-field-caption',
    fieldValue: 'dx-cardview-field-value',
    toolbarItem: 'dx-toolbar-item',
    toolbarItemContent: 'dx-toolbar-item-content',
    selectCheckbox: 'dx-cardview-select-checkbox',
    selectCard: 'dx-cardview-card-selection',
    checkbox: 'dx-checkbox',
    highlightedState: 'text-part--highlighted',
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
        return this.element.find(`.${CLASS.fieldCaption}`).withText(fieldCaption + ':');
    }

    getFieldValueCell(fieldCaption: String): Selector {
        return this.getFieldCaptionCell(fieldCaption).nextSibling();
    }

    getHeader(): Selector {
        return this.element.find(`.${CLASS.header}`);
    }

    getToolbarItem(index: number): Selector {
        return this.getHeader().find('.dx-toolbar-item').nth(index);
    }

    getHighlightedTexts(): Selector {
        return this.element.find(`.${CLASS.fieldValue}__${CLASS.highlightedState}`);
    }

    async getCaptions(): Promise<string[]> {
        const captionElements = this.element.find(`.${CLASS.fieldCaption}`);
        const count = await captionElements.count;
        const captions: string[] = [];

        for (let i = 0; i < count; i += 1) {
            const caption = await captionElements.nth(i).innerText;
            captions.push(caption.replace(/:$/, ''));
        }

        return captions;
    }
}
