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
});
