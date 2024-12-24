import type { DataSourceLike } from '@js/data/data_source';

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
  dateSerializationFormat?: string;
  keyExpr?: string | string[];
  onDataErrorOccurred?: unknown;
  paging?: PagingOptions;
  remoteOperations?: RemoteOperationsOptions | boolean;
}

export const defaultOptions = {
  paging: {
    enabled: true,
    pageSize: 6,
    pageIndex: 0,
  },
  remoteOperations: {
    filtering: false,
    paging: false,
    sorting: false,
    summary: false,
  },
} satisfies Options;
