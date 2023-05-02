import { WidgetName } from '../../helpers/createWidget';
import Button from '../button';
import Widget from '../internal/widget';
import CalendarView from './view';

const CLASS = {
  widget: 'dx-widget',
  calendarViewsWrapper: 'dx-calendar-views-wrapper',
  footer: 'dx-calendar-footer',
  button: 'dx-button',
  todayButton: 'dx-calendar-today-button',
};

export default class Calendar extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxCalendar'; }

  getViewsWrapper(): Selector {
    return this.element.find(`.${CLASS.calendarViewsWrapper}`);
  }

  getView(): CalendarView {
    return new CalendarView(this.element.find(`.${CLASS.calendarViewsWrapper}`).find(`.${CLASS.widget}`).nth(0));
  }

  getTodayButton(): Button {
    return new Button(this.element.find(`.${CLASS.todayButton}`));
  }
}
