import { getViewSwitcher, getDropDownViewSwitcher } from './view_switcher';
import { getDateNavigator } from './date_navigator';

import {
  ToolbarItem,
} from '../../toolbar/toolbar_props';

import {
  ConfigOptionType,
} from './types';
import {
  SchedulerToolbarItem,
} from './toolbar_props';

const DEFAULT_ELEMENT = 'defaultElement';
const VIEW_SWITCHER = 'viewSwitcher';
const DATE_NAVIGATOR = 'dateNavigator';

export const formToolbarItem = (
  item: SchedulerToolbarItem,
  options: ConfigOptionType,
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
          item as ToolbarItem, useDropDownViewSwitcher,
          showCalendar, captionText,
          updateDateByDirection,
          isPreviousButtonDisabled, isNextButtonDisabled,
        );
      default:
        console.log(`Unknown default element type: ${defaultElementType}`);
        break;
    }
  }

  return item as ToolbarItem;
};

export const showCalendar = (): void => {
  console.log('Rendering calendar');
};
