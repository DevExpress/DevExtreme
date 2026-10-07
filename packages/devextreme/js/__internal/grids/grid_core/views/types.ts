import type { template } from '@js/common';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { DxEvent } from '@js/events';
import type { dxScrollableOptions, ScrollEventInfo } from '@js/ui/scroll_view/ui.scrollable';
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import type {
  Cell, DataChange, RowChangeType, RowUpdate, RowWatch, UpdateChange,
} from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { InternalGrid, RowKey } from '@ts/grids/grid_core/types';

export type RowsViewScrollEvent = Partial<ScrollEventInfo<dxScrollable>> & {
  component: dxScrollable;
  scrollOffset: { top: number; left: number };
  forceUpdateScrollPosition?: boolean;
};

export type ColumnWidth = number | string | undefined;

export interface ColumnViewTemplateOptions {
  container: dxElementWrapper;
  model: TemplateModel;
  deferred?: DeferredObj<unknown>;
  onRendered?: () => void;
  change?: DataChange;
}

export interface ColumnViewTemplate {
  allowRenderToDetachedContainer?: boolean;
  render: (options: ColumnViewTemplateOptions) => void;
}

export interface ColumnRenderTemplate {
  allowRenderToDetachedContainer?: boolean;
  render: (container: dxElementWrapper, model: TemplateModel, change?: DataChange) => void;
}

export type ColumnTemplateSource = template | ColumnRenderTemplate;

export interface DelayedTemplate {
  template: ColumnViewTemplate;
  options: ColumnViewTemplateOptions;
  async?: boolean;
}

export interface AppendRowTemplate {
  render: (options: { content: dxElementWrapper; container: dxElementWrapper }) => void;
}

export interface TemplateModel {
  column?: Column;
  rowType?: string;
  renderAsync?: boolean;
  component?: InternalGrid;
}

export type ScrollableOptions = Omit<dxScrollableOptions<dxScrollable>, 'onScroll'> & {
  useSimulatedScrollbar?: boolean;
  onScroll?: (e: RowsViewScrollEvent) => void;
};

export interface ScrollPosition {
  left?: number;
  top?: number;
}

export interface BoundingRect {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export interface CellPosition {
  rowIndex: number;
  columnIndex: number;
}

export type ViewDataChange = DataChange & Partial<Pick<UpdateChange, 'columnIndices' | 'changeTypes'>>;

/** @architectureLeak data_grid: the cell hint skips group cells that have a template */
export type HintColumn = Column & { groupCellTemplate?: unknown };

export interface ViewRowCell extends Cell {
  columnIndex?: number;
}

export interface ViewRow {
  rowType: string;
  rowIndex?: number;
  dataIndex?: number;
  key?: RowKey;
  data?: RawItemData;
  values?: unknown[];
  oldValues?: unknown[];
  cells?: ViewRowCell[];
  isExpanded?: boolean;
  isEditing?: boolean;
  /** @architectureLeak tree_list: core sets aria-expanded for rows of a tree node */
  node?: { hasChildren?: boolean };
  watch?: RowWatch;
  update?: RowUpdate;
}

export interface WatchableOptions {
  data?: RawItemData;
  rowIndex?: number;
  dataIndex?: number;
  isExpanded?: boolean;
  row?: ViewRow;
  watch?: RowWatch;
  update?: RowUpdate;
}

export interface ViewCellOptions {
  column: Column;
  columnIndex: number;
  rowType: string;
  rowIndex?: number;
  isAltRow?: boolean;
  columns?: Column[];
  row?: ViewRow;
  key?: RowKey;
  data?: RawItemData;
  value?: unknown;
  oldValue?: unknown;
  displayValue?: unknown;
  text?: string;
  values?: unknown[];
  summaryItems?: unknown;
  resized?: Callback<[number]>;
  groupContinuesMessage?: string;
  groupContinuedMessage?: string;
  isEditing?: boolean;
  removed?: boolean;
  modified?: boolean;
  watch?: RowWatch;
  update?: RowUpdate;
  cellElement?: DxElement<Element>;
  component?: InternalGrid;
  renderAsync?: boolean;
}

export interface CellEventOptions extends Partial<ViewCellOptions> {
  cellElement: DxElement<Element>;
  event: DxEvent;
  eventType: string;
}

export interface RowPreparedOptions extends ViewRow {
  columns?: Column[];
  rowElement?: DxElement<Element>;
}

export interface TableRenderOptions {
  change?: ViewDataChange;
  columns?: Column[];
}

export interface RowRenderOptions {
  change?: ViewDataChange;
  columns: Column[];
  row: ViewRow;
  columnIndices?: number[];
  changeType?: RowChangeType;
}

export interface CellRenderOptions extends Omit<RowRenderOptions, 'columns'> {
  columns?: Column[];
  column: Column;
  columnIndex: number;
  rowIndex?: number;
  value?: unknown;
  oldValue?: unknown;
}

export interface ViewRowEvent {
  event: DxEvent;
  rowIndex: number;
  rowElement?: DxElement<Element>;
  columns?: Column[];
}

export interface ColumnWidthsOptions {
  widths?: ColumnWidth[];
  optionNames?: ColumnsChanges['optionNames'];
}
