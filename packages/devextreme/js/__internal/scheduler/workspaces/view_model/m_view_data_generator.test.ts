import { describe, expect, it } from '@jest/globals';

import type { ViewType } from '../../types';
import { ViewDataGeneratorDay } from './m_view_data_generator_day';
import { ViewDataGeneratorMonth } from './m_view_data_generator_month';
import { ViewDataGeneratorTimelineMonth } from './m_view_data_generator_timeline_month';
import { ViewDataGeneratorWeek } from './m_view_data_generator_week';

describe('ViewDataGenerator hiddenWeekDays support', () => {
  describe('daysInInterval getter', () => {
    it('week view: 6 with skippedDays [3]', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [3];
      expect(gen.daysInInterval).toBe(6);
    });

    it('week view: 5 with skippedDays [0,6]', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [0, 6];
      expect(gen.daysInInterval).toBe(5);
    });

    it('week view: 7 with empty skippedDays override', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [];
      expect(gen.daysInInterval).toBe(7);
    });
  });

  describe('getVisibleDaysOfWeek', () => {
    it('returns all 7 days when skippedDays is empty, rotated by firstDayOfWeek', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [];
      expect(gen.getVisibleDaysOfWeek(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
      expect(gen.getVisibleDaysOfWeek(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    });

    it('skips hidden days, preserving visible-day order from firstDayOfWeek', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [0, 6];
      expect(gen.getVisibleDaysOfWeek(0)).toEqual([1, 2, 3, 4, 5]);
      expect(gen.getVisibleDaysOfWeek(1)).toEqual([1, 2, 3, 4, 5]);
    });

    it('skips a single mid-week day', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [3];
      expect(gen.getVisibleDaysOfWeek(0)).toEqual([0, 1, 2, 4, 5, 6]);
      expect(gen.getVisibleDaysOfWeek(1)).toEqual([1, 2, 4, 5, 6, 0]);
    });
  });

  describe('getVisibleDayOffset for week-style layout', () => {
    const gen = new ViewDataGeneratorWeek('week' as ViewType);

    const callGetVisibleDayOffset = (
      g: ViewDataGeneratorWeek,
      rowIndex: number,
      columnIndex: number,
      firstDayOfWeek: number,
      cellCountInDay: number,
    ): number => (g as unknown as {
      getVisibleDayOffset: (r: number, c: number, firstDay: number, cellCount: number) => number;
    }).getVisibleDayOffset(rowIndex, columnIndex, firstDayOfWeek, cellCountInDay);

    it('zero offset for empty skippedDays', () => {
      gen.skippedDays = [];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 5, 0, 1)).toBe(0);
    });

    it('week with [0,6], firstDayOfWeek=1 (Mon): col 0..4 → 0 offset, col 5 → +2', () => {
      gen.skippedDays = [0, 6];
      [0, 1, 2, 3, 4].forEach((col) => {
        expect(callGetVisibleDayOffset(gen, 0, col, 1, 1)).toBe(0);
      });
      expect(callGetVisibleDayOffset(gen, 0, 5, 1, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 0, 9, 1, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 0, 10, 1, 1)).toBe(4);
    });

    it('week with [3] (skip Wed), firstDayOfWeek=0 (Sun): col 3 → +1 to skip Wed', () => {
      gen.skippedDays = [3];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 1, 0, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 2, 0, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 3, 0, 1)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 0, 4, 0, 1)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 0, 5, 0, 1)).toBe(1);
    });

    it('week with [1,3,5] (skip Mon, Wed, Fri), firstDayOfWeek=0', () => {
      gen.skippedDays = [1, 3, 5];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 1, 0, 1)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 0, 2, 0, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 0, 3, 0, 1)).toBe(3);
      expect(callGetVisibleDayOffset(gen, 0, 4, 0, 1)).toBe(3);
    });

    it('timelineWeek with hidden days and multiple cells in day uses day index', () => {
      const timelineWeekGen = new ViewDataGeneratorWeek('timelineWeek' as ViewType);
      timelineWeekGen.skippedDays = [0, 6];

      const timelineWeek = timelineWeekGen as unknown as ViewDataGeneratorWeek;

      // 2 cells per day, first visible week day is Monday (firstDayOfWeek=1)
      // Both cells of the first day must have the same offset.
      expect(callGetVisibleDayOffset(timelineWeek, 0, 0, 1, 2)).toBe(0);
      expect(callGetVisibleDayOffset(timelineWeek, 0, 1, 1, 2)).toBe(0);
      // The first cell of next visible day still has zero offset.
      expect(callGetVisibleDayOffset(timelineWeek, 0, 2, 1, 2)).toBe(0);
      // After 5 visible days (10 cells), the next day jumps over weekend (+2 days).
      expect(callGetVisibleDayOffset(timelineWeek, 0, 10, 1, 2)).toBe(2);
    });

    it('vertical week layout with hidden days uses column index as day index', () => {
      const weekGen = new ViewDataGeneratorWeek('week' as ViewType);
      weekGen.skippedDays = [0, 6];

      const verticalWeek = weekGen as unknown as ViewDataGeneratorWeek;

      expect(callGetVisibleDayOffset(verticalWeek, 0, 0, 3, 24)).toBe(0);
      expect(callGetVisibleDayOffset(verticalWeek, 0, 1, 3, 24)).toBe(0);
      expect(callGetVisibleDayOffset(verticalWeek, 0, 2, 3, 24)).toBe(0);
      expect(callGetVisibleDayOffset(verticalWeek, 0, 3, 3, 24)).toBe(2);
      expect(callGetVisibleDayOffset(verticalWeek, 0, 4, 3, 24)).toBe(2);
    });
  });

  describe('getVisibleDayOffset for month-style layout', () => {
    const gen = new ViewDataGeneratorMonth('month' as ViewType);

    const callGetVisibleDayOffset = (
      g: ViewDataGeneratorMonth,
      rowIndex: number,
      columnIndex: number,
      firstDayOfWeek: number,
      cellCountInDay: number,
    ): number => (g as unknown as {
      getVisibleDayOffset: (r: number, c: number, firstDay: number, cellCount: number) => number;
    }).getVisibleDayOffset(rowIndex, columnIndex, firstDayOfWeek, cellCountInDay);

    it('returns 0 for empty skippedDays', () => {
      gen.skippedDays = [];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 3, 5, 0, 1)).toBe(0);
    });

    it('month with [0,6], firstDayOfWeek=1: row=1 col=0 → +2 (jumps over Sat+Sun)', () => {
      gen.skippedDays = [0, 6];
      expect(callGetVisibleDayOffset(gen, 0, 0, 1, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 4, 1, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 1, 0, 1, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 1, 4, 1, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 2, 0, 1, 1)).toBe(4);
    });

    it('month with [3] (skip Wed), firstDayOfWeek=0: visible days = Sun,Mon,Tue,Thu,Fri,Sat', () => {
      gen.skippedDays = [3];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 2, 0, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 3, 0, 1)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 0, 5, 0, 1)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 1, 0, 0, 1)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 1, 3, 0, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 1, 5, 0, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 2, 0, 0, 1)).toBe(2);
    });
  });

  describe('Month view getCellCount honors skippedDays', () => {
    it('returns 5 with skippedDays [0, 6]', () => {
      const gen = new ViewDataGeneratorMonth('month' as ViewType);
      gen.skippedDays = [0, 6];
      expect(gen.getCellCount()).toBe(5);
    });

    it('returns 6 with skippedDays [3]', () => {
      const gen = new ViewDataGeneratorMonth('month' as ViewType);
      gen.skippedDays = [3];
      expect(gen.getCellCount()).toBe(6);
    });
  });

  describe('TimelineMonth hiddenWeekDays support', () => {
    it('maps next visible column to Monday when start is Friday and weekends are skipped', () => {
      const gen = new ViewDataGeneratorTimelineMonth('timelineMonth' as ViewType);
      gen.skippedDays = [0, 6];

      const startViewDate = new Date(2026, 4, 1, 0, 0); // Friday
      const options = {
        startViewDate,
        startDayHour: 0,
        endDayHour: 24,
        hoursInterval: 1,
        interval: 24 * 60 * 60 * 1000,
        firstDayOfWeek: 1, // Monday
        intervalCount: 1,
        viewOffset: 0,
        currentDate: new Date(2026, 4, 15),
        viewType: 'timelineMonth' as ViewType,
      };

      const date = gen.getDateByCellIndices(options, 0, 1);
      expect(date.getDay()).toBe(1);
      expect(date.getDate()).toBe(4);
    });
  });

  describe('Week hiddenWeekDays start date support', () => {
    it('uses week start when skippedDays override is empty', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [];

      const startViewDate = gen.getStartViewDate({
        currentDate: new Date(2026, 3, 1), // Wednesday
        startDayHour: 0,
        startDate: undefined,
        intervalCount: 1,
        firstDayOfWeek: 0, // Sunday
      });

      expect(startViewDate.getDay()).toBe(0);
      expect(startViewDate.getDate()).toBe(29);
    });

    it('uses first visible day of week for hidden weekends', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [0, 6];

      const startViewDate = gen.getStartViewDate({
        currentDate: new Date(2026, 3, 1), // Wednesday
        startDayHour: 0,
        startDate: undefined,
        intervalCount: 1,
        firstDayOfWeek: 0, // Sunday
      });

      expect(startViewDate.getDay()).toBe(1);
      expect(startViewDate.getDate()).toBe(30);
    });

    it('keeps first visible column on Monday when startViewDate is already Monday', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [0, 6];

      const options = {
        startViewDate: new Date(2026, 2, 30, 0, 0), // Monday
        startDayHour: 0,
        endDayHour: 24,
        hoursInterval: 1,
        interval: 24 * 60 * 60 * 1000,
        firstDayOfWeek: 0, // Sunday
        intervalCount: 1,
        viewOffset: 0,
        currentDate: new Date(2026, 3, 1),
        viewType: 'week' as ViewType,
      };

      const date = gen.getDateByCellIndices(options, 0, 0);
      expect(date.getDay()).toBe(1);
      expect(date.getDate()).toBe(30);
    });
  });

  describe('Day hiddenWeekDays support', () => {
    it('shifts startViewDate to the next visible day', () => {
      const gen = new ViewDataGeneratorDay('day' as ViewType);
      gen.skippedDays = [0, 6];

      const startViewDate = gen.getStartViewDate({
        currentDate: new Date(2026, 3, 11), // Saturday
        startDayHour: 0,
        startDate: undefined,
        intervalCount: 1,
      });

      expect(startViewDate.getDay()).toBe(1);
      expect(startViewDate.getDate()).toBe(13);
    });

    it('maps multi-day timeline columns to visible days only', () => {
      const gen = new ViewDataGeneratorDay('timelineDay' as ViewType);
      gen.skippedDays = [0, 6];

      const options = {
        startViewDate: new Date(2026, 3, 10, 0, 0), // Friday
        startDayHour: 0,
        endDayHour: 24,
        hoursInterval: 24,
        interval: 24 * 60 * 60 * 1000,
        firstDayOfWeek: 0,
        intervalCount: 3,
        viewOffset: 0,
        currentDate: new Date(2026, 3, 10),
        viewType: 'timelineDay' as ViewType,
      };

      const Monday = gen.getDateByCellIndices(options, 0, 1);
      const Tuesday = gen.getDateByCellIndices(options, 0, 2);

      expect(Monday.getDay()).toBe(1);
      expect(Monday.getDate()).toBe(13);
      expect(Tuesday.getDay()).toBe(2);
      expect(Tuesday.getDate()).toBe(14);
    });
  });
});
