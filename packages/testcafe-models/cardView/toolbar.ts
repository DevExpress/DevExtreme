import TextBox from "../textBox";

const CLASS = {
    disabledState: 'dx-state-disabled',
    textBox: 'dx-textbox',
};

export default class Toolbar {
    element: Selector;

    constructor(selector: Selector) {
        this.element = selector;
    }

    getSelectAllButton(): Selector {
        return this.element.find('[aria-label=\'Select all\']');
    }

    getClearSelectionButton(): Selector {
        return this.element.find('[aria-label=\'Clear selection\']');
    }

    getSearchTextBox(): TextBox {
        return new TextBox(this.element.find(`.${CLASS.textBox}`));
    }

    isSelectAllButtonDisabled(): Promise<boolean> {
        return this.getSelectAllButton().hasClass(CLASS.disabledState);
    }

    isClearSelectionButtonDisabled(): Promise<boolean> {
        return this.getClearSelectionButton().hasClass(CLASS.disabledState);
    }
}
