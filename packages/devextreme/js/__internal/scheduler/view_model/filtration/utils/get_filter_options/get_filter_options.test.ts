import { describe, expect, it } from '@jest/globals';

import { mockAppointmentDataAccessor } from '../../../../__mock__/appointment_data_accessor.mock';
import type Scheduler from '../../../../m_scheduler';
import { ResourceManager } from '../../../../utils/resource_manager/resource_manager';
import { getFilterOptions } from './get_filter_options';

export const getSchedulerMock = ({
  type,
  startDayHour,
  endDayHour,
  offsetMinutes,
  resourceManager,
  dateRange,
}: {
  type: string;
  startDayHour: number;
  endDayHour: number;
  offsetMinutes: number;
  resourceManager?: ResourceManager;
  dateRange?: Date[];
}): Scheduler => ({
  currentView: { type, skippedDays: [] },
  getWorkSpace: () => ({
    getDateRange: () => dateRange ?? [
      new Date(2000, 0, 10, startDayHour),
      new Date(2000, 0, 11, endDayHour),
    ],
  }),
  getTimeZone: () => 'Etc/UTC',
  getViewOption: (name: string) => ({ startDayHour, endDayHour, allDayPanelMode: 'allDay' }[name]),
  option: (name: string) => ({ firstDayOfWeek: 0, showAllDayPanel: true }[name]),
  getViewOffsetMs: () => offsetMinutes * 60_000,
  resourceManager: resourceManager ?? new ResourceManager([]),
  _dataAccessors: mockAppointmentDataAccessor,
}) as unknown as Scheduler;

describe('getFilterOptions', () => {
  ['agenda', 'month'].forEach((type) => {
    it(`should return correct filter options for ${type} view`, () => {
      const schedulerStore = getSchedulerMock({
        type,
        startDayHour: 0,
        endDayHour: 24,
        offsetMinutes: 30,
      });

      expect(getFilterOptions(schedulerStore)).toEqual({
        allDayPanelMode: 'allDay',
        showAllDayPanel: true,
        supportAllDayPanel: false,
        isDateTimeView: false,
        resourceManager: schedulerStore.resourceManager,
        dataAccessor: schedulerStore._dataAccessors,
        timeZone: 'Etc/UTC',
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
