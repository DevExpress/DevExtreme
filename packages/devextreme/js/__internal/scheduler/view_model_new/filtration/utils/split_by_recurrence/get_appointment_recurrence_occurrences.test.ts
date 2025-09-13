import {
  describe, expect, it,
} from '@jest/globals';

import { getAsciiStringByDate } from '../../../../recurrence/base';
import { getAppointmentRecurrenceOccurrences } from './get_appointment_recurrence_occurrences';

const options = {
  firstDayOfWeek: 3,
  interval: {
    min: Date.UTC(2000, 0, 10),
    max: Date.UTC(2000, 0, 15),
  },
  timeZone: 'America/Los_Angeles',
};

describe('getAppointmentRecurrenceOccurrences', () => {
  it('should return input appointment for not existed recurrence rule', () => {
    const appointment: any = {};
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
    )).toEqual([appointment]);
  });

  it('should return input appointment for invalid recurrence rule', () => {
    const appointment: any = { recurrenceRule: 'invalidRecurrenceRule' };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
    )).toEqual([appointment]);
  });

  it('should crop appointment occurrences by hours', () => {
    const appointment: any = {
      startDate: Date.UTC(2000, 0, 9, 20),
      endDate: Date.UTC(2000, 0, 9, 21),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      {
        firstDayOfWeek: 3,
        interval: {
          min: Date.UTC(2000, 0, 14, 10),
          max: Date.UTC(2000, 0, 15, 15),
        },
        timeZone: 'America/Los_Angeles',
      },
    )).toEqual([
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 14, 20),
        endDate: Date.UTC(2000, 0, 14, 21),
      },
    ]);
  });

  it('should not crop appointment occurrences by hours for full day interval', () => {
    const appointment: any = {
      startDate: Date.UTC(2000, 0, 9, 20),
      endDate: Date.UTC(2000, 0, 9, 21),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      {
        firstDayOfWeek: 3,
        interval: {
          min: Date.UTC(2000, 0, 14, 0),
          max: Date.UTC(2000, 0, 15, 24),
        },
        timeZone: 'America/Los_Angeles',
      },
    )).toEqual([
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 14, 20),
        endDate: Date.UTC(2000, 0, 14, 21),
      },
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 15, 20),
        endDate: Date.UTC(2000, 0, 15, 21),
      },
    ]);
  });

  it('should return appointment occurrences for appointment starts before view interval', () => {
    const appointment: any = {
      startDate: Date.UTC(2000, 0, 9, 10),
      endDate: Date.UTC(2000, 0, 9, 11),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
    )).toEqual([
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 10, 10),
        endDate: Date.UTC(2000, 0, 10, 11),
      },
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 11, 10),
        endDate: Date.UTC(2000, 0, 11, 11),
      },
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 12, 10),
        endDate: Date.UTC(2000, 0, 12, 11),
      },
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 13, 10),
        endDate: Date.UTC(2000, 0, 13, 11),
      },
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 14, 10),
        endDate: Date.UTC(2000, 0, 14, 11),
      },
    ]);
  });

  it('should return appointment occurrences for appointment starts inside view interval', () => {
    const appointment: any = {
      startDate: Date.UTC(2000, 0, 13, 10),
      endDate: Date.UTC(2000, 0, 13, 11),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
    )).toEqual([
      appointment,
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 14, 10),
        endDate: Date.UTC(2000, 0, 14, 11),
      },
    ]);
  });

  it('should return appointment occurrences for appointment starts after view interval', () => {
    const appointment: any = {
      startDate: Date.UTC(2000, 0, 20, 10),
      endDate: Date.UTC(2000, 0, 13, 11),
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
    )).toEqual([]);
  });

  it.each([
    { title: 'appointment', delta: 0 },
    { title: 'appointment occurrence', delta: -20 },
  ])('should return $title is hagging view interval', ({ delta }) => {
    const appointment: any = {
      startDate: Date.UTC(2000, 0, 9 + delta),
      endDate: Date.UTC(2000, 0, 16 + delta),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=20',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
    )).toEqual([{
      startDate: Date.UTC(2000, 0, 9),
      endDate: Date.UTC(2000, 0, 16),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=20',
    }]);
  });

  it.each([
    { title: 'appointment', delta: 0 },
    { title: 'appointment occurrence', delta: -10 },
  ])('should return $title starts before view interval', ({ delta }) => {
    const appointment: any = {
      startDate: Date.UTC(2000, 0, 9 + delta, 20),
      endDate: Date.UTC(2000, 0, 10 + delta, 10),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=10',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
    )).toEqual([{
      startDate: Date.UTC(2000, 0, 9, 20),
      endDate: Date.UTC(2000, 0, 10, 10),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=10',
    }]);
  });

  it('should return appointment occurrences for appointment with exceptions', () => {
    const exception1 = getAsciiStringByDate(
      new Date(Date.UTC(2000, 0, 11, 10)),
    );
    const exception2 = getAsciiStringByDate(
      new Date(Date.UTC(2000, 0, 12, 10)),
    );
    const exception3 = getAsciiStringByDate(
      new Date(Date.UTC(2000, 0, 13, 10)),
    );
    const appointment: any = {
      startDate: Date.UTC(2000, 0, 9, 10),
      endDate: Date.UTC(2000, 0, 9, 11),
      recurrenceException: `${exception1},${exception2},${exception3}`,
      recurrenceRule: 'FREQ=DAILY',
    };
    expect(getAppointmentRecurrenceOccurrences(
      appointment,
      options,
    )).toEqual([
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 10, 10),
        endDate: Date.UTC(2000, 0, 10, 11),
      },
      {
        ...appointment,
        startDate: Date.UTC(2000, 0, 14, 10),
        endDate: Date.UTC(2000, 0, 14, 11),
      },
    ]);
  });
});
