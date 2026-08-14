import type { RefreshOptions } from '../types';

export function getRefreshOptions(options?: boolean | RefreshOptions): RefreshOptions {
  if (options === true) {
    return { reload: true, changesOnly: true };
  }

  if (!options) {
    return { reload: true, lookup: true };
  }

  return options;
}
