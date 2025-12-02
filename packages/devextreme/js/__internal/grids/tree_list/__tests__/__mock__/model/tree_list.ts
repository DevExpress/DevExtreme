import type { Column } from '@js/ui/tree_list';
import TreeList from '@js/ui/tree_list';

import { GridCoreModel } from '../../../../grid_core/__tests__/__mock__/model/grid_core';

export class TreeListModel extends GridCoreModel<TreeList> {
  protected NAME = 'dxTreeList';

  public getInstance(): TreeList {
    return TreeList.getInstance(this.root) as TreeList;
  }

  public apiGetVisibleColumns(headerLevel?: number): Column[] {
    if (headerLevel === undefined) {
      return this.getInstance().getVisibleColumns();
    }

    return this.getInstance().getVisibleColumns(headerLevel);
  }
}
