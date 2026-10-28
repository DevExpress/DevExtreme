import type { DataRenderMode } from '@js/common/grids';
import type { DxEvent } from '@js/events';

import type { ColumnsController } from '../columns_controller/columns_controller';

export interface ColumnInfoCell {
  colspan?: number;
  rowspan?: number;
}

export type ColumnInfoCallback<T extends ColumnInfoCell> = (
  cell: T,
  visibleIndex: number,
  rowIndex: number,
  colIndex: number,
) => unknown;

export interface VirtualColumnsControllerExtension {
  resize: () => void;
  setScrollPosition: (position: number, event?: DxEvent) => void;
}

export type VirtualColumnsController = ColumnsController & VirtualColumnsControllerExtension;

export interface VirtualColumnsOptions {
  scrolling: {
    columnRenderingMode: DataRenderMode;
    columnPageSize: number;
    columnRenderingThreshold: number;
  };
}
