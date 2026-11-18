import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import DataGrid from '../dataGrid';

const CLASS = {
  treeList: 'dx-treelist-container',
};

export default class TreeList extends DataGrid {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxTreeList'; }

  public getContainer(): Locator {
    return this.element.locator(`.${CLASS.treeList}`);
  }
}
