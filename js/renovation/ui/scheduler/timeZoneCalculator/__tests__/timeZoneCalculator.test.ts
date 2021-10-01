import { TimeZoneCalculator } from '../utils';
import { PathTimeZoneConversion, TimeZoneCalculatorOptions } from '../types';
import dateUtils from '../../../../../core/utils/date';

describe('TimeZoneCalculator', () => {
  const localOffset = new Date().getTimezoneOffset() * 60000;
  const commonOffset = 15;
  const appointmentOffset = 7.5;

  const sourceDate = new Date(2020, 6, 6, 18, 0);

  const mock: TimeZoneCalculatorOptions = {
    getClientOffset: () => localOffset,
    getCommonOffset: () => commonOffset,
    getAppointmentOffset: () => appointmentOffset,
  };

  ['Grid', 'Appointment'].forEach((path) => {
    test(`converting operations with '${path}' should be symmetrical`, () => {
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
    'America/Los_Angeles',
    undefined,
  ].forEach((appointmentTimezone) => {
    ['toGrid', 'fromGrid'].forEach((path) => {
      test(`should use common time zone [path: ${path}
        if converting to common timezone, appointmentTimezone: ${appointmentTimezone}]`, () => {
        const calculator = new TimeZoneCalculator(mock);

        const spy = jest.spyOn(calculator, 'getConvertedDateByOffsets');

        calculator.createDate(
          sourceDate,
          {
            path: path as PathTimeZoneConversion,
            appointmentTimeZone: appointmentTimezone,
          },
        );

        expect(spy)
          .toBeCalledTimes(1);

        const isBackDirection = path === 'fromGrid';

        expect(spy)
          .toBeCalledWith(
            sourceDate,
            -localOffset / dateUtils.dateToMilliseconds('hour'),
            commonOffset,
            isBackDirection,
          );
      });
    });
  });

  [
    'America/Los_Angeles',
    undefined,
  ].forEach((appointmentTimezone) => {
    [
      'toAppointment',
      'fromAppointment',
    ].forEach((path) => {
      test(`if converting to appointment timezone, should use appointment time zone
              [path: ${path}, appointmentTimezone: ${appointmentTimezone}]`, () => {
        const calculator = new TimeZoneCalculator(mock);

        const spy = jest.spyOn(calculator, 'getConvertedDateByOffsets');

        calculator.createDate(
          sourceDate,
          {
            path: path as PathTimeZoneConversion,
            appointmentTimeZone: appointmentTimezone,
          },
        );

        expect(spy)
          .toBeCalledTimes(1);

        const isBackDirectionArg = path === 'fromAppointment';
        const commonOffsetArg = appointmentTimezone === undefined
          ? commonOffset
          : appointmentOffset;

        expect(spy)
          .toBeCalledWith(
            sourceDate,
            -localOffset / dateUtils.dateToMilliseconds('hour'),
            commonOffsetArg,
            isBackDirectionArg,
          );
      });
    });

    test('createDate should throw error if wrong path', () => {
      const calculator = new TimeZoneCalculator(mock);

      expect(() => {
        calculator.createDate(
          sourceDate,
          {
            path: 'WrongPath' as PathTimeZoneConversion,
            appointmentTimeZone: appointmentTimezone,
          },
        );
      })
        .toThrow('not specified pathTimeZoneConversion');
    });
  });
});
