import type {
  AllDayPanelOccupation,
  AppointmentPart,
  DateInterval,
  DateIntervalsExtended,
  MinimalAppointmentEntity,
} from '../../types';

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
): T & Pick<AppointmentPart, 'gridAppointmentDates'> => {
  const startDate = entity.startDate < interval.min ? interval.min : entity.startDate;
  const endDate = entity.endDate > interval.max ? interval.max : entity.endDate;

  return {
    ...entity,
    startDate,
    endDate,
    duration: endDate - startDate,
    gridAppointmentDates: {
      startDate: entity.startDate,
      endDate: entity.endDate,
    },
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
  { allDayPanel, regularPanel }: {
    allDayPanel: DateIntervalsExtended;
    regularPanel: DateIntervalsExtended;
  },
): (T & AppointmentPart)[] => entities
    .reduce<(T & AppointmentPart)[]>((result, entity) => {
      const panelOptions = entity.isAllDayPanelOccupied
        ? allDayPanel
        : regularPanel;
      const { intervals, prevIntervalEndDate, nextIntervalStartDate } = panelOptions;
      const startIndex = intervals.findIndex(({ max }) => entity.startDate < max);
      const endIndex = getEndIndex(intervals, entity.endDate);
      const partCount = endIndex - startIndex + 1;
      const isStartOnPrevView = entity.startDate < prevIntervalEndDate;
      const isEndOnNextView = entity.endDate > nextIntervalStartDate;

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
