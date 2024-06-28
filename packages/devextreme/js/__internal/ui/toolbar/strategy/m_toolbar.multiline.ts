import { getOuterWidth, getWidth } from '@js/core/utils/size';

import type Toolbar from '../m_toolbar';

const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';

export class MultiLineStrategy {
  _toolbar: Toolbar;

  constructor(toolbar: Toolbar) {
    this._toolbar = toolbar;
  }

  _initMarkup(): void {}

  _updateMenuVisibility(): void {}

  _renderMenuItems(): void {}

  _renderItem(): void {}

  _getMenuItems(): void {}

  _getToolbarItems() {
    return this._toolbar.option('items') ?? [];
  }

  _getItemsWidth(): number {
    return this._toolbar._getSummaryItemsSize('width', this._toolbar._itemElements(), true);
  }

  _arrangeItems(): void {
    const $label = this._toolbar._$toolbarItemsContainer.find(`.${TOOLBAR_LABEL_CLASS}`).eq(0);

    if (!$label.length) {
      return;
    }

    const elementWidth = getWidth(this._toolbar.$element());
    const labelPaddings = getOuterWidth($label) - getWidth($label);
    $label.css('maxWidth', elementWidth - labelPaddings);
  }

  _hideOverflowItems(): void {}

  _dimensionChanged(): void {}

  _itemOptionChanged(): void {}

  _optionChanged(): void {}
}
