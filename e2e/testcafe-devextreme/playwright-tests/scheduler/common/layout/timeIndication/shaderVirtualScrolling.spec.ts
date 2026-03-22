import { test } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Scheduler: Current Time Indication: Shader with Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 600 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const style = `
.dx-scheduler-date-time-shader-top::before,
.dx-scheduler-date-time-shader-bottom::before,
.dx-scheduler-timeline .dx-scheduler-date-time-shader::before,
.dx-scheduler-date-time-shader-all-day {
  background-color: red !important;
}`;

  const resources = [
    { text: 'Room 1', id: 1, color: '#cb6bb2' },
    { text: 'Room 2', id: 2, color: '#56ca85' },
    { text: 'Room 3', id: 3, color: '#1e90ff' },
    { text: 'Room 4', id: 4, color: '#ff9747' },
    { text: 'Room 5', id: 5, color: '#ff6a00' },
    { text: 'Room 6', id: 6, color: '#ffc0cb' },
  ];

  test('Should render shader correct with virtual scrolling without current time indicator', async ({ page }) => {
    await insertStylesheetRulesToPage(page, style);

    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: 'week',
      views: ['week'],
      groups: ['roomId'],
      resources: [{ fieldExpr: 'roomId', dataSource: resources, label: 'Room' }],
      startDayHour: 8,
      endDayHour: 18,
      currentDate: new Date(2025, 9, 15),
      height: 400,
      shadeUntilCurrentTime: true,
      scrolling: { mode: 'virtual' },
    });

    await testScreenshot(page, 'shader-virtual-scrolling-week-start.png');

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('instance').scrollTo(
        new Date(2025, 9, 15, 17, 30), { roomId: 6 },
      );
    });

    await testScreenshot(page, 'shader-virtual-scrolling-week-end.png');
  });

  test('Should render shader correctly with virtual scrolling and current time indicator', async ({ page }) => {
    await insertStylesheetRulesToPage(page, style);

    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: 'week',
      views: ['week'],
      groups: ['roomId'],
      resources: [{ fieldExpr: 'roomId', dataSource: resources, label: 'Room' }],
      startDayHour: 8,
      endDayHour: 18,
      currentDate: new Date(2025, 9, 15),
      indicatorTime: new Date(2025, 9, 15, 17, 30),
      height: 400,
      shadeUntilCurrentTime: true,
      scrolling: { mode: 'virtual' },
    });

    await testScreenshot(page, 'shader-virtual-scrolling-week-start-with-current-time-indicator.png');

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('instance').scrollTo(
        new Date(2025, 9, 15, 17, 30), { roomId: 6 },
      );
    });

    await testScreenshot(page, 'shader-virtual-scrolling-week-end-with-current-time-indicator.png');
  });
});
