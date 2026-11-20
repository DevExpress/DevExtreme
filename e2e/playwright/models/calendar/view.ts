import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';

const CLASS = {
  cell: 'dx-calendar-cell',
  weekNumberCell: 'dx-calendar-week-number-cell',
};

const serializeDate = (date: Date): string => [
  String(date.getFullYear()).padStart(4, '0'),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('/');

export default class CalendarView extends Widget {
  name: WidgetName = 'dxCalendarView';

  public getCellByDate(date: Date): Locator {
    return this.element.locator(`td[data-value='${serializeDate(date)}']`);
  }

  public getMonthCellByDate(date: Date): Locator {
    const foundDate = new Date(date);

    foundDate.setDate(1);

    return this.getCellByDate(foundDate);
  }

  public getCellByOffset(date: Date, offset: number): Locator {
    const foundDate = new Date(date);

    foundDate.setDate(foundDate.getDate() + offset);

    return this.getCellByDate(foundDate);
  }

  public getCellByIndex(index: number): Locator {
    return this.element.locator(`.${CLASS.cell}`).nth(index);
  }

  public getWeekNumberCellByIndex(index: number): Locator {
    return this.element.locator(`.${CLASS.weekNumberCell}`).nth(index);
  }
}
