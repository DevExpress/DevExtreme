import { Selector } from 'testcafe';
import ContextMenu from '../../contextMenu';
import DateBox from '../../dateBox/index';

const CLASS = {
  menuButton: 'dx-menu',
  filterMenu: 'dx-context-menu',
  gridMarker: 'dx-datagrid',
};

export default class FilterDateBox extends DateBox {
  menuButton: Selector;

  menu: ContextMenu;

  constructor(selector: Selector) {
    super(selector);

    this.menuButton = this.element.find(`.${CLASS.menuButton}`);
    this.menu = new ContextMenu(Selector('body').find(`.${CLASS.gridMarker}.${CLASS.filterMenu}`));
  }
}
