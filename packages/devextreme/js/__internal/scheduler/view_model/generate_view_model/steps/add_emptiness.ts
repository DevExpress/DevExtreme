import type { AllDayPanelOccupation } from '../../types';
import { getMinAppointmentSize } from '../options/get_min_appointment_size';
import type { Empty, Geometry } from './add_geometry/types';

interface AddEmptinessOptions {
  isTimelineView: boolean;
  isAdaptivityEnabled: boolean;
  isMonthView: boolean;
}

export const addEmptiness = <T extends Geometry & AllDayPanelOccupation & { allDay: boolean }>(
  entities: T[],
  options: AddEmptinessOptions,
): (T & Empty)[] => entities.map((entity) => {
  const minSize = getMinAppointmentSize({
    ...options,
    isAllDayAppointment: entity.allDay,
  });

  return {
    ...entity,
    empty: !entity.isAllDayPanelOccupied && (
      entity.height < minSize.height || entity.width < minSize.width
    ),
  };
});
