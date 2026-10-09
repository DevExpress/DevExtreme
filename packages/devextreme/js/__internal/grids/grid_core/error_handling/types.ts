import type { DxError } from '@ts/core/utils/error';

export interface ExternalError {
  message?: string;
}

export type GridError = DxError | ExternalError | string;
