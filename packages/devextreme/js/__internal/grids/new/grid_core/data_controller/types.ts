import type { DataSourceLike } from '@js/data/data_source';

export interface Paging {
  pageSize?: number;

  pageIndex?: number;
}

export interface DataControllerProperties {
  paging?: Paging;

  dataSource?: DataSourceLike<unknown>;

  keyExpr?: string | string[];
}
