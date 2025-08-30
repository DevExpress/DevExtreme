import { getMinAppointmentSize } from './options/get_min_appointment_size';
import type { Empty, Geometry } from './types';

export const addEmptiness = <T extends Geometry>(
  entities: T[],
  options: { isTimeline: boolean; isAdaptivityEnabled: boolean },
): (T & Empty)[] => {
  const minSize = getMinAppointmentSize(options);
  return entities.map((entity) => ({
    ...entity,
    empty: entity.height < minSize.height || entity.width < minSize.width,
  }));
};
