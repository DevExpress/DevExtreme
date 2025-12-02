import type { AllDayPanelOccupation, PanelName } from '../../types';
import { splitByCondition } from './add_collector/split_by_condition';

interface StartDate {
  startDateUTC: number;
}

const mergeByStartDate = <T extends StartDate>(a: T[], b: T[]): T[] => {
  const result: T[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i].startDateUTC <= b[j].startDateUTC) {
      result.push(a[i]);
      i += 1;
    } else {
      result.push(b[j]);
      j += 1;
    }
  }

  while (i < a.length) {
    result.push(a[i]);
    i += 1;
  }

  while (j < b.length) {
    result.push(b[j]);
    j += 1;
  }

  return result;
};

export const maybeSplit = <T extends AllDayPanelOccupation, R extends StartDate>(
  entities: T[],
  shouldSplit: boolean,
  callback: (items: T[], panelName: PanelName) => R[],
): R[] => {
  if (shouldSplit) {
    const [allDayEntities, regularEntities] = splitByCondition(
      entities,
      (entity) => entity.isAllDayPanelOccupied,
    );
    const allDayPanel = callback(allDayEntities, 'allDayPanel');
    const regularPanel = callback(regularEntities, 'regularPanel');

    return mergeByStartDate(allDayPanel, regularPanel);
  }

  return callback(entities, 'regularPanel');
};
