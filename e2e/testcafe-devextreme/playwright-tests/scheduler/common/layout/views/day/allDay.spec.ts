import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe('Layout:Views:Day:AllDay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [1, 2].forEach((intervalCount) => {
    ['horizontal', 'vertical'].forEach((groupOrientation) => {
      [true, false].forEach((showAllDayPanel) => {
        test(`Day view with interval and crossScrollingEnabled(groupOrientation='${groupOrientation}', showAllDayPanel='${showAllDayPanel}', intervalCount='${intervalCount}') layout test`, async ({ page }) => {
          await createWidget(page, 'dxScheduler', {
            resources: [{ fieldExpr: 'roomId', dataSource: [{ text: 'Room 1', id: 1 }, { text: 'Room 2', id: 2 }], label: 'Room' }],
            dataSource: [], views: [{ name: 'dayView', type: 'day', intervalCount, groupOrientation }],
            currentView: 'dayView', currentDate: new Date(2021, 2, 25), height: 600,
            groups: ['roomId'], showAllDayPanel, crossScrollingEnabled: true,
          });
          await page.evaluate(() => { ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().option('useNative', true); });
          await testScreenshot(page, `day-orientation=${groupOrientation}-allDay=${showAllDayPanel}-interval=${intervalCount}.png`, { element: page.locator('.dx-scheduler') });
        });
      });
    });
  });
});
