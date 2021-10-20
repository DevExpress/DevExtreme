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
        .toEqual({
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
        .toEqual({
          height: 20,
          left: 1,
          top: 2,
          width: 10,
        });
    });

    it('should return default height if it is not provided', () => {
      expect(getAppointmentStyles({
        ...testViewModel,
        geometry: {
          ...testViewModel.geometry,
          height: 0,
        },
      }))
        .toEqual({
          backgroundColor: '#1A2BC',
          height: 50,
          left: 1,
          top: 2,
          width: 10,
        });
    });

    it('should return default width if it is not provided', () => {
      expect(getAppointmentStyles({
        ...testViewModel,
        geometry: {
          ...testViewModel.geometry,
          width: 0,
        },
      }))
        .toEqual({
          backgroundColor: '#1A2BC',
          height: 20,
          left: 1,
          top: 2,
          width: 50,
        });
    });
  });

  it('getAppointmentKey', () => {
    expect(getAppointmentKey(testViewModel))
      .toBe('2-4-10-20');
  });
});
