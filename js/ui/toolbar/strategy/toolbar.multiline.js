export class MultiLineStrategy {
    constructor(toolbar) {
        this._toolbar = toolbar;
    }

    _initMarkup() {}

    _updateMenuVisibility() {
    }

    _renderMenuItems() {
    }

    _dimensionChanged() {
    }

    _itemOptionChanged() {

    }

    _optionChanged(name, value) {

    }

    _getMenuItems() {}

    _getToolbarItems() {
        return this._toolbar.option('items') ?? [];
    }

    _getItemsWidth() {
        // TODO
        return this._toolbar._getSummaryItemsWidth([this._toolbar._$beforeSection, this._toolbar._$centerSection, this._toolbar._$afterSection]);
    }

    _renderItem(item, itemElement) {
    }

    _arrangeItems() {}

    _hideOverflowItems() {

    }
}
