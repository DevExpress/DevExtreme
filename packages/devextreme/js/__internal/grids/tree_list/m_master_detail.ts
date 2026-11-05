import { extend } from '@js/core/utils/extend';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type {
  DataChange, GeneratedItem, ItemProcessingOptions, ProcessedItem,
} from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import { dataMasterDetailExtenderMixin, masterDetailModule } from '@ts/grids/grid_core/master_detail/m_master_detail';
import type { MasterDetailDataControllerExtension } from '@ts/grids/grid_core/master_detail/types';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';
import type { ExpandedKeysCache } from '@ts/grids/tree_list/data_controller/types';

import treeListCore from './core';

const data = (
  Base: ModuleType<DataController>,
): ModuleType<
  DataController & MasterDetailDataControllerExtension
> => class DataMasterDetailTreeListExtender
  // @ts-expect-error TreeList has no DataGrid grouping expand API
  extends dataMasterDetailExtenderMixin(Base) {
  public isRowExpanded(...args: [RowKey, ExpandedKeysCache?]): boolean | undefined {
    return this.isRowExpandedHack(...args);
  }

  protected _processItems(...args: [RawItemData[], DataChange]): ProcessedItem[] {
    return this._processItemsHack(...args);
  }

  protected _processDataItem(...args: [GeneratedItem, ItemProcessingOptions]): ProcessedItem {
    return this._processDataItemHack(...args);
  }
};

treeListCore.registerModule('masterDetail', extend(
  true,
  {},
  masterDetailModule,
  {
    extenders: {
      controllers: {
        data,
      },
    },
  },
));
