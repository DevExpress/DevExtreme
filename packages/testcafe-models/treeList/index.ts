import type { WidgetName } from '../types';
import DataGrid from '../dataGrid';

const CLASS = {
  treeList: 'dx-treelist-container',
  adaptiveColumnButton: 'dx-treelist-adaptive-more',
  adaptiveCommandCellHidden: 'dx-command-adaptive-hidden',
}

export default class TreeList extends DataGrid {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTreeList'; }

  getContainer(): Selector {
    return this.element.find(`.${CLASS.treeList}`);
  }

  getAdaptiveButton(): Selector {
    return this.element.find(`.${CLASS.adaptiveColumnButton}`);
  }

  isAdaptiveButtonHidden(): Promise<boolean> {
    return this.getAdaptiveButton().parent(`.${CLASS.adaptiveCommandCellHidden}`).exists;
  }
}
