import messageLocalization from '@js/common/core/localization/message';
import dateUtils from '@js/core/utils/date';
import type { ContentReadyEvent } from '@js/ui/button';
import type { Item as ButtonGroupItem, ItemClickEvent, Properties as ButtonGroupOptions } from '@js/ui/button_group';
import { current, isMaterialBased } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';
import { dateUtilsTs } from '@ts/core/utils/date';
import { extend } from '@ts/core/utils/m_extend';
import type { SchedulerHeader } from '@ts/scheduler/header/m_header';

import { Direction } from './constants';

export const CLASS = {
  container: 'dx-scheduler-navigator',
  previousButton: 'dx-scheduler-navigator-previous',
  calendarButton: 'dx-scheduler-navigator-caption',
  nextButton: 'dx-scheduler-navigator-next',
};
export const ITEMS_NAME = {
  previousButton: 'prev',
  nextButton: 'next',
  calendarButton: 'dateInterval',
};
export const DEFAULT_ITEMS = [
  ITEMS_NAME.previousButton,
  ITEMS_NAME.nextButton,
  ITEMS_NAME.calendarButton,
];

const { trimTime } = dateUtils;

interface DateNavigatorItem extends ButtonGroupItem {
  key: string;
  clickHandler: (event: ItemClickEvent) => Promise<void> | void;
  onContentReady: (event: ContentReadyEvent) => void;
}

const isPreviousButtonDisabled = (header: SchedulerHeader): boolean => {
  const minOption = header.option().min;

  if (!dateUtilsTs.isValidDate(minOption)) return false;

  let min = new Date(minOption);
  const caption = header._getCaption();

  min = trimTime(min);

  const previousDate = header._getNextDate(Direction.Left, caption.endDate);
  return previousDate < min;
};

const isNextButtonDisabled = (header: SchedulerHeader): boolean => {
  const maxOption = header.option().max;

  if (!dateUtilsTs.isValidDate(maxOption)) return false;

  const max = new Date(maxOption);
  const caption = header._getCaption();

  max.setHours(23, 59, 59);

  const nextDate = header._getNextDate(Direction.Right, caption.startDate);
  return nextDate > max;
};

const getPreviousButtonOptions = (header: SchedulerHeader): DateNavigatorItem => {
  const ariaMessage = messageLocalization.format('dxScheduler-navigationPrevious');

  return {
    key: ITEMS_NAME.previousButton,
    icon: 'chevronprev',
    elementAttr: {
      class: CLASS.previousButton,
      'aria-label': ariaMessage,
    },
    clickHandler: () => header._updateDateByDirection(Direction.Left),
    onContentReady: (event): void => {
      const previousButton = event.component;
      previousButton.option('disabled', isPreviousButtonDisabled(header));

      header._addEvent('min', () => {
        previousButton.option('disabled', isPreviousButtonDisabled(header));
      });

      header._addEvent('currentDate', () => {
        previousButton.option('disabled', isPreviousButtonDisabled(header));
      });

      header._addEvent('startViewDate', () => {
        previousButton.option('disabled', isPreviousButtonDisabled(header));
      });
    },
  };
};

const getCalendarButtonOptions = (header: SchedulerHeader): DateNavigatorItem => ({
  key: ITEMS_NAME.calendarButton,
  text: header.captionText,
  elementAttr: { class: CLASS.calendarButton },
  clickHandler: (event) => header._showCalendar(event),
  onContentReady: (event): void => {
    const calendarButton = event.component;

    header._addEvent('currentView', () => {
      calendarButton.option('text', header.captionText);
    });

    header._addEvent('currentDate', () => {
      calendarButton.option('text', header.captionText);
    });

    header._addEvent('startViewDate', () => {
      calendarButton.option('text', header.captionText);
    });

    header._addEvent('views', () => {
      calendarButton.option('text', header.captionText);
    });

    header._addEvent('firstDayOfWeek', () => {
      calendarButton.option('text', header.captionText);
    });
  },
});

const getNextButtonOptions = (header: SchedulerHeader): DateNavigatorItem => {
  const ariaMessage = messageLocalization.format('dxScheduler-navigationNext');

  return {
    key: ITEMS_NAME.nextButton,
    icon: 'chevronnext',
    elementAttr: {
      class: CLASS.nextButton,
      'aria-label': ariaMessage,
    },
    clickHandler: () => header._updateDateByDirection(Direction.Right),
    onContentReady: (event): void => {
      const nextButton = event.component;

      nextButton.option('disabled', isNextButtonDisabled(header));

      header._addEvent('min', () => {
        nextButton.option('disabled', isNextButtonDisabled(header));
      });

      header._addEvent('currentDate', () => {
        nextButton.option('disabled', isNextButtonDisabled(header));
      });

      header._addEvent('startViewDate', () => {
        nextButton.option('disabled', isNextButtonDisabled(header));
      });
    },
  };
};

export const getTodayButtonOptions = (
  header: SchedulerHeader,
  item: ToolbarItem,
): ToolbarItem => extend(true, {}, {
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  cssClass: 'dx-scheduler-today',
  options: {
    text: messageLocalization.format('dxScheduler-navigationToday'),
    icon: 'today',
    stylingMode: 'outlined',
    type: 'normal',
    onClick() {
      const { indicatorTime } = header.option();
      header._updateCurrentDate(indicatorTime ?? new Date());
    },
  },
}, item) as ToolbarItem;

export const getDateNavigator = (header: SchedulerHeader, item: ToolbarItem): ToolbarItem => {
  const stylingMode = isMaterialBased(current()) ? 'text' : 'contained';
  const config: ToolbarItem = extend(true, {}, {
    location: 'before',
    name: 'dateNavigator',
    widget: 'dxButtonGroup',
    cssClass: CLASS.container,
    options: {
      stylingMode,
      selectionMode: 'none',
    },
  }, item);
  const options = config.options as ButtonGroupOptions;
  const { onItemClick } = options;

  const items = options.items ?? DEFAULT_ITEMS;
  options.items = items.map((groupItem: ButtonGroupItem | string) => {
    switch (groupItem) {
      case ITEMS_NAME.previousButton:
        return getPreviousButtonOptions(header);
      case ITEMS_NAME.nextButton:
        return getNextButtonOptions(header);
      case ITEMS_NAME.calendarButton:
        return getCalendarButtonOptions(header);
      default:
        return groupItem as ButtonGroupItem;
    }
  });
  options.onItemClick = (event): void => {
    event.itemData.clickHandler?.(event);
    onItemClick?.(event);
  };

  return config;
};
