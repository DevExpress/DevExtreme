import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage, setStyleAttribute } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

test.describe('Outlook dragging base tests in shifted container', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Basic drag-n-drop movements in shifted container', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'margin-left: 50px; margin-top: 70px;');

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 2, 22, 10),
        endDate: new Date(2021, 2, 22, 12, 30),
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 22),
      startDayHour: 9,
      height: 600,
      width: 950,
    });

    const appt = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
    const ws = page.locator('.dx-scheduler-work-space');

    let box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-right-in-shifted-container.png', { element: ws });

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 - 100, box!.y + box!.height / 2, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-left-in-shifted-container.png', { element: ws });

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 + 100, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-bottom-in-shifted-container.png', { element: ws });

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 - 100, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'drag-n-drop-to-top-in-shifted-container.png', { element: ws });
  });
});
