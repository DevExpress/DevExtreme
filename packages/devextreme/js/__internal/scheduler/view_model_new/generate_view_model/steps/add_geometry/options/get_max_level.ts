import type { Orientation } from '@js/common';
import type { Properties } from '@js/ui/scheduler';

import { getAbstractSizeByViewOrientation } from '../swap_by_view_orientation';
import type { RealSize } from '../types';
import { getMinAppointmentSize } from './get_min_appointment_size';

interface Options {
  maxAppointmentsPerCell: Properties['maxAppointmentsPerCell'];
  cellSize: RealSize;
  collectorSize: RealSize;
  viewOrientation: Orientation;
  isTimeline: boolean;
  isAdaptivityEnabled: boolean;
}

export const getMaxLevel = ({
  maxAppointmentsPerCell,
  cellSize,
  collectorSize,
  viewOrientation,
  isTimeline,
  isAdaptivityEnabled,
}: Options): number => {
  switch (maxAppointmentsPerCell) {
    case 'auto': {
      const minAppointmentSize = getMinAppointmentSize({ isTimeline, isAdaptivityEnabled });
      if (isAdaptivityEnabled) {
        return viewOrientation === 'vertical'
          ? Math.floor(cellSize.width / minAppointmentSize.width)
          : 0;
      }

      const minAbstractSize = getAbstractSizeByViewOrientation(minAppointmentSize, viewOrientation);
      const cellSizeY = getAbstractSizeByViewOrientation(cellSize, viewOrientation).sizeY;
      const collectorSizeY = getAbstractSizeByViewOrientation(collectorSize, viewOrientation).sizeY;
      return Math.floor((cellSizeY - collectorSizeY) / minAbstractSize.sizeY);
    }
    case 'unlimited':
      return -1;
    default:
      return parseInt(String(maxAppointmentsPerCell), 10);
  }
};
