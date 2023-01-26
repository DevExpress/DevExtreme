import { ViewType } from '../../../../../types';
import { getCellDuration } from '../base';

describe('Views utils', () => {
  describe('getCellDuration', () => {
    [
      ...[
        'day', 'week', 'workWeek',
        'timelineDay', 'timelineWeek', 'timelineWorkWeek',
      ].map((item) => ({
        viewType: item,
        expected: 90000000,
      })),
      {
        viewType: 'month',
        expected: 32400000,
      },
      {
        viewType: 'timelineMonth',
        expected: 86400000,
      },
    ].forEach(({ viewType, expected }) => {
      it(`should return correct result if ${viewType} view`, () => {
        expect(getCellDuration(viewType as ViewType, 9, 18, 25))
          .toEqual(expected);
      });
    });
  });
});
