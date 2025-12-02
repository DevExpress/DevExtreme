import { getOuterWidth, getWidth } from '@js/core/utils/size';
import type { Item } from '@js/ui/toolbar';
import type Toolbar from '@ts/ui/toolbar/toolbar';

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

  // @ts-expect-error ts-error
  _getMenuItems(): Item[] {}

  _getToolbarItems(): Item[] {
    const { items = [] } = this._toolbar.option();

    return items;
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
