import * as getAppointmentDurationInHoursModule from '../../utils/getAppointmentDurationInHours';
import * as getHoursModule from '../../utils/getHours';
import isAppointmentDurationAllDay from '../../utils/isAppointmentDurationAllDay';

describe('allDayStrategy utils tests: isAppointmentDurationAllDay func tests', () => {
  it('should return true if appointment duration more equal 24 hours', () => {
    const expectedResult = true;
    const startDate = new Date(Date.UTC(2022, 1, 2, 10, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 3, 10, 0, 0));
    const viewStartDayHour = 9;
    const viewEndDayHour = 19;
    jest.spyOn(getAppointmentDurationInHoursModule, 'default').mockReturnValue(24);
    jest.spyOn(getHoursModule, 'default').mockReturnValue(0);

    const result = isAppointmentDurationAllDay(
      startDate,
      endDate,
      viewStartDayHour,
      viewEndDayHour,
      false,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return true if appointment duration more than 24 hours', () => {
    const expectedResult = true;
    const startDate = new Date(Date.UTC(2022, 1, 2, 10, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 3, 14, 0, 0));
    const viewStartDayHour = 9;
    const viewEndDayHour = 19;
    jest.spyOn(getAppointmentDurationInHoursModule, 'default').mockReturnValue(30);
    jest.spyOn(getHoursModule, 'default').mockReturnValue(0);

    const result = isAppointmentDurationAllDay(
      startDate,
      endDate,
      viewStartDayHour,
      viewEndDayHour,
      false,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return true if appointment overlap view day interval', () => {
    const expectedResult = true;
    const startDate = new Date(Date.UTC(2022, 1, 2, 8, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 2, 22, 0, 0));
    const viewStartDayHour = 9;
    const viewEndDayHour = 19;
    jest.spyOn(getAppointmentDurationInHoursModule, 'default').mockReturnValue(14);
    jest.spyOn(getHoursModule, 'default').mockImplementation((date) => {
      if (date === startDate) {
        return 8;
      }
      return 22;
    });

    const result = isAppointmentDurationAllDay(
      startDate,
      endDate,
      viewStartDayHour,
      viewEndDayHour,
      false,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return false if appointment duration less than view day duration', () => {
    const expectedResult = false;
    const startDate = new Date(Date.UTC(2022, 1, 2, 10, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 2, 14, 0, 0));
    const viewStartDayHour = 9;
    const viewEndDayHour = 19;
    jest.spyOn(getAppointmentDurationInHoursModule, 'default').mockReturnValue(4);
    jest.spyOn(getHoursModule, 'default').mockReturnValue(0);

    const result = isAppointmentDurationAllDay(
      startDate,
      endDate,
      viewStartDayHour,
      viewEndDayHour,
      false,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return false if appointment duration end hour less that view day end hour', () => {
    const expectedResult = false;
    const startDate = new Date(Date.UTC(2022, 1, 2, 2, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 2, 18, 30, 0));
    const viewStartDayHour = 9;
    const viewEndDayHour = 19;
    jest.spyOn(getAppointmentDurationInHoursModule, 'default').mockReturnValue(16);
    jest.spyOn(getHoursModule, 'default').mockImplementation((date) => {
      if (date === startDate) {
        return 2;
      }
      return 18;
    });

    const result = isAppointmentDurationAllDay(
      startDate,
      endDate,
      viewStartDayHour,
      viewEndDayHour,
      false,
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return false if appointment duration start hour greater that view day start hour', () => {
    const expectedResult = false;
    const startDate = new Date(Date.UTC(2022, 1, 2, 10, 0, 0));
    const endDate = new Date(Date.UTC(2022, 1, 2, 22, 30, 0));
    const viewStartDayHour = 9;
    const viewEndDayHour = 19;
    jest.spyOn(getAppointmentDurationInHoursModule, 'default').mockReturnValue(12);
    jest.spyOn(getHoursModule, 'default').mockImplementation((date) => {
      if (date === startDate) {
        return 10;
      }
      return 22;
    });

    const result = isAppointmentDurationAllDay(
      startDate,
      endDate,
      viewStartDayHour,
      viewEndDayHour,
      false,
    );

    expect(result).toEqual(expectedResult);
  });
});
