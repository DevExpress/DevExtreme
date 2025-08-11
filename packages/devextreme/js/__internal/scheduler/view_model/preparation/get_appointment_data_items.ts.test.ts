import { describe, expect, it } from '@jest/globals';
import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';

import { createTimeZoneCalculator } from '../../r1/timezone_calculator';
import type { AppointmentDataItem } from '../../types';
import { getAppointmentDataItems, replaceIncorrectEndDate } from './get_appointment_data_items';

describe('Data API', () => {
  describe('getAppointmentDataItems', () => {
    it('should prepare correct data items', () => {
      const data = [{
        startDate: new Date(2021, 9, 8),
        endDate: new Date(2021, 9, 9),
        recurrenceRule: 'FREQ=WEEKLY',
      }];
      const expectedResult: AppointmentDataItem = {
        allDay: false,
        endDate: new Date(2021, 9, 9),
        hasRecurrenceRule: true,
        rawAppointment: data[0],
        recurrenceException: undefined,
        recurrenceRule: 'FREQ=WEEKLY',
        startDate: new Date(2021, 9, 8),
        visible: true,
      };
      const result = getAppointmentDataItems(
        data,
        mockAppointmentDataAccessor,
        30,
        createTimeZoneCalculator(''),
      );

      expect(result)
        .toEqual([expectedResult]);
    });

    [null, undefined, ''].forEach((recurrenceRule) => {
      it(`should prepare correct data items if recurrenceRule=${recurrenceRule}`, () => {
        const data = [{
          startDate: new Date(2021, 9, 8),
          endDate: new Date(2021, 9, 9),
          recurrenceRule: recurrenceRule as any,
        }];
        const expectedResult: AppointmentDataItem = {
          allDay: false,
          endDate: new Date(2021, 9, 9),
          hasRecurrenceRule: false,
          rawAppointment: data[0],
          recurrenceException: undefined,
          recurrenceRule: recurrenceRule as any,
          startDate: new Date(2021, 9, 8),
          visible: true,
        };
        const result = getAppointmentDataItems(
          data as any,
          mockAppointmentDataAccessor,
          30,
          createTimeZoneCalculator(''),
        );

        expect(result)
          .toEqual([expectedResult]);
      });
    });

    [
      { visible: null, expected: true },
      { visible: undefined, expected: true },
      { visible: true, expected: true },
      { visible: false, expected: false },
    ].forEach(({ visible, expected }) => {
      it(`should correctly set visible if appointment visible is ${visible}`, () => {
        const data = [{
          startDate: new Date(2021, 9, 8),
          endDate: new Date(2021, 9, 9),
          visible,
        }];
        const result = getAppointmentDataItems(
          data as any,
          mockAppointmentDataAccessor,
          30,
          createTimeZoneCalculator(''),
        );

        expect(result)
          .toMatchObject([{
            visible: expected,
          }]);
      });
    });

    it('should return empty array if no dataItems', () => {
      let result = getAppointmentDataItems(
        undefined as any,
        mockAppointmentDataAccessor,
        30,
        createTimeZoneCalculator(''),
      );

      expect(result)
        .toEqual([]);

      result = getAppointmentDataItems(
        [] as any,
        mockAppointmentDataAccessor,
        30,
        createTimeZoneCalculator(''),
      );

      expect(result)
        .toEqual([]);
    });

    it('should return empty array without startDate', () => {
      const data = [{
        endDate: new Date(2021, 9, 9),
      }];

      const result = getAppointmentDataItems(
        data as any,
        mockAppointmentDataAccessor,
        30,
        createTimeZoneCalculator(''),
      );

      expect(result)
        .toEqual([]);
    });

    it('should correct endDate value if it doesn\'t set', () => {
      const data = [{
        startDate: new Date(2021, 9, 9, 17),
      }];

      const expectedResult: AppointmentDataItem = {
        allDay: false,
        endDate: new Date(2021, 9, 9, 17, 30),
        hasRecurrenceRule: false,
        rawAppointment: {
          ...data[0],
          endDate: new Date(2021, 9, 9, 17, 30),
        },
        recurrenceException: undefined,
        recurrenceRule: undefined,
        startDate: new Date(2021, 9, 9, 17),
        visible: true,
      };
      const result = getAppointmentDataItems(
        data as any,
        mockAppointmentDataAccessor,
        30,
        createTimeZoneCalculator(''),
      );

      expect(result)
        .toEqual([expectedResult]);
    });

    it('should return timezones of start date and end date if them exists', () => {
      const expectedTimezones = {
        startDateTimeZone: 'Etc/GMT+10',
        endDateTimeZone: 'Etc/GMT-10',
      };
      const data = [{
        startDate: new Date(2021, 9, 8),
        endDate: new Date(2021, 9, 9),
        ...expectedTimezones,
      }];

      const result = getAppointmentDataItems(
        data as any,
        mockAppointmentDataAccessor,
        30,
        createTimeZoneCalculator(''),
      );

      expect(result).toMatchObject([expectedTimezones]);
    });
  });
});

describe('replaceIncorrectEndDate', () => {
  it('should process endDate correctly', () => {
    [
      {
        data: {
          startDate: new Date(2019, 4, 3, 12),
          allDay: false,
        },
        expectedEndDate: new Date(2019, 4, 3, 12, 30),
      },
      {
        data: {
          startDate: new Date(2019, 4, 3, 12),
          allDay: false,
          endDate: new Date('string'),
        },
        expectedEndDate: new Date(2019, 4, 3, 12, 30),
      },
      {
        data: {
          startDate: new Date(2019, 4, 3, 12),
          allDay: true,
        },
        expectedEndDate: new Date(2019, 4, 3, 23, 59),
      },
    ].forEach((item) => {
      replaceIncorrectEndDate(
        item.data,
        30,
        mockAppointmentDataAccessor,
      );

      expect((item.data.endDate as Date).getHours()).toBe(item.expectedEndDate.getHours());
      expect((item.data.endDate as Date).getMinutes()).toBe(item.expectedEndDate.getMinutes());
    });
  });

  it('should return false for incorrect startDate', () => {
    [
      {},
      { startDate: 'Invalid date format' },
    ].forEach((data) => {
      expect(replaceIncorrectEndDate(
        data,
        30,
        mockAppointmentDataAccessor,
      )).toBe(false);
    });
  });
});
