import { getMinAppointmentSize } from '../options/get_min_appointment_size';
import type { Empty, Geometry } from './add_geometry/types';

export const addEmptiness = <T extends Geometry>(
  entities: T[],
  options: { isTimelineView: boolean; isAdaptivityEnabled: boolean },
): (T & Empty)[] => {
  const minSize = getMinAppointmentSize(options);
  return entities.map((entity) => ({
    ...entity,
    empty: entity.height < minSize.height || entity.width < minSize.width,
  }));
};
