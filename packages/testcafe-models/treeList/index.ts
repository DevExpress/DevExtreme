import type { WidgetName } from '../types';
import DataGrid from '../dataGrid';

const CLASS = {
  treeList: 'dx-treelist-container',
  adaptiveColumnButton: 'dx-treelist-adaptive-more',
}

export default class TreeList extends DataGrid {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTreeList'; }

  getContainer(): Selector {
    return this.element.find(`.${CLASS.treeList}`);
  }

  getAdaptiveButton(nth: number = 0): Selector {
    return this.element.find(`.${CLASS.adaptiveColumnButton}`).nth(nth);
  }
}
