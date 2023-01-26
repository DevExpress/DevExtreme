import getCurrentAppointment from '../get_current_appointment';

describe('getCurrentAppointment', () => {
  it('should return data if others are undefiend', () => {
    const appointmentItem = { data: { text: 'data' } };

    expect(getCurrentAppointment(appointmentItem))
      .toBe(appointmentItem.data);
  });

  it('should return currentData if settings are undefined', () => {
    const appointmentItem = {
      currentData: { text: 'currentData' },
      data: { text: 'data' },
    };

    expect(getCurrentAppointment(appointmentItem))
      .toBe(appointmentItem.currentData);
  });

  it('should return currentData if settings are defined but targetedAppointmentData is undefined', () => {
    const appointmentItem = {
      currentData: { text: 'currentData' },
      data: { text: 'data' },
      settings: {},
    };

    expect(getCurrentAppointment(appointmentItem))
      .toBe(appointmentItem.currentData);
  });

  it('should return targetedAppointmentData', () => {
    const appointmentItem = {
      currentData: { text: 'currentData' },
      data: { text: 'data' },
      settings: { targetedAppointmentData: { text: 'targetedAppointmentData' } },
    };

    expect(getCurrentAppointment(appointmentItem))
      .toBe(appointmentItem.settings.targetedAppointmentData);
  });
});
