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

const ADAPTIVITY_MIN_APPOINTMENT_COUNT = 0;
const MIN_APPOINTMENT_COUNT = 1;

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
      if (isAdaptivityEnabled && viewOrientation === 'horizontal') {
        return ADAPTIVITY_MIN_APPOINTMENT_COUNT;
      }

      const defaultAppointmentSize = getDefaultAppointmentSize({
        isTimelineView,
        isAdaptivityEnabled,
        viewOrientation,
      });
      const minAbstractSize = getAbstractSizeByViewOrientation(
        defaultAppointmentSize,
        viewOrientation,
      );
      const cellSizeY = getAbstractSizeByViewOrientation(cellSize, viewOrientation).sizeY;
      const collectorSizeY = getAbstractSizeByViewOrientation(collectorSize, viewOrientation).sizeY;
      const calculated = Math.floor(
        Math.max(0, cellSizeY - collectorSizeY) / minAbstractSize.sizeY,
      );

      return Math.max(
        calculated,
        isAdaptivityEnabled ? ADAPTIVITY_MIN_APPOINTMENT_COUNT : MIN_APPOINTMENT_COUNT,
      );
    }
    case 'unlimited':
      return -1;
    default:
      return parseInt(String(maxAppointmentsPerCell), 10);
  }
};
