import type { Mode } from '@js/common';

export interface Options {
  filterSyncEnabled?: boolean | Mode;
}

export const defaultOptions: Options = {
  filterSyncEnabled: 'auto',
};
