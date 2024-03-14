import { isDefined } from '@js/core/utils/type';
import { ColumnsController, columnsControllerModule } from '@ts/grids/grid_core/columns_controller/m_columns_controller';

import treeListCore from './m_core';

class TreeListColumnsController extends ColumnsController {
  public _getFirstItems(dataSourceAdapter) {
    return super._getFirstItems(dataSourceAdapter).map((node) => node.data);
  }

  public getFirstDataColumnIndex() {
    const visibleColumns = this.getVisibleColumns();
    const visibleColumnsLength = visibleColumns.length;
    let firstDataColumnIndex = 0;

    for (let i = 0; i <= visibleColumnsLength - 1; i++) {
      if (!isDefined(visibleColumns[i].command)) {
        firstDataColumnIndex = visibleColumns[i].index;
        break;
      }
    }

    return firstDataColumnIndex;
  }
}

treeListCore.registerModule('columns', {
  defaultOptions: columnsControllerModule.defaultOptions,
  controllers: {
    columns: TreeListColumnsController,
  },
});
