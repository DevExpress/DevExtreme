import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';
import DropDownMenu from './dropDownMenu';

const CLASS = {
  overflowMenu: 'dx-dropdownmenu',
  item: 'dx-toolbar-item',
};

export default class Toolbar extends Widget {
  name: WidgetName = 'dxToolbar';

  public getOverflowMenu(): DropDownMenu {
    return new DropDownMenu(this.page, this.element.locator(`.${CLASS.overflowMenu}`));
  }

  public getItem(idx = 0): Locator {
    return this.element.locator(`.${CLASS.item}`).nth(idx);
  }
}
