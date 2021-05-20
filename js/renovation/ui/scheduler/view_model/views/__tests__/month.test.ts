import {
  getStartViewDate,
} from '../month';

describe('Views ViewModel month', () => {
  describe('getStartViewDate', () => {
    it('should return correct start view date in basic case', () => {
      const startDayHour = 0;
      const firstDayOfWeek = 0;

      let currentDate = new Date(2021, 0, 1);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2020, 11, 27));

      currentDate = new Date(2021, 1, 1);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 0, 31));

      currentDate = new Date(2021, 2, 1);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 1, 28));

      currentDate = new Date(2021, 3, 1);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 2, 28));

      currentDate = new Date(2021, 4, 1);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 3, 25));

      currentDate = new Date(2021, 5, 1);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 4, 30));

      currentDate = new Date(2021, 6, 1);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 5, 27));

      currentDate = new Date(2021, 7, 1);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 7, 1));

      currentDate = new Date(2021, 8, 1);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 7, 29));
    });

    it('should return correct start view date with different dates', () => {
      const startDayHour = 0;
      const firstDayOfWeek = 0;

      let currentDate = new Date(2021, 0, 15);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2020, 11, 27));

      currentDate = new Date(2021, 1, 13);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 0, 31));

      currentDate = new Date(2021, 2, 22);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 1, 28));

      currentDate = new Date(2021, 3, 25);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 2, 28));

      currentDate = new Date(2021, 4, 5);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 3, 25));

      currentDate = new Date(2021, 5, 8);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 4, 30));

      currentDate = new Date(2021, 6, 17);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 5, 27));

      currentDate = new Date(2021, 7, 30);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 7, 1));

      currentDate = new Date(2021, 8, 25);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 7, 29));
    });

    it('should take into account start day hour', () => {
      const startDayHour = 5;
      const firstDayOfWeek = 0;

      const currentDate = new Date(2021, 0, 15);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2020, 11, 27, 5));
    });

    it('should take into account first day of week', () => {
      const startDayHour = 0;
      const firstDayOfWeek = 3;

      let currentDate = new Date(2021, 0, 15);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2020, 11, 30));

      currentDate = new Date(2021, 1, 13);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 0, 27));

      currentDate = new Date(2021, 2, 22);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 1, 24));

      currentDate = new Date(2021, 3, 25);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 2, 31));

      currentDate = new Date(2021, 4, 5);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 3, 28));

      currentDate = new Date(2021, 5, 8);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 4, 26));

      currentDate = new Date(2021, 6, 17);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 5, 30));

      currentDate = new Date(2021, 7, 30);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 6, 28));

      currentDate = new Date(2021, 8, 25);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 8, 1));
    });
  });
});
