import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';

export type StickyOffsets = Record<number, Record<string, number>>;

export interface StickyColumnsColumnsViewExtension {
  hasStickyColumns: () => boolean;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  setStickyOffsets(rowIndex?: number, offsets?: StickyOffsets): void;
}

export type StickyColumnHeadersView = ColumnHeadersView & StickyColumnsColumnsViewExtension;

export type StickyRowsView = RowsView & StickyColumnsColumnsViewExtension;
