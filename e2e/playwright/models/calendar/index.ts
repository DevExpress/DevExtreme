import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Button from '../button';
import CalendarView from './view';

const CLASS = {
  widget: 'dx-widget',
  calendarViewsWrapper: 'dx-calendar-views-wrapper',
  footer: 'dx-calendar-footer',
  button: 'dx-button',
  todayButton: 'dx-calendar-today-button',
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
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxCalendar'; }

  public getSelectedRangeCells(): Locator {
    return this.element.locator(`.${CLASS.cellInRange}`);
  }

  public getSelectedRangeStartCell(): Locator {
    return this.element.locator(`.${CLASS.cellInRangeStart}:not(.dx-calendar-other-month)`);
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

  public getViewsWrapper(): Locator {
    return this.element.locator(`.${CLASS.calendarViewsWrapper}`);
  }

  public getView(): CalendarView {
    return new CalendarView(
      this.page,
      this.element.locator(`.${CLASS.calendarViewsWrapper}`).locator(`.${CLASS.widget}`).nth(0),
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
    return this.element.locator(`*[data-value="${date}"]:not(.dx-calendar-other-month)`);
  }

  public async showGestureCover(): Promise<void> {
    await this.element.evaluate((element) => {
      const $element = $(element);
      const offset = $element.offset() ?? { left: 0, top: 0 };

      $element.trigger($.Event('dxpointerdown', {
        pageX: offset.left,
        pointers: [{ pointerId: 1 }],
      } as any));

      $element.trigger($.Event('dxpointermove', {
        pageX: offset.left + 20,
        pointers: [{ pointerId: 1 }],
      } as any));

      $element.trigger($.Event('mouseup', {
        pointers: [{ pointerId: 1 }],
      } as any));
    });
  }

  public async swipeStart(): Promise<void> {
    await this.element.evaluate((element) => {
      $(element).trigger($.Event('dxswipestart', {
        pointers: [{ pointerId: 1 }],
      } as any));
    });
  }

  public async swipe(offset: number): Promise<void> {
    await this.element.evaluate((element, swipeOffset) => {
      $(element).trigger($.Event('dxswipe', {
        offset: swipeOffset,
        pointers: [{ pointerId: 1 }],
      } as any));
    }, offset);
  }

  public async swipeEnd(): Promise<void> {
    await this.element.evaluate((element) => {
      $(element).trigger($.Event('dxswipeend', {
        pointers: [{ pointerId: 1 }],
      } as any));
    });
  }
}
