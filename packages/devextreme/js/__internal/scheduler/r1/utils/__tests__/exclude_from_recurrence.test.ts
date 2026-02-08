import { describe, expect, it } from '@jest/globals';
import { mockAppointmentDataAccessor } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';

import { excludeFromRecurrence } from '../index';

describe('excludeFromRecurrence', () => {
  [
    {
      allDay: true,
      recurrenceException: undefined,
      expected: '20220515T122500Z',
    },
    {
      allDay: true,
      recurrenceException: '20220615T181800Z',
      expected: '20220615T181800Z,20220515T122500Z',
    },
    {
      allDay: false,
      recurrenceException: undefined,
      expected: '20220515T181800Z',
    },
    {
      allDay: false,
      recurrenceException: '20220615T181800Z',
      expected: '20220615T181800Z,20220515T181800Z',
    },
  ].forEach(({ allDay, recurrenceException, expected }) => {
    it(`should return correct result if "allDay"=${allDay}, "recurrenceException"=${recurrenceException}`, () => {
      const exceptionDate = new Date('2022-05-15T18:18:00.00Z');
      const result = excludeFromRecurrence(
        {
          text: 'test appointment',
          allDay,
          startDate: new Date('2022-04-18T12:25:00.00Z'),
          endDate: new Date('2022-03-18T13:26:00.00Z'),
          recurrenceException,
        },
        exceptionDate,
        mockAppointmentDataAccessor,
      );

      expect(result.recurrenceException)
        .toBe(expected);
    });
  });

  it('should return correct result if exception date has no hours', () => {
    const exceptionDate = new Date('2022-05-15T00:00:00.00Z');
    const result = excludeFromRecurrence(
      {
        text: 'test appointment',
        startDate: new Date(2022, 3, 18, 12, 25),
        endDate: new Date(2022, 3, 18, 13, 26),
      },
      exceptionDate,
      mockAppointmentDataAccessor,
    );

    expect(result.recurrenceException)
      .toBe('20220515T000000Z');
  });
});
