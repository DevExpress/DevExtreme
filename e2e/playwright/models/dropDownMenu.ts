import type { WidgetName } from './types';
import Widget from './internal/widget';
import List from './list';
import Popup from './popup';

const CLASS = {
  popup: 'dx-popup',
  list: 'dx-list',
};

export default class DropDownMenu extends Widget {
  name: WidgetName = 'dxDropDownMenu';

  public getPopup(): Popup {
    return new Popup(this.page, this.element.locator(`.${CLASS.popup}`));
  }

  public getList(): List {
    return new List(this.page, this.getPopup().getWrapper().locator(`.${CLASS.list}`));
  }
}
