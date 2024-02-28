import { isDataOnWeekend } from '../../../to_test/views/utils/work_week';
import getSkippedHoursInRange from '../getSkippedHoursInRange';

describe('getSkippedHoursInRange', () => {
  describe('default', () => {
    it('should skip large interval', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => date.getDay() >= 6,
        getViewOptions: () => ({
          startDayHour: 0,
          endDayHour: 24,
        }),
        viewType: 'week',
      };

      const result = getSkippedHoursInRange(
        new Date(2021, 9, 8, 23, 23),
        new Date(2021, 12, 28, 18, 18),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(384);
    });

    it('should skip 2 weekend days if startDate and endDate inside weekend', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour: 0,
          endDayHour: 24,
        }),
        viewType: 'week',
      };

      const result = getSkippedHoursInRange(
        new Date(2021, 3, 3),
        new Date(2021, 3, 4, 0, 0, 0, 1),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(48);
    });
  });

  describe('border conditions', () => {
    const mockViewDataProvider = {
      isSkippedDate: (date: Date) => isDataOnWeekend(date),
      getViewOptions: () => ({
        startDayHour: 0,
        endDayHour: 24,
      }),
      viewType: 'week',
    };

    it('should not skip weekend if endDate at 0 border of weekend', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(24);
    });

    it('should skip weekend if endDate > 0 border of weekend', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3, 0, 0, 0, 1),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(24);
    });

    it('should skip 1 weekend day if endDate is at the end of the weekend day', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3, 23, 59, 59),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(24);
    });

    it('should skip 2 weekend days if endDate is at 0 border of the first week day', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 5, 0, 0, 0, 1),
        true,
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(48);
    });
  });

  describe('startDayHour and endDayHour and allDay = false', () => {
    interface TestParams {
      startDate: Date;
      endDate: Date;
      startDayHour: number;
      endDayHour: number;
      expectedHours: number;
    }

    it.each<TestParams>([
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        startDayHour: 0,
        endDayHour: 24,
        expectedHours: 48,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        startDayHour: 7,
        endDayHour: 17,
        expectedHours: 20,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        startDayHour: 0,
        endDayHour: 18,
        expectedHours: 36,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        startDayHour: 8,
        endDayHour: 24,
        expectedHours: 32,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 4, 13),
        startDayHour: 10,
        endDayHour: 16,
        expectedHours: 6 + 3,
      },
      {
        startDate: new Date(2024, 1, 4, 12),
        endDate: new Date(2024, 1, 6),
        startDayHour: 10,
        endDayHour: 16,
        expectedHours: 4,
      },
      {
        startDate: new Date(2024, 1, 4, 8),
        endDate: new Date(2024, 1, 6),
        startDayHour: 10,
        endDayHour: 16,
        expectedHours: 6,
      },
      {
        startDate: new Date(2024, 1, 2, 13, 0),
        endDate: new Date(2024, 1, 3, 18, 0),
        startDayHour: 12,
        endDayHour: 16,
        expectedHours: 4,
      },
    ])('should return correct number of skipped hours', ({
      startDate,
      endDate,
      expectedHours,
      startDayHour,
      endDayHour,
    }) => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour,
          endDayHour,
        }),
        viewType: 'week',
      };

      const result = getSkippedHoursInRange(startDate, endDate, false, mockViewDataProvider as any);
      expect(result).toBe(expectedHours);
    });

    it.each<{ startDate: Date; endDate: Date; expectedHours: number }>([
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 6),
        expectedHours: 16,
      },
      {
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 1, 4),
        expectedHours: 8,
      },
      {
        startDate: new Date(2024, 1, 4),
        endDate: new Date(2024, 1, 6),
        expectedHours: 8,
      },
    ])('should return correct number of skipped hours for timeline view', ({
      startDate,
      endDate,
      expectedHours,
    }) => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour: 11,
          endDayHour: 19,
        }),
        viewType: 'timelineWeek',
      };

      const result = getSkippedHoursInRange(startDate, endDate, true, mockViewDataProvider as any);
      expect(result).toBe(expectedHours);
    });
  });
});
