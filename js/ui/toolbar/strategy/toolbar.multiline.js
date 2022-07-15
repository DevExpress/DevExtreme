const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';

export class MultiLineStrategy {
    constructor(toolbar) {
        this._toolbar = toolbar;

        this._toolbar.$element().addClass(TOOLBAR_MULTILINE_CLASS);
    }

    _itemContainer() {
        return this._toolbar._$itemsContainer;
    }

    _renderSections() {}

    _getItems() {
        return this._toolbar.option('items') || [];
    }

    _applyCompactMode() {}
}
