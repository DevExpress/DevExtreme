import type { ViewType } from '../../../types';
import type { CellInterval, DateInterval } from '../../types';
import type { RealSize } from '../steps/add_geometry/types';
import { getIntervalDaysCount } from './get_interval_days_count';

interface Options {
  cellSize: RealSize;
  cells: CellInterval[];
  intervals: DateInterval[];
  viewType: ViewType;
  cellDurationMinutes: number;
  endDayHour: number;
  startDayHour: number;
}

export const getGroupSize = ({
  cellSize,
  cellDurationMinutes,
  endDayHour,
  startDayHour,
  cells,
  intervals,
  viewType,
}: Options): RealSize => {
  switch (viewType) {
    case 'month':
    case 'timelineMonth': {
      const intervalDaysCount = getIntervalDaysCount(intervals[0]);
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
        width: cellSize.width * intervals.length,
        height: cellSize.height * (endDayHour - startDayHour) * (60 / cellDurationMinutes),
      };
    default:
      return cellSize;
  }
};
