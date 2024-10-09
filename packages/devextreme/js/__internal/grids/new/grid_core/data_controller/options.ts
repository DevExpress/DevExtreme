import type { DataSourceLike } from '@js/data/data_source';

import type { Paging } from './types';

export interface Options {
  paging?: Paging;

  dataSource?: DataSourceLike<unknown>;

  keyExpr?: string | string[];
}

export const defaultOptions = {
  paging: {
    pageSize: 6,
    pageIndex: 0,
  },
} satisfies Options;
