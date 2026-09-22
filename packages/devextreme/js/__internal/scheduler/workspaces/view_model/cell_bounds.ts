import type { ViewCellData } from '../../types';

/** Instants when the cell has them, otherwise the wall-clock dates. */
export const cellBoundMs = (cell: ViewCellData): { start: number; end: number } => ({
  start: cell.startDateUTC?.getTime() ?? cell.startDate.getTime(),
  end: cell.endDateUTC?.getTime() ?? cell.endDate.getTime(),
});

/**
 * A repeated hour can end where it starts on the wall clock (`23:00 → 23:00`).
 * That wall range contains nothing, so an instant has to be able to hit the cell too.
 */
export const dateHitsCell = (cell: ViewCellData, date: Date): boolean => {
  const time = date.getTime();

  if (cell.startDateUTC && cell.endDateUTC) {
    const start = cell.startDateUTC.getTime();
    const end = cell.endDateUTC.getTime();

    if (time >= start && time < end) {
      return true;
    }
  }

  const wallStart = cell.startDate.getTime();
  const wallEnd = cell.endDate.getTime();

  return wallStart < wallEnd && time >= wallStart && time < wallEnd;
};
