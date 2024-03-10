import { isObject } from '@js/core/utils/type';

import { VIEW_TYPES } from '../const';
import type { ViewType } from '../types';

export const getCurrentView = (
  currentView: string | ViewType,
  // https://github.com/DevExpress/devextreme-renovation/issues/754
  views: (ViewType | Partial<unknown>)[],
): ViewType | Partial<unknown> => {
  let currentViewProps = views.find((view): boolean => {
    const names = isObject(view)
      // @ts-expect-error this type was related to R1 TSX
      ? [view.name, view.type]
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
