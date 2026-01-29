import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import { TimeZoneCalculator } from './calculator';
import type { TimeZoneCalculatorOptions } from './types';
import { createTimeZoneCalculator } from './calculator-utils';

describe('TimeZoneCalculator', () => {
  describe('General tests', () => {
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const commonOffset = 15;
    const appointmentOffset = 7.5;

    const sourceDate = new Date(2020, 6, 6, 18, 0);

    const mock: TimeZoneCalculatorOptions = {
      getClientOffset: () => localOffset,
      tryGetCommonOffset: () => commonOffset,
      tryGetAppointmentOffset: () => appointmentOffset,
    };

    ['Grid', 'Appointment'].forEach((path) => {
      it(`converting operations with '${path}' should be symmetrical`, () => {
        const calculator = new TimeZoneCalculator(mock);

        const convertedDate = calculator.createDate(
          sourceDate,
          `to${path}` as any,
        );

        const convertedDateBack = calculator.createDate(
          convertedDate,
          `from${path}` as any,
        );

        expect(convertedDate.getTime() !== sourceDate.getTime())
          .toBeTruthy();

        expect(sourceDate.getTime() === convertedDateBack.getTime())
          .toBeTruthy();
      });
    });

    [
      { path: 'toGrid', appointmentTimezone: 'America/Los_Angeles', timezone: 'common' },
      { path: 'toGrid', appointmentTimezone: undefined, timezone: 'common' },
      { path: 'fromGrid', appointmentTimezone: 'America/Los_Angeles', timezone: 'common' },
      { path: 'fromGrid', appointmentTimezone: undefined, timezone: 'common' },
      { path: 'toAppointment', appointmentTimezone: 'America/Los_Angeles', timezone: 'appointment' },
      { path: 'toAppointment', appointmentTimezone: undefined, timezone: 'common' },
      { path: 'fromAppointment', appointmentTimezone: 'America/Los_Angeles', timezone: 'appointment' },
      { path: 'fromAppointment', appointmentTimezone: undefined, timezone: 'common' },
    ].forEach(({ path, appointmentTimezone, timezone }) => {
      it(`should use ${timezone} timezone [path: ${path}, appointmentTimezone: ${appointmentTimezone}]`, () => {
        const calculator = createTimeZoneCalculator('America/Los_Angeles');
        const clientMock = jest.fn().mockReturnValue(0);
        const commonMock = jest.fn().mockReturnValue(0);
        const appointmentMock = jest.fn().mockReturnValue(0);

        jest.spyOn(calculator, 'getOffsets').mockImplementation(() => ({
          get client(): number { return clientMock() as number; },
          get common(): number { return commonMock() as number; },
          get appointment(): number { return appointmentMock() as number; },
        }));

        calculator.createDate(sourceDate, path as any, appointmentTimezone);

        expect(clientMock).toHaveBeenCalledTimes(1);
        expect(commonMock).toHaveBeenCalledTimes(timezone === 'common' ? 1 : 0);
        expect(appointmentMock).toHaveBeenCalledTimes(timezone === 'appointment' ? 1 : 0);
      });
    });

    it('createDate should throw error if wrong path', () => {
      const calculator = new TimeZoneCalculator(mock);

      expect(() => {
        calculator.createDate(
          sourceDate,
          'WrongPath' as any,
          'America/Los_Angeles',
        );
      })
        .toThrow('not specified pathTimeZoneConversion');
    });
  });

  describe('getOriginStartDateOffsetInMs method', () => {
    const minutesInMs = 60000;
    const hoursInMs = 60 * minutesInMs;
    const clientOffset = -7;
    const commonOffset = -5;
    const appointmentOffset = 6;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let calculator: TimeZoneCalculator;

    beforeEach(() => {
      calculator = new TimeZoneCalculator({
        getClientOffset: (): number => -1 * clientOffset * hoursInMs,
        tryGetCommonOffset: (): number => commonOffset,
        tryGetAppointmentOffset: (): number => appointmentOffset,
      });
    });

    it('should return correct offset for not utc date if appointment timezone set', () => {
      const expectedOffset = (appointmentOffset - commonOffset) * hoursInMs;
      const testDate = new Date(2021, 1, 1, 10, 0, 0);

      const result = calculator.getOriginStartDateOffsetInMs(testDate, 'test', false);

      expect(result).toEqual(expectedOffset);
    });

    it('should return correct offset for utc date if appointment timezone set', () => {
      const expectedOffset = (appointmentOffset - clientOffset) * hoursInMs;
      const testDate = new Date(2021, 1, 1, 10, 0, 0);

      const result = calculator.getOriginStartDateOffsetInMs(testDate, 'test', true);

      expect(result).toEqual(expectedOffset);
    });

    it('should return correct offset for utc date if appointment timezone not set', () => {
      const expectedOffset = (commonOffset - clientOffset) * hoursInMs;
      const testDate = new Date(2021, 1, 1, 10, 0, 0);

      const result = calculator.getOriginStartDateOffsetInMs(testDate, undefined, true);

      expect(result).toEqual(expectedOffset);
    });

    it('should return zero offset for not utc date if appointment timezone not set', () => {
      const expectedOffset = 0;
      const testDate = new Date(2021, 1, 1, 10, 0, 0);

      const result = calculator.getOriginStartDateOffsetInMs(testDate, undefined, false);

      expect(result).toEqual(expectedOffset);
    });
  });
});
