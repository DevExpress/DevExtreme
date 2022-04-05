import { getAppointmentTakesAllDay } from '../getAppointmentTakesAllDay';

describe('getAppointmentTakesAllDay', () => {
  it('should return true if all day appointment', () => {
    const appointment = {
      allDay: true,
      startDate: new Date(2022, 0, 1, 8),
      endDate: new Date(2022, 0, 1, 12),
    };

    expect(getAppointmentTakesAllDay(appointment, 0, 24))
      .toBe(true);
  });

  it('should return true if appointment takes all day', () => {
    const appointment = {
      allDay: false,
      startDate: new Date(2022, 0, 1, 8),
      endDate: new Date(2022, 0, 2, 12),
    };

    expect(getAppointmentTakesAllDay(appointment, 0, 24))
      .toBe(true);
  });

  it('should return false if appointment does not take all day', () => {
    const appointment = {
      allDay: false,
      startDate: new Date(2022, 0, 1, 10),
      endDate: new Date(2022, 0, 1, 11),
    };

    expect(getAppointmentTakesAllDay(appointment, 0, 24))
      .toBe(false);
  });

  it('should return true if appointment duration === view duration', () => {
    const appointment = {
      allDay: false,
      startDate: new Date(2022, 0, 1, 8),
      endDate: new Date(2022, 0, 1, 12),
    };

    expect(getAppointmentTakesAllDay(appointment, 8, 12))
      .toBe(true);
  });

  it('should return false if appointment duration > view duration', () => {
    const appointment = {
      allDay: false,
      startDate: new Date(2022, 0, 1, 8),
      endDate: new Date(2022, 0, 1, 13),
    };

    expect(getAppointmentTakesAllDay(appointment, 8, 11))
      .toBe(false);
  });
});
