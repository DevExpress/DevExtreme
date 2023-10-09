import { Selector } from 'testcafe';
import List from '../../list';

const CLASS = {
  filterMenu: 'dx-header-filter-menu',
  list: 'dx-list',
  button: 'dx-button',
};

export default class HeaderFilter {
  body = Selector('body');

  element = this.body.find(`.${CLASS.filterMenu}`);

  getList(): List {
    return new List(this.element.find(`.${CLASS.list}`));
  }

  getOkButton(): Selector {
    return this.element.find(`.${CLASS.button}`).nth(1);
  }

  getCancelButton(): Selector {
    return this.element.find(`.${CLASS.button}`).nth(0);
  }
}
