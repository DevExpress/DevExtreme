import { getFilterStrategy } from '../local';

jest.mock(
  '../../../../../../ui/scheduler/appointments/dataProvider/appointmentFilter',
  () => ({
    AppointmentFilterBaseStrategy: jest.fn(() => ({ strategy: 'base' })),
    AppointmentFilterVirtualStrategy: jest.fn(() => ({ strategy: 'virtual' })),
  }),
);

describe('Local filtering', () => {
  describe('getFilterStrategy', () => {
    [
      { isVirtualScrolling: true, expected: 'virtual' },
      { isVirtualScrolling: false, expected: 'base' },
    ].forEach(({ isVirtualScrolling, expected }) => {
      it('should return correct filter strategy', () => {
        const result = getFilterStrategy(
          'Test_resources' as any,
          'Test_startDayHour' as any,
          'Test_endDayHour' as any,
          'Test_cellDurationInMinutes' as any,
          'Test_showAllDayPanel' as any,
          'Test_supportAllDayRow' as any,
          'Test_firstDayOfWeek' as any,
          'Test_viewType' as any,
          'Test_dateRange' as any,
          'Test_groupCount' as any,
          'Test_loadedResources' as any,
          isVirtualScrolling,
          'Test_timeZoneCalculator' as any,
          'Test_dataAccessors' as any,
          'Test_viewDataProvider' as any,
        ) as any;

        expect(result.strategy)
          .toBe(expected);
      });
    });
  });
});
