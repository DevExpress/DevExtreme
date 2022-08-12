import { getAppointmentAllDay } from '../utils/getAppointmentAllDay';

describe('getAppointmentAllDay', () => {
  [
    {
      appointmentAllDay: false,
      prevCellAllDay: false,
      currentCellAllDay: false,
      expected: false,
    }, {
      appointmentAllDay: false,
      prevCellAllDay: true,
      currentCellAllDay: false,
      expected: false,
    }, {
      appointmentAllDay: false,
      prevCellAllDay: false,
      currentCellAllDay: true,
      expected: true,
    }, {
      appointmentAllDay: false,
      prevCellAllDay: true,
      currentCellAllDay: true,
      expected: false,
    }, {
      appointmentAllDay: true,
      prevCellAllDay: true,
      currentCellAllDay: false,
      expected: false,
    }, {
      appointmentAllDay: true,
      prevCellAllDay: true,
      currentCellAllDay: true,
      expected: true,
    },
  ].forEach(({
    appointmentAllDay, prevCellAllDay, currentCellAllDay, expected,
  }) => {
    it('should return correct value', () => {
      expect(getAppointmentAllDay(appointmentAllDay, prevCellAllDay, currentCellAllDay))
        .toBe(expected);
    });
  });
});
