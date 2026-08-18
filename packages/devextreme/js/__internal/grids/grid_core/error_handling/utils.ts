import type { DxError } from '@ts/core/utils/m_error';

import type { ExternalError } from './types';

export const isDxError = (
  error: DxError | ExternalError | string,
): error is DxError => typeof error !== 'string' && 'url' in error && !!error.url;

export const getErrorMessage = (error: DxError | ExternalError | string): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (isDxError(error)) {
    return error.message.replace(error.url, '');
  }

  // Reproduces the original `error.message || error`, which `.text()` stringified.
  // `||` (not `??`) so an empty message falls through too.
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return error.message || String(error);
};
