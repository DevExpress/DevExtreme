import { describe, expect, it } from '@jest/globals';
import { getSchedulerMock } from '@ts/scheduler/view_model/__mock__/scheduler.mock';

import { getViewModelOptions } from './get_view_model_options';

describe('getViewModelOptions', () => {
  it.each([
    { viewType: 'month' as const, expected: 'always' },
    { viewType: 'agenda' as const, expected: 'always' },
    { viewType: 'timelineMonth' as const, expected: 'always' },
    { viewType: 'day' as const, expected: 'never' },
    { viewType: 'week' as const, expected: 'never' },
    { viewType: 'workWeek' as const, expected: 'never' },
    { viewType: 'timelineDay' as const, expected: 'never' },
    { viewType: 'timelineWeek' as const, expected: 'never' },
    { viewType: 'timelineWorkWeek' as const, expected: 'never' },
  ])('should use $expected snapToCellsMode by default for $viewType', ({ viewType, expected }) => {
    expect(getViewModelOptions(getSchedulerMock({
      type: viewType,
      startDayHour: 0,
      endDayHour: 24,
      offsetMinutes: 0,
    })).snapToCellsMode).toBe(expected);
  });
});
