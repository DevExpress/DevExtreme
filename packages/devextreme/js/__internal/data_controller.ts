// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { extend } from '../core/utils/extend';
import ArrayStore from '../data/array_store';
import { DataSource } from '../data/data_source/data_source';
import { normalizeDataSourceOptions } from '../data/data_source/utils';

interface DataSourceType {
  _userData: unknown;
  _pageSize: number;
  dispose: () => void;
  load: () => Promise<unknown>;
  loadSingle: (propName: string, propValue: unknown) => Promise<unknown>;
  loadOptions: () => unknown;
  cancel: (operationId: number) => void;
  cancelAll: () => void;
  filter: (filter?: unknown) => unknown;
  group: (group?: unknown) => unknown;
  items: () => unknown[];
  key: () => string;
  keyOf: (item: unknown) => string;
  paginate: (paginate?: unknown) => unknown;
  pageIndex: (pageIndex?: number) => number | undefined;
  reload: () => Promise<unknown>;
  select: (...args: unknown[]) => unknown;
  searchExpr: (searchExpr?: unknown) => unknown;
  searchOperation: (searchOperation?: string) => unknown;
  searchValue: (searchValue?: unknown) => unknown;
  store: () => DataSourceType;
  totalCount: () => number;
  isLastPage: () => boolean;
  isLoaded: () => boolean;
  isLoading: () => boolean;
  on: (eventName: string, eventHandler: () => void) => DataSourceType;
  off: (eventName: string, eventHandler: () => void) => DataSourceType;
  _addSearchFilter: (storeLoadOptions: unknown) => void;
  _applyMapFunction: <TData = unknown>(data: TData) => TData;
}

class DataController {
  private _isSharedDataSource = false;

  private _dataSource?: DataSourceType;

  constructor(dataSourceOptions: DataSourceType) {
    this._initDataSource(dataSourceOptions);
  }

  static initFromArray(items: unknown[], key: string): DataController {
    const dataSource = new DataSource({
      store: new ArrayStore({
        key,
        data: items,
      }),
      pageSize: 0,
    });
    return new DataController(dataSource);
  }

  _initDataSource(dataSourceOptions: DataSourceType): void {
    this._disposeDataSource();

    if (dataSourceOptions) {
      if (dataSourceOptions instanceof DataSource) {
        this._isSharedDataSource = true;
        this._dataSource = dataSourceOptions;
      } else {
        const DataSourceConstructor = DataSource;

        const normalizedDataSourceOptions = normalizeDataSourceOptions(dataSourceOptions);
        this._dataSource = new DataSourceConstructor(
          extend(true, {}, {}, normalizedDataSourceOptions),
        );
      }
    }
  }

  _disposeDataSource(): void {
    if (this._dataSource) {
      if (this._isSharedDataSource) {
        this._isSharedDataSource = false;
      } else {
        this._dataSource.dispose();
      }

      delete this._dataSource;
    }
  }

  load(): Promise<unknown> {
    return this._dataSource.load();
  }

  loadSingle(propName: string, propValue: unknown): Promise<unknown> {
    let pName = propName;
    let pValue = propValue;

    if (arguments.length < 2) {
      pValue = propName;
      pName = this.key();
    }

    return this._dataSource.loadSingle(pName, pValue);
  }

  loadFromStore(loadOptions: unknown): Promise<unknown> {
    return this.store().load(loadOptions);
  }

  loadNextPage(): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    this.pageIndex(1 + this.pageIndex());

    return this.load();
  }

  loadOptions(): unknown {
    return this._dataSource.loadOptions();
  }

  userData(): unknown {
    return this._dataSource._userData;
  }

  cancel(operationId: number): void {
    this._dataSource.cancel(operationId);
  }

  cancelAll(): void {
    this._dataSource.cancelAll();
  }

  filter(filter?: unknown): unknown {
    return this._dataSource.filter(filter);
  }

  addSearchFilter(storeLoadOptions: unknown): void {
    this._dataSource._addSearchFilter(storeLoadOptions);
  }

  group(group: unknown): unknown {
    return this._dataSource.group(group);
  }

  paginate(): unknown {
    return this._dataSource.paginate();
  }

  pageSize(): number {
    return this._dataSource._pageSize;
  }

  pageIndex(pageIndex?: number): number | undefined {
    return this._dataSource.pageIndex(pageIndex);
  }

  resetDataSource(): void {
    this._disposeDataSource();
  }

  resetDataSourcePageIndex(): void {
    if (this.pageIndex()) {
      this.pageIndex(0);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.load();
    }
  }

  initDataSource(dataSourceOptions: DataSourceType): void {
    this._initDataSource(dataSourceOptions);
  }

  totalCount(): number {
    return this._dataSource.totalCount();
  }

  isLastPage(): boolean {
    return this._dataSource.isLastPage() || !this._dataSource._pageSize;
  }

  isLoading(): boolean {
    return this._dataSource.isLoading();
  }

  isLoaded(): boolean {
    return this._dataSource.isLoaded();
  }

  searchValue(value?: unknown): unknown {
    return this._dataSource.searchValue(value);
  }

  searchOperation(operation?: string): unknown {
    return this._dataSource.searchOperation(operation);
  }

  searchExpr(expr?: unknown): unknown {
    return this._dataSource.searchExpr(expr);
  }

  select(...args: unknown[]): unknown {
    return this._dataSource.select(args);
  }

  key(): string | undefined {
    return this._dataSource?.key();
  }

  keyOf(item: unknown): string {
    return this.store().keyOf(item);
  }

  store(): DataSourceType {
    return this._dataSource.store();
  }

  items(): unknown[] {
    return this._dataSource.items();
  }

  itemsToDataSource(value: unknown[], key: string): void {
    if (!this._dataSource) {
      this._dataSource = new DataSource({
        store: new ArrayStore({
          key,
          data: value,
        }),
        pageSize: 0,
      });
    }
  }

  applyMapFunction(data: unknown): unknown {
    return this._dataSource._applyMapFunction(data);
  }

  getDataSource(): DataSourceType | null {
    return this._dataSource ?? null;
  }

  reload(): Promise<unknown> {
    return this._dataSource.reload();
  }

  on(event: string, handler: () => void): void {
    this._dataSource.on(event, handler);
  }

  off(event: string, handler: () => void): void {
    this._dataSource.off(event, handler);
  }
}

export default DataController;
