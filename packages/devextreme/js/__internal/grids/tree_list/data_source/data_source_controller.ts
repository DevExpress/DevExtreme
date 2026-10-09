import type { StoreKey } from '@ts/data/abstract_store';
import { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { DataSourceAdapterProvider, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { RowKey } from '@ts/grids/grid_core/types';
import type { DataSourceAdapterTreeList } from '@ts/grids/tree_list/data_source_adapter/data_source_adapter';
import dataSourceAdapterProvider from '@ts/grids/tree_list/data_source_adapter/data_source_adapter';

export class TreeListDataSourceController
  extends DataSourceController<DataSourceAdapterTreeList> {
  protected getAdapterProvider(): DataSourceAdapterProvider<DataSourceAdapterTreeList> {
    return dataSourceAdapterProvider;
  }

  public key(): StoreKey | undefined {
    // @ts-expect-error keyExpr may be a function, grid_core key() allows only StoreKey
    return this.adapter?.getKeyExpr();
  }

  public keyOf(data: RawItemData): RowKey | undefined {
    return this.adapter?.keyOf(data);
  }
}
