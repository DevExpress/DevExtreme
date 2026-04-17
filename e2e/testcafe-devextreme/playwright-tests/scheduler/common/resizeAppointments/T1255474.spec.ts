import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const appointmentText = 'Book Flights to San Fran for Sales Trip';

test.describe.skip('Resize appointment that cross DTC time', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Resize appointment that cross DTC time', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      allDayPanelMode: 'allDay',
      height: 600,
      width: 800,
      firstDayOfWeek: 7,
      dataSource: [{
        text: appointmentText,
        startDate: new Date('2021-03-28T17:00:00.000Z'),
        endDate: new Date('2021-03-28T18:00:00.000Z'),
        TimeZone: 'Europe/Belgrade',
        allDay: true,
      }],
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentText });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0, { steps: 5 });
    await page.mouse.up();

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(-100, 0, { steps: 5 });
    await page.mouse.up();

    const scheduler = page.locator('.dx-scheduler');
    await testScreenshot(page, 'T1255474-resize-all-day-appointment.png', { element: scheduler });
  });
});
