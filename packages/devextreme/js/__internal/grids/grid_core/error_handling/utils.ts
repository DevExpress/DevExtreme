import { isObject } from '@js/core/utils/type';
import type { DxError } from '@ts/core/utils/m_error';

import type { GridError } from './types';

export const isDxError = (
  error: GridError,
): error is DxError => !!error && isObject(error) && 'url' in error && !!error.url;

export const getErrorMessage = (error: GridError): string => {
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
