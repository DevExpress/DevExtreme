import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const createScheduler = async (page: Page): Promise<void> => createWidget(page, 'dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 28),
  width: 600,
  height: 400,
});

test.describe('Date navigator', () => {
  [{
    agendaDuration: 20,
    result: '11-30 May 2021',
  }, {
    agendaDuration: 40,
    result: '11 May-19 Jun 2021',
  }].forEach(({ agendaDuration, result }) => {
    test(`Caption of date navigator should be valid after change view to Agenda with agendaDuration=${agendaDuration}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [],
        views: [{
          type: 'agenda',
          agendaDuration,
        }, 'month'],
        currentView: 'month',
        currentDate: new Date(2021, 4, 11),
        height: 600,
      });

      const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

      await toolbar.viewSwitcher.getButton('Month').element.click();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      await expect(toolbar.navigator.caption).toHaveText(result);
    });
  });

  test('Current date in Calendar should be respond on prev and next buttons of Navigator', async ({ page }) => {
    await createScheduler(page);

    const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

    await toolbar.navigator.caption.click();

    await testScreenshot(page, 'initial-calendar-state.png');

    await toolbar.navigator.nextButton.click();
    await toolbar.navigator.nextButton.click();
    await toolbar.navigator.nextButton.click();
    await toolbar.navigator.caption.click();

    await testScreenshot(page, 'calendar-state-after-next-button-click.png');

    await toolbar.navigator.prevButton.click();
    await toolbar.navigator.prevButton.click();
    await toolbar.navigator.prevButton.click();
    await toolbar.navigator.prevButton.click();
    await toolbar.navigator.prevButton.click();
    await toolbar.navigator.prevButton.click();
    await toolbar.navigator.caption.click();

    await testScreenshot(page, 'calendar-state-after-prev-button-click.png');
  });

  test('Current date in Navigator should be respond on Current date of Calendar', async ({ page }) => {
    await createScheduler(page);

    const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);
    const { navigator } = toolbar;

    await toolbar.navigator.caption.click();

    await navigator.calendar.nextButton.click();
    await navigator.calendar.getCell(20).click();

    await testScreenshot(page, 'navigator-state-after-calendar-next-button-click.png');

    await toolbar.navigator.caption.click();
    await navigator.calendar.prevButton.click();
    await navigator.calendar.prevButton.click();
    await toolbar.navigator.calendar.getCell(15).click();

    await testScreenshot(page, 'navigator-state-after-calendar-prev-button-click.png');
  });

  test('Current date in navigator should be updated if scheduler currentDate is changed', async ({ page }) => {
    await createScheduler(page);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('currentDate', new Date(2022, 2, 28));

    await scheduler.toolbar.navigator.caption.click();

    await testScreenshot(
      page,
      'navigator-state-after-change-currentDate-option.png',
      { element: scheduler.toolbar.navigator.calendar.element },
    );
  });

  test('Calendar should be have right appearance', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
    });

    const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

    await toolbar.navigator.caption.click();

    await testScreenshot(
      page,
      'right-calendar-appearance.png',
      { element: toolbar.navigator.calendar.element },
    );
  });
});
