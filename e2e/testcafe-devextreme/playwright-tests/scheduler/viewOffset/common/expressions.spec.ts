import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const APPOINTMENT_TITLES = { usual: 'Usual', allDay: 'All-day' };
const APPOINTMENTS = {
  week: [
    { StartDate2: '2023-09-06T04:00:00', EndDate2: '2023-09-06T06:00:00', Text2: APPOINTMENT_TITLES.usual },
    { StartDate2: '2023-09-06T00:00:00', EndDate2: '2023-09-06T00:00:00', Text2: APPOINTMENT_TITLES.allDay, AllDay2: true },
  ],
};

const setupPage = async (page: any) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme: string) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), process.env.THEME || 'fluent.blue.light');
};

test.describe.skip('Offset: Appointment expressions', () => {
  test('Appointment with expr common test', async ({ page }) => {
    const views = [{ type: 'week', cellDuration: 60 }];
    const dataSource = APPOINTMENTS.week;

    for (const offset of [0, 180, -180]) {
      await setupPage(page);

      await createWidget(page, 'dxScheduler', {
        currentDate: '2023-09-05',
        height: 800,
        dataSource,
        views,
        currentView: views[0].type,
        offset,
        startDateExpr: 'StartDate2',
        endDateExpr: 'EndDate2',
        textExpr: 'Text2',
        allDayExpr: 'AllDay2',
      });

      const workSpace = page.locator('.dx-scheduler-work-space');
      const usualAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLES.usual });
      const allDayAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TITLES.allDay });
      const viewType = views[0].type;

      await testScreenshot(page, `offset_appt-expr_${viewType}_offset-${offset}.png`, { element: workSpace });

      let box = await usualAppointment.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 100, { steps: 5 });
        await page.mouse.up();
      }

      box = await allDayAppointment.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2, { steps: 5 });
        await page.mouse.up();
      }

      await testScreenshot(page, `offset_appt-expr_drag-n-drop_${viewType}_offset-${offset}.png`, { element: workSpace });

      const usualResizeBottom = usualAppointment.locator('.dx-resizable-handle-bottom');
      box = await usualResizeBottom.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 100, { steps: 5 });
        await page.mouse.up();
      }

      const allDayResizeLeft = allDayAppointment.locator('.dx-resizable-handle-left');
      box = await allDayResizeLeft.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2, { steps: 5 });
        await page.mouse.up();
      }

      await testScreenshot(page, `offset_appt-expr_resize_${viewType}_offset-${offset}.png`, { element: workSpace });
    }
  });
});
