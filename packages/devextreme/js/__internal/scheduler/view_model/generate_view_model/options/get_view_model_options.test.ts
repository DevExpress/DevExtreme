import { describe, expect, it } from '@jest/globals';

import { getDefaultSnapToCellsModeForView } from './get_view_model_options';

describe('getDefaultSnapToCellsModeForView', () => {
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
  ])('should return $expected for $viewType', ({ viewType, expected }) => {
    expect(getDefaultSnapToCellsModeForView(viewType)).toBe(expected);
  });
});
