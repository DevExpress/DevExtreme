import { describe, expect, it } from '@jest/globals';

import type { ViewType } from '../../types';
import { ViewDataGenerator } from './m_view_data_generator';
import { ViewDataGeneratorMonth } from './m_view_data_generator_month';
import { ViewDataGeneratorWeek } from './m_view_data_generator_week';
import { ViewDataGeneratorWorkWeek } from './m_view_data_generator_work_week';

describe('ViewDataGenerator hiddenWeekDays support', () => {
  describe('isSkippedDate', () => {
    it('returns false when skippedDays is empty', () => {
      const gen = new ViewDataGenerator('week' as ViewType);
      gen.skippedDays = [];
      expect(gen.isSkippedDate(new Date(2026, 3, 8))).toBe(false);
    });

    it('returns true for a day in skippedDays', () => {
      const gen = new ViewDataGenerator('week' as ViewType);
      gen.skippedDays = [3];
      expect(gen.isSkippedDate(new Date(2026, 3, 8))).toBe(true);
      expect(gen.isSkippedDate(new Date(2026, 3, 9))).toBe(false);
    });

    it('returns true for any day in a multi-day skippedDays', () => {
      const gen = new ViewDataGenerator('week' as ViewType);
      gen.skippedDays = [0, 6];
      expect(gen.isSkippedDate(new Date(2026, 3, 11))).toBe(true);
      expect(gen.isSkippedDate(new Date(2026, 3, 12))).toBe(true);
      expect(gen.isSkippedDate(new Date(2026, 3, 13))).toBe(false);
    });
  });

  describe('daysInInterval getter', () => {
    it('week view: 7 with empty skippedDays', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [];
      expect(gen.daysInInterval).toBe(7);
    });

    it('week view: 5 with skippedDays [0,6]', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [0, 6];
      expect(gen.daysInInterval).toBe(5);
    });

    it('week view: 6 with skippedDays [3]', () => {
      const gen = new ViewDataGeneratorWeek('week' as ViewType);
      gen.skippedDays = [3];
      expect(gen.daysInInterval).toBe(6);
    });

    it('workWeek view: 5 with default skippedDays [0,6]', () => {
      const gen = new ViewDataGeneratorWorkWeek('workWeek' as ViewType);
      gen.skippedDays = [0, 6];
      expect(gen.daysInInterval).toBe(5);
    });

    it('day view: 1 (unaffected by skippedDays)', () => {
      const gen = new ViewDataGenerator('day' as ViewType);
      gen.skippedDays = [];
      expect(gen.daysInInterval).toBe(1);
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
    ): number => (g as unknown as {
      getVisibleDayOffset: (r: number, c: number, firstDay: number) => number;
    }).getVisibleDayOffset(rowIndex, columnIndex, firstDayOfWeek);

    it('zero offset for empty skippedDays', () => {
      gen.skippedDays = [];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 5, 0)).toBe(0);
    });

    it('week with [0,6], firstDayOfWeek=1 (Mon): col 0..4 → 0 offset, col 5 → +2', () => {
      gen.skippedDays = [0, 6];
      [0, 1, 2, 3, 4].forEach((col) => {
        expect(callGetVisibleDayOffset(gen, 0, col, 1)).toBe(0);
      });
      expect(callGetVisibleDayOffset(gen, 0, 5, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 0, 9, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 0, 10, 1)).toBe(4);
    });

    it('week with [3] (skip Wed), firstDayOfWeek=0 (Sun): col 3 → +1 to skip Wed', () => {
      gen.skippedDays = [3];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 1, 0)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 2, 0)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 3, 0)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 0, 4, 0)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 0, 5, 0)).toBe(1);
    });

    it('week with [1,3,5] (skip Mon, Wed, Fri), firstDayOfWeek=0', () => {
      gen.skippedDays = [1, 3, 5];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 1, 0)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 0, 2, 0)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 0, 3, 0)).toBe(3);
      expect(callGetVisibleDayOffset(gen, 0, 4, 0)).toBe(3);
    });
  });

  describe('getVisibleDayOffset for month-style layout', () => {
    const gen = new ViewDataGeneratorMonth('month' as ViewType);

    const callGetVisibleDayOffset = (
      g: ViewDataGeneratorMonth,
      rowIndex: number,
      columnIndex: number,
      firstDayOfWeek: number,
    ): number => (g as unknown as {
      getVisibleDayOffset: (r: number, c: number, firstDay: number) => number;
    }).getVisibleDayOffset(rowIndex, columnIndex, firstDayOfWeek);

    it('returns 0 for empty skippedDays', () => {
      gen.skippedDays = [];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 3, 5, 0)).toBe(0);
    });

    it('month with [0,6], firstDayOfWeek=1: row=1 col=0 → +2 (jumps over Sat+Sun)', () => {
      gen.skippedDays = [0, 6];
      expect(callGetVisibleDayOffset(gen, 0, 0, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 4, 1)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 1, 0, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 1, 4, 1)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 2, 0, 1)).toBe(4);
    });

    it('month with [3] (skip Wed), firstDayOfWeek=0: visible days = Sun,Mon,Tue,Thu,Fri,Sat', () => {
      gen.skippedDays = [3];
      expect(callGetVisibleDayOffset(gen, 0, 0, 0)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 2, 0)).toBe(0);
      expect(callGetVisibleDayOffset(gen, 0, 3, 0)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 0, 5, 0)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 1, 0, 0)).toBe(1);
      expect(callGetVisibleDayOffset(gen, 1, 3, 0)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 1, 5, 0)).toBe(2);
      expect(callGetVisibleDayOffset(gen, 2, 0, 0)).toBe(2);
    });
  });

  describe('Month view getCellCount honors skippedDays', () => {
    it('returns 7 with empty skippedDays', () => {
      const gen = new ViewDataGeneratorMonth('month' as ViewType);
      gen.skippedDays = [];
      expect(gen.getCellCount()).toBe(7);
    });

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
});
