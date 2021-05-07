import {
  getStartViewDate,
} from '../timeline_month';

describe('Views ViewModel timelineMonth', () => {
  describe('getStartViewDate', () => {
    it('should return the first day of month as start view date', () => {
      const startDayHour = 0;
      const firstDayOfWeek = 0;

      let currentDate = new Date(2021, 0, 15);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 0, 1));

      currentDate = new Date(2021, 1, 13);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 1, 1));

      currentDate = new Date(2021, 2, 5);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 2, 1));
    });

    it('should take into account startDayHour', () => {
      const startDayHour = 14;
      const firstDayOfWeek = 0;

      const currentDate = new Date(2021, 0, 15);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 0, 1, 14));
    });
  });
});
