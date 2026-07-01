import dateUtils from '@js/core/utils/date';

import timeZoneUtils from '../../utils_time_zone';
import type { DateRange } from './types';

const toMs = dateUtils.dateToMilliseconds;

interface ResizeHandles {
  top: boolean;
  left: boolean;
  right: boolean;
}

export interface IsStartDateResizedOptions {
  handles: ResizeHandles;
  isVerticalDirection: boolean;
  isAllDay: boolean;
  rtlEnabled: boolean;
}

export interface GetResizedDatesOptions {
  startDate: Date;
  endDate: Date;
  deltaTime: number;
  isStartDateChanged: boolean;
  needCorrectDates: boolean;
  startDayHour: number;
  endDayHour: number;
}

export const isStartDateResized = ({
  handles,
  isVerticalDirection,
  isAllDay,
  rtlEnabled,
}: IsStartDateResizedOptions): boolean => {
  const usesHorizontalHandles = !isVerticalDirection || isAllDay;

  if (usesHorizontalHandles) {
    return rtlEnabled ? handles.right : handles.left;
  }

  return handles.top;
};

const correctEndDateByDelta = (
  endDate: Date,
  deltaTime: number,
  startDayHour: number,
  endDayHour: number,
): number => {
  const maxDate = new Date(endDate);
  const minDate = new Date(endDate);
  const correctEndDate = new Date(endDate);

  minDate.setHours(startDayHour, 0, 0, 0);
  maxDate.setHours(endDayHour, 0, 0, 0);

  if (correctEndDate > maxDate) {
    correctEndDate.setHours(endDayHour, 0, 0, 0);
  }

  let result = correctEndDate.getTime() + deltaTime;
  const visibleDayDuration = (endDayHour - startDayHour) * toMs('hour');

  const daysCount = deltaTime > 0
    ? Math.ceil(deltaTime / visibleDayDuration)
    : Math.floor(deltaTime / visibleDayDuration);

  if (result > maxDate.getTime() || result <= minDate.getTime()) {
    const tailOfCurrentDay = maxDate.getTime() - correctEndDate.getTime();
    const tailOfPrevDays = deltaTime - tailOfCurrentDay;
    const correctedEndDate = new Date(correctEndDate).setDate(correctEndDate.getDate() + daysCount);
    const lastDay = new Date(correctedEndDate);
    lastDay.setHours(startDayHour, 0, 0, 0);

    result = lastDay.getTime() + tailOfPrevDays - visibleDayDuration * (daysCount - 1);
  }

  return result;
};

const correctStartDateByDelta = (
  startDate: Date,
  deltaTime: number,
  startDayHour: number,
  endDayHour: number,
): number => {
  const maxDate = new Date(startDate);
  const minDate = new Date(startDate);
  const correctStartDate = new Date(startDate);

  minDate.setHours(startDayHour, 0, 0, 0);
  maxDate.setHours(endDayHour, 0, 0, 0);

  if (correctStartDate < minDate) {
    correctStartDate.setHours(startDayHour, 0, 0, 0);
  }

  let result = correctStartDate.getTime() - deltaTime;

  const visibleDayDuration = (endDayHour - startDayHour) * toMs('hour');

  const daysCount = deltaTime > 0
    ? Math.ceil(deltaTime / visibleDayDuration)
    : Math.floor(deltaTime / visibleDayDuration);

  if (result < minDate.getTime() || result >= maxDate.getTime()) {
    const tailOfCurrentDay = correctStartDate.getTime() - minDate.getTime();
    const tailOfPrevDays = deltaTime - tailOfCurrentDay;

    const firstDay = new Date(correctStartDate.setDate(correctStartDate.getDate() - daysCount));
    firstDay.setHours(endDayHour, 0, 0, 0);

    result = firstDay.getTime() - tailOfPrevDays + visibleDayDuration * (daysCount - 1);
  }

  return result;
};

export const getResizedDates = (options: GetResizedDatesOptions): DateRange => {
  const {
    startDate,
    endDate,
    deltaTime,
    isStartDateChanged,
    needCorrectDates,
    startDayHour,
    endDayHour,
  } = options;

  if (isStartDateChanged) {
    const correctedStart = needCorrectDates
      ? correctStartDateByDelta(startDate, deltaTime, startDayHour, endDayHour)
      : startDate.getTime() - deltaTime;
    const startTime = correctedStart + timeZoneUtils.getTimezoneOffsetChangeInMs(
      startDate,
      endDate,
      new Date(correctedStart),
      endDate,
    );

    return {
      startDate: new Date(startTime),
      endDate: new Date(endDate.getTime()),
    };
  }

  const correctedEnd = needCorrectDates
    ? correctEndDateByDelta(endDate, deltaTime, startDayHour, endDayHour)
    : endDate.getTime() + deltaTime;
  const endTime = correctedEnd - timeZoneUtils.getTimezoneOffsetChangeInMs(
    startDate,
    endDate,
    startDate,
    new Date(correctedEnd),
  );

  return {
    startDate: new Date(startDate.getTime()),
    endDate: new Date(endTime),
  };
};
