import {
  describe, expect, it,
} from '@jest/globals';

import { getRecurrenceProcessor } from '../../m_recurrence';
import { createTimeZoneCalculator } from '../../r1/timezone_calculator';
import { getAppointmentRecurrenceOccurrences } from './get_appointment_recurrence_occurrences';

const options = {
  firstDayOfWeek: 3,
  interval: {
    min: new Date(2000, 0, 10).getTime(),
    max: new Date(2000, 0, 15).getTime(),
  },
};
const mockTimeZoneCalculator = createTimeZoneCalculator(
  Intl.DateTimeFormat().resolvedOptions().timeZone,
);

describe('getAppointmentRecurrenceOccurrences', () => {
  it('should return input appointment for not existed recurrence rule', () => {
    const appointment: any = {};
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([appointment]);
  });

  it('should return input appointment for invalid recurrence rule', () => {
    const appointment: any = { recurrenceRule: 'invalidRecurrenceRule' };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([appointment]);
  });

  it('should crop appointment occurrences by hours', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 9, 20).getTime(),
      endDate: new Date(2000, 0, 9, 21).getTime(),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      {
        firstDayOfWeek: 3,
        interval: {
          min: new Date(2000, 0, 14, 10).getTime(),
          max: new Date(2000, 0, 15, 15).getTime(),
        },
      },
      mockTimeZoneCalculator,
    )).toEqual([
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 20).getTime(),
        endDate: new Date(2000, 0, 14, 21).getTime(),
      },
    ]);
  });

  it('should not crop appointment occurrences by hours for full day interval', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 9, 20).getTime(),
      endDate: new Date(2000, 0, 9, 21).getTime(),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      {
        firstDayOfWeek: 3,
        interval: {
          min: new Date(2000, 0, 14, 0).getTime(),
          max: new Date(2000, 0, 15, 24).getTime(),
        },
      },
      mockTimeZoneCalculator,
    )).toEqual([
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 20).getTime(),
        endDate: new Date(2000, 0, 14, 21).getTime(),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 15, 20).getTime(),
        endDate: new Date(2000, 0, 15, 21).getTime(),
      },
    ]);
  });

  it('should return appointment occurrences for appointment starts before view interval', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 9, 10).getTime(),
      endDate: new Date(2000, 0, 9, 11).getTime(),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([
      {
        ...appointment,
        startDate: new Date(2000, 0, 10, 10).getTime(),
        endDate: new Date(2000, 0, 10, 11).getTime(),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 11, 10).getTime(),
        endDate: new Date(2000, 0, 11, 11).getTime(),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 12, 10).getTime(),
        endDate: new Date(2000, 0, 12, 11).getTime(),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 13, 10).getTime(),
        endDate: new Date(2000, 0, 13, 11).getTime(),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 10).getTime(),
        endDate: new Date(2000, 0, 14, 11).getTime(),
      },
    ]);
  });

  it('should return appointment occurrences for appointment starts inside view interval', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 13, 10).getTime(),
      endDate: new Date(2000, 0, 13, 11).getTime(),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([
      appointment,
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 10).getTime(),
        endDate: new Date(2000, 0, 14, 11).getTime(),
      },
    ]);
  });

  it('should return appointment occurrences for appointment starts after view interval', () => {
    const appointment: any = {
      startDate: new Date(2000, 0, 20, 10).getTime(),
      endDate: new Date(2000, 0, 13, 11).getTime(),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([]);
  });

  it.each([
    { title: 'appointment', delta: 0 },
    { title: 'appointment occurrence', delta: -20 },
  ])('should return $title is hagging view interval', ({ delta }) => {
    const appointment: any = {
      startDate: new Date(2000, 0, 9 + delta).getTime(),
      endDate: new Date(2000, 0, 16 + delta).getTime(),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=20',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([{
      startDate: new Date(2000, 0, 9).getTime(),
      endDate: new Date(2000, 0, 16).getTime(),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=20',
    }]);
  });

  it.each([
    { title: 'appointment', delta: 0 },
    { title: 'appointment occurrence', delta: -10 },
  ])('should return $title starts before view interval', ({ delta }) => {
    const appointment: any = {
      startDate: new Date(2000, 0, 9 + delta, 20).getTime(),
      endDate: new Date(2000, 0, 10 + delta, 10).getTime(),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=10',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([{
      startDate: new Date(2000, 0, 9, 20).getTime(),
      endDate: new Date(2000, 0, 10, 10).getTime(),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=10',
    }]);
  });

  it('should return appointment occurrences for appointment with exceptions', () => {
    const exception1 = getRecurrenceProcessor().getAsciiStringByDate(new Date(2000, 0, 11, 10));
    const exception2 = getRecurrenceProcessor().getAsciiStringByDate(new Date(2000, 0, 12, 10));
    const exception3 = getRecurrenceProcessor().getAsciiStringByDate(new Date(2000, 0, 13, 10));
    const appointment: any = {
      startDate: new Date(2000, 0, 9, 10).getTime(),
      endDate: new Date(2000, 0, 9, 11).getTime(),
      recurrenceException: `${exception1},${exception2},${exception3}`,
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
      mockTimeZoneCalculator,
    )).toEqual([
      {
        ...appointment,
        startDate: new Date(2000, 0, 10, 10).getTime(),
        endDate: new Date(2000, 0, 10, 11).getTime(),
      },
      {
        ...appointment,
        startDate: new Date(2000, 0, 14, 10).getTime(),
        endDate: new Date(2000, 0, 14, 11).getTime(),
      },
    ]);
  });
});
