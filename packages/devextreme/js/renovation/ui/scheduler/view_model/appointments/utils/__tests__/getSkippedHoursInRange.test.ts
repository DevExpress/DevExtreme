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
      };

      const result = getSkippedHoursInRange(
        new Date(2021, 9, 8, 23, 23),
        new Date(2021, 12, 28, 18, 18),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(384);
    });

    it('should skip 1 weekend day and 1 hour of the second weekend day if endDate is 1 ms in the second weekend day', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour: 0,
          endDayHour: 24,
        }),
      };

      const result = getSkippedHoursInRange(
        new Date(2021, 3, 3),
        new Date(2021, 3, 4, 0, 0, 0, 1),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(25);
    });
  });

  describe('border conditions', () => {
    const mockViewDataProvider = {
      isSkippedDate: (date: Date) => isDataOnWeekend(date),
      getViewOptions: () => ({
        startDayHour: 0,
        endDayHour: 24,
      }),
    };

    it('should not skip weekend if endDate at 0 border of weekend', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(0);
    });

    it('should skip only first weekend hour if endDate > 0 border of weekend', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3, 0, 0, 0, 1),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(1);
    });

    it('should skip 1 weekend day if endDate is at the end of the weekend day', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3, 23, 59, 59),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(24);
    });

    it('should skip 2 weekend days if endDate is at 0 border of the first week day', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 5, 0, 0, 0, 1),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(48);
    });
  });

  describe('startDayHour and endDayHour', () => {
    it.each<[number, number, number]>([
      [0, 24, 48],
      [7, 17, 20],
      [0, 18, 36],
      [8, 24, 32],
    ])(
      'should return correct skipped hours if skipped dates are the middle of period',
      (startDayHour, endDayHour, expectedHours) => {
        const mockViewDataProvider = {
          isSkippedDate: (date: Date) => isDataOnWeekend(date),
          getViewOptions: () => ({
            startDayHour,
            endDayHour,
          }),
        };

        const result = getSkippedHoursInRange(
          new Date(2024, 1, 1),
          new Date(2024, 1, 6),
          mockViewDataProvider as any,
        );

        expect(result)
          .toBe(expectedHours);
      },
    );

    it('should return correct skipped hours if skipped date is at the end', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour: 10,
          endDayHour: 16,
        }),
      };

      const result = getSkippedHoursInRange(
        new Date(2024, 1, 1),
        new Date(2024, 1, 4, 13),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(6 + 3);
    });

    it('should return correct skipped hours if skipped date is at the start', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour: 10,
          endDayHour: 16,
        }),
      };

      const result = getSkippedHoursInRange(
        new Date(2024, 1, 4, 12),
        new Date(2024, 1, 6),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(4);
    });

    it('should return correct skipped hours if skipped date is at the end (2)', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
        getViewOptions: () => ({
          startDayHour: 12,
          endDayHour: 16,
        }),
      };

      const result = getSkippedHoursInRange(
        new Date(2024, 1, 2, 13, 0),
        new Date(2024, 1, 3, 18, 0),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(4);
    });
  });
});
