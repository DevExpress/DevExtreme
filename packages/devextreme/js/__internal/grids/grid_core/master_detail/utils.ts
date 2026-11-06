import type { ViewRow } from '@ts/grids/grid_core/views/types';

export function isDetailRow<TRow extends Pick<ViewRow, 'rowType'>>(
  row: TRow | undefined,
): row is TRow & { rowType: 'detail' | 'detailAdaptive' } {
  const rowType = row?.rowType;
  return rowType === 'detail' || rowType === 'detailAdaptive';
}
