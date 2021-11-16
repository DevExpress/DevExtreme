import { ViewType } from '../../../../../types';
import { getCellDuration, isSupportMultiDayAppointments } from '../base';
import { VIEWS } from '../../../../../../../../ui/scheduler/constants';

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

  describe('isSupportMultiDayAppointments', () => {
    [
      { view: VIEWS.DAY, expected: false },
      { view: VIEWS.WEEK, expected: false },
      { view: VIEWS.WORK_WEEK, expected: false },
      { view: VIEWS.MONTH, expected: false },
      { view: VIEWS.TIMELINE_DAY, expected: true },
      { view: VIEWS.TIMELINE_WEEK, expected: true },
      { view: VIEWS.TIMELINE_WORK_WEEK, expected: true },
      { view: VIEWS.TIMELINE_MONTH, expected: true },
      { view: VIEWS.AGENDA, expected: false },
    ].forEach(({ view, expected }) => {
      it(`should return correct value for ${view} view`, () => {
        expect(isSupportMultiDayAppointments(view as any))
          .toBe(expected);
      });
    });
  });
});
