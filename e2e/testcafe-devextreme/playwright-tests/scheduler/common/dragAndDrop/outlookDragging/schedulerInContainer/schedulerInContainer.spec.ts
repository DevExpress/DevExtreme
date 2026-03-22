import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../../tests/container.html');

test.describe('Outlook dragging, for case scheduler in container', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Dragging should be work right in case dxScheduler placed in dxTabPanel', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.fx.off = true;

      ($('#container') as any).dxTabPanel({
        items: [{
          title: 'Info',
          text: 'This is Info Tab',
        }, {
          title: 'Contacts',
          text: 'This is Contacts Tab',
          disabled: true,
        }],
        itemTemplate: () => {
          const scheduler = $('<div />');
          (scheduler as any).dxScheduler({
            dataSource: [{
              text: 'Website Re-Design Plan',
              startDate: new Date(2021, 2, 30, 11),
              endDate: new Date(2021, 2, 30, 12),
            }],
            views: ['week', 'month'],
            currentView: 'week',
            currentDate: new Date(2021, 2, 28),
            startDayHour: 9,
            height: 600,
          });
          return scheduler;
        },
      });
    });

    const appt = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

    let box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 + 120, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'dxScheduler-placed-in-dxTabPanel-drag-to-bottom.png');

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 - 170, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'dxScheduler-placed-in-dxTabPanel-drag-to-top.png');

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'dxScheduler-placed-in-dxTabPanel-drag-to-right.png');
  });
});
