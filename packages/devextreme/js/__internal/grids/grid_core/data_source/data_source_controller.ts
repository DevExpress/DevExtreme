import type Store from '@ts/data/abstract_store';
import type { StoreKey } from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type {
  RawItemData, RemoteOperationsOptions,
} from '@ts/grids/grid_core/data_source_adapter/types';
import modules from '@ts/grids/grid_core/m_modules';

export class DataSourceController extends modules.Controller {
  // DataController owns the adapter's lifecycle, so it is absent before the first
  // dataSource assignment and again after a reset.
  private adapter: DataSourceAdapter | null = null;

  public setAdapter(adapter: DataSourceAdapter | null): void {
    this.adapter = adapter;
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
