import { describe, expect, it } from '@jest/globals';

import { mockAppointmentDataAccessor } from '../__mock__/appointment_data_accessor.mock';
import { mockTimeZoneCalculator } from '../__mock__/timezone_calculator.mock';
import type Scheduler from '../m_scheduler';
import { ResourceManager } from '../utils/resource_manager/resource_manager';
import AppointmentLayoutManager from './appointments_layout_manager';

export const getSchedulerMock = ({
  type,
  startDayHour,
  endDayHour,
  offsetMinutes,
  resourceManager,
  dateRange,
  skippedDays,
}: {
  type: string;
  startDayHour: number;
  endDayHour: number;
  offsetMinutes: number;
  resourceManager?: ResourceManager;
  skippedDays?: number[];
  dateRange?: Date[];
}): Scheduler => ({
  timeZoneCalculator: mockTimeZoneCalculator,
  currentView: { type, skippedDays: skippedDays ?? [] },
  getWorkSpace: () => ({
    getDateRange: () => dateRange ?? [
      new Date(2000, 0, 10, startDayHour),
      new Date(2000, 0, 11, endDayHour),
    ],
  }),
  getTimeZone: () => 'Etc/UTC',
  getViewOption: (name: string) => ({
    startDayHour,
    endDayHour,
    allDayPanelMode: 'allDay',
    cellDuration: 30,
  }[name]),
  option: (name: string) => ({ firstDayOfWeek: 0, showAllDayPanel: true }[name]),
  getViewOffsetMs: () => offsetMinutes * 60_000,
  resourceManager: resourceManager ?? new ResourceManager([]),
  _dataAccessors: mockAppointmentDataAccessor,
}) as unknown as Scheduler;

const defaultOptions = {
  type: 'week',
  startDayHour: 9,
  endDayHour: 18,
  offsetMinutes: 0,
};

describe('getOccurrences', () => {
  describe('common appointments', () => {
    it('should return occurrence', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{ ...appointment }]);
    });

    it('should return occurrences with extra field', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        customField: 'custom value',
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{ ...appointment }]);
    });

    it('should return occurrences if appointment intersects partially', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T18:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T12:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{ ...appointment }]);
    });

    it('should return occurrences if interval is in appointment', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T18:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T07:00:00Z'),
        new Date('2000-01-01T12:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{ ...appointment }]);
    });

    it('should not return occurrences out of interval - 1', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-03T06:00:00Z'),
        endDate: new Date('2000-01-03T07:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });

    it('should not return occurrences out of interval - 2', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-02T00:01:00Z'),
        endDate: new Date('2000-01-02T01:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });

    it('should not return occurrences out of interval - 3', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T23:00:00Z'),
        endDate: new Date('2000-01-01T23:59:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-02T00:00:00Z'),
        new Date('2000-01-03T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });

    it('should return occurrences if scheduler has skipped days, and appointment intersects with them', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock({
        ...defaultOptions,
        skippedDays: [0, 6],
      }));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-03T00:00:00Z'),
        [appointment],
      );

      expect(new Date('2000-01-01T00:00:00Z').getDay()).toBe(6); // weekend
      expect(occurrences).toEqual([{ ...appointment }]);
    });

    it('should return occurrences out of scheduler day hours', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock({
        ...defaultOptions,
        startDayHour: 8,
        endDayHour: 17,
      }));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T02:00:00Z'),
        endDate: new Date('2000-01-01T03:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{ ...appointment }]);
    });

    it('should return occurrences out of scheduler visible dates', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock({
        ...defaultOptions,
        dateRange: [
          new Date(2000, 0, 10, 9),
          new Date(2000, 0, 16, 18),
        ],
      }));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{ ...appointment }]);
    });

    it('should return occurrence if appointment has visible=false', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        visible: false,
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{ ...appointment }]);
    });
  });

  describe('recurring appointments', () => {
    it('should return occurrences', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-07T00:00:00Z'),
        [{
          text: 'test',
          startDate: new Date('2000-01-01T06:00:00Z'),
          endDate: new Date('2000-01-01T07:00:00Z'),
          recurrenceRule: 'FREQ=DAILY;INTERVAL=4',
        }],
      );

      expect(occurrences).toEqual([{
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=4',
      }, {
        text: 'test',
        startDate: new Date('2000-01-05T06:00:00Z'),
        endDate: new Date('2000-01-05T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=4',
      }]);
    });

    it('should return occurrences with extra fields', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-07T00:00:00Z'),
        [{
          text: 'test',
          startDate: new Date('2000-01-01T06:00:00Z'),
          endDate: new Date('2000-01-01T07:00:00Z'),
          recurrenceRule: 'FREQ=DAILY;INTERVAL=4',
          customField: 'custom value',
        }],
      );

      expect(occurrences).toEqual([{
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=4',
        customField: 'custom value',
      }, {
        text: 'test',
        startDate: new Date('2000-01-05T06:00:00Z'),
        endDate: new Date('2000-01-05T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=4',
        customField: 'custom value',
      }]);
    });

    it('should return occurrences with exceptions', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-06T00:00:00Z'),
        [{
          text: 'test',
          startDate: new Date('2000-01-01T06:00:00Z'),
          endDate: new Date('2000-01-01T07:00:00Z'),
          recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
          recurrenceException: '20000105T060000Z',
        }],
      );

      expect(occurrences).toEqual([{
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
        recurrenceException: '20000105T060000Z',
      }, {
        text: 'test',
        startDate: new Date('2000-01-03T06:00:00Z'),
        endDate: new Date('2000-01-03T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
        recurrenceException: '20000105T060000Z',
      }]);
    });

    it('should return occurrences out of recurring appointment with startDate out of interval', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-05T00:00:00Z'),
        new Date('2000-01-08T00:00:00Z'),
        [{
          text: 'test',
          startDate: new Date('2000-01-01T06:00:00Z'),
          endDate: new Date('2000-01-01T07:00:00Z'),
          recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
        }],
      );

      expect(occurrences).toEqual([{
        text: 'test',
        startDate: new Date('2000-01-05T06:00:00Z'),
        endDate: new Date('2000-01-05T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
      }, {
        text: 'test',
        startDate: new Date('2000-01-07T06:00:00Z'),
        endDate: new Date('2000-01-07T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
      }]);
    });
  });

  describe('all day appointments', () => {
    it('should return occurrences if all day appointment\' date intersects with the given interval', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T01:00:00Z'),
        endDate: new Date('2000-01-01T02:00:00Z'),
        allDay: true,
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T12:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{ ...appointment }]);
    });

    it('should not return occurrences if appointment is not in interval - 1', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T01:00:00Z'),
        endDate: new Date('2000-01-01T02:00:00Z'),
        allDay: true,
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-02T00:00:00Z'),
        new Date('2000-01-03T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });

    it('should not return occurrences if appointment is not in interval - 2', async () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-03-01T01:00:00Z'),
        endDate: new Date('2000-03-01T02:00:00Z'),
        allDay: true,
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });
  });
});
