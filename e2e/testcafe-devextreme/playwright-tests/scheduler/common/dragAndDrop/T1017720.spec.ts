import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe.skip('T1017720', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Drag-n-drop appointment above SVG element(T1017720)', async ({ page }) => {
    await createWidget(page, 'dxChart', {
      width: '100%',
      height: 1300,
      series: { type: 'bar', color: '#ffaa66' },
    });

    await page.evaluate(() => {
      const scheduler = $('<div id="scheduler" />');
      (scheduler as any).dxScheduler({
        width: '100%',
        height: '100%',
        startDayHour: 11,
        dataSource: [{
          text: 'text',
          startDate: new Date(2021, 6, 27, 11),
          endDate: new Date(2021, 6, 27, 14),
          allDay: false,
        }],
        views: ['week'],
        currentDate: new Date(2021, 6, 27, 12),
        currentView: 'week',
      });
      ($('#container') as any).dxPopup({
        width: '90%',
        height: '90%',
        visible: true,
        contentTemplate: () => scheduler,
      });
    });

    const scheduler = page.locator('#scheduler');
    const draggableAppointment = scheduler.locator('.dx-scheduler-appointment').filter({ hasText: 'text' });
    const workSpace = scheduler.locator('.dx-scheduler-work-space');

    let box = await draggableAppointment.boundingBox();
    await draggableAppointment.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 330, box!.y + box!.height / 2, { steps: 15 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-right(T1017720).png', { element: workSpace });

    box = await draggableAppointment.boundingBox();
    await draggableAppointment.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 - 330, box!.y + box!.height / 2 + 70, { steps: 15 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-left(T1017720).png', { element: workSpace });
  });
});
