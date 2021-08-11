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
        groupIndex: 99,
      },
      dateText: '1AM - 2PM',
      resourceColor: '#1A2BC',
    },
  };

  describe('getAppointmentStyles', () => {
    it('generate styles for the full model', () => {
      expect(getAppointmentStyles(testViewModel))
        .toMatchObject({
          backgroundColor: '#1A2BC',
          height: 20,
          left: 1,
          top: 2,
          width: 10,
        });
    });

    it('generate styles if resource color is not defined', () => {
      expect(getAppointmentStyles({
        ...testViewModel,
        info: {
          ...testViewModel.info,
          resourceColor: undefined,
        },
      }))
        .toMatchObject({
          height: 20,
          left: 1,
          top: 2,
          width: 10,
        });
    });
  });

  it('getAppointmentKey', () => {
    expect(getAppointmentKey(testViewModel))
      .toBe('99-1628157600000-1628164800000_2-4-10-20');
  });
});
