import type { Orientation } from '@js/common';
import { current as currentTheme } from '@js/ui/themes';

import type { ViewType } from '../../../types';
import type { RealSize } from '../steps/add_geometry/types';

interface Options {
  isTimelineView: boolean;
  isAdaptivityEnabled: boolean;
  viewType?: ViewType;
  isAllDayPanelOccupied?: boolean;
}

const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18;
const APPOINTMENT_DEFAULT_HEIGHT = 20;
const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT_DAY_WEEK = 12;
const APPOINTMENT_DEFAULT_HEIGHT_DAY_WEEK = 12;
const APPOINTMENT_DEFAULT_HORIZONTAL_WIDTH = 40;
const APPOINTMENT_DEFAULT_VERTICAL_WIDTH = 50;
const APPOINTMENT_MIN_HEIGHT = 35;
const APPOINTMENT_MIN_WIDTH = 40;
const TIMELINE_APPOINTMENT_DEFAULT_HEIGHT = 60;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30; // used for vertical view

// TODO get rid of depending from themes
const isCompactTheme = (): boolean => (currentTheme() || '').split('.').pop() === 'compact';
const getMinAppointmentHeightByTheme = (
  viewType?: ViewType,
  isAllDayPanelOccupied?: boolean,
): number => {
  const isDayOrWeekView = viewType === 'day' || viewType === 'week' || viewType === 'workWeek';
  const shouldUseDayWeekHeight = isDayOrWeekView && !isAllDayPanelOccupied;

  if (shouldUseDayWeekHeight) {
    return isCompactTheme()
      ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT_DAY_WEEK
      : APPOINTMENT_DEFAULT_HEIGHT_DAY_WEEK;
  }

  return isCompactTheme()
    ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT
    : APPOINTMENT_DEFAULT_HEIGHT;
};

export const getMinAppointmentSize = ({
  isTimelineView,
  isAdaptivityEnabled,
  viewType,
  isAllDayPanelOccupied,
}: Options): RealSize => {
  if (isAdaptivityEnabled) {
    return {
      width: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
      height: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
    };
  }

  return {
    width: APPOINTMENT_MIN_WIDTH,
    height: isTimelineView
      ? APPOINTMENT_MIN_HEIGHT
      : getMinAppointmentHeightByTheme(viewType, isAllDayPanelOccupied),
  };
};

export const getDefaultAppointmentSize = ({
  isTimelineView,
  isAdaptivityEnabled,
  viewOrientation,
  viewType,
  isAllDayPanelOccupied,
}: Options & {
  viewOrientation: Orientation;
}): RealSize => {
  if (isAdaptivityEnabled) {
    return {
      width: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
      height: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
    };
  }

  return {
    width: viewOrientation === 'vertical'
      ? APPOINTMENT_DEFAULT_VERTICAL_WIDTH
      : APPOINTMENT_DEFAULT_HORIZONTAL_WIDTH,
    height: isTimelineView
      ? TIMELINE_APPOINTMENT_DEFAULT_HEIGHT
      : getMinAppointmentHeightByTheme(viewType, isAllDayPanelOccupied),
  };
};
