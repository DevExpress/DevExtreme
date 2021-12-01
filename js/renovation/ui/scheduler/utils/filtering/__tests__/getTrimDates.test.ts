import getDatesWithoutTime from '../getDatesWithoutTime';

jest.mock(
  '../../../../../../ui/scheduler/appointments/dataProvider/appointmentFilter',
  () => ({
    AppointmentFilterBaseStrategy: jest.fn(() => ({ strategy: 'base' })),
    AppointmentFilterVirtualStrategy: jest.fn(() => ({ strategy: 'virtual' })),
  }),
);

describe('getDatesWithoutTime', () => {
  it('should trim dates correctly', () => {
    expect(getDatesWithoutTime(
      new Date(2021, 10, 23, 11, 11),
      new Date(2021, 10, 24, 12, 12),
    )).toEqual([
      new Date(2021, 10, 23),
      new Date(2021, 10, 25),
    ]);
  });
});
