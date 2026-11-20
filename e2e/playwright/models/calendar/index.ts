import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import Button from '../button';
import Widget from '../internal/widget';
import CalendarView from './view';

const CLASS = {
  widget: 'dx-widget',
  calendarViewsWrapper: 'dx-calendar-views-wrapper',
  todayButton: 'dx-calendar-today-button',
  otherMonth: 'dx-calendar-other-month',
  cellInRange: 'dx-calendar-cell-in-range',
  cellInRangeStart: 'dx-calendar-range-start-date',
  cellInRangeEnd: 'dx-calendar-range-end-date',
  cellInHoveredRange: 'dx-calendar-cell-range-hover',
  cellInHoveredRangeStart: 'dx-calendar-cell-range-hover-start',
  cellInHoveredRangeEnd: 'dx-calendar-cell-range-hover-end',
  navigatorNextView: 'dx-calendar-navigator-next-view',
  navigatorPrevView: 'dx-calendar-navigator-previous-view',
  navigatorCaption: 'dx-calendar-caption-button',
};

export default class Calendar extends Widget {
  name: WidgetName = 'dxCalendar';

  public getSelectedRangeCells(): Locator {
    return this.element.locator(`.${CLASS.cellInRange}`);
  }

  public getSelectedRangeStartCell(): Locator {
    return this.element.locator(`.${CLASS.cellInRangeStart}:not(.${CLASS.otherMonth})`);
  }

  public getSelectedRangeEndCell(): Locator {
    return this.element.locator(`.${CLASS.cellInRangeEnd}`);
  }

  public getHoveredRangeCells(): Locator {
    return this.element.locator(`.${CLASS.cellInHoveredRange}`);
  }

  public getHoveredRangeStartCell(): Locator {
    return this.element.locator(`.${CLASS.cellInHoveredRangeStart}`);
  }

  public getHoveredRangeEndCell(): Locator {
    return this.element.locator(`.${CLASS.cellInHoveredRangeEnd}`);
  }

  public getView(): CalendarView {
    return new CalendarView(
      this.page,
      this.element.locator(`.${CLASS.calendarViewsWrapper} .${CLASS.widget}`).first(),
    );
  }

  public getNavigatorNextButton(): Button {
    return new Button(this.page, this.element.locator(`.${CLASS.navigatorNextView}`));
  }

  public getNavigatorPrevButton(): Button {
    return new Button(this.page, this.element.locator(`.${CLASS.navigatorPrevView}`));
  }

  public getNavigatorCaption(): Button {
    return new Button(this.page, this.element.locator(`.${CLASS.navigatorCaption}`));
  }

  public getTodayButton(): Button {
    return new Button(this.page, this.element.locator(`.${CLASS.todayButton}`));
  }

  public getCellByDate(date: string): Locator {
    return this.element.locator(`*[data-value="${date}"]:not(.${CLASS.otherMonth})`);
  }

  public async showGestureCover(): Promise<void> {
    await this.element.evaluate((element) => {
      const $element = $(element);
      const { left = 0 } = $element.offset() ?? {};

      $element.trigger($.Event('dxpointerdown', {
        pageX: left,
        pointers: [{ pointerId: 1 }],
      }));

      $element.trigger($.Event('dxpointermove', {
        pageX: left + 20,
        pointers: [{ pointerId: 1 }],
      }));

      $element.trigger($.Event('mouseup', {
        pointers: [{ pointerId: 1 }],
      }));
    });
  }

  public async swipeStart(): Promise<void> {
    await this.element.evaluate((element) => {
      $(element).trigger($.Event('dxswipestart', {
        pointers: [{ pointerId: 1 }],
      }));
    });
  }

  public async swipe(offset: number): Promise<void> {
    await this.element.evaluate((element, swipeOffset) => {
      $(element).trigger($.Event('dxswipe', {
        offset: swipeOffset,
        pointers: [{ pointerId: 1 }],
      }));
    }, offset);
  }

  public async swipeEnd(): Promise<void> {
    await this.element.evaluate((element) => {
      $(element).trigger($.Event('dxswipeend', {
        pointers: [{ pointerId: 1 }],
      }));
    });
  }
}
