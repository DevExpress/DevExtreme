import { describe, expect, it } from '@jest/globals';
import { getSchedulerMock } from '@ts/scheduler/view_model/__mock__/scheduler.mock';
import { getCompareOptions } from '@ts/scheduler/view_model/common/get_compare_options';

import { getFilterOptions } from './get_filter_options';

describe('getFilterOptions', () => {
  ['agenda', 'month'].forEach((type) => {
    it(`should return correct filter options for ${type} view`, () => {
      const schedulerStore = getSchedulerMock({
        type,
        startDayHour: 0,
        endDayHour: 24,
        offsetMinutes: 30,
        dateRange: [
          new Date(2000, 0, 10, 0),
          new Date(2000, 0, 11, 24),
        ],
      });

      const compareOptions = getCompareOptions(schedulerStore);
      const filterOptions = getFilterOptions(schedulerStore, compareOptions);

      expect(filterOptions).toEqual({
        allDayPanelMode: 'allDay',
        showAllDayPanel: true,
        supportAllDayPanel: false,
        isDateTimeView: false,
        resourceManager: schedulerStore.resourceManager,
        dataAccessor: schedulerStore._dataAccessors,
        timeZone: 'Etc/UTC',
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
