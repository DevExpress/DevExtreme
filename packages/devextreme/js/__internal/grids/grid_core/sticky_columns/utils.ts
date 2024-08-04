import { StickyPosition } from './const';

const getStickyOffsetCore = function (columns, widths: number[], columnIndex): string {
  let result = 0;
  const column = columns[columnIndex];
  const { fixedPosition } = column;

  columns.forEach((col, colIndex) => {
    const needToUpdate = fixedPosition === StickyPosition.Right
      ? colIndex > columnIndex : colIndex < columnIndex;

    if (needToUpdate && col.fixed && col.fixedPosition === fixedPosition) {
      result += widths[colIndex];
    }
  });

  return `${result}px`;
};

export const getStickyOffset = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[],
  widths: number[],
  columnIndex: number,
  rtlEnabled: boolean,
): CSSStyleDeclaration {
  const result: { left?: string; right?: string } = {};
  const column = columns[columnIndex];

  if (column) {
    const offset = getStickyOffsetCore(
      rtlEnabled ? [...columns].reverse() : columns,
      rtlEnabled ? [...widths].reverse() : widths,
      rtlEnabled ? columns.length - columnIndex - 1 : columnIndex,
    );

    if (column.fixedPosition === StickyPosition.Right) {
      result.right = offset;
    } else {
      result.left = offset;
    }
  }

  return result as CSSStyleDeclaration;
};
