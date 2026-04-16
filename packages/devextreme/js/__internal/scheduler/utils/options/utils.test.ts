import {
  describe, expect, it, jest,
} from '@jest/globals';
import errors from '@js/ui/widget/ui.errors';

import { DEFAULT_VIEW_OPTIONS } from './constants_view';
import { resolveSkippedDays } from './normalize_skipped_days';
import type { RawViewType, ViewType } from './types';
import {
  getCurrentView,
  getViewOption,
  getViews,
  parseCurrentDate,
  parseDateOption,
} from './utils';

describe('views utils', () => {
  describe('getViews', () => {
    it('should filter view with incorrect name', () => {
      // @ts-expect-error intentionally pass an unsupported view name
      expect(getViews(['unknown'])).toEqual([]);
    });

    it('should filter view with incorrect type', () => {
      // @ts-expect-error intentionally pass an unsupported view type
      expect(getViews([{ type: 'unknown' }])).toEqual([]);
    });

    it('should not override view options by default options', () => {
      const input = {
        groupOrientation: 'vertical',
        type: 'day',
        intervalCount: 2,
        name: 'MyDay',
        groups: ['a', 'b'],
      };
      expect(getViews([input as RawViewType])).toEqual([{ ...input, skippedDays: [] }]);
    });

    it.each([
      {
        input: {
          type: 'day',
          intervalCount: undefined,
          groupOrientation: undefined,
        },
        output: {
          groupOrientation: 'horizontal',
          intervalCount: 1,
          type: 'day',
        },
      },
      {
        input: {
          type: 'agenda',
          intervalCount: undefined,
          agendaDuration: undefined,
        },
        output: {
          agendaDuration: 7,
          intervalCount: 1,
          type: 'agenda',
        },
      },
    ] as const)('should set default for undefined props ($input.type)', ({ input, output }) => {
      expect(getViews([input])).toEqual([{ ...output, skippedDays: [] }]);
    });

    it.each([{
      input: 'day',
      output: {
        groupOrientation: 'horizontal',
        intervalCount: 1,
        type: 'day',
      },
    }, {
      input: 'week',
      output: {
        groupOrientation: 'horizontal',
        intervalCount: 1,
        type: 'week',
      },
    }, {
      input: 'month',
      output: {
        groupOrientation: 'horizontal',
        intervalCount: 1,
        type: 'month',
      },
    }, {
      input: 'timelineDay',
      output: {
        groupOrientation: 'vertical',
        intervalCount: 1,
        type: 'timelineDay',
      },
    }, {
      input: 'timelineWeek',
      output: {
        groupOrientation: 'vertical',
        intervalCount: 1,
        type: 'timelineWeek',
      },
    }, {
      input: 'timelineMonth',
      output: {
        groupOrientation: 'vertical',
        intervalCount: 1,
        type: 'timelineMonth',
      },
    }, {
      input: 'agenda',
      output: {
        agendaDuration: 7,
        intervalCount: 1,
        type: 'agenda',
      },
    }])('should return normalized $input.type view', ({ input, output }) => {
      expect(getViews([input as RawViewType])).toEqual([{ ...output, skippedDays: [] }]);
    });

    it.each([
      {
        input: 'workWeek',
        output: {
          groupOrientation: 'horizontal',
          intervalCount: 1,
          type: 'workWeek',
        },
      }, {
        input: 'timelineWorkWeek',
        output: {
          groupOrientation: 'vertical',
          intervalCount: 1,
          type: 'timelineWorkWeek',
        },
      },
    ])('should return normalized $input.type view', ({ input, output }) => {
      expect(getViews([input as RawViewType])).toEqual([{ ...output, skippedDays: [0, 6] }]);
    });

    describe('hiddenWeekDays', () => {
      const getSkipped = (
        views: RawViewType[],
        viewType: ViewType,
        globalHiddenWeekDays?: number[],
      ): number[] => {
        const currentView = getCurrentView(viewType, views);

        return resolveSkippedDays(
          currentView.hiddenWeekDays,
          globalHiddenWeekDays,
          DEFAULT_VIEW_OPTIONS[currentView.type].skippedDays,
        );
      };

      it('uses per-view hiddenWeekDays for week', () => {
        expect(getSkipped([{ type: 'week', hiddenWeekDays: [3] }], 'week')).toEqual([3]);
      });

      it('lets workWeek override the default weekends with an empty list', () => {
        expect(getSkipped([{ type: 'workWeek', hiddenWeekDays: [] }], 'workWeek')).toEqual([]);
      });

      it('lets workWeek override the default weekends with custom days', () => {
        expect(getSkipped([{ type: 'workWeek', hiddenWeekDays: [3] }], 'workWeek')).toEqual([3]);
      });

      it('applies global hiddenWeekDays to workWeek', () => {
        expect(getSkipped(['workWeek'], 'workWeek', [3])).toEqual([3]);
      });

      it('applies global hiddenWeekDays to timelineWorkWeek', () => {
        expect(getSkipped(['timelineWorkWeek'], 'timelineWorkWeek', [3])).toEqual([3]);
      });

      it('applies global hiddenWeekDays to week', () => {
        expect(getSkipped(['week'], 'week', [3])).toEqual([3]);
      });

      it('applies global hiddenWeekDays to month', () => {
        expect(getSkipped(['month'], 'month', [0, 6])).toEqual([0, 6]);
      });

      it('applies global hiddenWeekDays to timelineWeek', () => {
        expect(getSkipped(['timelineWeek'], 'timelineWeek', [3])).toEqual([3]);
      });

      it('applies global hiddenWeekDays to timelineMonth', () => {
        expect(getSkipped(['timelineMonth'], 'timelineMonth', [3])).toEqual([3]);
      });

      it('applies global hiddenWeekDays to day', () => {
        expect(getSkipped(['day'], 'day', [3])).toEqual([3]);
      });

      it('applies global hiddenWeekDays to timelineDay', () => {
        expect(getSkipped(['timelineDay'], 'timelineDay', [3])).toEqual([3]);
      });

      it('applies global hiddenWeekDays to agenda', () => {
        expect(getSkipped(['agenda'], 'agenda', [3])).toEqual([3]);
      });

      it('removes duplicates from per-view hiddenWeekDays', () => {
        expect(getSkipped([{ type: 'week', hiddenWeekDays: [0, 0, 1, 1] }], 'week')).toEqual([0, 1]);
      });

      it('sorts per-view hiddenWeekDays', () => {
        expect(getSkipped([{ type: 'week', hiddenWeekDays: [6, 0, 3] }], 'week')).toEqual([0, 3, 6]);
      });

      it('filters out invalid per-view hiddenWeekDays values', () => {
        expect(
          getSkipped([
            // @ts-expect-error intentionally pass invalid values to verify runtime filtering
            { type: 'week', hiddenWeekDays: [7, -1, 1.5, 'x', null, 3] },
          ], 'week'),
        ).toEqual([3]);
      });

      it('falls back to an empty list and logs error when all days are hidden', () => {
        const logSpy = jest.spyOn(errors, 'log').mockImplementation(() => undefined);
        try {
          expect(
            getSkipped([{ type: 'week', hiddenWeekDays: [0, 1, 2, 3, 4, 5, 6] }], 'week'),
          ).toEqual([]);
          expect(logSpy).toHaveBeenCalledWith('W1029');
        } finally {
          logSpy.mockRestore();
        }
      });

      it('uses global hiddenWeekDays when week does not define its own value', () => {
        expect(getSkipped([{ type: 'week' }], 'week', [3])).toEqual([3]);
      });

      it('keeps the per-view value for week when both global and per-view hiddenWeekDays are set', () => {
        expect(getSkipped([{ type: 'week', hiddenWeekDays: [3] }], 'week', [0, 6])).toEqual([3]);
      });

      it('keeps the per-view value for workWeek when both global and per-view hiddenWeekDays are set', () => {
        expect(getSkipped([{ type: 'workWeek', hiddenWeekDays: [3] }], 'workWeek', [0, 6])).toEqual([3]);
      });

      it('returns an empty list for week when hiddenWeekDays is not set anywhere', () => {
        expect(getSkipped(['week'], 'week')).toEqual([]);
      });
    });
  });

  describe('getCurrentView', () => {
    it('should return normalized object', () => {
      expect(getCurrentView('agenda', ['agenda'])).toEqual({
        agendaDuration: 7,
        intervalCount: 1,
        type: 'agenda',
        skippedDays: [],
      });
    });

    it('should return view by type', () => {
      expect(getCurrentView('agenda', ['month', { type: 'agenda' }])).toEqual({
        agendaDuration: 7,
        intervalCount: 1,
        type: 'agenda',
        skippedDays: [],
      });
    });

    it('should return view by name', () => {
      expect(getCurrentView('SuperAgenda', ['month', { name: 'SuperAgenda', type: 'agenda' }])).toEqual({
        agendaDuration: 7,
        intervalCount: 1,
        name: 'SuperAgenda',
        type: 'agenda',
        skippedDays: [],
      });
    });

    it('should return default view out of the views list', () => {
      expect(getCurrentView('agenda', ['month'])).toEqual({
        agendaDuration: 7,
        intervalCount: 1,
        type: 'agenda',
        skippedDays: [],
      });
    });

    it('should return first view if nothing found', () => {
      expect(getCurrentView('agendaShort', ['month', 'agenda'])).toEqual({
        groupOrientation: 'horizontal',
        intervalCount: 1,
        type: 'month',
        skippedDays: [],
      });
    });

    it('should return first known view if wrong current view requested', () => {
      expect(getCurrentView(
        'blabla',
        [
          {
            type: 'blabla',
            name: 'blabla',
            unknown: 'incorrect view',
          } as unknown as RawViewType,
        ],
      )).toEqual({
        groupOrientation: 'horizontal',
        intervalCount: 1,
        type: 'day',
        skippedDays: [],
      });
    });
  });

  describe('parseDateOption', () => {
    const expectedDate = new Date(2025, 3, 23, 12, 1, 54);

    it('should return deserialized date from string', () => {
      expect(parseDateOption('2025/04/23 12:01:54')).toEqual(expectedDate);
    });

    it('should return deserialized date from number', () => {
      expect(parseDateOption(expectedDate.getTime())).toEqual(new Date(expectedDate));
    });

    it('should return deserialized date from date', () => {
      expect(parseDateOption(expectedDate)).toEqual(expectedDate);
    });
  });

  describe('parseCurrentDate', () => {
    const inputDate = new Date(2025, 3, 23, 12, 1, 54);
    const expectedDate = new Date(2025, 3, 23);

    it('should return trimmed deserialized date from string', () => {
      expect(parseCurrentDate('2025/04/23 12:01:54')).toEqual(expectedDate);
    });

    it('should return trimmed deserialized date from number', () => {
      expect(parseCurrentDate(inputDate.getTime())).toEqual(expectedDate);
    });

    it('should return trimmed deserialized date from date', () => {
      expect(parseCurrentDate(inputDate)).toEqual(expectedDate);
    });
  });

  describe('getViewOption', () => {
    const inputDate = new Date(2025, 3, 23, 12, 1, 54);
    const expectedDate = new Date(2025, 3, 23);

    it('should return currentDate', () => {
      expect(getViewOption('currentDate', inputDate)).toEqual(expectedDate);
    });

    it('should return min', () => {
      expect(getViewOption('min', inputDate)).toEqual(inputDate);
    });

    it('should return max', () => {
      expect(getViewOption('max', inputDate)).toEqual(inputDate);
    });

    it('should return views', () => {
      expect(getViewOption('views', ['month', 'agenda'])).toEqual(['month', 'agenda']);
    });
  });
});
