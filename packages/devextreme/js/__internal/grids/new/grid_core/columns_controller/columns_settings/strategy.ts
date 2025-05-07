import type { ChangedOptionInfo } from '@js/common/core/events';

import type { PreNormalizedColumn } from '../options';
import { columnOptionUpdate, preNormalizeColumns } from '../utils';
import {
  extractColumnsOptionsChange,
} from './extract_columns_options_change';
import type { ColumnChangeColumnOption, ColumnsChangeAll, ColumnsChangeColumn } from './types';

export const updateAllColumns = (
  settings: PreNormalizedColumn[],
  { value }: ColumnsChangeAll,
): PreNormalizedColumn[] | null => (value
  ? preNormalizeColumns(value)
  : settings);

export const updateColumn = (
  settings: PreNormalizedColumn[],
  { columnIdx, value }: ColumnsChangeColumn,
): PreNormalizedColumn[] => {
  // TODO: Separate logic for normalization of one column in a separate util func
  const [normalizedColumnValue] = preNormalizeColumns([value]);

  const newSettings = [...settings];
  newSettings[columnIdx] = normalizedColumnValue;

  return newSettings;
};

export const updateColumnOption = (
  settings: PreNormalizedColumn[],
  { columnIdx, optionPath, value }: ColumnChangeColumnOption,
): PreNormalizedColumn[] => columnOptionUpdate(
  settings,
  columnIdx,
  optionPath,
  value,
);

export const updateColumnSettings = (
  settings: PreNormalizedColumn[],
  optionsChange: ChangedOptionInfo | null,
): PreNormalizedColumn[] | null => {
  if (!optionsChange) {
    return settings;
  }

  const columnsOptionsChange = extractColumnsOptionsChange(optionsChange);

  switch (columnsOptionsChange?.type) {
    case 'allColumns':
      return updateAllColumns(settings, columnsOptionsChange);
    case 'column':
      return updateColumn(settings, columnsOptionsChange);
    case 'columnOption':
      return updateColumnOption(settings, columnsOptionsChange);
    default:
      return settings;
  }
};
