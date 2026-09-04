import { DataSource as DataSourceClass } from '@js/common/data/data_source/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import { extend } from '@js/core/utils/extend';
import type Store from '@ts/data/abstract_store';
import type { StoreKey } from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type {
  DataSourceAdapterProvider, RawItemData, RemoteOperationsOptions,
} from '@ts/grids/grid_core/data_source_adapter/types';
import modules from '@ts/grids/grid_core/m_modules';

export class DataSourceController extends modules.Controller {
  // DataController owns the adapter's lifecycle, so it is absent before the first
  // dataSource assignment and again after a reset.
  private adapter: DataSourceAdapter | null = null;

  private isShared = false;

  public setAdapter(adapter: DataSourceAdapter | null): void {
    this.adapter = adapter;
  }

  /**
   * @extended: DataGrid's data_source_controller
   */
  protected getSpecificDataSourceOption(): unknown {
    const dataSource = this.option('dataSource');

    if (Array.isArray(dataSource)) {
      return {
        store: {
          type: 'array',
          data: dataSource,
          key: this.option('keyExpr'),
        },
      };
    }

    return dataSource;
  }

  public createDataSource(): DataSource | undefined {
    const dataSourceOptions = this.getSpecificDataSourceOption();

    if (!dataSourceOptions) {
      this.isShared = false;
      return undefined;
    }

    if (dataSourceOptions instanceof DataSourceClass) {
      this.isShared = true;
      return dataSourceOptions as unknown as DataSource;
    }

    this.isShared = false;
    return new DataSourceClass(
      extend(true, {}, normalizeDataSourceOptions(dataSourceOptions, {})),
    ) as unknown as DataSource;
  }

  // Read back by DataController only until disposal moves here too, at which point
  // the flag stops leaving this class.
  public isSharedDataSource(): boolean {
    return this.isShared;
  }

  /**
   * @extended: DataGrid's and TreeList's data_source_controller
   */
  protected getAdapterProvider(): DataSourceAdapterProvider {
    throw new Error('Method not implemented.');
  }

  public createAdapter(dataSource: DataSource): DataSourceAdapter {
    const adapter = this.getAdapterProvider().create(this.component);

    adapter.init(dataSource);
    this.setAdapter(adapter);

    return adapter;
  }

  public hasAdapter(): boolean {
    return this.adapter !== null;
  }

  /**
   * Escape hatch for callers that need the adapter object itself rather than
   * a delegated read. Temporary — it reopens the boundary this controller draws.
   */
  public getAdapter(): DataSourceAdapter | null {
    return this.adapter;
  }

  public getDataSource(): DataSource | null {
    return this.adapter?._dataSource ?? null;
  }

  public store(): Store | undefined {
    return this.adapter?.store();
  }

  public key(): StoreKey | undefined {
    return this.adapter?.key();
  }

  public remoteOperations(): RemoteOperationsOptions {
    return this.adapter?.remoteOperations() ?? {};
  }

  public getDataIndexGetter(): ((data: RawItemData) => number) | undefined {
    return this.adapter?.getDataIndexGetter();
  }
}
