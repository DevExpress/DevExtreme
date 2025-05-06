import type { SingleMultipleOrNone } from '@js/common';
import messageLocalization from '@js/localization/message';

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
    ascendingText: messageLocalization.format('dxDataGrid-sortingAscendingText'),
    descendingText: messageLocalization.format('dxDataGrid-sortingDescendingText'),
    clearText: messageLocalization.format('dxDataGrid-sortingClearText'),
    mode: 'single',
    showSortIndexes: true,
  },
} satisfies Options;
