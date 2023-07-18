import {
  getAppointmentStyles,
  getAppointmentKey,
  getReducedIconTooltipText,
} from '../utils';

describe('Appointment utils', () => {
  const testViewModel = {
    key: '1-2-10-20',
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
      expect(getAppointmentStyles(testViewModel as any))
        .toEqual({
          height: '20px',
          left: '1px',
          top: '2px',
          width: '10px',
        });
    });

    it('generate styles if resource color is not defined', () => {
      expect(getAppointmentStyles({
        ...testViewModel,
        info: {
          ...testViewModel.info as any,
          resourceColor: undefined,
        },
      } as any))
        .toEqual({
          height: '20px',
          left: '1px',
          top: '2px',
          width: '10px',
        });
    });

    it('should return default height if it is not provided', () => {
      expect(getAppointmentStyles({
        ...testViewModel as any,
        geometry: {
          ...testViewModel.geometry,
          height: 0,
        },
      }))
        .toEqual({
          height: '50px',
          left: '1px',
          top: '2px',
          width: '10px',
        });
    });

    it('should return default width if it is not provided', () => {
      expect(getAppointmentStyles({
        ...testViewModel as any,
        geometry: {
          ...testViewModel.geometry,
          width: 0,
        },
      }))
        .toEqual({
          height: '20px',
          left: '1px',
          top: '2px',
          width: '50px',
        });
    });
  });

  describe('getAppointmentKey', () => {
    it('should generate correct key', () => {
      expect(getAppointmentKey(testViewModel.geometry))
        .toBe('1-2-10-20');
    });
  });

  describe('getReducedIconTooltipText', () => {
    [{
      endDate: new Date(2021, 11, 21, 19, 13),
      expected: 'End Date: December 21, 2021',
    }, {
      endDate: '2021-12-21T03:03:03.000Z',
      expected: 'End Date: December 21, 2021',
    }, {
      endDate: undefined,
      expected: 'End Date',
    }].forEach(({ endDate, expected }) => {
      it(`should generate correct text if date is ${endDate}`, () => {
        expect(getReducedIconTooltipText(endDate))
          .toBe(expected);
      });
    });
  });
});
