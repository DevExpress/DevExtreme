"use strict";

var _date = _interopRequireDefault(require("../../../../../core/utils/date"));
var _calculator = require("../calculator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
describe('TimeZoneCalculator', () => {
  describe('General tests', () => {
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const commonOffset = 15;
    const appointmentOffset = 7.5;
    const sourceDate = new Date(2020, 6, 6, 18, 0);
    const mock = {
      getClientOffset: () => localOffset,
      tryGetCommonOffset: () => commonOffset,
      tryGetAppointmentOffset: () => appointmentOffset
    };
    ['Grid', 'Appointment'].forEach(path => {
      test(`converting operations with '${path}' should be symmetrical`, () => {
        const calculator = new _calculator.TimeZoneCalculator(mock);
        const convertedDate = calculator.createDate(sourceDate, {
          path: `to${path}`
        });
        const convertedDateBack = calculator.createDate(convertedDate, {
          path: `from${path}`
        });
        expect(convertedDate.getTime() !== sourceDate.getTime())
        // eslint-disable-next-line spellcheck/spell-checker
        .toBeTruthy();
        expect(sourceDate.getTime() === convertedDateBack.getTime())
        // eslint-disable-next-line spellcheck/spell-checker
        .toBeTruthy();
      });
    });
    ['America/Los_Angeles', undefined].forEach(appointmentTimezone => {
      ['toGrid', 'fromGrid'].forEach(path => {
        test(`should use common time zone [path: ${path}
        if converting to common timezone, appointmentTimezone: ${appointmentTimezone}]`, () => {
          const calculator = new _calculator.TimeZoneCalculator(mock);
          const spy = jest.spyOn(calculator, 'getConvertedDateByOffsets');
          calculator.createDate(sourceDate, {
            path: path,
            appointmentTimeZone: appointmentTimezone
          });
          expect(spy).toBeCalledTimes(1);
          const isBackDirection = path === 'fromGrid';
          expect(spy).toBeCalledWith(sourceDate, -localOffset / _date.default.dateToMilliseconds('hour'), commonOffset, isBackDirection);
        });
      });
    });
    ['America/Los_Angeles', undefined].forEach(appointmentTimezone => {
      ['toAppointment', 'fromAppointment'].forEach(path => {
        test(`if converting to appointment timezone, should use appointment time zone
              [path: ${path}, appointmentTimezone: ${appointmentTimezone}]`, () => {
          const calculator = new _calculator.TimeZoneCalculator(mock);
          const spy = jest.spyOn(calculator, 'getConvertedDateByOffsets');
          calculator.createDate(sourceDate, {
            path: path,
            appointmentTimeZone: appointmentTimezone
          });
          expect(spy).toBeCalledTimes(1);
          const isBackDirectionArg = path === 'fromAppointment';
          const commonOffsetArg = appointmentTimezone === undefined ? commonOffset : appointmentOffset;
          expect(spy).toBeCalledWith(sourceDate, -localOffset / _date.default.dateToMilliseconds('hour'), commonOffsetArg, isBackDirectionArg);
        });
      });
      test('createDate should throw error if wrong path', () => {
        const calculator = new _calculator.TimeZoneCalculator(mock);
        expect(() => {
          calculator.createDate(sourceDate, {
            path: 'WrongPath',
            appointmentTimeZone: appointmentTimezone
          });
        }).toThrow('not specified pathTimeZoneConversion');
      });
    });
  });
  describe('getOriginStartDateOffsetInMs method', () => {
    const minutesInMs = 60000;
    const hoursInMs = 60 * minutesInMs;
    const clientOffset = -7;
    const commonOffset = -5;
    const appointmentOffset = 6;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let calculator;
    beforeEach(() => {
      calculator = new _calculator.TimeZoneCalculator({
        getClientOffset: () => -1 * clientOffset * hoursInMs,
        tryGetCommonOffset: () => commonOffset,
        tryGetAppointmentOffset: () => appointmentOffset
      });
    });
    test('should return correct offset for not utc date if appointment timezone set', () => {
      const expectedOffset = (appointmentOffset - commonOffset) * hoursInMs;
      const testDate = new Date(2021, 1, 1, 10, 0, 0);
      const result = calculator.getOriginStartDateOffsetInMs(testDate, 'test', false);
      expect(result).toEqual(expectedOffset);
    });
    test('should return correct offset for utc date if appointment timezone set', () => {
      const expectedOffset = (appointmentOffset - clientOffset) * hoursInMs;
      const testDate = new Date(2021, 1, 1, 10, 0, 0);
      const result = calculator.getOriginStartDateOffsetInMs(testDate, 'test', true);
      expect(result).toEqual(expectedOffset);
    });
    test('should return correct offset for utc date if appointment timezone not set', () => {
      const expectedOffset = (commonOffset - clientOffset) * hoursInMs;
      const testDate = new Date(2021, 1, 1, 10, 0, 0);
      const result = calculator.getOriginStartDateOffsetInMs(testDate, undefined, true);
      expect(result).toEqual(expectedOffset);
    });
    test('should return zero offset for not utc date if appointment timezone not set', () => {
      const expectedOffset = 0;
      const testDate = new Date(2021, 1, 1, 10, 0, 0);
      const result = calculator.getOriginStartDateOffsetInMs(testDate, undefined, false);
      expect(result).toEqual(expectedOffset);
    });
  });
});