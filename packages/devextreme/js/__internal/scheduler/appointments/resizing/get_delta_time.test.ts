import {
  describe, expect, it,
} from '@jest/globals';

import { VIEW_TYPES } from '../../utils/options/constants_view';
import type { ViewType } from '../../utils/options/types';
import { getDeltaTime } from './get_delta_time';

describe('getDeltaTime', () => {
  VIEW_TYPES.forEach((view) => {
    it(`should return zero for not resized appointment in ${view} view`, () => {
      expect(getDeltaTime(
        { width: 100, height: 100 },
        { width: 100, height: 100 },
        {
          viewType: view,
          cellSize: { width: 50, height: 50 },
          resizableStep: 50,
          cellDurationInMinutes: 30,
          isAllDayPanel: true,
        },
      )).toBe(0);
    });
  });

  ['day', 'week', 'workWeek'].forEach((view) => {
    it(`should return correct delta in px for resized appointment in vertical ${view} view`, () => {
      expect(getDeltaTime(
        { width: 100, height: 50 },
        { width: 100, height: 100 },
        {
          viewType: view as ViewType,
          cellSize: { width: 50, height: 50 },
          resizableStep: 50,
          cellDurationInMinutes: 30,
          isAllDayPanel: false,
        },
      )).toBe(-30 * 60_000);
    });

    it(`should return correct delta in px for resized all day appointment in vertical ${view} view`, () => {
      expect(getDeltaTime(
        { width: 50, height: 100 },
        { width: 100, height: 100 },
        {
          viewType: view as ViewType,
          cellSize: { width: 50, height: 50 },
          resizableStep: 50,
          cellDurationInMinutes: 30,
          isAllDayPanel: true,
        },
      )).toBe(-24 * 3600_000);
    });
  });

  ['timelineMonth', 'month'].forEach((view) => {
    it(`should return correct delta in px for resized appointment in ${view} view`, () => {
      expect(getDeltaTime(
        { width: 50, height: 100 },
        { width: 100, height: 100 },
        {
          viewType: view as ViewType,
          cellSize: { width: 50, height: 50 },
          resizableStep: 50,
          cellDurationInMinutes: 30,
          isAllDayPanel: false,
        },
      )).toBe(-24 * 3600_000);
    });
  });

  ['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach((view) => {
    it(`should return zero for not resized appointment in horizontal ${view} view`, () => {
      expect(getDeltaTime(
        { width: 50, height: 100 },
        { width: 100, height: 100 },
        {
          viewType: view as ViewType,
          cellSize: { width: 50, height: 50 },
          resizableStep: 50,
          cellDurationInMinutes: 30,
          isAllDayPanel: false,
        },
      )).toBe(-30 * 60_000);
    });
  });
});
