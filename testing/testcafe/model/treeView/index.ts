import Widget from '../internal/widget';
import CheckBox from '../checkBox';

const CLASS = {
  treeview: 'dx-treeview',
  node: 'dx-treeview-node',
  checkbox: 'dx-checkbox',
};

export default class TreeView extends Widget {
  name = 'dxTreeView';

  getNodes(): Selector {
    return this.element.find(`.${CLASS.node}`);
  }

  getNode(index = 0): Selector {
    return this.getNodes().nth(index);
  }

  getCheckBoxByNodeIndex(index = 0): CheckBox {
    return new CheckBox(this.getNode(index).find(`.${CLASS.checkbox}`));
  }
}
