import { STICKY_BORDER_WIDTH, StickyPosition } from './const';

export const getColumnFixedPosition = (
  { fixedPosition }: { fixedPosition: StickyPosition | undefined },
): StickyPosition => fixedPosition ?? StickyPosition.Left;

const getColumnWidth = (column): number => (column.visibleWidth ?? column.width) as number;

const getStickyColumnsByFixedPosition = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any,
  columnIndex: number,
  fixedPosition: StickyPosition,
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
): any[] => (fixedPosition === StickyPosition.Right
  ? columns.slice(columnIndex + 1)
  : columns.slice(0, columnIndex).reverse());

const getStickyOffsetCore = function (
  columns,
  columnIndex: number,
  fixedPosition: StickyPosition,
): number {
  const column = columns[columnIndex];
  const targetColumnIsSticky = getColumnFixedPosition(column) === StickyPosition.Sticky;
  const columnsByFixedPosition = getStickyColumnsByFixedPosition(
    columns,
    columnIndex,
    fixedPosition,
  );
  let offset = 0;
  let adjacentStickyColumnIndex = 0;
  let nonAdjacentStickyColumnCount = targetColumnIsSticky && columnsByFixedPosition.length ? 1 : 0;

  columnsByFixedPosition.forEach((col, colIndex: number) => {
    if (col.fixed) {
      const columnIsSticky = getColumnFixedPosition(col) === StickyPosition.Sticky;
      const areNextOnlyFixedColumns = !columnsByFixedPosition.slice(colIndex + 1)
        .some(({ fixed }: { fixed: boolean }) => !fixed);

      offset += getColumnWidth(col);

      if (colIndex === 0 && areNextOnlyFixedColumns) {
        nonAdjacentStickyColumnCount = 0;
      } else if (targetColumnIsSticky && columnIsSticky && !areNextOnlyFixedColumns) {
        if (colIndex !== adjacentStickyColumnIndex) {
          nonAdjacentStickyColumnCount += 1;
          adjacentStickyColumnIndex = colIndex + 1;
        } else {
          adjacentStickyColumnIndex += 1;
        }
      }
    }
  });

  return offset - (nonAdjacentStickyColumnCount * STICKY_BORDER_WIDTH);
};

export const getStickyOffset = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[],
  columnIndex: number,
  rtlEnabled: boolean,
): CSSStyleDeclaration {
  const result: { left?: string; right?: string } = {};
  const column = columns[columnIndex];

  if (column) {
    const fixedPosition = getColumnFixedPosition(column);

    switch (fixedPosition) {
      case StickyPosition.Sticky: {
        const offsetLeft = getStickyOffsetCore(
          rtlEnabled ? [...columns].reverse() : columns,
          rtlEnabled ? columns.length - columnIndex - 1 : columnIndex,
          StickyPosition.Left,
        );

        const offsetRight = getStickyOffsetCore(
          rtlEnabled ? [...columns].reverse() : columns,
          rtlEnabled ? columns.length - columnIndex - 1 : columnIndex,
          StickyPosition.Right,
        );

        result.left = `${offsetLeft}px`;
        result.right = `${offsetRight}px`;
        break;
      }
      case StickyPosition.Right: {
        const offsetRight = getStickyOffsetCore(
          rtlEnabled ? [...columns].reverse() : columns,
          rtlEnabled ? columns.length - columnIndex - 1 : columnIndex,
          StickyPosition.Right,
        );

        result.right = `${offsetRight}px`;
        break;
      }
      default: {
        const offsetLeft = getStickyOffsetCore(
          rtlEnabled ? [...columns].reverse() : columns,
          rtlEnabled ? columns.length - columnIndex - 1 : columnIndex,
          StickyPosition.Left,
        );

        result.left = `${offsetLeft}px`;
      }
    }
  }

  return result as CSSStyleDeclaration;
};
