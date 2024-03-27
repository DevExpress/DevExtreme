import ContextMenu from '../../contextMenu';
import TextBox from '../../textBox';
import { getRootContainer } from '../../../helpers/domUtils';

const CLASS = {
  menuButton: 'dx-menu-item',
  filterMenu: 'dx-context-menu',
  gridMarker: 'dx-datagrid',
};

export default class FilterTextBox extends TextBox {
  root: Selector;

  menuButton: Selector;

  menu: ContextMenu;

  constructor(selector: Selector) {
    super(selector);

    this.root = getRootContainer();
    this.menuButton = this.element.find(`.${CLASS.menuButton}`).nth(0);
    this.menu = new ContextMenu(this.root.find(`.${CLASS.gridMarker}.${CLASS.filterMenu}`));
  }
}
