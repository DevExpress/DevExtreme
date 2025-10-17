import type { ViewType } from '../../../types';
import type { CellInterval, DateInterval } from '../../types';
import type { RealSize } from '../steps/add_geometry/types';

interface Options {
  cellSize: RealSize;
  cells: CellInterval[];
  intervals: DateInterval[];
  viewType: ViewType;
  cellDurationMinutes: number;
  endDayHour: number;
  startDayHour: number;
  isAllDayPanel: boolean;
}

export const getGroupSize = ({
  cellSize,
  cellDurationMinutes,
  endDayHour,
  startDayHour,
  cells,
  intervals,
  viewType,
  isAllDayPanel,
}: Options): RealSize => {
  switch (viewType) {
    case 'month':
    case 'timelineMonth': {
      const intervalDaysCount = cells.filter((cell) => cell.rowIndex === 0).length;
      return {
        width: cellSize.width * intervalDaysCount,
        height: cellSize.height * intervals.length,
      };
    }
    case 'timelineDay':
    case 'timelineWeek':
    case 'timelineWorkWeek': {
      return {
        width: cellSize.width * cells.length,
        height: cellSize.height,
      };
    }
    case 'day':
    case 'week':
    case 'workWeek':
      return {
        width: isAllDayPanel ? cellSize.width * cells.length : cellSize.width * intervals.length,
        height: cellSize.height * (endDayHour - startDayHour) * (60 / cellDurationMinutes),
      };
    default:
      return cellSize;
  }
};
