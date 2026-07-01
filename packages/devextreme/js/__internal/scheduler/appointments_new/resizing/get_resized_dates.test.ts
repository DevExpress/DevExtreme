import {
  describe, expect, it,
} from '@jest/globals';

import { getResizedDates, isStartDateResized } from './get_resized_dates';

const HOUR = 60 * 60 * 1000;

describe('isStartDateResized', () => {
  it('should use the top handle for vertical timed appointments', () => {
    expect(isStartDateResized({
      handles: { top: true, left: false, right: false },
      isVerticalDirection: true,
      isAllDay: false,
      rtlEnabled: false,
    })).toBe(true);

    expect(isStartDateResized({
      handles: { top: false, left: false, right: false },
      isVerticalDirection: true,
      isAllDay: false,
      rtlEnabled: false,
    })).toBe(false);
  });

  it('should use the left handle for horizontal appointments', () => {
    expect(isStartDateResized({
      handles: { top: false, left: true, right: false },
      isVerticalDirection: false,
      isAllDay: false,
      rtlEnabled: false,
    })).toBe(true);
  });

  it('should use the right handle for horizontal appointments in RTL', () => {
    expect(isStartDateResized({
      handles: { top: false, left: false, right: true },
      isVerticalDirection: false,
      isAllDay: false,
      rtlEnabled: true,
    })).toBe(true);
  });

  it('should use the left/right handle for all-day appointments regardless of direction', () => {
    expect(isStartDateResized({
      handles: { top: true, left: true, right: false },
      isVerticalDirection: true,
      isAllDay: true,
      rtlEnabled: false,
    })).toBe(true);
  });
});

describe('getResizedDates', () => {
  it('should move the end date by the delta when the end is resized', () => {
    const range = getResizedDates({
      startDate: new Date(2024, 0, 1, 10, 0),
      endDate: new Date(2024, 0, 1, 11, 0),
      deltaTime: HOUR,
      isStartDateChanged: false,
      needCorrectDates: false,
      startDayHour: 0,
      endDayHour: 24,
    });

    expect(range.startDate).toEqual(new Date(2024, 0, 1, 10, 0));
    expect(range.endDate).toEqual(new Date(2024, 0, 1, 12, 0));
  });

  it('should move the start date by the delta when the start is resized', () => {
    const range = getResizedDates({
      startDate: new Date(2024, 0, 1, 10, 0),
      endDate: new Date(2024, 0, 1, 11, 0),
      deltaTime: HOUR,
      isStartDateChanged: true,
      needCorrectDates: false,
      startDayHour: 0,
      endDayHour: 24,
    });

    expect(range.startDate).toEqual(new Date(2024, 0, 1, 9, 0));
    expect(range.endDate).toEqual(new Date(2024, 0, 1, 11, 0));
  });

  it('should wrap the end date to the next visible day when delta exceeds the working hours', () => {
    const range = getResizedDates({
      startDate: new Date(2024, 0, 1, 9, 0),
      endDate: new Date(2024, 0, 1, 17, 0),
      deltaTime: 2 * HOUR,
      isStartDateChanged: false,
      needCorrectDates: true,
      startDayHour: 9,
      endDayHour: 18,
    });

    expect(range.startDate).toEqual(new Date(2024, 0, 1, 9, 0));
    expect(range.endDate).toEqual(new Date(2024, 0, 2, 10, 0));
  });
});
