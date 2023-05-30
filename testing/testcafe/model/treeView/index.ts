import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import CheckBox from '../checkBox';
import TextBox from '../textBox';
import Scrollable from '../scrollView/scrollable';
import TreeViewNode from './treeViewNode';

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

  getNode(index = 0): TreeViewNode {
    return new TreeViewNode(this.getNodes().nth(index));
  }

  getSelectAllCheckBox(): CheckBox {
    return new CheckBox(this.element.find(`.${CLASS.selectAllItem}`));
  }

  getSearchTextBox(): TextBox {
    return new TextBox(this.element.find(`.${CLASS.searchBar}`));
  }

  getCheckBoxByNodeIndex(index = 0): CheckBox {
    return this.getNode(index).getCheckBox();
  }

  getScrollable(): Scrollable {
    return new Scrollable(this.element.find(`.${CLASS.scrollable}`));
  }
}
