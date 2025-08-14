import { describe, expect, it } from '@jest/globals';

import { BaseAppointmentLayoutManager } from './base_appointment_layout_manager';
import type { FilterOptions, ListEntity } from './types';

class LayoutManager extends BaseAppointmentLayoutManager<ListEntity, ListEntity> {
  isSupportAllDayPanel(): boolean { return true; }

  getFilterOptions(isSplitByDays: boolean): FilterOptions {
    return super.getFilterOptions(isSplitByDays);
  }

  filterAppointments(): ListEntity[] { return []; }

  generateViewModel(): ListEntity[] { return []; }
}
const instanceMock = new LayoutManager({
  getWorkSpace: () => ({
    getDateRange: () => [
      new Date(2000, 0, 10),
      new Date(2000, 0, 11, 23, 59),
    ],
  }),
  getViewOption: (name: string) => ({ startDayHour: 0, endDayHour: 24 }[name]),
  option: (name: string) => ({ firstDayOfWeek: 0 }[name]),
  getViewOffsetMs: () => 30 * 60_000,
  resourceManager: 'resourceManager',
  timeZoneCalculator: 'timeZoneCalculator',
} as any);

describe('BaseAppointmentLayoutManager', () => {
  it('should return correct filter options for isSplitByDay=true', () => {
    expect(instanceMock.getFilterOptions(true)).toEqual({
      resourceManager: 'resourceManager',
      timeZoneCalculator: 'timeZoneCalculator',
      viewOffset: 30 * 60_000,
      firstDayOfWeek: 0,
      allDayPanel: {
        intervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 12, 0, 30).getTime(),
        }],
        prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
        nextIntervalStartDate: new Date(2000, 0, 12, 0, 30).getTime(),
      },
      regularPanel: {
        intervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 11, 0, 30).getTime(),
        }, {
          min: new Date(2000, 0, 11, 0, 30).getTime(),
          max: new Date(2000, 0, 12, 0, 30).getTime(),
        }],
        prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
        nextIntervalStartDate: new Date(2000, 0, 12, 0, 30).getTime(),
      },
    });
  });

  it('should return correct filter options for isSplitByDay=false', () => {
    expect(instanceMock.getFilterOptions(false)).toEqual({
      resourceManager: 'resourceManager',
      timeZoneCalculator: 'timeZoneCalculator',
      viewOffset: 30 * 60_000,
      firstDayOfWeek: 0,
      allDayPanel: {
        intervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 12, 0, 30).getTime(),
        }],
        prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
        nextIntervalStartDate: new Date(2000, 0, 12, 0, 30).getTime(),
      },
      regularPanel: {
        intervals: [{
          min: new Date(2000, 0, 10, 0, 30).getTime(),
          max: new Date(2000, 0, 12, 0, 30).getTime(),
        }],
        prevIntervalEndDate: new Date(2000, 0, 10, 0, 30).getTime(),
        nextIntervalStartDate: new Date(2000, 0, 12, 0, 30).getTime(),
      },
    });
  });
});
