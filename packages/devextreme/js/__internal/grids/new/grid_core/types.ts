import type { DataSourceLike } from '@js/data/data_source';

import type { ColumnProperties } from './columns_controller/types';

interface Paging {
  pageSize?: number;

  pageIndex?: number;
}

export interface Properties {
  paging?: Paging;

  columns?: ColumnProperties[];

  noDataText?: string;

  dataSource?: DataSourceLike<unknown>;
}
