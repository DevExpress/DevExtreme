import { isDataOnWeekend } from '../../../to_test/views/utils/work_week';
import getSkippedHoursInRange from '../getSkippedHoursInRange';

describe('getSkippedHoursInRange', () => {
  it('should return correct interval', () => {
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

  it('should return correct interval if skip weekend', () => {
    const mockViewDataProvider = {
      isSkippedDate: (date: Date) => isDataOnWeekend(date),
    };

    const result = getSkippedHoursInRange(
      new Date(2021, 3, 2),
      new Date(2021, 3, 3),
      mockViewDataProvider as any,
    );

    expect(result)
      .toBe(0);
  });
});
