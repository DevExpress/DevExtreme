import type { dxElementWrapper } from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import type { DxEvent, PointerInteractionEvent } from '@js/events';

import type { ColumnChooserView } from '../column_chooser/column_chooser';
import type { ColumnHeadersView } from '../column_headers/column_headers';
import type { Column, ColumnIndex, DropLocationNames } from '../columns_controller/types';
import type { HeaderPanel } from '../header_panel/header_panel';
import type { ColumnPoint } from '../types';
import type { BoundingRect } from '../views/types';
import type { DraggingHeaderView } from './columns_resizing_reordering';

export type DraggingPanel = ColumnHeadersView | ColumnChooserView | HeaderPanel;

export interface DraggingPanelBoundingRect {
  draggingPanel: DraggingPanel;
  boundingRect: BoundingRect;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface TablePosition {
  height: number;
  top?: number;
}

export type PointerEventWithData<TData> = Omit<DxEvent<PointerInteractionEvent>, 'data'> & {
  pageX: number;
  pageY: number;
  data: TData;
};

export interface PointerEventArgs<TData = undefined> {
  event: PointerEventWithData<TData>;
}

export type DraggingHeaderEventArgs = PointerEventArgs<{ that: DraggingHeaderView }>;

export interface CallbackSubscription {
  callback: Callback;
  handler: Parameters<Callback['add']>[0];
}

export interface ResizingInfo {
  startPosX: number;
  currentColumnIndex: number;
  currentColumnWidth: number;
  nextColumnIndex: number;
  nextColumnWidth: number;
  needToInvertResizing: boolean;
}

export interface CellWidths {
  cellWidth: number;
  nextCellWidth?: number;
}

export interface DragHeaderOptions {
  deltaX: number;
  deltaY: number;
  sourceColumn: Column;
  index: number;
  columnIndex: number;
  columnElement: dxElementWrapper;
  sourceLocation: DropLocationNames;
  draggingPanels: DraggingPanel[];
  rowIndex: number;
}

export interface DragOptions extends DragHeaderOptions {
  draggingPanelBoundingRects: DraggingPanelBoundingRect[] | null;
  pointsByTarget?: Partial<Record<DropLocationNames, ColumnPoint[]>>;
}

export interface DraggingPointsOptions extends DragOptions {
  targetDraggingPanel: DraggingPanel;
  columns: Column[];
  columnElements: dxElementWrapper;
  isVerticalOrientation: boolean;
  startColumnIndex: number;
}

export interface DraggingPointCreatedOptions {
  point: ColumnPoint;
  columns: Column[];
  location?: string;
  sourceColumn?: Column;
  cells?: dxElementWrapper;
}

export interface DropOptions {
  sourceIndex: number;
  sourceColumnIndex: ColumnIndex;
  sourceColumnElement: dxElementWrapper;
  sourceLocation: DropLocationNames;
  targetLocation?: DropLocationNames;
  targetColumnIndex?: ColumnIndex;
  targetColumnElement?: dxElementWrapper;
  isLast?: boolean;
  posX?: number;
  posY?: number;
}
