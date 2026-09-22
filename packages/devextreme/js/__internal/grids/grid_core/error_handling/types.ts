import type { DxError } from '@ts/core/utils/m_error';

export interface ExternalError {
  message?: string;
}

export type GridError = DxError | ExternalError | string;
