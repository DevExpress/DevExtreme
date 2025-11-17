import type { AllDayPanelOccupation } from '../../types';
import { getMinAppointmentSize } from '../options/get_min_appointment_size';
import type { Empty, Geometry } from './add_geometry/types';

export const addEmptiness = <T extends Geometry & AllDayPanelOccupation>(
  entities: T[],
  options: { isTimelineView: boolean; isAdaptivityEnabled: boolean; isMonthView?: boolean },
): (T & Empty)[] => entities.map((entity) => {
    const minSize = getMinAppointmentSize({
      ...options,
      isAllDayPanel: entity.isAllDayPanelOccupied,
    });
    return {
      ...entity,
      empty: !entity.isAllDayPanelOccupied && (
        entity.height < minSize.height || entity.width < minSize.width
      ),
    };
  });
