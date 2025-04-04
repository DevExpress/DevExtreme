import { describe, expect, it } from '@jest/globals';
import { compileGetter, compileSetter } from '@js/core/utils/data';

import { createTimeZoneCalculator } from '../../timezone_calculator';
import type { AppointmentDataItem } from '../../types';
import { getPreparedDataItems, resolveDataItems } from '../data';

const defaultDataAccessors = {
  expr: {
    startDateExpr: 'startDate',
    endDateExpr: 'endDate',
    recurrenceRuleExpr: 'recurrenceRule',
    visibleExpr: 'visible',
  } as any,
  get(name, obj) {
    return (compileGetter(name) as any)(obj);
  },
  set(name, obj, value) {
    return (compileSetter(name) as any)(obj, value);
  },
} as any;

describe('Data API', () => {
  describe('getPreparedDataItems', () => {
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
      const result = getPreparedDataItems(
        data,
        defaultDataAccessors,
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
        const result = getPreparedDataItems(
          data as any,
          defaultDataAccessors,
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
        const result = getPreparedDataItems(
          data as any,
          defaultDataAccessors,
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
      let result = getPreparedDataItems(
        undefined as any,
        defaultDataAccessors,
        30,
        createTimeZoneCalculator(''),
      );

      expect(result)
        .toEqual([]);

      result = getPreparedDataItems(
        [] as any,
        defaultDataAccessors,
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

      const result = getPreparedDataItems(
        data as any,
        defaultDataAccessors,
        30,
        createTimeZoneCalculator(''),
      );

      expect(result)
        .toEqual([]);
    });

    it('should return correct value without endDate', () => {
      const data = [{
        startDate: new Date(2021, 9, 9, 17),
      }];

      const expectedResult: AppointmentDataItem = {
        allDay: false,
        endDate: new Date(2021, 9, 9, 17, 30),
        hasRecurrenceRule: false,
        rawAppointment: data[0],
        recurrenceException: undefined,
        recurrenceRule: undefined,
        startDate: new Date(2021, 9, 9, 17),
        visible: true,
      };
      const result = getPreparedDataItems(
        data as any,
        defaultDataAccessors,
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

      const result = getPreparedDataItems(
        data as any,
        defaultDataAccessors,
        30,
        createTimeZoneCalculator(''),
      );

      expect(result).toMatchObject([expectedTimezones]);
    });
  });

  describe('resolveDataItems', () => {
    it('should return correct items if loaded Array', () => {
      const data = [1, 2, 3];

      expect(resolveDataItems(data as any))
        .toBe(data);
    });

    it('should return correct items if loaded Object', () => {
      const options = {
        data: [1, 2, 3],
      };

      expect(resolveDataItems(options as any))
        .toBe(options.data);
    });
  });
});
