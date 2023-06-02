import { getWidth, getOuterWidth } from '../../../core/utils/size';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';

export class MultiLineStrategy {
    constructor(toolbar) {
        this._toolbar = toolbar;
    }

    _initMarkup() {}

    _updateMenuVisibility() {}

    _renderMenuItems() {}

    _renderItem() {}

    _getMenuItems() {}

    _getToolbarItems() {
        return this._toolbar.option('items') ?? [];
    }

    _getItemsWidth() {
        return this._toolbar._getSummaryItemsWidth(this._toolbar.itemElements(), true);
    }

    _arrangeItems() {
        const $label = this._toolbar._$toolbarItemsContainer.find(`.${TOOLBAR_LABEL_CLASS}`).eq(0);

        if(!$label.length) {
            return;
        }

        const elementWidth = getWidth(this._toolbar.$element());
        const labelPaddings = getOuterWidth($label) - getWidth($label);
        $label.css('maxWidth', elementWidth - labelPaddings);
    }

    _hideOverflowItems() {}

    _dimensionChanged() {}

    _itemOptionChanged() {}

    _optionChanged() {}
}
