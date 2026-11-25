import type { dxElementWrapper } from '@js/core/renderer';
import type dxChart from '@js/viz/chart';
import type { Properties as ChartOptions } from '@js/viz/chart';
import type { PivotGridField } from '@ts/grids/pivot_grid/types';

export interface ChartDataItem {
  val: unknown;
  series: string;
  arg: string;
}

export interface ChartProcessCellArgs {
  rowPath: unknown[];
  maxRowLevel: number;
  rowPathFormatted: (string | undefined)[];
  rowFields: PivotGridField[];
  columnPathFormatted: (string | undefined)[];
  maxColumnLevel: number;
  columnPath: unknown[];
  columnFields: PivotGridField[];
  dataFields: PivotGridField[];
  dataIndex: number;
  dataValues: unknown[];
  visible: boolean;
  chartDataItem: ChartDataItem;
}

export type ChartProcessedCell = Partial<ChartProcessCellArgs>;

export interface ChartCellMembers {
  rowMemberIndex: number | undefined;
  rowVisibility: boolean;
  rowPath: unknown[];
  rowPathFormatted: (string | undefined)[];
  columnMemberIndex: number | undefined;
  columnVisibility: boolean;
  columnPath: unknown[];
  columnPathFormatted: (string | undefined)[];
}

export interface ChartCellDataField {
  dataField: PivotGridField;
  measureIndex: number;
}

export type ChartCell = ChartCellMembers & ChartCellDataField;

export interface ChartSeriesOptions {
  pane?: string;
  axis?: string;
}

export interface ChartIntegrationOptions {
  inverted?: boolean;
  dataFieldsDisplayMode?: string;
  putDataFieldsInto?: string;
  alternateDataFields?: boolean;
  processCell?: (cellData: ChartProcessCellArgs) => ChartProcessedCell | null | undefined;
  customizeChart?: (chartOptions: ChartOptions) => ChartOptions | null | undefined;
  customizeSeries?: (
    seriesName: string,
    seriesOptions: ChartSeriesOptions,
  ) => ChartSeriesOptions | null | undefined;
  grandTotalText?: string;
}

export type ChartTarget = string | Element | dxElementWrapper | dxChart;
