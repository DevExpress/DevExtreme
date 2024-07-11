"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateNavigator = void 0;
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _themes = require("../../../ui/themes");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const {
  trimTime
} = _date.default;
const DATE_NAVIGATOR_CLASS = 'dx-scheduler-navigator';
const PREVIOUS_BUTTON_CLASS = 'dx-scheduler-navigator-previous';
const CALENDAR_BUTTON_CLASS = 'dx-scheduler-navigator-caption';
const NEXT_BUTTON_CLASS = 'dx-scheduler-navigator-next';
const DIRECTION_LEFT = -1;
const DIRECTION_RIGHT = 1;
const getDateNavigator = (header, item) => {
  const items = [getPreviousButtonOptions(header), getCalendarButtonOptions(header), getNextButtonOptions(header)];
  // @ts-expect-error
  const stylingMode = (0, _themes.isMaterialBased)() ? 'text' : 'contained';
  return _extends({
    widget: 'dxButtonGroup',
    cssClass: DATE_NAVIGATOR_CLASS,
    options: {
      items,
      stylingMode,
      selectionMode: 'none',
      onItemClick: e => {
        e.itemData.clickHandler(e);
      }
    }
  }, item);
};
exports.getDateNavigator = getDateNavigator;
const getPreviousButtonOptions = header => ({
  key: 'previous',
  icon: 'chevronprev',
  elementAttr: {
    class: PREVIOUS_BUTTON_CLASS
  },
  clickHandler: () => header._updateDateByDirection(DIRECTION_LEFT),
  onContentReady: e => {
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
  }
});
const getCalendarButtonOptions = header => ({
  key: 'calendar',
  text: header.captionText,
  elementAttr: {
    class: CALENDAR_BUTTON_CLASS
  },
  clickHandler: e => header._showCalendar(e),
  onContentReady: e => {
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
  }
});
const getNextButtonOptions = header => ({
  key: 'next',
  icon: 'chevronnext',
  elementAttr: {
    class: NEXT_BUTTON_CLASS
  },
  clickHandler: () => header._updateDateByDirection(DIRECTION_RIGHT),
  onContentReady: e => {
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
  }
});
const isPreviousButtonDisabled = header => {
  let min = header.option('min');
  if (!min) return false;
  min = new Date(min);
  const caption = header._getCaption();
  min = trimTime(min);
  const previousDate = header._getNextDate(-1, caption.endDate);
  return previousDate < min;
};
const isNextButtonDisabled = header => {
  let max = header.option('max');
  if (!max) return false;
  max = new Date(max);
  const caption = header._getCaption();
  max = max.setHours(23, 59, 59);
  const nextDate = header._getNextDate(1, caption.startDate);
  return nextDate > max;
};