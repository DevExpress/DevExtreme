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
const HOUR_MS = 3600_000;

describe('getAppointmentRecurrenceOccurrences', () => {
  describe('without recurrence rule', () => {
    it('should return shift appointment according to timeZone', () => {
      const appointment: any = {
        source: {
          startDate: Date.UTC(2000, 0, 10, 10),
          endDate: Date.UTC(2000, 0, 10, 11),
        },
      };

      expect(getAppointmentRecurrenceOccurrences(
        appointment,
        options,
      )).toEqual([{
        ...appointment,
        startDateUTC: appointment.source.startDate - HOUR_MS * 8,
        endDateUTC: appointment.source.endDate - HOUR_MS * 8,
      }]);
    });

    it('should return shift appointment according to timeZone cross summer DST', () => {
      const appointment: any = {
        source: {
          startDate: Date.UTC(2025, 2, 9, 1),
          endDate: Date.UTC(2025, 2, 9, 4),
        },
      };

      expect(getAppointmentRecurrenceOccurrences(
        appointment,
        options,
      )).toEqual([{
        ...appointment,
        startDateUTC: appointment.source.startDate - HOUR_MS * 8,
        endDateUTC: appointment.source.endDate - HOUR_MS * 8,
      }]);
    });

    it('should return shift appointment according to timeZone cross winter DST', () => {
      const appointment: any = {
        source: {
          startDate: Date.UTC(2025, 10, 2, 1),
          endDate: Date.UTC(2025, 10, 2, 4),
        },
      };

      expect(getAppointmentRecurrenceOccurrences(
        appointment,
        options,
      )).toEqual([{
        ...appointment,
        startDateUTC: appointment.source.startDate - HOUR_MS * 7,
        endDateUTC: appointment.source.endDate - HOUR_MS * 7,
      }]);
    });

    it('should return shift appointment according to timeZone in unreachable time', () => {
      const appointment: any = {
        source: {
          startDate: Date.UTC(2025, 2, 9, 2, 15),
          endDate: Date.UTC(2025, 2, 9, 3, 45),
        },
      };

      expect(getAppointmentRecurrenceOccurrences(
        appointment,
        options,
      )).toEqual([{
        ...appointment,
        startDateUTC: appointment.source.startDate - HOUR_MS * 8,
        endDateUTC: appointment.source.endDate - HOUR_MS * 8,
      }]);
    });
  });

  describe('with recurrence rule', () => {
    it('should return the same source in any timezone if appointment timezone set', () => {
      const appointment: any = {
        source: {
          startDate: Date.UTC(2025, 0, 7, 1),
          endDate: Date.UTC(2025, 0, 7, 2),
        },
        startDateTimeZone: 'America/Chicago',
        endDateTimeZone: 'America/Chicago',
        recurrenceRule: 'FREQ=DAILY',
        hasRecurrenceRule: true,
      };
      const getSources = (date: number, timeZone: string) => {
        const dateCopy = new Date(date);
        return getAppointmentRecurrenceOccurrences(
          appointment,
          {
            interval: {
              min: dateCopy.setDate(dateCopy.getDate() - 2),
              max: dateCopy.setDate(dateCopy.getDate() + 2),
            },
            timeZone,
          },
        ).map((item) => ({
          startDate: new Date(item.source.startDate).toUTCString(),
          endDate: new Date(item.source.endDate).toUTCString(),
        }));
      };

      const sourcesChicago = [
        ...getSources(Date.UTC(2025, 1), 'America/Chicago'),
        ...getSources(Date.UTC(2025, 6), 'America/Chicago'),
        ...getSources(Date.UTC(2025, 11), 'America/Chicago'),
      ];
      const sourcesSydney = [
        ...getSources(Date.UTC(2025, 1) + 24 * HOUR_MS, 'Australia/Sydney'),
        ...getSources(Date.UTC(2025, 6) + 24 * HOUR_MS, 'Australia/Sydney'),
        ...getSources(Date.UTC(2025, 11) + 24 * HOUR_MS, 'Australia/Sydney'),
      ];
      const sourcesBelgrade = [
        ...getSources(Date.UTC(2025, 1) + 24 * HOUR_MS, 'Europe/Belgrade'),
        ...getSources(Date.UTC(2025, 6) + 24 * HOUR_MS, 'Europe/Belgrade'),
        ...getSources(Date.UTC(2025, 11) + 24 * HOUR_MS, 'Europe/Belgrade'),
      ];

      expect(sourcesChicago).toEqual(sourcesSydney);
      expect(sourcesChicago).toEqual(sourcesBelgrade);
    });

    it('should return appointment occurrences for appointment starts before view interval', () => {
      const appointment: any = {
        source: {
          startDate: Date.UTC(2000, 0, 9, 10),
          endDate: Date.UTC(2000, 0, 9, 11),
        },
        recurrenceRule: 'FREQ=DAILY',
        hasRecurrenceRule: true,
      };
      expect(getAppointmentRecurrenceOccurrences(
        appointment,
        options,
      )).toEqual([
        {
          ...appointment,
          source: {
            startDate: Date.UTC(2000, 0, 10, 10),
            endDate: Date.UTC(2000, 0, 10, 11),
          },
          startDateUTC: Date.UTC(2000, 0, 10, 10) - HOUR_MS * 8,
          endDateUTC: Date.UTC(2000, 0, 10, 11) - HOUR_MS * 8,
        },
        {
          ...appointment,
          source: {
            startDate: Date.UTC(2000, 0, 11, 10),
            endDate: Date.UTC(2000, 0, 11, 11),
          },
          startDateUTC: Date.UTC(2000, 0, 11, 10) - HOUR_MS * 8,
          endDateUTC: Date.UTC(2000, 0, 11, 11) - HOUR_MS * 8,
        },
        {
          ...appointment,
          source: {
            startDate: Date.UTC(2000, 0, 12, 10),
            endDate: Date.UTC(2000, 0, 12, 11),
          },
          startDateUTC: Date.UTC(2000, 0, 12, 10) - HOUR_MS * 8,
          endDateUTC: Date.UTC(2000, 0, 12, 11) - HOUR_MS * 8,
        },
        {
          ...appointment,
          source: {
            startDate: Date.UTC(2000, 0, 13, 10),
            endDate: Date.UTC(2000, 0, 13, 11),
          },
          startDateUTC: Date.UTC(2000, 0, 13, 10) - HOUR_MS * 8,
          endDateUTC: Date.UTC(2000, 0, 13, 11) - HOUR_MS * 8,
        },
        {
          ...appointment,
          source: {
            startDate: Date.UTC(2000, 0, 14, 10),
            endDate: Date.UTC(2000, 0, 14, 11),
          },
          startDateUTC: Date.UTC(2000, 0, 14, 10) - HOUR_MS * 8,
          endDateUTC: Date.UTC(2000, 0, 14, 11) - HOUR_MS * 8,
        },
      ]);
    });

    it('should return appointment occurrences for appointment starts inside view interval', () => {
      const appointment: any = {
        source: {
          startDate: Date.UTC(2000, 0, 13, 10),
          endDate: Date.UTC(2000, 0, 13, 11),
        },
        recurrenceRule: 'FREQ=DAILY',
        hasRecurrenceRule: true,
      };
      expect(getAppointmentRecurrenceOccurrences(
        appointment,
        options,
      )).toEqual([
        {
          ...appointment,
          startDateUTC: Date.UTC(2000, 0, 13, 10) - HOUR_MS * 8,
          endDateUTC: Date.UTC(2000, 0, 13, 11) - HOUR_MS * 8,
        },
        {
          ...appointment,
          source: {
            startDate: Date.UTC(2000, 0, 14, 10),
            endDate: Date.UTC(2000, 0, 14, 11),
          },
          startDateUTC: Date.UTC(2000, 0, 14, 10) - HOUR_MS * 8,
          endDateUTC: Date.UTC(2000, 0, 14, 11) - HOUR_MS * 8,
        },
      ]);
    });

    it('should return appointment occurrences for appointment starts after view interval', () => {
      const appointment: any = {
        source: {
          startDate: Date.UTC(2000, 0, 20, 10),
          endDate: Date.UTC(2000, 0, 13, 11),
        },
        recurrenceRule: 'FREQ=DAILY',
        hasRecurrenceRule: true,
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
        source: {
          startDate: Date.UTC(2000, 0, 9 + delta),
          endDate: Date.UTC(2000, 0, 16 + delta),
        },
        recurrenceRule: 'FREQ=DAILY;INTERVAL=20',
        hasRecurrenceRule: true,
      };
      expect(getAppointmentRecurrenceOccurrences(
        appointment,
        options,
      )).toEqual([{
        ...appointment,
        source: {
          startDate: Date.UTC(2000, 0, 9),
          endDate: Date.UTC(2000, 0, 16),
        },
        startDateUTC: Date.UTC(2000, 0, 9) - HOUR_MS * 8,
        endDateUTC: Date.UTC(2000, 0, 16) - HOUR_MS * 8,
      }]);
    });

    it.each([
      { title: 'appointment', delta: 0 },
      { title: 'appointment occurrence', delta: -10 },
    ])('should return $title starts before view interval', ({ delta }) => {
      const appointment: any = {
        source: {
          startDate: Date.UTC(2000, 0, 9 + delta, 20),
          endDate: Date.UTC(2000, 0, 10 + delta, 10),
        },
        recurrenceRule: 'FREQ=DAILY;INTERVAL=10',
        hasRecurrenceRule: true,
      };
      expect(getAppointmentRecurrenceOccurrences(
        appointment,
        options,
      )).toEqual([{
        ...appointment,
        source: {
          startDate: Date.UTC(2000, 0, 9, 20),
          endDate: Date.UTC(2000, 0, 10, 10),
        },
        startDateUTC: Date.UTC(2000, 0, 9, 20) - HOUR_MS * 8,
        endDateUTC: Date.UTC(2000, 0, 10, 10) - HOUR_MS * 8,
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
        source: {
          startDate: Date.UTC(2000, 0, 9, 10),
          endDate: Date.UTC(2000, 0, 9, 11),
        },
        recurrenceException: `${exception1},${exception2},${exception3}`,
        recurrenceRule: 'FREQ=DAILY',
        hasRecurrenceRule: true,
      };
      expect(getAppointmentRecurrenceOccurrences(
        appointment,
        options,
      )).toEqual([
        {
          ...appointment,
          source: {
            startDate: Date.UTC(2000, 0, 10, 10),
            endDate: Date.UTC(2000, 0, 10, 11),
          },
          startDateUTC: Date.UTC(2000, 0, 10, 10) - HOUR_MS * 8,
          endDateUTC: Date.UTC(2000, 0, 10, 11) - HOUR_MS * 8,
        },
        {
          ...appointment,
          source: {
            startDate: Date.UTC(2000, 0, 14, 10),
            endDate: Date.UTC(2000, 0, 14, 11),
          },
          startDateUTC: Date.UTC(2000, 0, 14, 10) - HOUR_MS * 8,
          endDateUTC: Date.UTC(2000, 0, 14, 11) - HOUR_MS * 8,
        },
      ]);
    });
  });
});
