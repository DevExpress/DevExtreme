import { describe, expect, it } from '@jest/globals';

import { getSchedulerMock } from './__mock__/scheduler.mock';
import { getFilterOptions } from './get_filter_options';

const getSchedulerStore = (type: string): ReturnType<typeof getSchedulerMock> => getSchedulerMock({
  type,
  startDayHour: 0,
  endDayHour: 24,
  offsetMinutes: 30,
});

describe('getFilterOptions', () => {
  ['agenda', 'month'].forEach((type) => {
    it(`should return correct filter options for ${type} view`, () => {
      const schedulerStore = getSchedulerStore(type);
      expect(getFilterOptions(schedulerStore)).toEqual({
        allDayPanelMode: 'allDay',
        showAllDayPanel: true,
        supportAllDayPanel: false,
        resourceManager: schedulerStore.resourceManager,
        timeZoneCalculator: schedulerStore.timeZoneCalculator,
        viewOffset: 30 * 60_000,
        firstDayOfWeek: 0,
        allDayIntervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 13, 0, 30).getTime(),
        }],
        regularIntervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 13, 0, 30).getTime(),
        }],
      });
    });
  });
});
