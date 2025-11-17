import type { AllDayPanelOccupation, Duration } from '../../types';
import { getMinAppointmentSize } from '../options/get_min_appointment_size';
import type { Empty, Geometry } from './add_geometry/types';

const TEN_MINUTES_MS = 10 * 60 * 1000;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export const addEmptiness = <T extends Geometry & AllDayPanelOccupation & Duration>(
  entities: T[],
  options: { isTimelineView: boolean; isAdaptivityEnabled: boolean },
): (T & Empty)[] => {
  const minSize = getMinAppointmentSize(options);
  return entities.map((entity) => {
    const isShortDuration = entity.duration >= TEN_MINUTES_MS
      && entity.duration <= FIFTEEN_MINUTES_MS;

    return {
      ...entity,
      empty: !entity.isAllDayPanelOccupied && !isShortDuration && (
        entity.height < minSize.height || entity.width < minSize.width
      ),
    };
  });
};
