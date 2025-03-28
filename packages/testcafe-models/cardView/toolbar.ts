const CLASS = {
    disabledState: 'dx-state-disabled',
};

export default class Toolbar {
    element: Selector;

    constructor(selector: Selector) {
        this.element = selector;
    }

    getSelectAllButton(): Selector {
        return this.element.find('[aria-label=\'Select All\']');
    }

    getClearSelectionButton(): Selector {
        return this.element.find('[aria-label=\'Clear selection\']');
    }

    isSelectAllButtonDisabled(): Promise<boolean> {
        return this.getSelectAllButton().hasClass(CLASS.disabledState);
    }

    isClearSelectionButtonDisabled(): Promise<boolean> {
        return this.getClearSelectionButton().hasClass(CLASS.disabledState);
    }
}
