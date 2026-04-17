import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Agenda:view switching', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('View switching should work for empty agenda', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        startDate: new Date(2021, 4, 25, 0),
        endDate: new Date(2021, 4, 25, 1),
        text: 'Test Appointment',
      }],
      views: ['day', 'agenda'],
      currentView: 'day',
      currentDate: new Date(2021, 4, 25),
      height: 600,
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.option('currentDate', new Date(2021, 4, 26));
      instance.option('currentView', 'agenda');
    });

    await testScreenshot(page, 'switch-to-agenda-without-appointments.png');
  });
});
