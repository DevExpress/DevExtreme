import {
  describe, expect, it,
} from '@jest/globals';

import { VIEWS } from './constants_view';
import {
  getCurrentView, getViewOption, getViews, parseCurrentDate, parseDateOption,
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
      expect(getViews([input] as any)).toEqual([input]);
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
          name: 'Day',
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
          name: 'Agenda',
          type: 'agenda',
        },
      },
    ] as const)('should set default for undefined props ($input.type)', ({ input, output }) => {
      expect(getViews([input])).toEqual([output]);
    });

    it.each(
      Object.values(VIEWS).map((view, index) => ({
        input: view,
        output: [
          {
            groupOrientation: 'horizontal',
            intervalCount: 1,
            name: 'Day',
            type: 'day',
          },
          {
            groupOrientation: 'horizontal',
            intervalCount: 1,
            name: 'Week',
            type: 'week',
          },
          {
            groupOrientation: 'horizontal',
            intervalCount: 1,
            name: 'Work Week',
            type: 'workWeek',
          },
          {
            groupOrientation: 'horizontal',
            intervalCount: 1,
            name: 'Month',
            type: 'month',
          },
          {
            groupOrientation: 'vertical',
            intervalCount: 1,
            name: 'Timeline Day',
            type: 'timelineDay',
          },
          {
            groupOrientation: 'vertical',
            intervalCount: 1,
            name: 'Timeline Week',
            type: 'timelineWeek',
          },
          {
            groupOrientation: 'vertical',
            intervalCount: 1,
            name: 'Timeline Work Week',
            type: 'timelineWorkWeek',
          },
          {
            groupOrientation: 'vertical',
            intervalCount: 1,
            name: 'Timeline Month',
            type: 'timelineMonth',
          },
          {
            agendaDuration: 7,
            intervalCount: 1,
            name: 'Agenda',
            type: 'agenda',
          },
        ][index],
      })),
    )('should return normalized $input.type view', ({ input, output }) => {
      expect(getViews([input])).toEqual([output]);
    });
  });

  describe('getCurrentView', () => {
    it('should return normalized object', () => {
      expect(getCurrentView('agenda', ['agenda'])).toEqual({
        agendaDuration: 7,
        intervalCount: 1,
        name: 'Agenda',
        type: 'agenda',
      });
    });

    it('should return view by type', () => {
      expect(getCurrentView('agenda', ['month', { type: 'agenda' }])).toEqual({
        agendaDuration: 7,
        intervalCount: 1,
        name: 'Agenda',
        type: 'agenda',
      });
    });

    it('should return view by name', () => {
      expect(getCurrentView('SuperAgenda', ['month', { name: 'SuperAgenda', type: 'agenda' }])).toEqual({
        agendaDuration: 7,
        intervalCount: 1,
        name: 'SuperAgenda',
        type: 'agenda',
      });
    });

    it('should return default view out of the views list', () => {
      expect(getCurrentView('agenda', ['month'])).toEqual({
        agendaDuration: 7,
        intervalCount: 1,
        name: 'Agenda',
        type: 'agenda',
      });
    });

    it('should return first view if nothing found', () => {
      expect(getCurrentView('agendaShort', ['month', 'agenda'])).toEqual({
        groupOrientation: 'horizontal',
        intervalCount: 1,
        name: 'Month',
        type: 'month',
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
        name: 'Day',
        type: 'day',
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
