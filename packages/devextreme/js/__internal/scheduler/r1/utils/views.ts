import { isObject } from '@js/core/utils/type';

import { VIEW_TYPES } from '../../constants';
import type { RawViewType, ViewType } from '../../types';

export const getCurrentView = (
  currentView: string | ViewType,
  views: RawViewType[],
): RawViewType => {
  let currentViewProps = views.find((view): boolean => {
    const names = isObject(view)
      ? [view.name, view.type]
      : [view];

    return names.includes(currentView);
  });

  if (currentViewProps === undefined) {
    if (VIEW_TYPES.includes(currentView)) {
      currentViewProps = currentView as ViewType;
    } else {
      [currentViewProps] = views;
    }
  }

  return currentViewProps;
};
