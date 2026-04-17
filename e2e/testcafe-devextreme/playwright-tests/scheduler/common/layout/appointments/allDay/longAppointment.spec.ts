import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe('Layout:Appointments:AllDay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test("Long all day appointment should be render, if him ended on next view day in currentView: 'day'(T1021963)", async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{ allDay: true, startDate: new Date(2021, 2, 28), endDate: new Date(2021, 2, 29) }],
      views: ['day'], currentView: 'day', currentDate: new Date(2021, 2, 28),
      startDayHour: 9, width: 400, height: 600,
    });

    const prevButton = page.locator('.dx-scheduler-navigator-previous');
    const nextButton = page.locator('.dx-scheduler-navigator-next');
    const workSpace = page.locator('.dx-scheduler-work-space');

    await prevButton.click();
    await testScreenshot(page, '27-march-day-view.png', { element: workSpace });
    await nextButton.click();
    await testScreenshot(page, '28-march-day-view.png', { element: workSpace });
    await nextButton.click();
    await testScreenshot(page, '29-march-day-view.png', { element: workSpace });
    await nextButton.click();
    await testScreenshot(page, '30-march-day-view.png', { element: workSpace });
  });

  test('Long all day appointment should be render, if him ended on next view day in currentView:', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{ allDay: true, startDate: new Date(2021, 2, 27), endDate: new Date(2021, 3, 4) }],
      views: ['week'], currentView: 'week', currentDate: new Date(2021, 2, 28),
      startDayHour: 9, width: 600, height: 600,
    });

    const prevButton = page.locator('.dx-scheduler-navigator-previous');
    const nextButton = page.locator('.dx-scheduler-navigator-next');
    const workSpace = page.locator('.dx-scheduler-work-space');

    await prevButton.click();
    await testScreenshot(page, '21-27-march-week-view.png', { element: workSpace });
    await nextButton.click();
    await testScreenshot(page, '28-march-3-apr-week-view.png', { element: workSpace });
    await nextButton.click();
    await testScreenshot(page, '4-10-apr-week-view.png', { element: workSpace });
  });
});
