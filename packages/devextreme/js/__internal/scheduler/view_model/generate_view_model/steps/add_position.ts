import timeZoneUtils from '../../../utils_time_zone';
import type {
  CellInterval,
  ListEntity,
  Position,
} from '../../types';
import { binarySearchCellIndex } from './binary_search_cell_index';

// NOTE: startDateUTC is wall-clock time encoded as UTC, so both occurrences of a
// repeated fall-back hour collapse to the same value. source.startDate is the
// real instant and is used to shift post-transition appointments onto the
// extra cells that represent that hour.
const getCroppedSourceDate = (
  dateUTC: number,
  sourceDate: number | undefined,
): number | undefined => {
  if (sourceDate === undefined) {
    return undefined;
  }

  const originalEncoded = timeZoneUtils.createUTCDateWithLocalOffset(new Date(sourceDate));
  if (!originalEncoded) {
    return sourceDate;
  }

  // NOTE: splitByParts crops startDateUTC/endDateUTC but keeps the original
  // source endpoints. Map the cropped wall-clock time back to a real instant
  // so a tail part after the transition is shifted on its own.
  return sourceDate + (dateUTC - originalEncoded.getTime());
};

const getPositionTimestamp = (
  dateUTC: number,
  sourceDate: number | undefined,
  cells: CellInterval[],
  fallBackShiftMs: number,
): number => {
  const croppedSourceDate = getCroppedSourceDate(dateUTC, sourceDate);
  if (fallBackShiftMs <= 0 || croppedSourceDate === undefined || cells.length === 0) {
    return dateUTC;
  }

  const viewStart = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(cells[0].min));
  const appointmentShiftMs = timeZoneUtils.getLocalFallBackShiftMs(
    viewStart,
    new Date(croppedSourceDate),
  );

  return dateUTC + Math.min(appointmentShiftMs, fallBackShiftMs);
};

export const addPosition = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC'> & Partial<Pick<ListEntity, 'source'>>>(
  entities: T[],
  cells: CellInterval[],
  fallBackShiftMs = 0,
): (T & Position)[] => entities.map((entity) => {
  const startDateUTC = getPositionTimestamp(
    entity.startDateUTC,
    entity.source?.startDate,
    cells,
    fallBackShiftMs,
  );
  const endDateUTC = getPositionTimestamp(
    entity.endDateUTC,
    entity.source?.endDate,
    cells,
    fallBackShiftMs,
  );
  const cellIndex = binarySearchCellIndex(cells, startDateUTC);
  let endCellIndex = cellIndex;
  while (
    endCellIndex < cells.length - 1
      && endDateUTC > cells[endCellIndex].max
      && endDateUTC >= cells[endCellIndex + 1].min
  ) { endCellIndex += 1; }

  return {
    ...entity,
    startDateUTC: Math.max(startDateUTC, cells[cellIndex].min),
    endDateUTC: Math.min(endDateUTC, cells[endCellIndex].max),
    cellIndex,
    endCellIndex,
    rowIndex: cells[cellIndex].rowIndex,
    columnIndex: cells[cellIndex].columnIndex,
  };
});
