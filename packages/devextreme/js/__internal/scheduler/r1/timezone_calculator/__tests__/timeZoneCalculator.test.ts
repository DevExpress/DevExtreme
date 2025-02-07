import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import dateUtils from '@js/core/utils/date';
import timeZoneUtils from '@ts/scheduler/m_utils_time_zone';
import { createTimeZoneCalculator } from '@ts/scheduler/r1/timezone_calculator';

import { TimeZoneCalculator } from '../calculator';
import type { PathTimeZoneConversion } from '../const';
import type { TimeZoneCalculatorOptions } from '../types';

describe('TimeZoneCalculator', () => {
  describe('T1255474 - handle DST', () => {
    // DST CET: 01:00 UTC 27 March 2021, 01:00 UTC 30 October 2021
    // DST USA: 01:00 UTC 09 March 2025, 01:00 UTC 03 November 2024
    ([
      [new Date(Date.UTC(2021, 2, 27, 0)), 'CET winter'],
      [new Date(Date.UTC(2021, 2, 27, 15)), 'CET winter to summer'],
      [new Date(Date.UTC(2021, 2, 27, 22)), 'CET winter to summer'],
      [new Date(Date.UTC(2021, 2, 28, 0)), 'CET summer'],
      [new Date(Date.UTC(2021, 9, 29, 21)), 'CET summer'],
      [new Date(Date.UTC(2021, 9, 30, 15)), 'CET summer to winter'],
      [new Date(Date.UTC(2021, 9, 30, 21)), 'CET summer to winter'],
      [new Date(Date.UTC(2021, 9, 30, 23)), 'CET winter'],
      [new Date(Date.UTC(2025, 2, 9, 0)), 'USA winter'],
      [new Date(Date.UTC(2025, 2, 9, 2)), 'USA winter to summer'],
      [new Date(Date.UTC(2025, 2, 10, 0)), 'USA summer'],
      [new Date(Date.UTC(2024, 11, 3, 21)), 'USA summer'],
      [new Date(Date.UTC(2024, 11, 4, 15)), 'USA summer to winter'],
      [new Date(Date.UTC(2024, 11, 4, 23)), 'USA winter'],
    ] as const).forEach(([date, description]) => {
      [
        'Europe/Belgrade', // +1/+2 GMT
        'Asia/Beirut', // +2/+3 GMT
        'America/Los_Angeles', // -7/-8 GMT
        'Etc/GMT+12',
        'Etc/GMT+11',
        'Etc/GMT+10',
        'Etc/GMT+9',
        'Etc/GMT+8',
        'Etc/GMT+7',
        'Etc/GMT+6',
      ].forEach((clientTimeZOne) => {
        it(`Should correctly convert ${date.toISOString()} (${description}) to Grid and back in ${clientTimeZOne} timezone`, () => {
          const calculator = createTimeZoneCalculator('America/Los_Angeles');

          jest.spyOn(calculator as any, 'getClientOffset').mockImplementation((dateArg) => (timeZoneUtils
            .calculateTimezoneByValue(clientTimeZOne, dateArg as Date) ?? 0) * dateUtils.dateToMilliseconds('hour'));

          const sourceDate = calculator.createDate(date, { path: 'toGrid' as PathTimeZoneConversion }) as Date;
          const gridDate = calculator.createDate(sourceDate, { path: 'fromGrid' as PathTimeZoneConversion }) as Date;
          const sourceDate2 = calculator.createDate(gridDate, { path: 'toGrid' as PathTimeZoneConversion }) as Date;

          expect(date.toISOString()).toBe(gridDate.toISOString());
          expect(sourceDate.toISOString()).toBe(sourceDate2.toISOString());
        });
      });
    });
  });

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
          { path: `to${path}` as PathTimeZoneConversion },
        ) as Date;

        const convertedDateBack = calculator.createDate(
          convertedDate,
          { path: `from${path}` as PathTimeZoneConversion },
        ) as Date;

        expect(convertedDate.getTime() !== sourceDate.getTime())
          // eslint-disable-next-line spellcheck/spell-checker
          .toBeTruthy();

        expect(sourceDate.getTime() === convertedDateBack.getTime())
          // eslint-disable-next-line spellcheck/spell-checker
          .toBeTruthy();
      });
    });

    [
      { path: 'toGrid' as PathTimeZoneConversion, appointmentTimezone: 'America/Los_Angeles', timezone: 'common' },
      { path: 'toGrid' as PathTimeZoneConversion, appointmentTimezone: undefined, timezone: 'common' },
      { path: 'fromGrid' as PathTimeZoneConversion, appointmentTimezone: 'America/Los_Angeles', timezone: 'common' },
      { path: 'fromGrid' as PathTimeZoneConversion, appointmentTimezone: undefined, timezone: 'common' },
      { path: 'toAppointment' as PathTimeZoneConversion, appointmentTimezone: 'America/Los_Angeles', timezone: 'appointment' },
      { path: 'toAppointment' as PathTimeZoneConversion, appointmentTimezone: undefined, timezone: 'common' },
      { path: 'fromAppointment' as PathTimeZoneConversion, appointmentTimezone: 'America/Los_Angeles', timezone: 'appointment' },
      { path: 'fromAppointment' as PathTimeZoneConversion, appointmentTimezone: undefined, timezone: 'common' },
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

        calculator.createDate(sourceDate, { path, appointmentTimeZone: appointmentTimezone });

        expect(clientMock).toHaveBeenCalledTimes(3);
        expect(commonMock).toHaveBeenCalledTimes(timezone === 'common' ? 3 : 0);
        expect(appointmentMock).toHaveBeenCalledTimes(timezone === 'appointment' ? 3 : 0);
      });
    });

    it('createDate should throw error if wrong path', () => {
      const calculator = new TimeZoneCalculator(mock);

      expect(() => {
        calculator.createDate(
          sourceDate,
          {
            path: 'WrongPath' as PathTimeZoneConversion,
            appointmentTimeZone: 'America/Los_Angeles',
          },
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
