import { Selector } from 'testcafe';
import type { WidgetName } from '../types';

import Widget from '../internal/widget';
import Button from '../button';

const CLASS = {
  item: 'dx-button',
  buttonGroup: 'dx-buttongroup',
  selected: 'dx-state-selected',
  itemSelected: 'dx-item-selected',
};
export default class ButtonGroup extends Widget {
  // eslint-disable-next-line
  constructor(id: string | Selector) {
    super(id);

    this.element = Selector(`.${CLASS.buttonGroup}`);
  }

  getItem(index = 0): Button {
    return new Button(this.getItems().nth(index));
  }

  getItems(): Selector {
    return this.element.find(`.${CLASS.item}`);
  }

  isItemSelected(index = 0): Promise<boolean> {
    return this.getItem(index).element.hasClass(CLASS.itemSelected);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxButtonGroup'; }
}
