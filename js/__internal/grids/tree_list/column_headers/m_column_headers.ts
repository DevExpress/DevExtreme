import { columnHeadersModule } from '@ts/grids/grid_core/column_headers/m_column_headers';

import treeListCore from '../m_core';

class TreeListColumnHeadersView extends columnHeadersModule.views.columnHeadersView {
  public setTableRole($tableElement) {
    this.setAria('role', 'treegrid', $tableElement);
  }
}

treeListCore.registerModule('columnHeaders', {
  defaultOptions: columnHeadersModule.defaultOptions,
  views: {
    columnHeadersView: TreeListColumnHeadersView,
  },
});
