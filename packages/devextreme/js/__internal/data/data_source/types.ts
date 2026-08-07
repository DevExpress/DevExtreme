import type { DataSourceOptionsStub } from '@js/data/data_source';

export interface StoreLoadOptions {
  sort?: DataSourceOptionsStub['sort'];
  filter?: DataSourceOptionsStub['filter'];
  langParams?: DataSourceOptionsStub['langParams'];
  select?: DataSourceOptionsStub['select'];
  group?: DataSourceOptionsStub['group'];
  requireTotalCount?: DataSourceOptionsStub['requireTotalCount'];
  searchOperation?: DataSourceOptionsStub['searchOperation'];
  searchValue?: DataSourceOptionsStub['searchValue'];
  searchExpr?: DataSourceOptionsStub['searchExpr'];
  skip?: number;
  take?: number;
  userData?: unknown;
}

export interface LoadOperation {
  operationId: number;
  storeLoadOptions: StoreLoadOptions;
  delay?: number;
}
