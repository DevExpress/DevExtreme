import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const SCREENSHOT_BASE_NAME = 'recurrent-appointment-timezone-dst__editing';
const TEST_APPOINTMENT_TEXT = 'Watercolor Landscape';
const APPOINTMENT_DATETIME = {
  winter: { start: new Date('2020-11-01T17:30:00.000Z'), end: new Date('2020-11-01T19:00:00.000Z') },
  summer: { start: new Date('2020-03-08T16:30:00.000Z'), end: new Date('2020-03-08T18:00:00.000Z') },
};

async function configureScheduler(page, { start, end }: { start: Date; end: Date }) {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      startDate: start,
      endDate: end,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO',
      text: TEST_APPOINTMENT_TEXT,
    }],
    timeZone: 'America/Los_Angeles',
    currentView: 'week',
    currentDate: start,
    startDayHour: 9,
    cellDuration: 30,
    width: 1000,
    height: 585,
  });
}

test.describe.skip('Editing recurrent appointment in DST time', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Editing popup: should have correctly been edited from editing popup. DST - winter time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.winter);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    await appointment.dblclick();

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const saveButton = popup.locator('.dx-popup-done.dx-button');
    await saveButton.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__popup__winter-time.png`, { element: workSpace });
  });

  test('Editing popup: should have correctly been edited from editing popup. DST - summer time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.summer);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    await appointment.dblclick();

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const saveButton = popup.locator('.dx-popup-done.dx-button');
    await saveButton.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__popup__summer-time.png`, { element: workSpace });
  });

  test('Drag-n-drop up: should have correctly been edited. DST - winter time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.winter);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(1).locator('.dx-scheduler-date-table-cell').nth(1);
    await appointment.dragTo(targetCell);

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__drag-n-drop-up__winter-time.png`, { element: workSpace });
  });

  test('Drag-n-drop down: should have correctly been edited. DST - winter time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.winter);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(4).locator('.dx-scheduler-date-table-cell').nth(1);
    await appointment.dragTo(targetCell);

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__drag-n-drop-down__winter-time.png`, { element: workSpace });
  });

  test('Drag-n-drop up: should have correctly been edited. DST - summer time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.summer);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(1).locator('.dx-scheduler-date-table-cell').nth(1);
    await appointment.dragTo(targetCell);

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__drag-n-drop-up__summer-time.png`, { element: workSpace });
  });

  test('Drag-n-drop down: should have correctly been edited. DST - summer time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.summer);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(4).locator('.dx-scheduler-date-table-cell').nth(1);
    await appointment.dragTo(targetCell);

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__drag-n-drop-down__summer-time.png`, { element: workSpace });
  });

  test('Resize top: should have correctly been edited. DST - winter time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.winter);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    const topHandle = appointment.locator('.dx-resizable-handle-top');

    await topHandle.hover();
    await page.mouse.down();
    await page.mouse.move(0, 100, { steps: 5 });
    await page.mouse.up();

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__resize-top__winter-time.png`, { element: workSpace });
  });

  test('Resize bottom: should have correctly been edited. DST - winter time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.winter);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');

    await bottomHandle.hover();
    await page.mouse.down();
    await page.mouse.move(0, 100, { steps: 5 });
    await page.mouse.up();

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__resize-bottom__winter-time.png`, { element: workSpace });
  });

  test('Resize top: should have correctly been edited. DST - summer time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.summer);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    const topHandle = appointment.locator('.dx-resizable-handle-top');

    await topHandle.hover();
    await page.mouse.down();
    await page.mouse.move(0, 100, { steps: 5 });
    await page.mouse.up();

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__resize-top__summer-time.png`, { element: workSpace });
  });

  test('Resize bottom: should have correctly been edited. DST - summer time', async ({ page }) => {
    await configureScheduler(page, APPOINTMENT_DATETIME.summer);
    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT_TEXT });
    const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');

    await bottomHandle.hover();
    await page.mouse.down();
    await page.mouse.move(0, 100, { steps: 5 });
    await page.mouse.up();

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, `${SCREENSHOT_BASE_NAME}__resize-bottom__summer-time.png`, { element: workSpace });
  });
});
