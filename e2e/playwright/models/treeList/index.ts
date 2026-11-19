import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import DataGrid from '../dataGrid';

const CLASS = {
  treeList: 'dx-treelist-container',
};

export default class TreeList extends DataGrid {
  name: WidgetName = 'dxTreeList';

  compatibilityName: WidgetName = 'dxTreeList';

  public getContainer(): Locator {
    return this.element.locator(`.${CLASS.treeList}`);
  }
}
