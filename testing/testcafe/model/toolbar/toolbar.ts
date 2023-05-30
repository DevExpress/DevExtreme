import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import DropDownMenu from './dropDownMenu';

const CLASS = {
  overflowMenu: 'dx-dropdownmenu',
  item: 'dx-toolbar-item',
};

export default class Toolbar extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxToolbar'; }

  getOverflowMenu(): DropDownMenu {
    return new DropDownMenu(this.element.find(`.${CLASS.overflowMenu}`));
  }

  getItem(idx?: number): Selector {
    return this.element.find(`.${CLASS.item}`).nth(!idx ? 0 : idx);
  }
}
