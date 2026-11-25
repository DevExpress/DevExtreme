import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import GridBase from '../dataGrid/gridBase';

const CLASS = {
  treeList: 'dx-treelist-container',
};

export default class TreeList extends GridBase {
  name: WidgetName = 'dxTreeList';

  compatibilityName: WidgetName = 'dxTreeList';

  public getContainer(): Locator {
    return this.element.locator(`.${CLASS.treeList}`);
  }
}
