import { getAppointmentTakesAllDay } from '../getAppointmentTakesAllDay';

describe('getAppointmentTakesAllDay', () => {
  describe('allDayPanelMode is all', () => {
    it('should return true if all day appointment', () => {
      const appointment = {
        allDay: true,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 1, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'all'))
        .toBe(true);
    });

    it('should return true if appointment takes all day', () => {
      const appointment = {
        allDay: false,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 2, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'all'))
        .toBe(true);
    });

    it('should return false if appointment does not take all day', () => {
      const appointment = {
        allDay: false,
        startDate: new Date(2022, 0, 1, 10),
        endDate: new Date(2022, 0, 1, 11),
      };

      expect(getAppointmentTakesAllDay(appointment, 'all'))
        .toBe(false);
    });

    it('should return false if appointment duration > view duration', () => {
      const appointment = {
        allDay: false,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 1, 13),
      };

      expect(getAppointmentTakesAllDay(appointment, 'all'))
        .toBe(false);
    });

    [
      undefined,
      null,
    ].forEach((endDate) => {
      it(`should return false if endDate is ${endDate}`, () => {
        const appointment = {
          allDay: false,
          startDate: new Date(2022, 0, 1, 8),
          endDate,
        };

        expect(getAppointmentTakesAllDay(appointment, 'all'))
          .toBe(false);
      });
    });
  });

  describe('allDayPanelMode is hidden', () => {
    it('should return true if all day appointment', () => {
      const appointment = {
        allDay: true,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 1, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'hidden'))
        .toBe(false);
    });
  });

  describe('allDayPanelMode is allDay', () => {
    it('should return true if all day appointment', () => {
      const appointment = {
        allDay: true,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 1, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'allDay'))
        .toBe(true);
    });

    it('should return true if appointment takes all day', () => {
      const appointment = {
        allDay: false,
        startDate: new Date(2022, 0, 1, 8),
        endDate: new Date(2022, 0, 2, 12),
      };

      expect(getAppointmentTakesAllDay(appointment, 'allDay'))
        .toBe(false);
    });
  });
});
