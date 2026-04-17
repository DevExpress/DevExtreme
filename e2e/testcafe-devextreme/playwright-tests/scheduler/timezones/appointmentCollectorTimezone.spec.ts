import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const MACHINE_TIMEZONES = {
  EuropeBerlin: 'Europe/Berlin',
  AmericaLosAngeles: 'America/Los_Angeles',
} as const;

test.describe('Scheduler - Appointment Collector Timezone', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [
    MACHINE_TIMEZONES.EuropeBerlin,
  ].forEach((machineTimezone) => {
    test.describe(`timezone: ${machineTimezone}`, () => {
      test.use({ timezoneId: machineTimezone });

      test('Appointment collector button should have correct date', async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          timeZone: 'America/Los_Angeles',
          dataSource: [
            {
              text: 'Website Re-Design Plan',
              startDate: new Date('2021-03-05T15:30:00.000Z'),
              endDate: new Date('2021-03-05T17:00:00.000Z'),
            },
            {
              text: 'Complete Shipper Selection Form',
              startDate: new Date('2021-03-05T15:30:00.000Z'),
              endDate: new Date('2021-03-05T17:00:00.000Z'),
            },
            {
              text: 'Upgrade Server Hardware',
              startDate: new Date('2021-03-05T19:00:00.000Z'),
              endDate: new Date('2021-03-05T21:15:00.000Z'),
            },
            {
              text: 'Upgrade Personal Computers',
              startDate: new Date('2021-03-05T23:45:00.000Z'),
              endDate: new Date('2021-03-06T01:30:00.000Z'),
            },
          ],
          currentView: 'month',
          currentDate: new Date(2021, 2, 1),
          maxAppointmentsPerCell: 3,
        });

        const scheduler = page.locator('#container');
        await expect(scheduler).toBeVisible();

        const collector = page.locator('.dx-scheduler-appointment-collector').first();
        const expectedDate = 'March 5, 2021';

        const ariaRoleDescription = await collector.getAttribute('aria-roledescription');
        expect(ariaRoleDescription).toContain(expectedDate);
      });
    });
  });
});
