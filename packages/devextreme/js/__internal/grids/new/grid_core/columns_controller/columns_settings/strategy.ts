import type { ChangedOptionInfo } from '@js/common/core/events';

import type { ColumnProperties, PreNormalizedColumn } from '../options';
import { columnOptionUpdate, preNormalizeColumns } from '../utils';
import {
  extractColumnsOptionsChange,
} from './extract_columns_options_change';
import type { ColumnChangeColumnOption, ColumnsChangeAll, ColumnsChangeColumn } from './types';

export const updateAllColumns = (
  settings: PreNormalizedColumn[],
  { value }: ColumnsChangeAll,
): PreNormalizedColumn[] => (value
  ? preNormalizeColumns(value)
  : settings);

export const updateColumn = (
  settings: PreNormalizedColumn[],
  { columnIdx, value }: ColumnsChangeColumn,
): PreNormalizedColumn[] => {
  const newSettings = [...settings] as ColumnProperties[];
  newSettings[columnIdx] = value;

  return preNormalizeColumns(newSettings);
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
): PreNormalizedColumn[] => {
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
