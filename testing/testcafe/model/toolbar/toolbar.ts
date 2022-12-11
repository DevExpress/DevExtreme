import { ClientFunction } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import DropDownMenu from './dropDownMenu';

const CLASS = {
  overflowMenu: 'dx-dropdownmenu',
};

export default class Toolbar extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxToolbar'; }

  getOverflowMenu(): DropDownMenu {
    return new DropDownMenu(this.element.find(`.${CLASS.overflowMenu}`));
  }

  repaint(): Promise<{ top: number; left: number }> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).repaint(),
      { dependencies: { getInstance } },
    )();
  }
}
