import type { Mode } from '@js/common';
import type { Properties } from '@js/ui/data_grid';
import type {
  ChangedEvent as BaseChangedEvent,
  LoadOperation as BaseLoadOperation,
  StoreLoadOptions,
} from '@ts/data/data_source/types';

export type RemoteOperations = Properties['remoteOperations'];

export type RemoteOperationsOptions = Exclude<RemoteOperations, boolean | Mode | undefined>;

export interface OperationTypes {
  reload?: boolean;
  fullReload?: boolean;
  sorting?: boolean;
  grouping?: boolean;
  groupExpanding?: boolean;
  filtering?: boolean;
  pageIndex?: boolean;
  skip?: boolean;
  take?: boolean;
  pageSize?: boolean;
  paging?: boolean;
}

export interface LoadOperation extends BaseLoadOperation {
  data?: unknown[];
  cachedStoreData?: unknown[];
  storeLoadOptions: StoreLoadOptions & {
    isLoadingAll?: boolean;
  };
  originalStoreLoadOptions?: StoreLoadOptions;
  remoteOperations?: RemoteOperations;
  isCustomLoading?: boolean;
  pageIndex?: number;
  lastLoadOptions?: StoreLoadOptions & {
    pageIndex: number;
    pageSize: number;
  };
  operationTypes?: OperationTypes;
  group?: unknown[] | null;
  extra?: {
    totalCount?: number;
  }
}

export interface ChangedEvent extends BaseChangedEvent {
  // When  virtual scrolling with scrolling.legacyMode, changeType
  // also can be 'append', 'prepend', 'pageIndex' in case of
  changeType?: 'loadError';
  error?: unknown;
}
