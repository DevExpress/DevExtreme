import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe.skip('Agenda:Editing', () => {
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

  test('It should be possible to change the data source of agenda resources', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        {
          text: 'New Brochures',
          ownerId: [1],
          startDate: new Date(2021, 1, 1, 18, 30),
          endDate: new Date(2021, 1, 1, 21, 15),
        },
        {
          text: 'Website Re-Design Plan',
          ownerId: [2],
          startDate: new Date(2021, 1, 1, 23, 45),
          endDate: new Date(2021, 1, 2, 18, 15),
        },
      ],
      views: ['agenda'],
      currentView: 'agenda',
      currentDate: new Date(2021, 1, 1),
      resources: [{
        fieldExpr: 'ownerId',
        dataSource: [
          { text: 'Samantha Bright', id: 1 },
          { text: 'Todd Hoffman', id: 2 },
        ],
        label: 'Owner',
      }],
    });

    const firstAppointmentOwner = page.locator('.dx-scheduler-appointment').nth(0).locator('.dx-scheduler-appointment-resource-badge').filter({ hasText: 'Samantha Bright' });
    const secondAppointmentOwner = page.locator('.dx-scheduler-appointment').nth(1).locator('.dx-scheduler-appointment-resource-badge').filter({ hasText: 'Todd Hoffman' });

    await expect(firstAppointmentOwner).toBeVisible();
    await expect(secondAppointmentOwner).toBeVisible();

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.option('resources[0].dataSource', [{ text: 'Todd Hoffman', id: 2 }]);
    });

    await expect(firstAppointmentOwner).not.toBeVisible();
    await expect(secondAppointmentOwner).toBeVisible();
  });
});
