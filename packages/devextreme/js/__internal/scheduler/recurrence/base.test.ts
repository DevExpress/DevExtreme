import {
  describe, expect, it,
} from '@jest/globals';

import {
  getAsciiStringByDate,
  getDateByAsciiString,
  getRecurrenceString,
} from './base';

describe('recurrence base utils', () => {
  describe('getAsciiStringByDate', () => {
    it('should return equivalent ISO value', () => {
      const etalon = new Date(1997, 11, 23, 16);
      const expectedResult = etalon
        .toISOString()
        .replace(/[:-]/g, '')
        .replace('.000Z', 'Z');

      const result = getAsciiStringByDate(etalon);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getRecurrenceString', () => {
    it('should handle objects with freq', () => {
      const string = getRecurrenceString({
        freq: 'yearly',
        interval: 2,
      });

      expect(string).toEqual('FREQ=YEARLY;INTERVAL=2');
    });

    it('should handle objects with freq & interval', () => {
      const string = getRecurrenceString({
        freq: 'yearly',
        interval: 1,
      });

      expect(string).toEqual('FREQ=YEARLY');
    });

    it('should handle objects with freq & interval > 1', () => {
      const string = getRecurrenceString({
        freq: 'yearly',
        interval: 2,
      });

      expect(string).toEqual('FREQ=YEARLY;INTERVAL=2');
    });

    it('should handle objects without freq', () => {
      const string = getRecurrenceString({
        interval: 2,
      });

      expect(string).toEqual(undefined);
    });

    it('should handle objects with until', () => {
      const string = getRecurrenceString({
        freq: 'yearly',
        until: new Date(Date.UTC(2015, 6, 9)),
        interval: 1,
      });

      expect(string).toEqual('FREQ=YEARLY;UNTIL=20150709T000000Z');
    });

    it('should handle objects with each possible field', () => {
      const string = getRecurrenceString({
        freq: 'yearly',
        until: new Date(Date.UTC(2015, 6, 9)),
        interval: 1,
      });

      expect(string).toEqual('FREQ=YEARLY;UNTIL=20150709T000000Z');
    });

    it('should return string with freq ahead', () => {
      const string = getRecurrenceString({
        interval: 10,
        freq: 'monthly',
      });

      expect(string).toEqual('FREQ=MONTHLY;INTERVAL=10');
    });
  });

  describe('getDateByAsciiString', () => {
    it('should return a valid date for yyyyMMddThhmmss format', () => {
      const date = getDateByAsciiString('20150303T030000');

      expect(date).toEqual(new Date(2015, 2, 3, 3, 0));
    });

    it('should return a valid date for yyyyMMddTHHmmss format', () => {
      const date = getDateByAsciiString('20150303T173000');

      expect(date).toEqual(new Date(2015, 2, 3, 17, 30));
    });

    it('should return a valid date for yyyyMMdd format', () => {
      const date = getDateByAsciiString('20150303');

      expect(date).toEqual(new Date(2015, 2, 3));
    });

    it('should return a valid date for yyyyMMddTHHmmssZ format', () => {
      const date = getDateByAsciiString('20160711T230000Z');

      expect(date).toEqual(new Date(Date.UTC(2016, 6, 11, 23)));
    });

    [
      {
        value: '20160711T230000Z',
        date: new Date(Date.UTC(2016, 6, 11, 23, 0, 0)),
      }, {
        value: '20160711T230000',
        date: new Date(2016, 6, 11, 23, 0, 0),
      }, {
        value: '20160711',
        date: new Date(2016, 6, 11),
      },
    ].forEach((testCase) => {
      it(`should be return valid of date from '${testCase.value}'`, () => {
        const result = getDateByAsciiString(testCase.value);

        expect(result).toEqual(testCase.date);
      });
    });
  });
});
