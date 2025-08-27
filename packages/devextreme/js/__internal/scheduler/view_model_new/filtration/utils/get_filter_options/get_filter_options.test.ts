import { describe, expect, it } from '@jest/globals';
import { getSchedulerMock } from '@ts/scheduler/view_model_new/filtration/scheduler.mock';

import { getFilterOptions } from './get_filter_options';

const getSchedulerStore = (type: string): ReturnType<typeof getSchedulerMock> => getSchedulerMock({
  type,
  startDayHour: 0,
  endDayHour: 24,
  offsetMinutes: 30,
});

describe('BaseAppointmentLayoutManager', () => {
  it('should return correct filter options for agenda view', () => {
    const schedulerStore = getSchedulerStore('agenda');
    expect(getFilterOptions(schedulerStore)).toEqual({
      allDayPanelMode: 'allDay',
      showAllDayPanel: true,
      supportAllDayPanel: false,
      resourceManager: schedulerStore.resourceManager,
      timeZoneCalculator: schedulerStore.timeZoneCalculator,
      viewOffset: 30 * 60_000,
      firstDayOfWeek: 0,
      allDayPanel: {
        intervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 13, 0, 30).getTime(),
        }],
        prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
        nextIntervalStartDate: new Date(2000, 0, 13, 0, 30).getTime(),
      },
      regularPanel: {
        intervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 11, 0, 30).getTime(),
        }, {
          min: new Date(2000, 0, 11, 0, 30).getTime(),
          max: new Date(2000, 0, 12, 0, 30).getTime(),
        }, {
          min: new Date(2000, 0, 12, 0, 30).getTime(),
          max: new Date(2000, 0, 13, 0, 30).getTime(),
        }],
        prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
        nextIntervalStartDate: new Date(2000, 0, 13, 0, 30).getTime(),
      },
    });
  });

  it('should return correct filter options for month view', () => {
    const schedulerStore = getSchedulerStore('month');
    expect(getFilterOptions(schedulerStore)).toEqual({
      allDayPanelMode: 'allDay',
      showAllDayPanel: true,
      supportAllDayPanel: false,
      resourceManager: schedulerStore.resourceManager,
      timeZoneCalculator: schedulerStore.timeZoneCalculator,
      viewOffset: 30 * 60_000,
      firstDayOfWeek: 0,
      allDayPanel: {
        intervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 13, 0, 30).getTime(),
        }],
        prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
        nextIntervalStartDate: new Date(2000, 0, 13, 0, 30).getTime(),
      },
      regularPanel: {
        intervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 13, 0, 30).getTime(),
        }],
        prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
        nextIntervalStartDate: new Date(2000, 0, 13, 0, 30).getTime(),
      },
    });
  });
});
