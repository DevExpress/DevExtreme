import type { Orientation } from '@js/common';
import { current as currentTheme } from '@js/ui/themes';

import type { RealSize } from '../steps/add_geometry/types';

interface Options {
  isTimelineView: boolean;
  isAdaptivityEnabled: boolean;
  isAllDayPanel?: boolean;
  isMonthView?: boolean;
}

const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 12;
const APPOINTMENT_DEFAULT_HEIGHT = 12;
const COMPACT_THEME_ALL_DAY_APPOINTMENT_DEFAULT_HEIGHT = 18;
const ALL_DAY_APPOINTMENT_DEFAULT_HEIGHT = 20;
const COMPACT_THEME_MONTH_APPOINTMENT_DEFAULT_HEIGHT = 18;
const MONTH_APPOINTMENT_DEFAULT_HEIGHT = 20;
const APPOINTMENT_DEFAULT_HORIZONTAL_WIDTH = 40;
const APPOINTMENT_DEFAULT_VERTICAL_WIDTH = 50;
const APPOINTMENT_MIN_HEIGHT = 35;
const APPOINTMENT_MIN_WIDTH = 40;
const TIMELINE_APPOINTMENT_DEFAULT_HEIGHT = 60;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30; // used for vertical view

// TODO get rid of depending from themes
const isCompactTheme = (): boolean => (currentTheme() || '').split('.').pop() === 'compact';
const getMinAppointmentHeightByTheme = (isAllDayPanel = false, isMonthView = false): number => {
  if (isAllDayPanel) {
    return isCompactTheme()
      ? COMPACT_THEME_ALL_DAY_APPOINTMENT_DEFAULT_HEIGHT
      : ALL_DAY_APPOINTMENT_DEFAULT_HEIGHT;
  }
  if (isMonthView) {
    return isCompactTheme()
      ? COMPACT_THEME_MONTH_APPOINTMENT_DEFAULT_HEIGHT
      : MONTH_APPOINTMENT_DEFAULT_HEIGHT;
  }
  return isCompactTheme()
    ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT
    : APPOINTMENT_DEFAULT_HEIGHT;
};

export const getMinAppointmentSize = ({
  isTimelineView,
  isAdaptivityEnabled,
  isAllDayPanel = false,
  isMonthView = false,
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
      : getMinAppointmentHeightByTheme(isAllDayPanel, isMonthView),
  };
};

export const getDefaultAppointmentSize = ({
  isTimelineView,
  isAdaptivityEnabled,
  viewOrientation,
  isAllDayPanel = false,
  isMonthView = false,
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
      : getMinAppointmentHeightByTheme(isAllDayPanel, isMonthView),
  };
};
