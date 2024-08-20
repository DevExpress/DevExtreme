import type { WidgetName } from '../types';
import DataGrid from '../dataGrid';

const CLASS = {
  treeList: 'dx-treelist-container',
}

export default class TreeList extends DataGrid {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTreeList'; }

  getContainer(): Selector {
    return this.element.find(`.${CLASS.treeList}`);
  }
}
