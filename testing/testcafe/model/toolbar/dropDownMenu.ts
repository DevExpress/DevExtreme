import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import Popup from '../popup';
import List from '../list';

const CLASS = {
  popup: 'dx-popup',
  list: 'dx-list',
};

export default class DropDownMenu extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxDropDownMenu'; }

  getPopup(): Popup {
    return new Popup(this.element.find(`.${CLASS.popup}`));
  }

  getList(): List {
    return new List(this.getPopup().getWrapper().find(`.${CLASS.list}`));
  }
}
