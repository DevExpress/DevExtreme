import { DataSource as DataSourceClass } from '@js/common/data/data_source/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import type { Callback } from '@js/core/utils/callbacks';
import { extend } from '@js/core/utils/extend';
import type { StoreChange } from '@js/data/store';
import type Store from '@ts/data/abstract_store';
import type { StoreKey } from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type {
  DataSourceAdapterProvider, LoadOperation, OperationTypes, RawItemData, RemoteOperationsOptions,
} from '@ts/grids/grid_core/data_source_adapter/types';
import modules from '@ts/grids/grid_core/m_modules';
import type { RowKey } from '@ts/grids/grid_core/m_types';

export class DataSourceController<
  TAdapter extends DataSourceAdapter = DataSourceAdapter,
> extends modules.Controller {
  // Absent before the first dataSource assignment and again after a reset.
  protected adapter: TAdapter | null = null;

  private isShared = false;

  public pushed!: Callback<[StoreChange[]]>;

  private readonly dataPushedHandlerProxy = this.dataPushedHandler.bind(this);

  /**
   * @extended: DataGrid's and TreeList's data_source_controller
   */
  protected getAdapterProvider(): DataSourceAdapterProvider<TAdapter> {
    throw new Error('Method not implemented.');
  }

  protected callbackNames(): string[] {
    return ['pushed'];
  }

  public publicMethods(): string[] {
    return ['getDataSource', 'keyOf'];
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

  public getDataSource(): DataSource | null {
    return this.adapter?._dataSource ?? null;
  }

  public createAdapter(dataSource: DataSource): TAdapter {
    const adapter = this.getAdapterProvider().create(this.component);

    adapter.init(dataSource);

    this.adapter = adapter;

    adapter.pushed.add(this.dataPushedHandlerProxy);

    return adapter;
  }

  public hasAdapter(): boolean {
    return this.adapter !== null;
  }

  public getAdapter(): TAdapter | null {
    return this.adapter;
  }

  public disposeAdapter(): void {
    this.adapter?.pushed.remove(this.dataPushedHandlerProxy);
    this.adapter?.dispose(this.isShared);
    this.adapter = null;
  }

  /**
   * @extended: focus
   */
  protected dataPushedHandler(changes: StoreChange[]): void {
    this.pushed.fire(changes);
  }

  public store(): Store | undefined {
    return this.adapter?.store();
  }

  public push(changes: StoreChange[], fromStore = false): void {
    this.adapter?.push(changes, fromStore);
  }

  /**
   * The key the component identifies rows by. Not interchangeable with `store()?.key()` (TreeList)
   * Callers that need what the store itself can identify a row by have to ask the store.
   *
   * @extended: TreeList's data_source_controller
   */
  public key(): StoreKey | undefined {
    return this.adapter?.key();
  }

  /**
   * @extended: TreeList's data_source_controller
   */
  public keyOf(data: RawItemData): RowKey | undefined {
    return this.adapter?.store()?.keyOf(data);
  }

  public remoteOperations(): RemoteOperationsOptions {
    return this.adapter?.remoteOperations() ?? {};
  }

  public getDataIndexGetter(): ((data: RawItemData) => number) | undefined {
    return this.adapter?.getDataIndexGetter();
  }

  public operationTypes(): OperationTypes | null | undefined {
    return this.adapter?.operationTypes();
  }

  public loadingOperationTypes(): OperationTypes {
    return this.adapter?.loadingOperationTypes() ?? {};
  }

  public isLoading(): boolean {
    return this.adapter?.isLoading() ?? false;
  }

  public select(): StoreLoadOptions['select'] {
    return this.adapter?.select();
  }

  public lastLoadOptions(): Partial<NonNullable<LoadOperation['lastLoadOptions']>> {
    return this.adapter?.lastLoadOptions() ?? {};
  }

  public getCachedStoreData(): RawItemData[] | undefined {
    return this.adapter?.getCachedStoreData();
  }

  public hasKnownLastPage(): boolean {
    return this.adapter ? this.adapter.hasKnownLastPage() : true;
  }
}
