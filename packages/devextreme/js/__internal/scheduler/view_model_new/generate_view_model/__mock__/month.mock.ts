export const monthCells = Array.from({ length: 28 }).map((_, index) => ({
  min: new Date(2025, 0, index + 1).getTime(),
  max: new Date(2025, 0, index + 2).getTime(),
  cellIndex: index,
  rowIndex: Math.floor(index / 7),
  columnIndex: index % 7,
}));
