import { test } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Scheduler: Current Time Indication: Shader', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const views = ['day', 'week', 'timelineDay', 'timelineWeek', 'timelineMonth'];
  const style = `
.dx-scheduler-date-time-shader-top::before,
.dx-scheduler-date-time-shader-bottom::before,
.dx-scheduler-timeline .dx-scheduler-date-time-shader::before,
.dx-scheduler-date-time-shader-all-day {
  background-color: red !important;
}`;

  const baseOptions = {
    dataSource: [],
    currentDate: new Date(2021, 7, 1),
    height: 400,
    width: 700,
    startDayHour: 5,
    indicatorTime: new Date(2021, 7, 1, 6),
    currentView: 'day',
    resources: [{
      fieldExpr: 'priorityId',
      dataSource: [
        { text: 'Low Priority', id: 0, color: '#24ff50' },
        { text: 'High Priority', id: 1, color: '#ff9747' },
      ],
      label: 'Priority',
    }],
    shadeUntilCurrentTime: true,
  };

  [false, true].forEach((crossScrollingEnabled) => {
    test(`Shader should be displayed correctly when crossScrollingEnabled=${crossScrollingEnabled}`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, style);
      await createWidget(page, 'dxScheduler', {
        ...baseOptions,
        views,
        crossScrollingEnabled,
      });

      for (const view of views) {
        await page.evaluate((v: string) => {
          ($('#container') as any).dxScheduler('instance').option('currentView', v);
        }, view);

        await testScreenshot(
          page,
          `shader-in-${view}-crossScrolling=${crossScrollingEnabled}.png`,
          { element: page.locator('.dx-scheduler-work-space') },
        );
      }
    });

    test(`Shader should be displayed correctly when crossScrollingEnabled=${crossScrollingEnabled} and horizontal grouping is used`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, style);
      await createWidget(page, 'dxScheduler', {
        ...baseOptions,
        views: [
          { type: 'day', groupOrientation: 'horizontal' },
          { type: 'week', groupOrientation: 'horizontal' },
          { type: 'tiemlineDay', groupOrientation: 'horizontal' },
          { type: 'timelineWeek', groupOrientation: 'horizontal' },
          { type: 'timelineMonth', groupOrientation: 'horizontal' },
        ],
        crossScrollingEnabled,
        groups: ['priorityId'],
      });

      for (const view of views) {
        await page.evaluate((v: string) => {
          ($('#container') as any).dxScheduler('instance').option('currentView', v);
        }, view);

        await testScreenshot(
          page,
          `shader-in-${view}-crossScrolling=${crossScrollingEnabled}-horizontal-grouping.png`,
          { element: page.locator('.dx-scheduler-work-space') },
        );
      }
    });

    test(`Shader should be displayed correctly when crossScrollingEnabled=${crossScrollingEnabled} and vertical grouping is used`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, style);
      await createWidget(page, 'dxScheduler', {
        ...baseOptions,
        views: [
          { type: 'day', groupOrientation: 'vertical' },
          { type: 'week', groupOrientation: 'vertical' },
          { type: 'tiemlineDay', groupOrientation: 'vertical' },
          { type: 'timelineWeek', groupOrientation: 'vertical' },
          { type: 'timelineMonth', groupOrientation: 'vertical' },
        ],
        crossScrollingEnabled,
        groups: ['priorityId'],
      });

      for (const view of views) {
        await page.evaluate((v: string) => {
          ($('#container') as any).dxScheduler('instance').option('currentView', v);
        }, view);

        await testScreenshot(
          page,
          `shader-in-${view}-crossScrolling=${crossScrollingEnabled}-vertical-grouping.png`,
          { element: page.locator('.dx-scheduler-work-space') },
        );
      }
    });
  });
});
