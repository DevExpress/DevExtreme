/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import {
  ToolbarItem,
  ToolbarWidgetType,
  ToolbarButtonStylingMode,
  ToolbarButtonGroupItemPropsType,
} from '../../toolbar/toolbar_props';

import {
  Direction,
  SchedulerToolbarButtonGroupItemPropsType,
} from './types';

const DATE_NAVIGATOR_CLASS = 'dx-scheduler-navigator';

const PREVIOUS_BUTTON_CLASS = 'dx-scheduler-navigator-previous';
const CALENDAR_BUTTON_CLASS = 'dx-scheduler-navigator-caption';
const NEXT_BUTTON_CLASS = 'dx-scheduler-navigator-next';

const DIRECTION_LEFT: Direction = -1;
const DIRECTION_RIGHT: Direction = 1;

const getPreviousButtonOptions = (
  isPreviousButtonDisabled: boolean,
): SchedulerToolbarButtonGroupItemPropsType => ({
  icon: 'chevronprev',
  // elementAttr: { class: PREVIOUS_BUTTON_CLASS },
  disabled: isPreviousButtonDisabled,
});

const getCalendarButtonOptions = (
  captionText: string,
): SchedulerToolbarButtonGroupItemPropsType => ({
  text: captionText,
  // elementAttr: { class: CALENDAR_BUTTON_CLASS },
});

const getNextButtonOptions = (
  isNextButtonDisabled: boolean,
): SchedulerToolbarButtonGroupItemPropsType => ({
  icon: 'chevronnext',
  // elementAttr: { class: NEXT_BUTTON_CLASS },
  disabled: isNextButtonDisabled,
});

export const getDateNavigator = (
  item: ToolbarItem,
  useDropDownViewSwitcher: boolean,
  showCalendar: () => void,
  captionText: string,
  updateDateByDirection: (direction: Direction) => void,
  isPreviousButtonDisabled: boolean,
  isNextButtonDisabled: boolean,
): ToolbarItem => {
  const items = [
    getPreviousButtonOptions(isPreviousButtonDisabled),
    getCalendarButtonOptions(captionText),
    getNextButtonOptions(isNextButtonDisabled),
  ] as ToolbarButtonGroupItemPropsType[];

  const stylingMode = useDropDownViewSwitcher ? 'text' : 'contained';

  return {
    widget: 'dxButtonGroup' as ToolbarWidgetType,
    cssClass: DATE_NAVIGATOR_CLASS,
    options: {
      items,
      stylingMode: stylingMode as ToolbarButtonStylingMode,
      onItemClick: (e) => {
        switch (e.itemIndex) {
          case 0:
            updateDateByDirection(DIRECTION_LEFT);
            break;
          case 1:
            showCalendar();
            break;
          case 2:
            updateDateByDirection(DIRECTION_RIGHT);
            break;
          default:
            break;
        }
      },
    },
    ...item,
  } as ToolbarItem;
};
