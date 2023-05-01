import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import dateSerialization from '../../../../js/core/utils/date_serialization';
import dateUtils from '../../../../js/core/utils/date';

export default class CalendarView extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxCalendarView'; }

  getCellByDate(date: Date): Selector {
    return this.element.find(`td[data-value='${dateSerialization.serializeDate(date, dateUtils.getShortDateFormat())}']`);
  }

  // eslint-disable-next-line class-methods-use-this
  getDateByOffset(date: Date, offset: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);

    return newDate;
  }

  getCellByOffset(date: Date, offset: number): Selector {
    return this.element.find(`td[data-value='${dateSerialization.serializeDate(this.getDateByOffset(date, offset), dateUtils.getShortDateFormat())}']`);
  }
}
