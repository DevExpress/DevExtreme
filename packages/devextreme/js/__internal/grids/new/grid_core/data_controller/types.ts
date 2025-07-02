import type { LoadOptions } from '@js/common/data.types';

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
