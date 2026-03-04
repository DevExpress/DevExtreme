import type { SingleMultipleOrNone } from '@js/common';

export interface SortingOptions {
  ascendingText?: string;
  clearText?: string;
  descendingText?: string;
  mode?: SingleMultipleOrNone;
  showSortIndexes?: boolean;
}

export interface Options {
  sorting?: SortingOptions;
}

export const defaultOptions = {
  sorting: {
    ascendingText: undefined,
    descendingText: undefined,
    clearText: undefined,
    mode: 'single',
    showSortIndexes: true,
  },
} satisfies Options;
