import { current as currentTheme } from '@js/ui/themes';

import type { RealSize } from '../steps/add_geometry/types';

interface Options {
  isTimelineView: boolean;
  isAdaptivityEnabled: boolean;
}

const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18;
const APPOINTMENT_DEFAULT_HEIGHT = 20;
const APPOINTMENT_DEFAULT_WIDTH = 40;
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

export const getMinAppointmentSize = ({
  isTimelineView,
  isAdaptivityEnabled,
}: Options): RealSize => {
  if (isAdaptivityEnabled) {
    return {
      width: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
      height: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
    };
  }

  return {
    width: APPOINTMENT_MIN_WIDTH,
    height: isTimelineView ? APPOINTMENT_MIN_HEIGHT : getMinAppointmentHeightByTheme(),
  };
};

export const getDefaultAppointmentSize = ({
  isTimelineView,
  isAdaptivityEnabled,
}: Options): RealSize => {
  if (isAdaptivityEnabled) {
    return {
      width: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
      height: ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH,
    };
  }

  return {
    width: APPOINTMENT_DEFAULT_WIDTH,
    height: isTimelineView ? TIMELINE_APPOINTMENT_DEFAULT_HEIGHT : getMinAppointmentHeightByTheme(),
  };
};
