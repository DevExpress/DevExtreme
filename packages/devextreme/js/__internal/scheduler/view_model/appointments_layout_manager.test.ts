import { describe, expect, it } from '@jest/globals';

import { getSchedulerMock } from './__mock__/scheduler.mock';
import AppointmentLayoutManager from './appointments_layout_manager';

const defaultOptions = {
  type: 'week',
  startDayHour: 9,
  endDayHour: 18,
  offsetMinutes: 0,
};

describe('getOccurrences', () => {
  describe('common appointments', () => {
    it('should return occurrence', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        appointmentData: { ...appointment },
      }]);
    });

    it('should return occurrences with extra field', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        customField: 'custom value',
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        appointmentData: { ...appointment },
      }]);
    });

    it('should return occurrences if appointment intersects partially', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T18:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T12:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        appointmentData: { ...appointment },
      }]);
    });

    it('should return occurrences if interval is in appointment', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T18:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T07:00:00Z'),
        new Date('2000-01-01T12:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        appointmentData: { ...appointment },
      }]);
    });

    it('should not return occurrences out of interval - 1', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-03T06:00:00Z'),
        endDate: new Date('2000-01-03T07:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });

    it('should not return occurrences out of interval - 2', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-02T00:01:00Z'),
        endDate: new Date('2000-01-02T01:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });

    it('should not return occurrences out of interval - 3', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T23:00:00Z'),
        endDate: new Date('2000-01-01T23:59:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-02T00:00:00Z'),
        new Date('2000-01-03T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });

    it('should return occurrences if scheduler has skipped days, and appointment intersects with them', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock({
        ...defaultOptions,
        skippedDays: [0, 6],
      }));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-03T00:00:00Z'),
        [appointment],
      );

      expect(new Date('2000-01-01T06:00:00Z').getDay()).toBe(6); // weekend
      expect(occurrences).toEqual([{
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        appointmentData: { ...appointment },
      }]);
    });

    it('should return occurrences out of scheduler day hours', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock({
        ...defaultOptions,
        startDayHour: 8,
        endDayHour: 17,
      }));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T02:00:00Z'),
        endDate: new Date('2000-01-01T03:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        appointmentData: { ...appointment },
      }]);
    });

    it('should return occurrences out of scheduler visible dates', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock({
        ...defaultOptions,
        dateRange: [
          new Date(2000, 0, 10, 9),
          new Date(2000, 0, 16, 18),
        ],
      }));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        appointmentData: { ...appointment },
      }]);
    });

    it('should return occurrence if appointment has visible=false', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        visible: false,
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        appointmentData: { ...appointment },
      }]);
    });
  });

  describe('recurring appointments', () => {
    it('should return occurrences', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=4',
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-07T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        appointmentData: { ...appointment },
      }, {
        startDate: new Date('2000-01-05T06:00:00Z'),
        endDate: new Date('2000-01-05T07:00:00Z'),
        appointmentData: { ...appointment },
      }]);
    });

    it('should return occurrences with extra fields', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=4',
        customField: 'custom value',
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-07T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        appointmentData: { ...appointment },
      }, {
        startDate: new Date('2000-01-05T06:00:00Z'),
        endDate: new Date('2000-01-05T07:00:00Z'),
        appointmentData: { ...appointment },
      }]);
    });

    it('should return occurrences with exceptions', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
        recurrenceException: '20000105T060000Z',
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-06T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        appointmentData: { ...appointment },
      }, {
        startDate: new Date('2000-01-03T06:00:00Z'),
        endDate: new Date('2000-01-03T07:00:00Z'),
        appointmentData: { ...appointment },
      }]);
    });

    it('should return occurrences out of recurring appointment with startDate out of interval', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T06:00:00Z'),
        endDate: new Date('2000-01-01T07:00:00Z'),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-05T00:00:00Z'),
        new Date('2000-01-08T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: new Date('2000-01-05T06:00:00Z'),
        endDate: new Date('2000-01-05T07:00:00Z'),
        appointmentData: { ...appointment },
      }, {
        startDate: new Date('2000-01-07T06:00:00Z'),
        endDate: new Date('2000-01-07T07:00:00Z'),
        appointmentData: { ...appointment },
      }]);
    });
  });

  describe('all day appointments', () => {
    it('should return occurrences if all day appointment\' date intersects with the given interval', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T01:00:00Z'),
        endDate: new Date('2000-01-01T02:00:00Z'),
        allDay: true,
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T12:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([{
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        appointmentData: { ...appointment },
      }]);
    });

    it('should not return occurrences if appointment is not in interval - 1', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-01-01T01:00:00Z'),
        endDate: new Date('2000-01-01T02:00:00Z'),
        allDay: true,
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-02T00:00:00Z'),
        new Date('2000-01-03T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });

    it('should not return occurrences if appointment is not in interval - 2', () => {
      const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

      const appointment = {
        text: 'test',
        startDate: new Date('2000-03-01T01:00:00Z'),
        endDate: new Date('2000-03-01T02:00:00Z'),
        allDay: true,
      };
      const occurrences = layoutManager.getOccurrences(
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-02T00:00:00Z'),
        [appointment],
      );

      expect(occurrences).toEqual([]);
    });
  });

  it('should return occurrences for common and recurring appointments together', () => {
    const layoutManager = new AppointmentLayoutManager(getSchedulerMock(defaultOptions));

    const appointment = {
      text: 'test 1',
      startDate: new Date('2000-01-01T06:00:00Z'),
      endDate: new Date('2000-01-01T07:00:00Z'),
    };
    const recurringAppointment = {
      text: 'test 2',
      startDate: new Date('2000-01-01T06:00:00Z'),
      endDate: new Date('2000-01-01T07:00:00Z'),
      recurrenceRule: 'FREQ=DAILY;INTERVAL=3',
    };
    const occurrences = layoutManager.getOccurrences(
      new Date('2000-01-01T00:00:00Z'),
      new Date('2000-01-06T00:00:00Z'),
      [appointment, recurringAppointment],
    );

    expect(occurrences).toEqual([{
      startDate: new Date('2000-01-01T06:00:00Z'),
      endDate: new Date('2000-01-01T07:00:00Z'),
      appointmentData: { ...appointment },
    }, {
      startDate: new Date('2000-01-01T06:00:00Z'),
      endDate: new Date('2000-01-01T07:00:00Z'),
      appointmentData: { ...recurringAppointment },
    }, {
      startDate: new Date('2000-01-04T06:00:00Z'),
      endDate: new Date('2000-01-04T07:00:00Z'),
      appointmentData: { ...recurringAppointment },
    }]);
  });
});
