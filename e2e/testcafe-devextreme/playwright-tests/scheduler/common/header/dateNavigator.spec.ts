import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Date navigator', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

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

      const viewSwitcherMonthButton = page.locator('.dx-scheduler-view-switcher .dx-buttongroup .dx-button').filter({ hasText: 'Month' });
      await viewSwitcherMonthButton.click();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      const caption = page.locator('.dx-scheduler-navigator-caption');
      await expect(caption).toHaveText(result);
    });
  });

  test('Current date in Calendar should be respond on prev and next buttons of Navigator', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      width: 600,
      height: 400,
    });

    const caption = page.locator('.dx-scheduler-navigator-caption');
    const nextButton = page.locator('.dx-scheduler-navigator-next');
    const prevButton = page.locator('.dx-scheduler-navigator-previous');

    await caption.click();
    await testScreenshot(page, 'initial-calendar-state.png');

    await nextButton.click();
    await nextButton.click();
    await nextButton.click();
    await caption.click();
    await testScreenshot(page, 'calendar-state-after-next-button-click.png');

    await prevButton.click();
    await prevButton.click();
    await prevButton.click();
    await prevButton.click();
    await prevButton.click();
    await prevButton.click();
    await caption.click();
    await testScreenshot(page, 'calendar-state-after-prev-button-click.png');
  });

  test('Current date in Navigator should be respond on Current date of Calendar', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      width: 600,
      height: 400,
    });

    const caption = page.locator('.dx-scheduler-navigator-caption');

    await caption.click();

    const calendarNextButton = page.locator('.dx-calendar .dx-calendar-navigator-next-view');
    const calendarPrevButton = page.locator('.dx-calendar .dx-calendar-navigator-previous-view');
    const calendarCells = page.locator('.dx-calendar-body td.dx-calendar-cell');

    await calendarNextButton.click();
    await calendarCells.nth(20).click();

    await testScreenshot(page, 'navigator-state-after-calendar-next-button-click.png');

    await caption.click();
    await calendarPrevButton.click();
    await calendarPrevButton.click();
    await calendarCells.nth(15).click();

    await testScreenshot(page, 'navigator-state-after-calendar-prev-button-click.png');
  });

  test('Current date in navigator should be updated if scheduler currentDate is changed', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      width: 600,
      height: 400,
    });

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('instance').option('currentDate', new Date(2022, 2, 28));
    });

    const caption = page.locator('.dx-scheduler-navigator-caption');
    await caption.click();

    await testScreenshot(
      page,
      'navigator-state-after-change-currentDate-option.png',
      { element: page.locator('.dx-calendar') },
    );
  });

  test('Calendar should be have right appearance', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
    });

    const caption = page.locator('.dx-scheduler-navigator-caption');
    await caption.click();

    await testScreenshot(
      page,
      'right-calendar-appearance.png',
      { element: page.locator('.dx-calendar') },
    );
  });
});
