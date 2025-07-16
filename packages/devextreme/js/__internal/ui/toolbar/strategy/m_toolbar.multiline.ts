import { getOuterWidth, getWidth } from '@js/core/utils/size';
import type { Item } from '@js/ui/toolbar';
import type Toolbar from '@ts/ui/toolbar/m_toolbar';

const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';

export class MultiLineStrategy {
  _toolbar: Toolbar;

  constructor(toolbar: Toolbar) {
    this._toolbar = toolbar;
  }

  // eslint-disable-next-line class-methods-use-this
  _initMarkup(): void {}

  // eslint-disable-next-line class-methods-use-this
  _updateMenuVisibility(): void {}

  // eslint-disable-next-line class-methods-use-this
  _renderMenuItems(): void {}

  // eslint-disable-next-line class-methods-use-this
  _renderItem(): void {}

  // @ts-expect-error ts-error
  // eslint-disable-next-line class-methods-use-this
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

  // eslint-disable-next-line class-methods-use-this
  _hideOverflowItems(): void {}

  // eslint-disable-next-line class-methods-use-this
  _dimensionChanged(): void {}

  // eslint-disable-next-line class-methods-use-this
  _itemOptionChanged(): void {}

  // eslint-disable-next-line class-methods-use-this
  _optionChanged(): void {}
}
