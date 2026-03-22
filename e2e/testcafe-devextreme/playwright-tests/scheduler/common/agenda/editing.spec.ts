import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Agenda:Editing', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('It should be possible to delete an appointment', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        { text: 'App 1', startDate: new Date(2021, 1, 1, 12), endDate: new Date(2021, 1, 1, 13) },
        { text: 'App 2', startDate: new Date(2021, 1, 2, 12), endDate: new Date(2021, 1, 2, 13) },
        { text: 'App 3', startDate: new Date(2021, 1, 3, 12), endDate: new Date(2021, 1, 3, 13) },
        { text: 'App 4', startDate: new Date(2021, 1, 4, 12), endDate: new Date(2021, 1, 4, 13) },
      ],
      views: ['agenda'],
      currentView: 'agenda',
      currentDate: new Date(2021, 1, 1),
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'App 1' });
    await appointment.click();

    const deleteButton = page.locator('.dx-tooltip-appointment-item-delete-button').first();
    await deleteButton.click();

    const count = await page.locator('.dx-scheduler-appointment').count();
    expect(count).toBe(3);
  });
});
