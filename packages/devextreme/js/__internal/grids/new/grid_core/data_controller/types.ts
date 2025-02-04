export type DataObject = Record<string, unknown>;
export type Key = unknown;
export type KeyExpr = unknown;
export interface OperationOptions {
  filtering?: boolean;
  sorting?: boolean;
  paging?: boolean;
}
export type RemoteOperations = boolean | OperationOptions | 'auto';
