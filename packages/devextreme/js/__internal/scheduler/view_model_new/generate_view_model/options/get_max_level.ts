import type { Orientation } from '@js/common';
import type { Properties } from '@js/ui/scheduler';

import { getAbstractSizeByViewOrientation } from '../steps/add_geometry/swap_by_view_orientation';
import type { RealSize } from '../steps/add_geometry/types';
import { getDefaultAppointmentSize } from './get_min_appointment_size';

interface Options {
  maxAppointmentsPerCell: Properties['maxAppointmentsPerCell'];
  cellSize: RealSize;
  collectorSize: RealSize;
  viewOrientation: Orientation;
  isTimelineView: boolean;
  isAdaptivityEnabled: boolean;
}

export const getMaxLevel = ({
  maxAppointmentsPerCell,
  cellSize,
  collectorSize,
  viewOrientation,
  isTimelineView,
  isAdaptivityEnabled,
}: Options): number => {
  switch (maxAppointmentsPerCell) {
    case 'auto': {
      const defaultAppointmentSize = getDefaultAppointmentSize({
        isTimelineView,
        isAdaptivityEnabled,
      });
      if (isAdaptivityEnabled) {
        return viewOrientation === 'vertical'
          ? Math.floor(cellSize.width / defaultAppointmentSize.width)
          : 0;
      }

      const minAbstractSize = getAbstractSizeByViewOrientation(
        defaultAppointmentSize,
        viewOrientation,
      );
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
