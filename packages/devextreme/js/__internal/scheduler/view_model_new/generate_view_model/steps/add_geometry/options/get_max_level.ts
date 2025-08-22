import type { Orientation } from '@js/common';
import type { Properties } from '@js/ui/scheduler';
import { current as currentTheme } from '@js/ui/themes';

import { getAbstractSizeByViewOrientation } from '../swap_by_view_orientation';
import type { RealSize } from '../types';

interface Options {
  maxAppointmentsPerCell: Properties['maxAppointmentsPerCell'];
  cellSize: RealSize;
  collectorSize: RealSize;
  viewOrientation: Orientation;
  isAdaptivityEnabled: boolean;
}

const APPOINTMENT_DEFAULT_HEIGHT = 20;
const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30;

// TODO get rid of depending from themes
const isCompactTheme = (): boolean => (currentTheme() || '').split('.').pop() === 'compact';
const getMinAppointmentY = (): number => (
  isCompactTheme()
    ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT
    : APPOINTMENT_DEFAULT_HEIGHT
);

export const getMaxLevel = ({
  maxAppointmentsPerCell,
  cellSize,
  collectorSize,
  viewOrientation,
  isAdaptivityEnabled,
}: Options): number => {
  switch (maxAppointmentsPerCell) {
    case 'auto': {
      if (isAdaptivityEnabled) {
        return viewOrientation === 'vertical'
          ? Math.floor(cellSize.width / ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH)
          : 0;
      }

      const cellSizeY = getAbstractSizeByViewOrientation(cellSize, viewOrientation).sizeY;
      const collectorSizeY = getAbstractSizeByViewOrientation(collectorSize, viewOrientation).sizeY;
      return Math.floor((cellSizeY - collectorSizeY) / getMinAppointmentY());
    }
    case 'unlimited':
      return -1;
    default:
      return parseInt(String(maxAppointmentsPerCell), 10);
  }
};
