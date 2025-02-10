import type { ColumnProperties } from './options';
import type { Column } from './types';
import { normalizeColumns, preNormalizeColumns } from './utils';

export function normalizeColumn(column: ColumnProperties): Column {
  return normalizeColumns(
    preNormalizeColumns([column]),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (v) => v,
  )[0];
}
