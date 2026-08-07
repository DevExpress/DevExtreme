import type { DataSourceOptionsStub } from '@js/data/data_source';
import type { StoreChange } from '@js/data/store';

export interface StoreLoadOptions extends Pick<
  DataSourceOptionsStub,
    'sort' | 'filter' | 'langParams' | 'select' | 'group'
    | 'requireTotalCount' | 'searchOperation' | 'searchValue' | 'searchExpr'
> {
  skip?: number;
  take?: number;
  userData?: unknown;
}

export interface LoadOperation {
  operationId: number;
  storeLoadOptions: StoreLoadOptions;
  delay?: number;
}

export type DataChange<TItem = unknown, TKey = unknown> = StoreChange<TItem, TKey>;

export interface ChangedEvent {
  changes?: DataChange[];
}
