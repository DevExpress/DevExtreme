import { test } from '@playwright/test';
import { createWidget, insertStylesheetRulesToPage, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const APPOINTMENT_TITLE = 'Test';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;
const APPOINTMENTS: Record<string, Record<string, unknown>[]> = {
  week: [{ startDate: '2023-09-05T05:00:00', endDate: '2023-09-05T09:00:00', text: APPOINTMENT_TITLE }],
  month: [{ startDate: '2023-09-05T10:00:00', endDate: '2023-09-06T15:00:00', text: APPOINTMENT_TITLE }],
  timelineMonth: [{ startDate: '2023-09-02T10:00:00', endDate: '2023-09-03T15:00:00', text: APPOINTMENT_TITLE }],
  allDayWeek: [{ startDate: '2023-09-05T05:00:00', endDate: '2023-09-05T09:00:00', text: APPOINTMENT_TITLE, allDay: true }],
  allDayMonth: [{ startDate: '2023-09-05T10:00:00', endDate: '2023-09-06T15:00:00', text: APPOINTMENT_TITLE, allDay: true }],
  allDayTimelineMonth: [{ startDate: '2023-09-02T10:00:00', endDate: '2023-09-03T15:00:00', text: APPOINTMENT_TITLE, allDay: true }],
};

const getDragCoordinatesByView = (viewType: string): { x: number; y: number } => {
  switch (viewType) {
    case 'week': return { x: 150, y: 0 };
    case 'month': return { x: 300, y: 300 };
    default: return { x: 300, y: 0 };
  }
};

const getScreenshotName = (viewType: string, offset: number, isAllDay: boolean) =>
  `offset_drag-n-drop_${isAllDay ? 'all-day' : 'usual'}-appts_${viewType}_offset-${offset}.png`;

const viewConfigs = [
  { views: [{ type: 'week', cellDuration: 60 }], dataSource: APPOINTMENTS.week, isAllDay: false },
  { views: [{ type: 'week', cellDuration: 60 }], dataSource: APPOINTMENTS.allDayWeek, isAllDay: true },
  { views: [{ type: 'month' }], dataSource: APPOINTMENTS.month, isAllDay: false },
  { views: [{ type: 'month' }], dataSource: APPOINTMENTS.allDayMonth, isAllDay: true },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS.timelineMonth, isAllDay: false },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS.allDayTimelineMonth, isAllDay: true },
];

const setupPage = async (page: any) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme: string) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), process.env.THEME || 'fluent.blue.light');
};

test.describe('Offset: Drag-n-drop appointments', () => {
  test('Usual appointments drag-n-drop', async ({ page }) => {
    for (const { views, dataSource, isAllDay } of viewConfigs) {
      for (const offset of [0, 735, -735]) {
        await setupPage(page);

        await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
        await createWidget(page, 'dxScheduler', {
          currentDate: '2023-09-07',
          height: 800,
          dataSource,
          views,
          currentView: views[0].type,
          offset,
        });

        const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLE });
        const viewType = views[0].type;
        const { x, y } = getDragCoordinatesByView(viewType);

        const box = await appointment.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + x, box.y + box.height / 2 + y, { steps: 5 });
          await page.mouse.up();
        }

        const workSpace = page.locator('.dx-scheduler-work-space');
        await testScreenshot(page, getScreenshotName(viewType, offset, isAllDay), { element: workSpace });
      }
    }
  });
});
