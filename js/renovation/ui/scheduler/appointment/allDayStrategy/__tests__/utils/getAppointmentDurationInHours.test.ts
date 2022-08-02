import getAppointmentDurationInHours from '../../utils/getAppointmentDurationInHours';

describe('allDayStrategy utils tests: getAppointmentDurationInHours func tests', () => {
  it('should return correct hours duration between dates', () => {
    const expectedResult = 4;
    const startDate = new Date(Date.UTC(2022, 1, 2, 10, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 2, 14, 0, 0));

    const result = getAppointmentDurationInHours(startDate, endDate);

    expect(result).toEqual(expectedResult);
  });

  it('should return correct hours duration between dates with minutes', () => {
    const expectedResult = 2.25;

    const startDate = new Date(Date.UTC(2022, 1, 2, 10, 30, 0));
    const endDate = new Date(Date.UTC(2022, 1, 2, 12, 45, 0));

    const result = getAppointmentDurationInHours(startDate, endDate);

    expect(result).toEqual(expectedResult);
  });
});
