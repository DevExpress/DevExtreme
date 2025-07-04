import {
  describe, expect, it,
} from '@jest/globals';

import { getRecurrenceProcessor } from '../../../m_recurrence';
import { createTimeZoneCalculator } from '../../../r1/timezone_calculator';
import { getAppointmentsOccurrences } from './getAppointmentsOccurrences';

const options = {
  firstDayOfWeek: 3,
  interval: {
    min: new Date(2000, 0, 10),
    max: new Date(2000, 0, 15),
  },
};
const mockTimeZoneCalculator = createTimeZoneCalculator(
  Intl.DateTimeFormat().resolvedOptions().timeZone,
);

describe('getAppointmentsOccurrences', () => {
  it('should return input appointment for not existed recurrence rule', () => {
    const appointment: any = {};
    expect(getAppointmentsOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([appointment]);
  });

  it('should return input appointment for invalid recurrence rule', () => {
    const appointment: any = { recurrenceRule: 'invalidRecurrenceRule' };
    expect(getAppointmentsOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([appointment]);
  });

  it('should crop appointment occurrences by hours', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 9, 20),
      endDate: new Date(2000, 0, 9, 21),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentsOccurrences(
      appointment,
      {
        firstDayOfWeek: 3,
        interval: {
          min: new Date(2000, 0, 14, 10),
          max: new Date(2000, 0, 15, 15),
        },
      },
      mockTimeZoneCalculator,
    )).toEqual([
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 20),
        endDate: new Date(2000, 0, 14, 21),
      },
    ]);
  });

  it('should not crop appointment occurrences by hours for full day interval', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 9, 20),
      endDate: new Date(2000, 0, 9, 21),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentsOccurrences(
      appointment,
      {
        firstDayOfWeek: 3,
        interval: {
          min: new Date(2000, 0, 14, 0),
          max: new Date(2000, 0, 15, 24),
        },
      },
      mockTimeZoneCalculator,
    )).toEqual([
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 20),
        endDate: new Date(2000, 0, 14, 21),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 15, 20),
        endDate: new Date(2000, 0, 15, 21),
      },
    ]);
  });

  it('should return appointment occurrences for appointment starts before view interval', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 9, 10),
      endDate: new Date(2000, 0, 9, 11),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentsOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([
      {
        ...appointment,
        startDate: new Date(2000, 0, 10, 10),
        endDate: new Date(2000, 0, 10, 11),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 11, 10),
        endDate: new Date(2000, 0, 11, 11),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 12, 10),
        endDate: new Date(2000, 0, 12, 11),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 13, 10),
        endDate: new Date(2000, 0, 13, 11),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 10),
        endDate: new Date(2000, 0, 14, 11),
      },
    ]);
  });

  it('should return appointment occurrences for appointment starts inside view interval', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 13, 10),
      endDate: new Date(2000, 0, 13, 11),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentsOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([
      appointment,
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 10),
        endDate: new Date(2000, 0, 14, 11),
      },
    ]);
  });

  it('should return appointment occurrences for appointment starts after view interval', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 20, 10),
      endDate: new Date(2000, 0, 13, 11),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentsOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([]);
  });

  it('should return appointment occurrences for appointment with exceptions', () => {
    const exception1 = getRecurrenceProcessor().getAsciiStringByDate(new Date(2000, 0, 11, 10));
    const exception2 = getRecurrenceProcessor().getAsciiStringByDate(new Date(2000, 0, 12, 10));
    const exception3 = getRecurrenceProcessor().getAsciiStringByDate(new Date(2000, 0, 13, 10));
    const appointment: any = {
      startDate: new Date(2000, 0, 9, 10),
      endDate: new Date(2000, 0, 9, 11),
      recurrenceException: `${exception1},${exception2},${exception3}`,
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentsOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([
      {
        ...appointment,
        startDate: new Date(2000, 0, 10, 10),
        endDate: new Date(2000, 0, 10, 11),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 10),
        endDate: new Date(2000, 0, 14, 11),
      },
    ]);
  });
});
