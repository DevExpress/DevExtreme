import type { HorizontalAlignment } from '@js/common';
import type { Format } from '@js/common/core/localization';
import type { ExcelPivotGridCell } from '@js/excel_exporter';
import type { PivotGridDataType } from '@js/ui/pivot_grid/data_source';
import type { HorizontalHeadersArea, VerticalHeadersArea } from '@ts/grids/pivot_grid/headers_area/m_headers_area';
import type { PivotGrid } from '@ts/grids/pivot_grid/m_widget';
import type { PivotGridField } from '@ts/grids/pivot_grid/types';

import type { DataProvider } from './m_export';

export interface PivotGridExportItem extends ExcelPivotGridCell {
  colspan?: number;
  rowspan?: number;
  alignment?: HorizontalAlignment;
  width?: number;
  isWhiteSpace?: boolean;
}

/** An item after `prepareItems`, which sets `colspan` and `rowspan` on every item. */
export type PivotGridPreparedExportItem = PivotGridExportItem & {
  colspan: number;
  rowspan: number;
};

export interface PivotGridExportStyle {
  alignment: HorizontalAlignment;
  dataType?: PivotGridDataType;
  format?: Format;
}

export interface PivotGridExportCellData {
  value?: unknown;
  cellSourceData?: PivotGridExportItem;
}

export interface PivotGridExportCellMerging {
  colspan: number;
  rowspan: number;
}

export interface DataProviderOptions {
  items: PivotGridPreparedExportItem[][];
  columns: PivotGridPreparedExportItem[];
  rtlEnabled?: boolean;
  dataFields: PivotGridField[];
  rowsArea: VerticalHeadersArea;
  columnsArea: HorizontalHeadersArea;
}

export interface PivotGridExportMixin {
  exportTo: () => void;
  _getLength: (items: PivotGridExportItem[][]) => number;
  _correctCellsInfoItemLengths: (
    cellsInfo: PivotGridExportItem[][],
    expectedLength: number,
  ) => PivotGridExportItem[][];
  _calculateCellInfoItemLength: (columnsRow: PivotGridExportItem[]) => number;
  _getEmptyCell: () => PivotGridExportItem;
  _getAllItems: (
    columnsInfo: PivotGridExportItem[][],
    rowsInfoItems: PivotGridExportItem[][],
    cellsInfo: PivotGridExportItem[][],
  ) => PivotGridPreparedExportItem[][];
  getDataProvider: () => DataProvider;
}

export type ExportPivotGrid = PivotGrid & PivotGridExportMixin;
