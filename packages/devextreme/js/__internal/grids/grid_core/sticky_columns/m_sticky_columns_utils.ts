import { StickyPosition } from './const';

const getStickyOffsetCore = function (columns, widths, columnIndex) {
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

export const getStickyOffset = function (columns, widths, columnIndex, rtlEnabled) {
  const result: any = {};
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

  return result;
};
