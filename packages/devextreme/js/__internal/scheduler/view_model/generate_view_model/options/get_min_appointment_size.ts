import type { Orientation } from '@js/common';
import { current as currentTheme } from '@js/ui/themes';

import type { RealSize } from '../steps/add_geometry/types';

interface Options {
  isTimelineView: boolean;
  isAdaptivityEnabled: boolean;
  isMonthView?: boolean;
  isAllDayAppointment?: boolean;
}

const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18;
const APPOINTMENT_DEFAULT_HEIGHT = 20;
const DAY_VIEW_APPOINTMENT_MIN_HEIGHT = 12;
const APPOINTMENT_DEFAULT_HORIZONTAL_WIDTH = 40;
const APPOINTMENT_DEFAULT_VERTICAL_WIDTH = 50;
const APPOINTMENT_MIN_HEIGHT = 35;
const APPOINTMENT_MIN_WIDTH = 40;
const TIMELINE_APPOINTMENT_DEFAULT_HEIGHT = 60;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30; // used for vertical view

// TODO get rid of depending from themes
const isCompactTheme = (): boolean => (currentTheme() || '').split('.').pop() === 'compact';
const getMinAppointmentHeightByTheme = (): number => (
  isCompactTheme()
    ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT
    : APPOINTMENT_DEFAULT_HEIGHT
);

const getVerticalViewMinHeight = (options: Options): number => {
  if (options.isMonthView || options.isAllDayAppointment) {
    return getMinAppointmentHeightByTheme();
  }

  return DAY_VIEW_APPOINTMENT_MIN_HEIGHT;
};

export const getMinAppointmentSize = (options: Options): RealSize => {
  const { isTimelineView, isAdaptivityEnabled } = options;
  if (isAdaptivityEnabled) {
    return {
      width: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
      height: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
    };
  }

  const verticalSize = getVerticalViewMinHeight(options);

  return {
    width: APPOINTMENT_MIN_WIDTH,
    height: isTimelineView ? APPOINTMENT_MIN_HEIGHT : verticalSize,
  };
};

export const getDefaultAppointmentSize = ({
  isTimelineView,
  isAdaptivityEnabled,
  viewOrientation,
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
    height: isTimelineView ? TIMELINE_APPOINTMENT_DEFAULT_HEIGHT : getMinAppointmentHeightByTheme(),
  };
};
