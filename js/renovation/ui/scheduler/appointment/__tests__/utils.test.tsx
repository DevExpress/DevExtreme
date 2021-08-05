import {
  getAppointmentStyles,
  getAppointmentKey,
} from '../utils';

describe('Appointment utils', () => {
  const testViewModel = {
    appointment: {
      startDate: new Date(2021, 7, 5, 10),
      endDate: new Date(2021, 7, 5, 12),
      text: 'Some text',
    },

    geometry: {
      empty: false,
      left: 1,
      top: 2,
      width: 10,
      height: 20,
      leftVirtualWidth: 1,
      topVirtualHeight: 2,
    },

    info: {
      appointment: {
        startDate: new Date(2021, 7, 5, 10),
        endDate: new Date(2021, 7, 5, 12),
      },
      sourceAppointment: {
        groupIndex: 1,
      },
      dateText: '1AM - 2PM',
      resourceColor: '#1A2BC',
    },
  };

  it('getAppointmentStyles', () => {
    expect(getAppointmentStyles(testViewModel))
      .toMatchObject({
        backgroundColor: '#1A2BC',
        height: 20,
        left: 1,
        top: 2,
        width: 10,
      });
  });

  it('getAppointmentKey', () => {
    expect(getAppointmentKey(testViewModel))
      .toBe('1-1628146800000-1628154000000_2-4-10-20');
  });
});
