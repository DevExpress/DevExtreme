import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import CalendarView from './calendarView';

const CLASS = {
  widget: 'dx-widget',
  calendarViewsWrapper: 'dx-calendar-views-wrapper',
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
}
