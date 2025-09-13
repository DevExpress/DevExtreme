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
        dataAccessor: schedulerStore._dataAccessors,
        timeZone: 'UTC',
        viewOffset: 30 * 60_000,
        firstDayOfWeek: 0,
        allDayIntervals: [{
          min: Date.UTC(2000, 0, 10, 0, 30),
          max: Date.UTC(2000, 0, 12, 0, 30),
        }],
        regularIntervals: [{
          min: Date.UTC(2000, 0, 10, 0, 30),
          max: Date.UTC(2000, 0, 12, 0, 30),
        }],
      });
    });
  });
});
