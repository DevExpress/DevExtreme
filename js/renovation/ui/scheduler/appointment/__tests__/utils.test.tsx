import {
  getAppointmentStyles,
  getAppointmentKey,
} from '../utils';

describe('Appointment utils', () => {
  const testViewModel = {
    appointment: {
      startDate: new Date('2021-08-05T10:00:00.000Z'),
      endDate: new Date('2021-08-05T12:00:00.000Z'),
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
        startDate: new Date('2021-08-05T10:00:00.000Z'),
        endDate: new Date('2021-08-05T12:00:00.000Z'),
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
      .toBe('1-1628157600000-1628164800000_2-4-10-20');
  });
});
