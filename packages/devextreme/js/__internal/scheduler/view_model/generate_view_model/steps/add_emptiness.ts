import type { ViewType } from '../../../types';
import type { AllDayPanelOccupation, Duration } from '../../types';
import { getMinAppointmentSize } from '../options/get_min_appointment_size';
import type { Empty, Geometry } from './add_geometry/types';

export const addEmptiness = <T extends Geometry & AllDayPanelOccupation & Duration>(
  entities: T[],
  options: { isTimelineView: boolean; isAdaptivityEnabled: boolean; viewType?: ViewType },
): (T & Empty)[] => entities.map((entity) => {
    const minSize = getMinAppointmentSize({
      ...options,
      isAllDayPanelOccupied: entity.isAllDayPanelOccupied,
    });
    return {
      ...entity,
      empty: !entity.isAllDayPanelOccupied && (
        entity.height < minSize.height || entity.width < minSize.width
      ),
    };
  });
