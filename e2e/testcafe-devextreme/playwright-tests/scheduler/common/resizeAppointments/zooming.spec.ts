import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, insertStylesheetRulesToPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

async function setZoomLevel(page, zoomLevel: number): Promise<void> {
  await page.evaluate((z) => {
    $('body').css('zoom', `${z}%`);
  }, zoomLevel);
}

test.describe('Resize appointments - Zooming', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Vertical resize with zooming', async ({ page }) => {
    await setZoomLevel(page, 110);
    await insertStylesheetRulesToPage(page, '.dx-scheduler-cell-sizes-vertical { height: 43px;}');

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Appt-01',
        startDate: new Date(2021, 2, 28, 0),
        endDate: new Date(2021, 2, 28, 0, 30),
      }],
      views: ['day'],
      currentView: 'day',
      cellDuration: 15,
      currentDate: new Date(2021, 2, 28),
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appt-01' });
    const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');

    await bottomHandle.hover();
    await page.mouse.down();
    await page.mouse.move(0, 430, { steps: 10 });
    await page.mouse.up();

    const height = await appointment.evaluate((el) => parseInt(getComputedStyle(el).height, 10));
    expect(height).toBe(94);

    await setZoomLevel(page, 0);
  });
});
