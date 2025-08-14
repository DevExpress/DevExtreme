import type {
  AppointmentPart, DateInterval, FilterOptions, MinimalAppointmentEntity,
} from '../types';

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

const cropEntityByInterval = <T extends MinimalAppointmentEntity>(
  entity: T,
  interval: DateInterval,
): T => {
  const startDate = entity.startDate < interval.min ? interval.min : entity.startDate;
  const endDate = entity.endDate > interval.max ? interval.max : entity.endDate;

  return {
    ...entity,
    startDate,
    endDate,
    duration: endDate - startDate,
  };
};

export const splitByParts = <T extends MinimalAppointmentEntity>(
  entities: T[],
  { allDayPanel, regularPanel }: Pick<FilterOptions, 'allDayPanel' | 'regularPanel'>,
): (T & AppointmentPart)[] => entities
    .reduce<(T & AppointmentPart)[]>((result, entity) => {
      const panelOptions = entity.isAllDayPanelOccupied
        ? allDayPanel
        : regularPanel;
      const { intervals, prevIntervalEndDate, nextIntervalStartDate } = panelOptions;
      const startIndex = intervals.findIndex(({ max }) => entity.startDate < max);
      let endIndex = intervals.findIndex(
        (_, index) => index < intervals.length - 1 && entity.endDate <= intervals[index + 1].min,
      );
      endIndex = endIndex === -1 ? intervals.length - 1 : endIndex;
      const partCount = endIndex - startIndex + 1;
      const isStartOnPrevInterval = entity.startDate < prevIntervalEndDate;
      const isEndOnNextInterval = entity.endDate > nextIntervalStartDate;

      if (partCount <= 1) {
        result.push({
          ...cropEntityByInterval(entity, intervals[startIndex]),
          partIndex: 0,
          partCount: 0,
          reduced: getSingleReduced(isStartOnPrevInterval, isEndOnNextInterval),
        });
      } else {
        const parts: (T & AppointmentPart)[] = Array.from({ length: partCount })
          .map((_, partIndex) => ({
            ...cropEntityByInterval(entity, intervals[startIndex + partIndex]),
            partIndex,
            partCount,
            reduced: 'body',
          }));
        parts[0].reduced = isStartOnPrevInterval ? 'body' : 'head';
        parts[parts.length - 1].reduced = isEndOnNextInterval ? 'body' : 'tail';
        result.push(...parts);
      }

      return result;
    }, []);
