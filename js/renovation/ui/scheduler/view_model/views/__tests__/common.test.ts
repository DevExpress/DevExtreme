import {
  getCurrentDate,
  getFirstDayOfWeek,
  getStartViewDate,
} from '../common';

describe('Views ViewModel common', () => {
  describe('getCurrentDate', () => {
    it('should return trimmed current date if startDate is undefined', () => {
      const currentDate = new Date(2021, 1, 1, 3);

      expect(getCurrentDate(currentDate))
        .toEqual(new Date(2021, 1, 1));
    });

    it('should return trimmed start date if startDate is defined', () => {
      const currentDate = new Date(2021, 1, 1, 3);
      const startDate = new Date(2021, 1, 2, 3);

      expect(getCurrentDate(currentDate, startDate))
        .toEqual(new Date(2021, 1, 2));
    });
  });

  describe('getFirstDayOfWeek', () => {
    const includedDaysBase = [0, 1, 2, 3, 4, 5, 6, 7];

    it('should return correct first day of week in basic case', () => {
      expect(getFirstDayOfWeek(includedDaysBase, 3))
        .toBe(3);
      expect(getFirstDayOfWeek(includedDaysBase, 0))
        .toBe(0);
      expect(getFirstDayOfWeek(includedDaysBase, 6))
        .toBe(6);
    });

    it('should return the smallest value from included days if firstDayOfWeek is incorrect', () => {
      expect(getFirstDayOfWeek(includedDaysBase, 9))
        .toBe(0);
      expect(getFirstDayOfWeek(includedDaysBase, -5))
        .toBe(0);
      expect(getFirstDayOfWeek([5, 3], -5))
        .toBe(3);
    });

    it('should return the smallest value from included days when firstDayOfWeek is not included in included days', () => {
      const includedDays = [5, 4, 3, 2];
      expect(getFirstDayOfWeek(includedDays, 1))
        .toBe(2);
      expect(getFirstDayOfWeek(includedDays, 6))
        .toBe(2);
    });
  });

  describe('getStartViewDate', () => {
    it('should return current date', () => {
      const currentDate = new Date(2021, 1, 1, 3);

      expect(getStartViewDate(1, 0, currentDate))
        .toBe(currentDate);
    });
  });
});
