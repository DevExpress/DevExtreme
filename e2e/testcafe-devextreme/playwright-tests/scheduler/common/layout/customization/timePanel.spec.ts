import { test } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Scheduler: Layout Customization: Time Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['week', 'agenda'].forEach((view) => {
    test(`Time panel customization should work in ${view} view`, async ({ page }) => {
      for (const crossScrollingEnabled of [false, true]) {
        await insertStylesheetRulesToPage(page, '#container .dx-scheduler-time-panel { width: 150px;}');

        await createWidget(page, 'dxScheduler', {
          timeZone: 'America/Los_Angeles',
          currentDate: new Date(2021, 4, 11),
          height: 500,
          width: 700,
          startDayHour: 9,
          showAllDayPanel: false,
          dataSource: [{
            text: 'Create Report on Customer Feedback',
            startDate: new Date('2021-05-11T22:15:00.000Z'),
            endDate: new Date('2021-05-12T00:30:00.000Z'),
          }, {
            text: 'Review Customer Feedback Report',
            startDate: new Date('2021-05-11T23:15:00.000Z'),
            endDate: new Date('2021-05-12T01:30:00.000Z'),
          }, {
            text: 'Customer Feedback Report Analysis',
            startDate: new Date('2021-05-12T16:30:00.000Z'),
            endDate: new Date('2021-05-12T17:30:00.000Z'),
            recurrenceRule: 'FREQ=WEEKLY',
          }, {
            text: 'Prepare Shipping Cost Analysis Report',
            startDate: new Date('2021-05-12T19:30:00.000Z'),
            endDate: new Date('2021-05-12T20:30:00.000Z'),
          }, {
            text: 'Provide Feedback on Shippers',
            startDate: new Date('2021-05-12T21:15:00.000Z'),
            endDate: new Date('2021-05-12T23:00:00.000Z'),
          }, {
            text: 'Select Preferred Shipper',
            startDate: new Date('2021-05-13T00:30:00.000Z'),
            endDate: new Date('2021-05-13T03:00:00.000Z'),
          }, {
            text: 'Complete Shipper Selection Form',
            startDate: new Date('2021-05-13T15:30:00.000Z'),
            endDate: new Date('2021-05-13T17:00:00.000Z'),
          }, {
            text: 'Upgrade Server Hardware',
            startDate: new Date('2021-05-13T19:00:00.000Z'),
            endDate: new Date('2021-05-13T21:15:00.000Z'),
            recurrenceRule: 'FREQ=WEEKLY',
          }, {
            text: 'Upgrade Personal Computers',
            startDate: new Date('2021-05-13T21:45:00.000Z'),
            endDate: new Date('2021-05-13T23:30:00.000Z'),
          }],
          views: [view],
          currentView: view,
          crossScrollingEnabled,
        });

        await testScreenshot(
          page,
          `custom-time-panel-in-${view}-cross-scrolling=${crossScrollingEnabled}.png`,
          { element: '#container' },
        );
      }
    });
  });
});
