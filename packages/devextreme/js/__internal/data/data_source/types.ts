import type { DataSourceOptionsStub } from '@js/data/data_source';

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
