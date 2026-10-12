import type { Orientation } from '@js/common';
import { current as currentTheme, isCompact } from '@js/ui/themes';

import type { RealSize } from '../steps/add_geometry/types';

interface Options {
  isTimelineView: boolean;
  isAdaptivityEnabled: boolean;
  isMonthView?: boolean;
  isAllDayAppointment?: boolean;
  // From the theme when it declares one; otherwise the legacy literals below apply
  appointmentMinHeight?: number;
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

const getMinAppointmentHeight = (appointmentMinHeight?: number): number => {
  if (appointmentMinHeight !== undefined) {
    return appointmentMinHeight;
  }

  return isCompact(currentTheme())
    ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT
    : APPOINTMENT_DEFAULT_HEIGHT;
};

export const getMinAppointmentSize = (options: Options): RealSize => {
  const {
    isTimelineView, isAdaptivityEnabled, isMonthView, isAllDayAppointment, appointmentMinHeight,
  } = options;

  if (isAdaptivityEnabled) {
    return {
      width: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
      height: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
    };
  }

  if (isTimelineView) {
    return {
      width: APPOINTMENT_MIN_WIDTH,
      height: APPOINTMENT_MIN_HEIGHT,
    };
  }

  const width = APPOINTMENT_MIN_WIDTH;
  const height = isMonthView || isAllDayAppointment
    ? getMinAppointmentHeight(appointmentMinHeight)
    : DAY_VIEW_APPOINTMENT_MIN_HEIGHT;

  return { width, height };
};

export const getDefaultAppointmentSize = ({
  isTimelineView,
  isAdaptivityEnabled,
  viewOrientation,
  appointmentMinHeight,
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
      : getMinAppointmentHeight(appointmentMinHeight),
  };
};
