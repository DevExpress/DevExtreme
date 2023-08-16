/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { isObject } from '../../../../core/utils/type';

const VIEW_TYPES = [
  'day', 'week', 'workWeek',
  'month', 'timelineDay', 'timelineWeek',
  'timelineWorkWeek', 'timelineMonth', 'agenda',
];

export const renovationGetCurrentView = (
  currentView: any,
  // https://github.com/DevExpress/devextreme-renovation/issues/754
  views: any[],
): any => {
  let currentViewProps = views.find((view): boolean => {
    const names = isObject(view)
      ? [(view as any).name, (view as any).type]
      : [view];

    if (names.includes(currentView)) {
      return true;
    }

    return false;
  });

  if (currentViewProps === undefined) {
    if (VIEW_TYPES.includes(currentView)) {
      currentViewProps = currentView;
    } else {
      [currentViewProps] = views;
    }
  }

  return currentViewProps;
};
