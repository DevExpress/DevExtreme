import { test } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';
import { createWidget, insertStylesheetRulesToPage, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const APPOINTMENT_TITLES = { usual: 'Usual', allDay: 'All-day' };
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;
const APPOINTMENTS: Record<string, Record<string, unknown>[]> = {
  week: [
    { startDate: '2023-09-05T05:00:00', endDate: '2023-09-05T09:00:00', text: APPOINTMENT_TITLES.usual },
    { startDate: '2023-09-05T00:00:00', endDate: '2023-09-06T00:00:00', text: APPOINTMENT_TITLES.allDay, allDay: true },
  ],
  month: [
    { startDate: '2023-09-05T10:00:00', endDate: '2023-09-06T15:00:00', text: APPOINTMENT_TITLES.usual },
    { startDate: '2023-09-05T00:00:00', endDate: '2023-09-06T00:00:00', text: APPOINTMENT_TITLES.allDay, allDay: true },
  ],
  timelineMonth: [
    { startDate: '2023-09-02T10:00:00', endDate: '2023-09-03T15:00:00', text: APPOINTMENT_TITLES.usual },
    { startDate: '2023-09-02T00:00:00', endDate: '2023-09-03T00:00:00', text: APPOINTMENT_TITLES.allDay, allDay: true },
  ],
};

enum ResizeType {
  startPlus = 'start-plus',
  startMinus = 'start-minus',
  endPlus = 'end-plus',
  endMinus = 'end-minus',
}

const isVerticalView = (viewType: string, isAllDay: boolean): boolean => !isAllDay && viewType === 'week';
const isStartResize = (resizeType: ResizeType): boolean =>
  resizeType === ResizeType.startPlus || resizeType === ResizeType.startMinus;

const getResizableHandle = (appointment: Locator, viewType: string, resizeType: ResizeType, isAllDay: boolean): Locator => {
  if (isVerticalView(viewType, isAllDay) && isStartResize(resizeType)) return appointment.locator('.dx-resizable-handle-top');
  if (isVerticalView(viewType, isAllDay) && !isStartResize(resizeType)) return appointment.locator('.dx-resizable-handle-bottom');
  if (isStartResize(resizeType)) return appointment.locator('.dx-resizable-handle-left');
  return appointment.locator('.dx-resizable-handle-right');
};

const getResizableValues = (viewType: string, resizeType: ResizeType, isAllDay: boolean): { x: number; y: number } => {
  if (isVerticalView(viewType, isAllDay) && resizeType === ResizeType.startPlus) return { x: 0, y: -100 };
  if (isVerticalView(viewType, isAllDay) && resizeType === ResizeType.startMinus) return { x: 0, y: 50 };
  if (isVerticalView(viewType, isAllDay) && resizeType === ResizeType.endPlus) return { x: 0, y: 100 };
  if (isVerticalView(viewType, isAllDay) && resizeType === ResizeType.endMinus) return { x: 0, y: -50 };
  if (resizeType === ResizeType.startPlus) return { x: -100, y: 0 };
  if (resizeType === ResizeType.startMinus) return { x: 50, y: 0 };
  if (resizeType === ResizeType.endPlus) return { x: 100, y: 0 };
  return { x: -50, y: 0 };
};

const doResize = async (page: Page, appointment: Locator, viewType: string, resizeType: ResizeType, isAllDay: boolean): Promise<void> => {
  const handle = getResizableHandle(appointment, viewType, resizeType, isAllDay);
  const { x, y } = getResizableValues(viewType, resizeType, isAllDay);
  const box = await handle.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + x, box.y + box.height / 2 + y, { steps: 5 });
    await page.mouse.up();
  }
};

const getScreenshotName = (viewType: string, resizeType: string, offset: number) =>
  `offset_resize-appts_${viewType}_${resizeType}_offset-${offset}.png`;

const VIEW_CONFIGS = [
  { views: [{ type: 'week', cellDuration: 60 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'month', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.month },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS.timelineMonth },
];

const setupPage = async (page: any) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme: string) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), process.env.THEME || 'fluent.blue.light');
};

test.describe.skip('Offset: Resize appointments', () => {
  test('Appointments resize common cases', async ({ page }) => {
    for (const { views, dataSource } of VIEW_CONFIGS) {
      for (const offset of [0, 735, -735]) {
        await setupPage(page);

        await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
        await createWidget(page, 'dxScheduler', {
          currentDate: '2023-09-07', height: 800, dataSource, views, currentView: views[0].type, offset,
        });

        const usualAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLES.usual });
        const allDayAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLES.allDay });
        const viewType = views[0].type;
        const workSpace = page.locator('.dx-scheduler-work-space');

        await doResize(page, usualAppt, viewType, ResizeType.startMinus, false);
        await doResize(page, allDayAppt, viewType, ResizeType.startMinus, true);
        await testScreenshot(page, getScreenshotName(viewType, ResizeType.startMinus, offset), { element: workSpace });

        await doResize(page, usualAppt, viewType, ResizeType.startPlus, false);
        await doResize(page, allDayAppt, viewType, ResizeType.startPlus, true);
        await testScreenshot(page, getScreenshotName(viewType, ResizeType.startPlus, offset), { element: workSpace });

        await doResize(page, usualAppt, viewType, ResizeType.endMinus, false);
        await doResize(page, allDayAppt, viewType, ResizeType.endMinus, true);
        await testScreenshot(page, getScreenshotName(viewType, ResizeType.endMinus, offset), { element: workSpace });

        await doResize(page, usualAppt, viewType, ResizeType.endPlus, false);
        await doResize(page, allDayAppt, viewType, ResizeType.endPlus, true);
        await testScreenshot(page, getScreenshotName(viewType, ResizeType.endPlus, offset), { element: workSpace });
      }
    }
  });

  test(`Should resize appointment correctly with startDayHour and endDayHour (view: 'week', offset: 720)`, async ({ page }) => {
    for (const offset of [-720, 720]) {
      await setupPage(page);

      await createWidget(page, 'dxScheduler', {
        dataSource: [
          { startDate: '2023-09-06T22:00:00', endDate: '2023-09-07T00:00:00', text: APPOINTMENT_TITLES.usual },
          { startDate: '2023-09-06T00:00:00', endDate: '2023-09-06T00:00:00', allDay: true, text: APPOINTMENT_TITLES.allDay },
        ],
        currentView: 'week', startDayHour: 10, endDayHour: 12, currentDate: '2023-09-07', height: 800, offset,
      });

      const usualAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLES.usual });
      const allDayAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLES.allDay });

      let box = await usualAppt.locator('.dx-resizable-handle-bottom').boundingBox();
      if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 50, { steps: 5 }); await page.mouse.up(); }

      box = await usualAppt.locator('.dx-resizable-handle-top').boundingBox();
      if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 50, { steps: 5 }); await page.mouse.up(); }

      box = await allDayAppt.locator('.dx-resizable-handle-left').boundingBox();
      if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2, { steps: 5 }); await page.mouse.up(); }

      box = await allDayAppt.locator('.dx-resizable-handle-right').boundingBox();
      if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2, { steps: 5 }); await page.mouse.up(); }

      const workSpace = page.locator('.dx-scheduler-work-space');
      await testScreenshot(page, `offset_resize-appts_week_offset-${offset}_startDayHour-10_endDayHour-12.png`, { element: workSpace });
    }
  });

  test(`Should resize appointment correctly with startDayHour and endDayHour (view: 'timelineDay', offset: 720)`, async ({ page }) => {
    for (const { offset, currentDate } of [{ offset: -720, currentDate: '2023-09-07' }, { offset: 720, currentDate: '2023-09-06' }]) {
      await setupPage(page);

      await createWidget(page, 'dxScheduler', {
        dataSource: [{ startDate: '2023-09-06T22:00:00', endDate: '2023-09-07T00:00:00', text: APPOINTMENT_TITLES.usual }],
        currentView: 'timelineDay', startDayHour: 10, endDayHour: 12, height: 800, currentDate, offset,
      });

      const usualAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLES.usual });

      let box = await usualAppt.locator('.dx-resizable-handle-left').boundingBox();
      if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 200, box.y + box.height / 2, { steps: 5 }); await page.mouse.up(); }

      box = await usualAppt.locator('.dx-resizable-handle-right').boundingBox();
      if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 - 200, box.y + box.height / 2, { steps: 5 }); await page.mouse.up(); }

      const workSpace = page.locator('.dx-scheduler-work-space');
      await testScreenshot(page, `offset_resize-appts_timelineDay_offset-${offset}_startDayHour-10_endDayHour-12.png`, { element: workSpace });
    }
  });
});
