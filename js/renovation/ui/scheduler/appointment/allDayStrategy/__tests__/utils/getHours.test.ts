import getHours from '../../utils/getHours';

describe('allDayStrategy utils tests: getHours func tests', () => {
  it('should return date hours if isSchedulerTimezoneSet = false', () => {
    const date = new Date(Date.UTC(2022, 1, 2, 10, 30, 0));
    const expectedResult = date.getHours();

    const result = getHours(date, false);

    expect(result).toEqual(expectedResult);
  });

  it('should return utc date hours if isSchedulerTimezoneSet = true', () => {
    const expectedResult = 10;
    const date = new Date(Date.UTC(2022, 1, 2, expectedResult, 30, 0));

    const result = getHours(date, true);

    expect(result).toEqual(expectedResult);
  });
});
