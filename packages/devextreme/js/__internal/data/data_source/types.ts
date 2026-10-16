import type { DeferredObj } from '@js/core/utils/deferred';
import type { DataSourceOptionsStub } from '@js/data/data_source';
import type { StoreChange } from '@js/data/store';
import type Store from '@ts/data/abstract_store';

export interface StoreLoadOptions extends Pick<
  DataSourceOptionsStub,
    'sort' | 'filter' | 'langParams' | 'select' | 'group'
    | 'requireTotalCount' | 'searchOperation' | 'searchValue' | 'searchExpr'
> {
  // On top of the options below, a store may declare its own through `_customLoadOptions()`.
  [key: string]: unknown;

  skip?: number;
  take?: number;
  userData?: unknown;
}

export interface LoadOperation {
  operationId: number;
  storeLoadOptions: StoreLoadOptions;
  delay?: number;
  // Set by `customizeStoreLoadOptions` handlers to short-circuit the store call.
  data?: unknown[] | DeferredObj<unknown[]>;
}

export interface LoadResult extends Record<string, unknown> {
  data: unknown[];
  extra: Record<string, unknown>;
  storeLoadOptions: StoreLoadOptions;
}

export type EventOptionName = 'onChanged'
  | 'onLoadError'
  | 'onLoadingChanged'
  | 'onCustomizeLoadResult'
  | 'onCustomizeStoreLoadOptions';

/** What `normalizeDataSourceOptions()` produces: the public options with `store` resolved. */
export interface NormalizedDataSourceOptions extends Omit<DataSourceOptionsStub, 'store'> {
  // A store may declare load options of its own; they ride along untouched.
  [key: string]: unknown;

  store: Store;

  // Honoured by the constructor, but absent from the public options.
  pageIndex?: number;
  onCustomizeLoadResult?: Function;
  onCustomizeStoreLoadOptions?: Function;
}

export interface ChangedEvent {
  changes?: StoreChange[];
}

export interface ChangingEvent {
  changes: StoreChange[];
}

export type DataSourceEventName = | 'changed'
  | 'loadError'
  | 'loadingChanged'
  | 'customizeStoreLoadOptions'
  | 'customizeLoadResult'
  | 'changing';
