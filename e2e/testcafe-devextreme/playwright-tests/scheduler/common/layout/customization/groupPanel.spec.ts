import { test } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Scheduler: Layout Customization: Group Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const views = [
    { type: 'week', groupOrientation: 'vertical' },
    { type: 'month', groupOrientation: 'vertical' },
    { type: 'timelineWeek', groupOrientation: 'vertical' },
    { type: 'timelineMonth', groupOrientation: 'vertical' },
  ];

  [false, true].forEach((crossScrollingEnabled) => {
    test(`Group panel customization should work (crossScrollingEnabled=${crossScrollingEnabled})`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, '#container .dx-scheduler-group-header { width: 200px;}');

      await createWidget(page, 'dxScheduler', {
        currentDate: new Date(2021, 4, 11),
        height: 500,
        width: 700,
        startDayHour: 9,
        showAllDayPanel: false,
        dataSource: [{
          text: 'Create Report on Customer Feedback',
          startDate: new Date(2021, 4, 1, 14),
          endDate: new Date(2021, 4, 1, 15),
          priorityId: 0,
        }, {
          text: 'Review Customer Feedback Report',
          startDate: new Date(2021, 4, 9, 9, 30),
          endDate: new Date(2021, 4, 9, 11),
          priorityId: 0,
        }],
        groups: ['priorityId'],
        resources: [{
          fieldExpr: 'priorityId',
          dataSource: [
            { text: 'Low Priority', id: 0, color: '#24ff50' },
            { text: 'High Priority', id: 1, color: '#ff9747' },
          ],
          label: 'Priority',
        }],
        views,
        crossScrollingEnabled,
      });

      for (const view of views) {
        await page.evaluate((viewType: string) => {
          ($('#container') as any).dxScheduler('instance').option('currentView', viewType);
        }, view.type);

        await testScreenshot(
          page,
          `custom-group-panel-in-${view.type}-cross-scrolling=${crossScrollingEnabled}.png`,
          { element: page.locator('.dx-scheduler') },
        );
      }
    });
  });
});
