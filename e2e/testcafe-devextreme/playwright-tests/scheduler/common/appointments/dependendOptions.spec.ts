import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe.skip('Appointment dependend options', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('cellDuration (T1076138)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'test-appt',
        startDate: new Date(2021, 3, 27, 10),
        endDate: new Date(2021, 3, 27, 11, 20),
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 3, 27),
      startDayHour: 9,
      endDayHour: 18,
      width: 600,
      height: 600,
      cellDuration: 20,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test-appt' });

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('option', 'cellDuration', 30);
    });

    const clientHeight = await appointment.evaluate((el) => el.clientHeight);
    expect(clientHeight).toBeGreaterThanOrEqual(132);
    expect(clientHeight).toBeLessThanOrEqual(133);
  });
});
