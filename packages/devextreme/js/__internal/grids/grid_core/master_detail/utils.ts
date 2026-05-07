// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isDetailRow(row): boolean {
  const rowType = row?.rowType;
  return rowType === 'detail' || rowType === 'detailAdaptive';
}
