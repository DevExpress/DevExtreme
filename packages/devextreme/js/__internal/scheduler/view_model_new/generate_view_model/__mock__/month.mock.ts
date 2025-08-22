export const monthIntervals = [
  { min: new Date(2025, 0, 1).getTime(), max: new Date(2025, 0, 8).getTime() },
  { min: new Date(2025, 0, 8).getTime(), max: new Date(2025, 0, 15).getTime() },
  { min: new Date(2025, 0, 15).getTime(), max: new Date(2025, 0, 22).getTime() },
  { min: new Date(2025, 0, 22).getTime(), max: new Date(2025, 0, 29).getTime() },
];

export const monthCells = Array.from({ length: 28 }).map((_, index) => ({
  min: new Date(2025, 0, index + 1).getTime(),
  max: new Date(2025, 0, index + 2).getTime(),
  cellIndex: index,
  rowIndex: Math.floor(index / 7),
  columnIndex: index % 7,
}));
