import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import CheckBox from '../checkBox';
import Scrollable from '../scrollView/scrollable';

const CLASS = {
  treeview: 'dx-treeview',
  node: 'dx-treeview-node',
  checkbox: 'dx-checkbox',
  scrollable: 'dx-scrollable',
  selectAllItem: 'dx-treeview-select-all-item',
  searchBar: 'dx-treeview-search',
};

export default class TreeView extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTreeView'; }

  getNodes(): Selector {
    return this.element.find(`.${CLASS.node}`);
  }

  getNode(index = 0): Selector {
    return this.getNodes().nth(index);
  }

  getSelectAllItem(): Selector {
    return this.element.find(`.${CLASS.selectAllItem}`);
  }

  getSearchBar(): Selector {
    return this.element.find(`.${CLASS.searchBar}`);
  }

  getCheckBoxByNodeIndex(index = 0): CheckBox {
    return new CheckBox(this.getNode(index).find(`.${CLASS.checkbox}`));
  }

  getScrollable(): Scrollable {
    return new Scrollable(this.element.find(`.${CLASS.scrollable}`));
  }
}
