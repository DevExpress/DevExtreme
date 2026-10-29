import type { ColumnInfoCell } from '@ts/grids/grid_core/virtual_columns/types';

export interface PivotGridColumnInfo extends ColumnInfoCell {
  type?: string;
  path?: unknown[];
  isLast?: boolean;
  dataIndex?: number;
  dataSourceIndex?: number;
}
