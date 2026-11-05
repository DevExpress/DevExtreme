import type { DataType, HorizontalAlignment } from '@js/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { Format } from '@js/localization';
import type { Column as DataGridColumn, Properties as DataGridProperties } from '@js/ui/data_grid';
import type { Column, GroupColumn } from '@ts/grids/grid_core/columns_controller/types';
import type { GeneratedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { OptionChanged, OptionChangedFor, SummaryTextItem } from '@ts/grids/grid_core/types';

export type ExportOptionChanged = OptionChanged
  | OptionChangedFor<Pick<DataGridProperties, 'export'>>;

export type ExportableColumn = Column & Pick<DataGridColumn, 'allowExporting'>;

export type ExportColumn = ExportableColumn & {
  exportColspan?: number;
  gridColumn?: Column;
};

export interface ExportSummaryItem extends SummaryTextItem {
  name?: string;
  alignByColumn?: boolean;
}

interface ExportItemBase {
  data?: RawItemData;
  summaryCells?: ExportSummaryItem[][];
}

export interface ExportGroupItem extends ExportItemBase {
  rowType: 'group';
  values: unknown[];
  key: unknown[];
  groupIndex: number;
  summaryCells: ExportSummaryItem[][];
}

export interface ExportFooterItem extends ExportItemBase {
  rowType: 'groupFooter' | 'totalFooter';
  values: (ExportSummaryItem | undefined)[];
  key?: unknown;
  groupIndex?: undefined;
}

export interface ExportRowItem extends ExportItemBase {
  rowType: Exclude<GeneratedItem['rowType'], 'group' | 'groupFooter'>;
  values: unknown[];
  key?: unknown;
  groupIndex?: undefined;
}

export type ExportItem = ExportGroupItem | ExportFooterItem | ExportRowItem;

export type ColumnWidthsByColumnIndex = Record<number, number>;

export interface DataProviderOptions {
  isHeadersVisible: boolean | undefined;
  rtlEnabled: boolean | undefined;
  summaryTexts: Record<string, string | undefined>;
  groupColumns: GroupColumn[];
  items: ExportItem[];
  loadingItems: DeferredObj<ExportItem[]>;
  columns: ExportColumn[][];
}

export interface ExportStyle {
  bold?: boolean;
  alignment?: HorizontalAlignment;
  format?: Format;
  dataType?: DataType;
}

export interface ExportGroupSummaryItem {
  value: unknown;
  name?: string;
}

export interface ExportCellSourceData {
  rowType?: string;
  column?: Column;
  value?: unknown;
  totalSummaryItemName?: string;
  groupIndex?: number;
  groupSummaryItems?: ExportGroupSummaryItem[];
  data?: RawItemData;
}

export interface ExportCellData {
  cellSourceData: ExportCellSourceData;
  value: unknown;
}

export interface ExportMenuItem {
  text: string;
  icon: string;
  onClick: () => void;
}
