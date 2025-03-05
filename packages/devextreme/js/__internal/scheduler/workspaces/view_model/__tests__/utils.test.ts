import { describe, expect } from '@jest/globals';
import each from 'jest-each';

import {
  alignToFirstDayOfWeek,
  alignToLastDayOfWeek,
  calculateAlignedWeeksBetweenDates,
  calculateDaysBetweenDates,
} from '../m_utils';

/*

Calendar for 2023-06 for easier test cases understanding:

mon tue wed thu fri sat sun
             1   2   3   4
 5   6   7   8   9   10  11
 12  13  14  15  16  17  18
 19  20  21  22  23  24  25
 26  27  28  29  30

*/

describe('alignToFirstDayOfWeek', () => {
  each`
        date                      | firstDayOfWeek
        ${new Date('2023-06-26')} | ${1}
        ${new Date('2023-06-25')} | ${0}
    `.it('should return the same value if date is first day of week', ({
            date, firstDayOfWeek,
          }) => {
            const resultDate = alignToFirstDayOfWeek(date, firstDayOfWeek);
            expect(resultDate).toEqual(date);
          });

  each`
        date                      | rightDate                 | firstDayOfWeek
        ${new Date('2023-06-29')} | ${new Date('2023-06-26')} | ${1}
        ${new Date('2023-06-27')} | ${new Date('2023-06-26')} | ${1}
        ${new Date('2023-06-30')} | ${new Date('2023-06-26')} | ${1}

        ${new Date('2023-06-25')} | ${new Date('2023-06-19')} | ${1}

        ${new Date('2023-06-26')} | ${new Date('2023-06-25')} | ${0}
    `.it('should return first day of current week', ({
            date, rightDate, firstDayOfWeek,
          }) => {
            const resultDate = alignToFirstDayOfWeek(date, firstDayOfWeek);
            expect(resultDate).toEqual(rightDate);
          });
});

describe('alignToLastDayOfWeek', () => {
  each`
        date                      | firstDayOfWeek
        ${new Date('2023-06-25')} | ${1}
        ${new Date('2023-06-24')} | ${0}
    `.it('should return the same value if date is last day of week', ({
            date, firstDayOfWeek,
          }) => {
            const resultDate = alignToLastDayOfWeek(date, firstDayOfWeek);
            expect(resultDate).toEqual(date);
          });

  each`
        date                      | rightDate                 | firstDayOfWeek
        ${new Date('2023-06-12')} | ${new Date('2023-06-18')} | ${1}
        ${new Date('2023-06-14')} | ${new Date('2023-06-18')} | ${1}
        ${new Date('2023-06-16')} | ${new Date('2023-06-18')} | ${1}

        ${new Date('2023-06-21')} | ${new Date('2023-06-25')} | ${1}
    `.it('should return last day of current week', ({
            date, rightDate, firstDayOfWeek,
          }) => {
            const resultDate = alignToLastDayOfWeek(date, firstDayOfWeek);
            expect(resultDate).toEqual(rightDate);
          });
});

describe('calculateDaysBetweenDates', () => {
  each`
        fromDate                  | toDate                     | res
        ${new Date('2023-06-28')} | ${new Date('2023-06-28')}  | ${1}
        ${new Date('2023-06-28')} | ${new Date('2023-06-29')}  | ${2}
        ${new Date('2023-06-28')} | ${new Date('2023-07-04')}  | ${7}
    `.it('should return right count of days between dates', ({
            fromDate, toDate, res,
          }) => {
            expect(calculateDaysBetweenDates(fromDate, toDate)).toBe(res);
          });

  each`
        fromDate                  | toDate                     | res
        ${new Date('2023-06-28T23:59:00')} | ${new Date('2023-06-29T00:01:00')}  | ${2}
        ${new Date('2023-06-28T00:01:00')} | ${new Date('2023-06-28T23:59:00')}  | ${1}
    `.it('should return right count of days between dates when they have non-zero time', ({
            fromDate, toDate, res,
          }) => {
            expect(calculateDaysBetweenDates(fromDate, toDate)).toBe(res);
          });
});

describe('calculateAlignedWeeksBetweenDates', () => {
  each`
        fromDate                  | toDate                     | res
        ${new Date('2023-10-01')} | ${new Date('2023-10-31')}  | ${6}
        ${new Date('2023-06-01')} | ${new Date('2023-07-31')}  | ${10}
    `.it('should return right count of days between dates', ({
            fromDate, toDate, res,
          }) => {
            expect(calculateAlignedWeeksBetweenDates(fromDate, toDate, 1)).toBe(res);
          });

  each`
        fromDate                  | toDate                     | res
        ${new Date('2023-06-04')} | ${new Date('2023-06-12')}  | ${6}
        ${new Date('2023-06-05')} | ${new Date('2023-06-12')}  | ${6}
        ${new Date('2023-06-05')} | ${new Date('2023-06-11')}  | ${6}
    `.it('should return at least 6 weeks in order to not make breaking change', ({
            fromDate, toDate, res,
          }) => {
            expect(calculateAlignedWeeksBetweenDates(fromDate, toDate, 1)).toBe(res);
          });
});
