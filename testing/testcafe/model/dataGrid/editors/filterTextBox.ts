import { Selector } from 'testcafe';
import ContextMenu from '../../contextMenu';
import TextBox from '../../textBox';

const CLASS = {
  menuButton: 'dx-menu',
  filterMenu: 'dx-context-menu',
  gridMarker: 'dx-datagrid',
};

export default class FilterTextBox extends TextBox {
  menuButton: Selector;

  menu: ContextMenu;

  constructor(selector: Selector) {
    super(selector);

    this.menuButton = this.element.find(`.${CLASS.menuButton}`);
    this.menu = new ContextMenu(Selector('body').find(`.${CLASS.gridMarker}.${CLASS.filterMenu}`));
  }
}
