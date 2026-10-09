import { isDefined } from '@js/core/utils/type';
import { ColumnsController, columnsControllerModule } from '@ts/grids/grid_core/columns_controller/columns_controller';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import treeListCore from './core';

export class TreeListColumnsController extends ColumnsController {
  public _getFirstItems(dataSourceAdapter?: DataSourceAdapter): RawItemData[] {
    // @ts-expect-error TreeList nodes have data that the base adapter does not type
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
