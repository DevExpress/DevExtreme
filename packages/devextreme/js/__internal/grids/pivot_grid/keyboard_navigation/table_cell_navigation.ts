export type CellNavigationDirection = 'up' | 'down' | 'left' | 'right';

export interface CellCoordinates {
  rowIndex: number;
  columnIndex: number;
}

export function buildCellMatrix(section: HTMLTableSectionElement): HTMLTableCellElement[][] {
  const matrix: HTMLTableCellElement[][] = [];

  Array.from(section.rows).forEach((row, rowIndex) => {
    matrix[rowIndex] ??= [];

    Array.from(row.cells).forEach((cell) => {
      let columnIndex = 0;

      while (matrix[rowIndex][columnIndex]) {
        columnIndex += 1;
      }

      for (let rowOffset = 0; rowOffset < cell.rowSpan; rowOffset += 1) {
        for (let columnOffset = 0; columnOffset < cell.colSpan; columnOffset += 1) {
          matrix[rowIndex + rowOffset] ??= [];
          matrix[rowIndex + rowOffset][columnIndex + columnOffset] = cell;
        }
      }
    });
  });

  return matrix;
}

export function getCellCoordinates(
  matrix: HTMLTableCellElement[][],
  cell: HTMLTableCellElement,
): CellCoordinates | undefined {
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    const columnIndex = matrix[rowIndex]?.indexOf(cell) ?? -1;

    if (columnIndex > -1) {
      return { rowIndex, columnIndex };
    }
  }

  return undefined;
}

export function getAdjacentCell(
  section: HTMLTableSectionElement,
  cell: HTMLTableCellElement,
  direction: CellNavigationDirection,
): HTMLTableCellElement | null {
  const matrix = buildCellMatrix(section);
  const coordinates = getCellCoordinates(matrix, cell);

  if (!coordinates) {
    return null;
  }

  const { rowIndex, columnIndex } = coordinates;

  const getTarget = (): HTMLTableCellElement | undefined => {
    switch (direction) {
      case 'left':
        return matrix[rowIndex][columnIndex - 1];
      case 'right':
        return matrix[rowIndex][columnIndex + cell.colSpan];
      case 'up':
        return matrix[rowIndex - 1]?.[columnIndex];
      case 'down':
        return matrix[rowIndex + cell.rowSpan]?.[columnIndex];
      default:
        return undefined;
    }
  };

  const target = getTarget();

  return target && target !== cell ? target : null;
}
