import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type Store from '@ts/data/abstract_store';
import type { StoreKey } from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { DataSourceEventName, StoreLoadOptions } from '@ts/data/data_source/types';

const DataControllerMock = {
  load: (): DeferredObj<unknown> => Deferred().reject(),
  loadSingle: (): DeferredObj<unknown> => Deferred().reject(),
  loadFromStore: (): DeferredObj<unknown> => Deferred().reject(),
  loadNextPage: (): DeferredObj<unknown> => Deferred().reject(),
  loadOptions: noop,
  userData: noop,
  cancel: noop,
  cancelAll: noop,
  filter: noop,
  addSearchFilter: noop,
  group: noop,
  paginate: noop,
  pageSize: noop,
  pageIndex: noop,
  resetDataSourcePageIndex: noop,
  totalCount: noop,
  isLastPage: noop,
  isLoading: noop,
  isLoaded: noop,
  searchValue: noop,
  searchOperation: noop,
  searchExpr: noop,
  select: noop,
  key: noop,
  keyOf: noop,
  store: noop,
  items: noop,
  applyMapFunction: noop,
  getDataSource: noop,
  reload: noop,
  on: noop,
  off: noop,
};

class DataController {
  private readonly _dataSource!: DataSource;

  constructor(dataSource: DataSource | null | undefined) {
    if (!dataSource) {
      // @ts-expect-error the mock has the same methods, all of them no-ops
      // eslint-disable-next-line no-constructor-return
      return DataControllerMock;
    }
    this._dataSource = dataSource;
  }

  load(): DeferredObj<unknown> {
    return this._dataSource.load();
  }

  loadSingle(propName: unknown, propValue?: unknown): DeferredObj<unknown> {
    if (arguments.length < 2) {
      return this._dataSource.loadSingle(this.key(), propName);
    }

    return this._dataSource.loadSingle(propName, propValue);
  }

  loadFromStore(loadOptions?: StoreLoadOptions): DeferredObj<unknown[]> {
    return this.store().load(loadOptions);
  }

  loadNextPage(): DeferredObj<unknown> {
    this.pageIndex(1 + this.pageIndex());

    return this.load();
  }

  loadOptions(): StoreLoadOptions {
    return this._dataSource.loadOptions();
  }

  userData(): Record<string, unknown> {
    return this._dataSource._userData;
  }

  cancel(operationId: number): void {
    this._dataSource.cancel(operationId);
  }

  cancelAll(): void {
    this._dataSource.cancelAll();
  }

  filter(filter?: undefined): StoreLoadOptions['filter'];
  filter(filter: NonNullable<StoreLoadOptions['filter']>): void;
  filter(filter?: StoreLoadOptions['filter']): StoreLoadOptions['filter'] {
    return this._dataSource.filter(filter);
  }

  addSearchFilter(storeLoadOptions: StoreLoadOptions): void {
    this._dataSource._addSearchFilter(storeLoadOptions);
  }

  group(group?: undefined): StoreLoadOptions['group'];
  group(group: NonNullable<StoreLoadOptions['group']>): void;
  group(group?: StoreLoadOptions['group']): StoreLoadOptions['group'] {
    // @ts-expect-error DataSource accessors are typed without the undefined getter argument
    return this._dataSource.group(group);
  }

  paginate(): boolean | undefined {
    return this._dataSource.paginate();
  }

  pageSize(): number {
    return this._dataSource._pageSize;
  }

  pageIndex(): number;
  pageIndex(pageIndex: number): void;
  pageIndex(pageIndex?: number): number | undefined {
    // @ts-expect-error DataSource accessors are typed without the undefined getter argument
    return this._dataSource.pageIndex(pageIndex);
  }

  resetDataSourcePageIndex(): void {
    if (this.pageIndex()) {
      this.pageIndex(0);
      this.load();
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

  searchValue(): StoreLoadOptions['searchValue'];
  searchValue(value: StoreLoadOptions['searchValue']): void;
  searchValue(value?: StoreLoadOptions['searchValue']): StoreLoadOptions['searchValue'] {
    if (!arguments.length) {
      return this._dataSource.searchValue();
    }

    return this._dataSource.searchValue(value);
  }

  searchOperation(operation?: unknown): StoreLoadOptions['searchOperation'] {
    // @ts-expect-error DataSource.searchOperation() treats a non-string argument as the getter
    return this._dataSource.searchOperation(operation);
  }

  searchExpr(): StoreLoadOptions['searchExpr'];
  searchExpr(expr: NonNullable<StoreLoadOptions['searchExpr']>): void;
  searchExpr(expr?: StoreLoadOptions['searchExpr']): StoreLoadOptions['searchExpr'] {
    if (!arguments.length) {
      return this._dataSource.searchExpr();
    }

    // @ts-expect-error DataSource.searchExpr() is typed without an array or undefined argument
    return this._dataSource.searchExpr(expr);
  }

  select(): StoreLoadOptions['select'];
  select(...selectExpr: NonNullable<StoreLoadOptions['select']>[]): void;
  select(...selectExpr: NonNullable<StoreLoadOptions['select']>[]): unknown {
    return this._dataSource.select(...selectExpr);
  }

  key(): StoreKey | undefined {
    return this._dataSource.key();
  }

  keyOf(item: unknown): unknown {
    return this.store().keyOf(item);
  }

  store(): Store {
    return this._dataSource.store();
  }

  items(): unknown[] {
    return this._dataSource.items();
  }

  applyMapFunction(data: unknown[]): unknown[] {
    return this._dataSource._applyMapFunction(data);
  }

  getDataSource(): DataSource | null {
    return this._dataSource || null;
  }

  reload(): DeferredObj<unknown> {
    return this._dataSource.reload();
  }

  on(event: DataSourceEventName, handler: Function): void {
    this._dataSource.on(event, handler);
  }

  off(event: DataSourceEventName, handler?: Function): void {
    this._dataSource.off(event, handler);
  }
}

export default DataController;
