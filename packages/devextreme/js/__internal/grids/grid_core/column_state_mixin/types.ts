import type { dxElementWrapper } from '@js/core/renderer';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { Cell } from '@ts/grids/grid_core/data_controller/types';
import type { View } from '@ts/grids/grid_core/modules/modules';
import type { InternalGrid } from '@ts/grids/grid_core/types';

export interface ColumnStateMixinRequirements {
  option: InternalGrid['option'];
  component?: InternalGrid;
  setAria: View['setAria'];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mixin constructors need any[]
export type ColumnStateMixinBase = new (...args: any[]) => ColumnStateMixinRequirements;

export interface IndicatorColumnsSource {
  getColumns: () => Column[];
  getColumnElements: () => dxElementWrapper | undefined;
}

export interface ColumnStateOptions {
  name: string;
  rootElement: dxElementWrapper;
  column: Column;
  showColumnLines?: boolean;
}

export interface IndicatorOptions extends ColumnStateOptions {
  columnAlignment: string;
  container?: dxElementWrapper;
  indicator?: dxElementWrapper;
}

export interface IndicatorRowOptions {
  cells?: Cell[];
}
