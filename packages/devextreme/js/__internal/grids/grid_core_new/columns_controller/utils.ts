// @ts-nocheck

import type { Column, ColumnConfiguration, ColumnSettings } from './types';

export function normalizeColumn(column: string): Column {
  return {
    dataField: column,
    name: column,
    calculateCellValue(data) {
      return data[column];
    },
  };
}
