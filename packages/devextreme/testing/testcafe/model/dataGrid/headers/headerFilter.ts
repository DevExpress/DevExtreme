import List from '../../list';
import { getRootContainer } from '../../../helpers/domUtils';

const CLASS = {
  filterMenu: 'dx-header-filter-menu',
  content: 'dx-overlay-content',
  list: 'dx-list',
  button: 'dx-button',
};

export default class HeaderFilter {
  root = getRootContainer();

  element = this.root.find(`.${CLASS.filterMenu}`);

  getList(): List {
    return new List(this.element.find(`.${CLASS.list}`));
  }

  getButtons(): Selector {
    return this.element.find(`.${CLASS.button}`);
  }

  getContent(): Selector {
    return this.element.find(`.${CLASS.content}`);
  }
}
