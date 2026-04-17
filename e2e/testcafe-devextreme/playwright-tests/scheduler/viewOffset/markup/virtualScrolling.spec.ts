import { test } from '@playwright/test';
import { createWidget, insertStylesheetRulesToPage, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;
const APPOINTMENTS = [
  { startDate: '2023-09-05T00:00:00', endDate: '2023-09-05T03:00:00', text: '#0 Usual 05 00:00->03:00' },
  { startDate: '2023-09-05T04:00:00', endDate: '2023-09-05T09:00:00', text: '#1 Usual 05 05:00->09:00' },
  { startDate: '2023-09-05T10:30:00', endDate: '2023-09-05T16:30:00', text: '#2 Usual 05 12:30->16:30' },
  { startDate: '2023-09-05T17:00:00', endDate: '2023-09-05T23:30:00', text: '#3 Usual 05 18:00->22:00' },
  { startDate: '2023-09-05T00:00:00', endDate: '2023-09-05T00:00:00', text: '#4 All-day 05', allDay: true },
];

const getScreenshotName = (viewType: string, offset: number, startDayHour: number, endDayHour: number) =>
  `view_markup_virtual-scrolling_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}.png`;

const VIEW_CONFIGS = [
  { views: [{ type: 'week', cellDuration: 60 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'month' }], dataSource: APPOINTMENTS },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS },
];

const setupPage = async (page: any) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme: string) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), process.env.THEME || 'fluent.blue.light');
};

test.describe.skip('Offset: Markup virtual scrolling', () => {
  test('Virtual scrolling render', async ({ page }) => {
    for (const { views, dataSource } of VIEW_CONFIGS) {
      for (const offset of [0, 735, 1440, -735, -1440]) {
        for (const { startDayHour, endDayHour } of [{ startDayHour: 0, endDayHour: 24 }, { startDayHour: 9, endDayHour: 17 }]) {
          await setupPage(page);

          await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
          await createWidget(page, 'dxScheduler', {
            currentDate: '2023-09-07',
            height: 800,
            maxAppointmentsPerCell: 'unlimited',
            dataSource,
            views,
            currentView: views[0].type,
            offset,
            startDayHour,
            endDayHour,
          });

          const workSpace = page.locator('.dx-scheduler-work-space');
          await testScreenshot(page, getScreenshotName(views[0].type, offset, startDayHour, endDayHour), { element: workSpace });
        }
      }
    }
  });
});
