import { Selector } from 'testcafe';
import ContextMenu from '../../contextMenu';
import TextBox from '../../textBox';

const CLASS = {
  menuButton: 'dx-menu',
  filterMenu: 'dx-context-menu',
  gridMarker: 'dx-datagrid',
};

export default class FilterTextBox extends TextBox {
  body: Selector;

  menuButton: Selector;

  menu: ContextMenu;

  constructor(selector: Selector) {
    super(selector);

    this.body = Selector('body');
    this.menuButton = this.element.find(`.${CLASS.menuButton}`);
    this.menu = new ContextMenu(this.body.find(`.${CLASS.gridMarker}.${CLASS.filterMenu}`));
  }
}
