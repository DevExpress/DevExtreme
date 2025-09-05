import { current as currentTheme } from '@js/ui/themes';

import type { RealSize } from '../types';

interface Options {
  isTimeline: boolean;
  isAdaptivityEnabled: boolean;
}

const APPOINTMENT_DEFAULT_HEIGHT = 20;
const APPOINTMENT_DEFAULT_WIDTH = 40;
const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30;
const TIMELINE_APPOINTMENT_MIN_HEIGHT = 35;

// TODO get rid of depending from themes
const isCompactTheme = (): boolean => (currentTheme() || '').split('.').pop() === 'compact';
const getMinAppointmentHeightByTheme = (): number => (
  isCompactTheme()
    ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT
    : APPOINTMENT_DEFAULT_HEIGHT
);

export const getMinAppointmentSize = ({
  isTimeline,
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
    height: isTimeline ? TIMELINE_APPOINTMENT_MIN_HEIGHT : getMinAppointmentHeightByTheme(),
  };
};
