import {
  describe, expect, it,
} from '@jest/globals';

import type { RawViewType } from './types';
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
