import type { Mode } from '@js/common';

export interface Options {
  // NOTE: Underscore for option name because FilterSync feature disabled
  _filterSyncEnabled?: boolean | Mode;
}

export const defaultOptions: Options = {
  _filterSyncEnabled: false,
};
