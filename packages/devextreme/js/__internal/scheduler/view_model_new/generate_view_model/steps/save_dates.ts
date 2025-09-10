import type { TimeZoneCalculator } from '../../../r1/timezone_calculator';
import type {
  DatesAfterSplit,
  DatesBeforeSplit,
  ListEntity,
} from '../../types';

export const saveDatesBeforeSplit = <T extends ListEntity>(
  entities: T[],
  timeZoneCalculator: TimeZoneCalculator,
): (T & DatesBeforeSplit)[] => entities.map((entity) => ({
    ...entity,
    datesBeforeSplit: {
      allDay: entity.isAllDayPanelOccupied,
      startDate: entity.startDate,
      endDate: entity.endDate,
    },
    sourceDatesBeforeSplit: {
      allDay: entity.isAllDayPanelOccupied,
      startDate: timeZoneCalculator.createDate(entity.startDate, 'fromGrid').getTime(),
      endDate: timeZoneCalculator.createDate(entity.endDate, 'fromGrid').getTime(),
    },
  }));

export const saveDatesAfterSplit = <T extends ListEntity>(
  entities: T[],
): (T & DatesAfterSplit)[] => entities.map((entity) => ({
    ...entity,
    datesAfterSplit: {
      allDay: entity.isAllDayPanelOccupied,
      startDate: entity.startDate,
      endDate: entity.endDate,
    },
  }));
