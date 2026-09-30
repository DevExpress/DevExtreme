import { isDefined } from '@js/core/utils/type';
import { ColumnsController, columnsControllerModule } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import treeListCore from './m_core';

class TreeListColumnsController extends ColumnsController {
  public _getFirstItems(dataSourceAdapter): (RawItemData | undefined)[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- base method returns any
    return super._getFirstItems(dataSourceAdapter).map((node) => node.data);
  }

  public getFirstDataColumnIndex(): number {
    const visibleColumns = this.getVisibleColumns();
    const visibleColumnsLength = visibleColumns.length;
    let firstDataColumnIndex = 0;

    for (let i = 0; i <= visibleColumnsLength - 1; i += 1) {
      if (!isDefined(visibleColumns[i].command)) {
        firstDataColumnIndex = visibleColumns[i].index ?? 0;
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
