import type { Locator } from '@playwright/test';
import dateSerialization from 'devextreme/core/utils/date_serialization';
import dateUtils from 'devextreme/core/utils/date';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';

const CLASS = {
  cell: 'dx-calendar-cell',
  contouredCell: 'dx-calendar-contoured-date',
  weekNumberCell: 'dx-calendar-week-number-cell',
};

export default class CalendarView extends Widget {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxCalendarView'; }

  public getCellByDate(date: Date): Locator {
    return this.element.locator(`td[data-value='${dateSerialization.serializeDate(date, dateUtils.getShortDateFormat())}']`);
  }

  public getMonthCellByDate(date: Date): Locator {
    const foundDate = new Date(date);
    foundDate.setDate(1);

    return this.element.locator(`td[data-value='${dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat())}']`);
  }

  // eslint-disable-next-line class-methods-use-this
  public getDateByOffset(date: Date, offset: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);

    return newDate;
  }

  public getCellByOffset(date: Date, offset: number): Locator {
    return this.element.locator(`td[data-value='${dateSerialization.serializeDate(this.getDateByOffset(date, offset), dateUtils.getShortDateFormat())}']`);
  }

  public getCellByIndex(index: number): Locator {
    return this.element.locator(`.${CLASS.cell}`).nth(index);
  }

  public getWeekNumberCellByIndex(index: number): Locator {
    return this.element.locator(`.${CLASS.weekNumberCell}`).nth(index);
  }
}
