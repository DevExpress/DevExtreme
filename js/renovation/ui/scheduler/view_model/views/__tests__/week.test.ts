import {
  getStartViewDate,
} from '../week';

describe('Views ViewModel week', () => {
  describe('getStartViewDate', () => {
    it('should return the first day of month as start view date', () => {
      const startDayHour = 0;
      const firstDayOfWeek = 0;

      for (let day = 10; day < 17; day += 1) {
        const currentDate = new Date(2021, 0, day);
        expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
          .toEqual(new Date(2021, 0, 10));
      }
    });

    it('should take into account startDayHour', () => {
      const startDayHour = 9;
      const firstDayOfWeek = 0;

      const currentDate = new Date(2021, 0, 11);
      expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
        .toEqual(new Date(2021, 0, 10, 9));
    });

    it('should take into account first day of week', () => {
      const startDayHour = 0;
      const firstDayOfWeek = 2;

      for (let day = 12; day < 19; day += 1) {
        const currentDate = new Date(2021, 0, day);
        expect(getStartViewDate(startDayHour, firstDayOfWeek, currentDate))
          .toEqual(new Date(2021, 0, 12));
      }
    });
  });
});
