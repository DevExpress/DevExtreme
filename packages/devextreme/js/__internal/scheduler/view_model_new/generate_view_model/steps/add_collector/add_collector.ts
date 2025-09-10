import type {
  AppointmentCollector,
  AppointmentPart,
  DatesBeforeSplit,
  Duration,
  Level,
  ListEntity,
  Position,
} from '../../../types';
import { addCollectorByLevel } from './add_collector_by_level';
import { addLevel } from './add_level';
import type { CollectorOptions } from './types';

export const addCollector = <
  T extends ListEntity & Position & Duration & AppointmentPart & DatesBeforeSplit,
>(
    entities: T[],
    options: CollectorOptions,
  ): (T & Level & AppointmentCollector)[] => {
  const step1 = addLevel(entities, options);
  const step2 = addCollectorByLevel(step1, options);
  return step2;
};
