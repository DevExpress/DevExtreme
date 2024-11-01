import messageLocalization from '@js/common/core/localization/message';
import dateUtils from '@js/core/utils/date';
import { isMaterialBased } from '@js/ui/themes';

const { trimTime } = dateUtils;

const DATE_NAVIGATOR_CLASS = 'dx-scheduler-navigator';

const PREVIOUS_BUTTON_CLASS = 'dx-scheduler-navigator-previous';
const CALENDAR_BUTTON_CLASS = 'dx-scheduler-navigator-caption';
const NEXT_BUTTON_CLASS = 'dx-scheduler-navigator-next';

const DIRECTION_LEFT = -1;
const DIRECTION_RIGHT = 1;

export const getDateNavigator = (header, item) => {
  const items = [
    getPreviousButtonOptions(header),
    getCalendarButtonOptions(header),
    getNextButtonOptions(header),
  ];

  // @ts-expect-error
  const stylingMode = isMaterialBased() ? 'text' : 'contained';

  return {
    widget: 'dxButtonGroup',
    cssClass: DATE_NAVIGATOR_CLASS,
    options: {
      items,
      stylingMode,
      selectionMode: 'none',
      onItemClick: (e) => {
        e.itemData.clickHandler(e);
      },
    },
    ...item,
  };
};

const getPreviousButtonOptions = (header) => {
  const ariaMessage = messageLocalization.format('dxScheduler-navigationPrevious');

  return {
    key: 'previous',
    icon: 'chevronprev',
    elementAttr: {
      class: PREVIOUS_BUTTON_CLASS,
      'aria-label': ariaMessage,
    },
    clickHandler: () => header._updateDateByDirection(DIRECTION_LEFT),
    onContentReady: (e) => {
      const previousButton = e.component;
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

const getCalendarButtonOptions = (header) => ({
  key: 'calendar',
  text: header.captionText,
  elementAttr: { class: CALENDAR_BUTTON_CLASS },
  clickHandler: (e) => header._showCalendar(e),
  onContentReady: (e) => {
    const calendarButton = e.component;

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

const getNextButtonOptions = (header) => {
  const ariaMessage = messageLocalization.format('dxScheduler-navigationNext');

  return {
    key: 'next',
    icon: 'chevronnext',
    elementAttr: {
      class: NEXT_BUTTON_CLASS,
      'aria-label': ariaMessage,
    },
    clickHandler: () => header._updateDateByDirection(DIRECTION_RIGHT),
    onContentReady: (e) => {
      const nextButton = e.component;

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

const isPreviousButtonDisabled = (header) => {
  let min = header.option('min');

  if (!min) return false;

  min = new Date(min);

  const caption = header._getCaption();

  min = trimTime(min);

  const previousDate = header._getNextDate(-1, caption.endDate);
  return previousDate < min;
};

const isNextButtonDisabled = (header) => {
  let max = header.option('max');

  if (!max) return false;

  max = new Date(max);

  const caption = header._getCaption();

  max = max.setHours(23, 59, 59);

  const nextDate = header._getNextDate(1, caption.startDate);
  return nextDate > max;
};
