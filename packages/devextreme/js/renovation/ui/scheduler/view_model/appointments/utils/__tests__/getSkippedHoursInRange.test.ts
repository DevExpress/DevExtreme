import { isDataOnWeekend } from '../../../to_test/views/utils/work_week';
import getSkippedHoursInRange from '../getSkippedHoursInRange';

describe('getSkippedHoursInRange', () => {
  describe('default', () => {
    it('should skip large interval', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => date.getDay() >= 6,
      };

      const result = getSkippedHoursInRange(
        new Date(2021, 9, 8, 23, 23),
        new Date(2021, 12, 28, 18, 18),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(384);
    });

    it('should skip 2 weekend days if startDate and endDate inside weekend', () => {
      const mockViewDataProvider = {
        isSkippedDate: (date: Date) => isDataOnWeekend(date),
      };

      const result = getSkippedHoursInRange(
        new Date(2021, 3, 3),
        new Date(2021, 3, 4, 0, 0, 0, 1),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(48);
    });
  });

  describe('border conditions', () => {
    const mockViewDataProvider = {
      isSkippedDate: (date: Date) => isDataOnWeekend(date),
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

    it('should skip weekend if endDate > 0 border of weekend', () => {
      const result = getSkippedHoursInRange(
        new Date(2021, 3, 2),
        new Date(2021, 3, 3, 0, 0, 0, 1),
        mockViewDataProvider as any,
      );

      expect(result)
        .toBe(24);
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
});
