import {
  describe, expect, it, jest,
} from '@jest/globals';
import errors from '@js/ui/widget/ui.errors';

import { DEFAULT_VIEW_OPTIONS } from './constants_view';
import { resolveSkippedDays } from './normalize_hidden_days';
import type { RawViewType, ViewType } from './types';
import { getCurrentView } from './utils';

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
