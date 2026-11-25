import type { PivotGridArea } from '@js/ui/pivot_grid/data_source';
import type { PivotGridField } from '@ts/grids/pivot_grid/types';

import type { Cell as SummaryCell } from './summary_display_modes';

export interface SummaryHeaderItem {
  index: number;
  value?: unknown;
  children?: SummaryHeaderItem[];
  isEmpty?: boolean[];
}

/** One raw value per data field. Custom, XMLA and remote summaries can return anything. */
export type SummaryCellValues = unknown[];

/** Kept on the cell itself, so it survives re-applying the modes to the same data. */
export interface SummaryCellState {
  originalCell?: SummaryCellValues;
  postProcessedFlags?: boolean[];
  allowResetting?: boolean;
}

export type SummaryDataCell = SummaryCellValues & SummaryCellState;

export interface SummaryData {
  rows: SummaryHeaderItem[];
  columns: SummaryHeaderItem[];
  values: SummaryDataCell[][];
  grandTotalRowIndex: number;
  grandTotalColumnIndex: number;
  isEmptyGrandTotalRow?: boolean[];
  isEmptyGrandTotalColumn?: boolean[];
}

/** createMockSummaryCell() passes an empty object. */
export type SummaryCellData = Partial<Pick<SummaryData, 'values'>>;

export interface SummaryCellPaths {
  _columnPath?: SummaryHeaderItem[];
  _rowPath?: SummaryHeaderItem[];
}

export type SummaryFieldId = PivotGridField | string | number;

export interface SummaryFieldPosition {
  area?: PivotGridArea;
  index: number;
}

/** getFieldPos() stores found fields on the cache object itself. */
export type SummaryFieldsCache = Record<string, unknown> & {
  fields: Record<string, PivotGridField | undefined>;
  positions: Record<string, SummaryFieldPosition>;
};

export type SummaryExpression = (e: SummaryCell) => unknown;
