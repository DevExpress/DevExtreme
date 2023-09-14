import getDatesWithoutTime from '../getDatesWithoutTime';

jest.mock(
  '../../../../../../__internal/scheduler/appointments/data_provider/m_appointment_filter',
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
