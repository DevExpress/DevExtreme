import type { OptionChanged } from '@ts/core/widget/types';

import type { ButtonCollectionProperties } from '../button_group/button_collection';
import ButtonCollection, { BUTTON_GROUP_ITEM_HAS_WIDTH } from '../button_group/button_collection';

export class BaseButtonCollection extends ButtonCollection {
  _optionChanged(args: OptionChanged<ButtonCollectionProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'stylingMode':
      case 'selectionMode':
      case 'buttonTemplate':
      case 'items':
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
      case 'tabIndex':
        this._invalidate();
        break;
      case 'width':
        this.itemElements()
          .toggleClass(BUTTON_GROUP_ITEM_HAS_WIDTH, !!value);
        break;
      default:
        super._optionChanged(args);
        break;
    }
  }
}
