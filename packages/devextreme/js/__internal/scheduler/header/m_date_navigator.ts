import messageLocalization from '@js/common/core/localization/message';
import dateUtils from '@js/core/utils/date';
import type { ContentReadyEvent } from '@js/ui/button';
import type { Item as ButtonGroupItem, ItemClickEvent, Properties as ButtonGroupOptions } from '@js/ui/button_group';
import { isMaterialBased } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';
import { extend } from '@ts/core/utils/m_extend';
import type { SchedulerHeader } from '@ts/scheduler/header/m_header';

import {
  CALENDAR_BUTTON_CLASS,
  CALENDAR_BUTTON_NAME,
  DATE_NAVIGATOR_CLASS,
  DEFAULT_ITEMS,
  Direction,
  NEXT_BUTTON_CLASS,
  NEXT_BUTTON_NAME,
  PREVIOUS_BUTTON_CLASS,
  PREVIOUS_BUTTON_NAME,
} from './constants';

const { trimTime } = dateUtils;

interface DateNavigatorItem extends ButtonGroupItem {
  key: string;
  onClick: (event: ItemClickEvent) => void;
  onContentReady: (event: ContentReadyEvent) => void;
}

const isPreviousButtonDisabled = (header: SchedulerHeader): boolean => {
  const minOption = header.option('min');

  if (!minOption) return false;

  let min = new Date(minOption);
  const caption = header._getCaption();

  min = trimTime(min);

  const previousDate = header._getNextDate(-1, caption.endDate);
  return previousDate < min;
};

const isNextButtonDisabled = (header: SchedulerHeader): boolean => {
  const maxOption = header.option('max');

  if (!maxOption) return false;

  const max = new Date(maxOption);
  const caption = header._getCaption();

  max.setHours(23, 59, 59);

  const nextDate = header._getNextDate(1, caption.startDate);
  return nextDate > max;
};

const getPreviousButtonOptions = (header: SchedulerHeader): DateNavigatorItem => {
  const ariaMessage = messageLocalization.format('dxScheduler-navigationPrevious');

  return {
    key: PREVIOUS_BUTTON_NAME,
    icon: 'chevronprev',
    elementAttr: {
      class: PREVIOUS_BUTTON_CLASS,
      'aria-label': ariaMessage,
    },
    onClick: () => header._updateDateByDirection(Direction.Left),
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
  key: CALENDAR_BUTTON_NAME,
  text: header.captionText,
  elementAttr: { class: CALENDAR_BUTTON_CLASS },
  onClick: (event) => header._showCalendar(event),
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
    key: NEXT_BUTTON_NAME,
    icon: 'chevronnext',
    elementAttr: {
      class: NEXT_BUTTON_CLASS,
      'aria-label': ariaMessage,
    },
    onClick: () => header._updateDateByDirection(Direction.Right),
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

export const getDateNavigator = (header: SchedulerHeader, item): ToolbarItem => {
  // @ts-expect-error
  const stylingMode = isMaterialBased() ? 'text' : 'contained';
  const config: ToolbarItem = extend(true, {}, {
    widget: 'dxButtonGroup',
    cssClass: DATE_NAVIGATOR_CLASS,
    options: {
      stylingMode,
      selectionMode: 'none',
    },
  }, item);
  const options = config.options as ButtonGroupOptions;
  const { onItemClick } = options;

  options.items = (options.items ?? DEFAULT_ITEMS).map((groupItem) => {
    switch (groupItem) {
      case PREVIOUS_BUTTON_NAME:
        return getPreviousButtonOptions(header);
      case NEXT_BUTTON_NAME:
        return getNextButtonOptions(header);
      case CALENDAR_BUTTON_NAME:
        return getCalendarButtonOptions(header);
      default:
        return groupItem;
    }
  });
  options.onItemClick = (event): void => {
    event.itemData.onClick(event);
    onItemClick?.(event);
  };

  return config;
};
