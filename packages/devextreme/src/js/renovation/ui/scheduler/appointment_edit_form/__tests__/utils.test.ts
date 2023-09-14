import { getFirstDayOfWeek } from '../utils';

describe('Utils', () => {
  describe('getFirstDayOfWeek', () => {
    [{
      firstDayOfWeek: 0,
      expected: 0,
    }, {
      firstDayOfWeek: 1,
      expected: 1,
    }, {
      firstDayOfWeek: 10,
      expected: 10,
    }, {
      firstDayOfWeek: undefined,
      expected: 0,
    }].forEach(({ firstDayOfWeek, expected }) => {
      it(`should return correct correct value if firstDayOfWeek=${firstDayOfWeek}`, () => {
        expect(getFirstDayOfWeek(firstDayOfWeek))
          .toBe(expected);
      });
    });
  });
});
