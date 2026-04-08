import {
  describe, expect, it, jest,
} from '@jest/globals';
import errors from '@js/ui/widget/ui.errors';

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
      expect(getViews(['unknown'] as any)).toEqual([]);
    });

    it('should filter view with incorrect type', () => {
      expect(getViews([{ type: 'unknown' }] as any)).toEqual([]);
    });

    it('should not override view options by default options', () => {
      const input = {
        groupOrientation: 'vertical',
        type: 'day',
        intervalCount: 2,
        name: 'MyDay',
        groups: ['a', 'b'],
      };
      expect(getViews([input] as any)).toEqual([{ ...input, skippedDays: [] }]);
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
      expect(getViews([input] as any)).toEqual([{ ...output, skippedDays: [] }]);
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
      expect(getViews([input] as any)).toEqual([{ ...output, skippedDays: [0, 6] }]);
    });

    describe('hiddenDays', () => {
      const getSkipped = (
        views: any[],
        viewType: string,
        globalHiddenDays?: number[],
      ): number[] => {
        const result = getViews(views, globalHiddenDays);
        const view = result.find((v) => v.type === viewType);
        return (view as any).skippedDays;
      };

      it('per-view hiddenDays on week → uses per-view value', () => {
        expect(getSkipped([{ type: 'week', hiddenDays: [3] }], 'week')).toEqual([3]);
      });

      it('per-view hiddenDays: [] on workWeek → overrides built-in default', () => {
        expect(getSkipped([{ type: 'workWeek', hiddenDays: [] }], 'workWeek')).toEqual([]);
      });

      it('per-view hiddenDays on workWeek → overrides built-in default', () => {
        expect(getSkipped([{ type: 'workWeek', hiddenDays: [3] }], 'workWeek')).toEqual([3]);
      });

      it('global hiddenDays on workWeek → ignored, built-in default wins', () => {
        expect(getSkipped(['workWeek'], 'workWeek', [3])).toEqual([0, 6]);
      });

      it('global hiddenDays on week → applied', () => {
        expect(getSkipped(['week'], 'week', [3])).toEqual([3]);
      });

      it('global hiddenDays on month → applied', () => {
        expect(getSkipped(['month'], 'month', [0, 6])).toEqual([0, 6]);
      });

      it('global hiddenDays on timelineWeek → applied', () => {
        expect(getSkipped(['timelineWeek'], 'timelineWeek', [3])).toEqual([3]);
      });

      it('global hiddenDays on timelineMonth → applied', () => {
        expect(getSkipped(['timelineMonth'], 'timelineMonth', [3])).toEqual([3]);
      });

      it('global hiddenDays on day → ignored (unsupported view)', () => {
        expect(getSkipped(['day'], 'day', [3])).toEqual([]);
      });

      it('global hiddenDays on agenda → ignored (unsupported view)', () => {
        expect(getSkipped(['agenda'], 'agenda', [3])).toEqual([]);
      });

      it('per-view hiddenDays dedupes duplicates', () => {
        expect(getSkipped([{ type: 'week', hiddenDays: [0, 0, 1, 1] }], 'week')).toEqual([0, 1]);
      });

      it('per-view hiddenDays sorts ascending', () => {
        expect(getSkipped([{ type: 'week', hiddenDays: [6, 0, 3] }], 'week')).toEqual([0, 3, 6]);
      });

      it('per-view hiddenDays filters out invalid values', () => {
        expect(
          getSkipped([{ type: 'week', hiddenDays: [7, -1, 1.5, 'x', null, 3] as any }], 'week'),
        ).toEqual([3]);
      });

      it('hiddenDays covering all 7 days → falls back to [] and logs W1029', () => {
        const logSpy = jest.spyOn(errors, 'log').mockImplementation(() => undefined);
        try {
          expect(
            getSkipped([{ type: 'week', hiddenDays: [0, 1, 2, 3, 4, 5, 6] }], 'week'),
          ).toEqual([]);
          expect(logSpy).toHaveBeenCalledWith('W1029');
        } finally {
          logSpy.mockRestore();
        }
      });

      it('global hiddenDays + per-view undefined on week → uses global', () => {
        expect(getSkipped([{ type: 'week' }], 'week', [3])).toEqual([3]);
      });

      it('global hiddenDays + per-view [3] on week → per-view wins', () => {
        expect(getSkipped([{ type: 'week', hiddenDays: [3] }], 'week', [0, 6])).toEqual([3]);
      });

      it('no hiddenDays anywhere on week → []', () => {
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
      expect(getCurrentView('blabla', [{
        type: 'blabla',
        name: 'blabla',
        unknown: 'incorrect view',
      } as any])).toEqual({
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
