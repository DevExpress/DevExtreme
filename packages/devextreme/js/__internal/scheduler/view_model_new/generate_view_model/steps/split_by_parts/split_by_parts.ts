import type {
  AllDayPanelOccupation,
  AppointmentPart,
  DateInterval,
  MinimalAppointmentEntity,
} from '../../../types';
import { getNextIntervalStartDate } from './get_next_interval_start_date';
import { getPrevIntervalEndDate } from './get_prev_interval_end_date';

const getSingleReduced = (
  isStartOnPrevInterval: boolean,
  isEndOnNextInterval: boolean,
): AppointmentPart['reduced'] => {
  switch (true) {
    case isStartOnPrevInterval && isEndOnNextInterval:
      return 'body';
    case isStartOnPrevInterval:
      return 'tail';
    case isEndOnNextInterval:
      return 'head';
    default:
      return undefined;
  }
};

const getReduced = (
  isFirstItem: boolean,
  isLastItem: boolean,
  isStartOnPrevInterval: boolean,
  isEndOnNextInterval: boolean,
): 'head' | 'body' | 'tail' => {
  switch (true) {
    case isFirstItem && !isStartOnPrevInterval:
      return 'head';
    case isLastItem && !isEndOnNextInterval:
      return 'tail';
    default:
      return 'body';
  }
};

const cropEntityByInterval = <T extends MinimalAppointmentEntity>(
  entity: T,
  interval: DateInterval,
): T => {
  const startDate = entity.startDateUTC < interval.min ? interval.min : entity.startDateUTC;
  const endDate = entity.endDateUTC > interval.max ? interval.max : entity.endDateUTC;

  return {
    ...entity,
    startDateUTC: startDate,
    endDateUTC: endDate,
    duration: endDate - startDate,
  };
};

const getEndIndex = (intervals: DateInterval[], endDateMs: number): number => {
  const lastIdx = intervals.length - 1;

  for (let idx = 0; idx < lastIdx; idx += 1) {
    const nextInterval = intervals[idx + 1];

    if (nextInterval.min >= endDateMs) {
      return idx;
    }
  }

  return lastIdx;
};

export const splitByParts = <T extends MinimalAppointmentEntity & AllDayPanelOccupation>(
  entities: T[],
  intervals: DateInterval[],
): (T & AppointmentPart)[] => {
  const prevIntervalEndDate = getPrevIntervalEndDate(intervals);
  const nextIntervalStartDate = getNextIntervalStartDate(intervals);

  return entities
    .reduce<(T & AppointmentPart)[]>((result, entity) => {
      const startIndex = intervals.findIndex(({ max }) => entity.startDateUTC < max);
      const endIndex = getEndIndex(intervals, entity.endDateUTC);
      const partCount = endIndex - startIndex + 1;
      const isStartOnPrevView = entity.startDateUTC < prevIntervalEndDate;
      const isEndOnNextView = entity.endDateUTC > nextIntervalStartDate;

      if (partCount <= 1) {
        result.push({
          ...cropEntityByInterval(entity, intervals[startIndex]),
          partIndex: 0,
          partCount: 0,
          reduced: getSingleReduced(isStartOnPrevView, isEndOnNextView),
        });
      } else {
        const parts: (T & AppointmentPart)[] = Array.from({ length: partCount })
          .map((_, partIndex) => {
            const isFirstIdx = partIndex === 0;
            const isLastIdx = partIndex === partCount - 1;

            return {
              ...cropEntityByInterval(entity, intervals[startIndex + partIndex]),
              partIndex,
              partCount,
              reduced: getReduced(isFirstIdx, isLastIdx, isStartOnPrevView, isEndOnNextView),
            };
          });
        result.push(...parts);
      }

      return result;
    }, []);
};
