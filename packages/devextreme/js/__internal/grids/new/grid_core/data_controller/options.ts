import type { DataErrorOccurredInfo } from '@js/common/grids';
import type { DataSourceLike } from '@js/data/data_source';

import type { Action } from '../types';

interface PagingOptions {
  enabled?: boolean;
  pageSize?: number;
  pageIndex?: number;
}

interface RemoteOperationsOptions {
  filtering?: boolean;
  paging?: boolean;
  sorting?: boolean;
  summary?: boolean;
}

export interface Options {
  cacheEnabled?: boolean;
  dataSource?: DataSourceLike<unknown>;
  keyExpr?: string | string[];
  onDataErrorOccurred?: Action<DataErrorOccurredInfo>;
  paging?: PagingOptions;
  remoteOperations?: RemoteOperationsOptions | boolean | 'auto';
}

export const defaultOptions = {
  paging: {
    enabled: true,
    pageSize: 6,
    pageIndex: 0,
  },
  remoteOperations: 'auto',
  cacheEnabled: true,
} satisfies Options;
