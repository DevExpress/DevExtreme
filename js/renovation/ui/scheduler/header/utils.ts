import { getViewSwitcher, getDropDownViewSwitcher } from './view_switcher';
import { getDateNavigator } from './date_navigator';

import { ItemOptions, ItemView } from './types';
import { ViewType } from '../types';

import { ToolbarItem } from '../../toolbar/toolbar_props';
import { ViewProps } from '../props';
import { SchedulerToolbarItem } from './props';

import {
  validateViews, getViewName,
  getViewText, getViewType,
} from '../../../../ui/scheduler/header/utils';
import devices from '../../../../core/devices';

const DEFAULT_ELEMENT = 'defaultElement';
const VIEW_SWITCHER = 'viewSwitcher';
const DATE_NAVIGATOR = 'dateNavigator';

export const formToolbarItem = (
  item: SchedulerToolbarItem,
  options: ItemOptions,
): ToolbarItem => {
  const {
    useDropDownViewSwitcher,
    selectedView,
    views,
    setCurrentView,
    showCalendar,
    captionText,
    updateDateByDirection,
    isPreviousButtonDisabled,
    isNextButtonDisabled,
  } = options;

  if (item[DEFAULT_ELEMENT]) {
    const defaultElementType = item[DEFAULT_ELEMENT];

    switch (defaultElementType) {
      case VIEW_SWITCHER:
        if (useDropDownViewSwitcher) {
          return getDropDownViewSwitcher(item as ToolbarItem, selectedView, views, setCurrentView);
        }

        return getViewSwitcher(item as ToolbarItem, selectedView, views, setCurrentView);
      case DATE_NAVIGATOR:
        return getDateNavigator(
          item as ToolbarItem,
          showCalendar, captionText,
          updateDateByDirection,
          isPreviousButtonDisabled,
          isNextButtonDisabled,
        );
      default:
        throw new Error('Unknown default item in the scheduler\'s toolbar'); // TODO: rework with a public api
    }
  }

  return item as ToolbarItem;
};

export const formatViews = (views: (ViewType | ViewProps)[]): ItemView[] => {
  validateViews(views);

  return views.map((view) => {
    const text = getViewText(view);
    const name = getViewName(view);

    return { text, name };
  });
};

export const isMonthView = (currentView: string): boolean => getViewType(currentView) as string === 'month';

export const isMobileLayout = (): boolean => !devices.current().generic;
