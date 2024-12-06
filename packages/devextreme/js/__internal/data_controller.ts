import { Deferred } from '@js/core/utils/deferred';

import ArrayStore from '../common/data/array_store';
import { DataSource } from '../common/data/data_source/data_source';
import { normalizeDataSourceOptions } from '../common/data/data_source/utils';
import { extend } from '../core/utils/extend';
import { isDefined } from '../core/utils/type';

interface DataSourceType {
  _userData: unknown;
  _pageSize: number;
  dispose: () => void;
  load: (loadOptions?: unknown) => Promise<unknown>;
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
  pageIndex: <TIdx = number | undefined>(pageIndex: TIdx) => TIdx extends number
    ? undefined
    : number;
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

interface DataControllerOptions extends Record<string, unknown> {
  key: string;
}

class DataController {
  private _isSharedDataSource = false;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  private _dataSource: DataSourceType;

  private _keyExpr: string;

  constructor(dataSourceOptions: unknown[] | DataSourceType, { key }: DataControllerOptions) {
    this._keyExpr = key;
    this.updateDataSource(dataSourceOptions);
  }

  _updateDataSource(dataSourceOptions: DataSourceType): void {
    if (!dataSourceOptions) {
      return;
    }
    if (dataSourceOptions instanceof DataSource) {
      this._isSharedDataSource = true;
      this._dataSource = dataSourceOptions;
    } else {
      // @ts-expect-error
      const normalizedDataSourceOptions = normalizeDataSourceOptions(dataSourceOptions);
      this._dataSource = new DataSource(
        extend(true, {}, {}, normalizedDataSourceOptions),
      ) as unknown as DataSourceType;
    }
  }

  _updateDataSourceByItems(items: unknown[]): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    this._dataSource = new DataSource({
      store: new ArrayStore({
        key: this.key(),
        data: items,
      }),
      pageSize: 0,
    });
  }

  _disposeDataSource(): void {
    if (this._dataSource) {
      if (this._isSharedDataSource) {
        this._isSharedDataSource = false;
      } else {
        this._dataSource.dispose();
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      delete this._dataSource;
    }
  }

  load(): Promise<unknown> {
    return this._dataSource.load();
  }

  loadSingle(propName: string, propValue: unknown): Promise<unknown> {
    if (!this._dataSource) {
      // @ts-expect-error TS2350
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().reject();
    }

    let pName = propName;
    let pValue = propValue;

    if (arguments.length < 2) {
      pValue = propName;
      pName = this.key() as string;
    }

    return this._dataSource.loadSingle(pName, pValue);
  }

  loadFromStore(loadOptions: unknown): Promise<unknown> {
    return this.store().load(loadOptions);
  }

  loadNextPage(): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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
    if (pageIndex === undefined) {
      return this._dataSource.pageIndex(undefined);
    }
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

  updateDataSource(items: unknown[] | DataSourceType, key?: string): void {
    const dataSourceOptions = items ?? this.items();

    if (key) {
      this._keyExpr = key;
    }
    this._disposeDataSource();
    if (Array.isArray(dataSourceOptions)) {
      this._updateDataSourceByItems(dataSourceOptions);
    } else {
      this._updateDataSource(dataSourceOptions);
    }
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
    const storeKey = this._dataSource?.key();

    return isDefined(storeKey) && this._keyExpr === 'this' ? storeKey : this._keyExpr;
  }

  keyOf(item: unknown): string {
    return this.store().keyOf(item);
  }

  store(): DataSourceType {
    return this._dataSource.store();
  }

  items(): unknown[] {
    return this._dataSource?.items();
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
