import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import CheckBox from '../checkBox';
import TreeViewNode from './treeViewNode';

const CLASS = {
  node: 'dx-treeview-node',
  scrollable: 'dx-scrollable',
  selectAllItem: 'dx-treeview-select-all-item',
  searchBar: 'dx-treeview-search',
};

export default class TreeView extends Widget {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxTreeView'; }

  public getNodes(): Locator {
    return this.element.locator(`.${CLASS.node}`);
  }

  public getNode(index = 0): TreeViewNode {
    return new TreeViewNode(this.page, this.getNodes().nth(index));
  }

  public getNodeItem(index = 0): Locator {
    return this.getNodes().nth(index);
  }

  public getSelectAllCheckBox(): CheckBox {
    return new CheckBox(this.page, this.element.locator(`.${CLASS.selectAllItem}`));
  }

  public getSearchTextBox(): Locator {
    return this.element.locator(`.${CLASS.searchBar}`);
  }

  public getCheckBoxByNodeIndex(index = 0): CheckBox {
    return this.getNode(index).getCheckBox();
  }

  public getScrollable(): Locator {
    return this.element.locator(`.${CLASS.scrollable}`);
  }
}
