import type {
  AppointmentCollector,
  AppointmentPart,
  Duration,
  Level,
  ListEntity,
  MaxLevel,
  Position,
} from '../../../types';
import { sortByDuration, sortByGroupIndex, sortByStartDate } from '../sorting';
import { addCollectorByLevel } from './add_collector_by_level';
import { addLevel } from './add_level';
import type { CollectorOptions } from './types';

export const sortGridAppointments = <T extends {
  duration: number;
  startDate: number;
  groupIndex: number;
}>(entities: T[]): T[] => {
  sortByDuration(entities);
  sortByStartDate(entities);
  sortByGroupIndex(entities);
  return entities;
};

export const addCollector = <T extends ListEntity & Position & Duration & AppointmentPart>(
  entities: T[],
  options: CollectorOptions,
): (T & Level & MaxLevel & AppointmentCollector)[] => {
  const step1 = sortGridAppointments(entities);
  const step2 = addLevel(step1, options.maxLevel);
  const step3 = addCollectorByLevel(step2, options);
  return step3;
};
