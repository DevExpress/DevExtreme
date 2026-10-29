import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Column, VisibleWidth } from '@ts/grids/grid_core/columns_controller/types';
import type { InternalGrid, InternalGridOptions } from '@ts/grids/grid_core/types';
import type { ViewCellOptions } from '@ts/grids/grid_core/views/types';

export type RowDraggingOptions = NonNullable<InternalGridOptions['rowDragging']>;

export type RowDraggingStartEvent = Parameters<NonNullable<RowDraggingOptions['onDragStart']>>[0];

export type RowDraggingEndEvent = Parameters<NonNullable<RowDraggingOptions['onDragEnd']>>[0];

export type RowDraggingAddEvent = Parameters<NonNullable<RowDraggingOptions['onAdd']>>[0];

export type HandleCellTemplate = (
  container: DxElement,
  options: ViewCellOptions,
) => dxElementWrapper | undefined;

export type DraggableGridOptions = Pick<InternalGridOptions,
  'dataSource'
  | 'showBorders'
  | 'showColumnHeaders'
  | 'scrolling'
  | 'pager'
  | 'columnFixing'
  | 'columnAutoWidth'
  | 'showColumnLines'
> & {
  columns: {
    width: VisibleWidth;
    fixed: Column['fixed'];
    fixedPosition: Column['fixedPosition'];
  }[];
  loadingTimeout: null;
  isDragging: boolean;
  onRowPrepared: (e: { component: InternalGrid; rowElement: DxElement }) => void;
};
