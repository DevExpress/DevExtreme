import type { LoadOptions } from '@js/common/data.types';
import type { FilterDescriptor } from '@js/data';
import type DataSource from '@js/data/data_source';

export type DataObject = Record<string, unknown>;
export type Key = unknown;
export type KeyExpr = unknown;

export interface OperationOptions {
  filtering?: boolean;
  sorting?: boolean;
  paging?: boolean;
  grouping?: boolean;
}

export interface InternalOperationOptions extends OperationOptions {
  summary?: boolean;
}

export type RemoteOperations = boolean | OperationOptions | 'auto';

export interface InternalLoadOptions extends LoadOptions {
  summary?: unknown;

  langParams?: unknown;
}

export interface DataControllerPublicMethods {
  getDataSource: () => DataSource;
  byKey: (key: Key) => Promise<DataObject> | undefined;
  getCombinedFilter: () => FilterDescriptor | FilterDescriptor[];
  keyOf: (obj: DataObject) => Key;
  pageCount: () => number;
  pageSize: {
    (): number;
    (value: number): void;
  };
  pageIndex: {
    (): number;
    (newIndex: number): Promise<void>;
  };
  totalCount: () => number;
}
