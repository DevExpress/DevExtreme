import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage, setStyleAttribute, appendElementTo } from '../../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../../tests/container.html');

test.describe('Outlook dragging, for case scheduler in container with transform style', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Dragging should be work right in case dxScheduler placed in container with transform style', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'margin-top: 100px; margin-left: 100px; transform: translate(0px, 0px);');
    await appendElementTo(page, '#container', 'div', { id: 'scheduler' });

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 2, 24, 11),
        endDate: new Date(2021, 2, 24, 12),
      }],
      views: ['workWeek'],
      currentView: 'workWeek',
      currentDate: new Date(2021, 2, 22),
      startDayHour: 9,
      height: 600,
      width: 800,
    }, '#scheduler');

    const appt = page.locator('#scheduler .dx-scheduler-appointment').first();

    let box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 + 120, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-bottom.png');

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 - 170, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-top.png');

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-right.png');

    box = await appt.boundingBox();
    await appt.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 - 230, box!.y + box!.height / 2, { steps: 10 });
    await page.mouse.up();
    await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-left.png');
  });
});
