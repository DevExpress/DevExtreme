import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl, generateOptionMatrix } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const MACHINE_TIMEZONES = {
  EuropeBerlin: 'Europe/Berlin',
  AmericaLosAngeles: 'America/Los_Angeles',
} as const;
type MachineTimezonesType = typeof MACHINE_TIMEZONES[keyof typeof MACHINE_TIMEZONES];

const SCHEDULER_SELECTOR = '#container';
const MS_IN_MINUTE = 60000;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const APPOINTMENT_TEXT = 'TEST_APPT';

const getAppointments = (
  startDate: Date,
  currentView: string,
) => [
  {
    startDate,
    endDate: new Date(startDate.getTime() + MS_IN_HOUR),
    text: APPOINTMENT_TEXT,
    recurrenceRule: currentView === 'week' ? 'FREQ=DAILY' : 'FREQ=WEEKLY;BYDAY=FR',
  },
];

const getFirstDayOfWeek = (currentView: string) => (currentView === 'week' ? 4 : 0);
const getAppointmentsCount = (currentView: string) => (currentView === 'week' ? 7 : 6);

test.describe('Scheduler exclude from recurrence', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  generateOptionMatrix({
    timeZone: [undefined, 'America/New_York'] as (string | undefined)[],
    currentView: ['week', 'month'],
    location: [
      [MACHINE_TIMEZONES.EuropeBerlin, 'summer', '2024-03-31', new Date('2024-01-01T12:00:00Z')],
      [MACHINE_TIMEZONES.EuropeBerlin, 'winter', '2024-10-27', new Date('2024-01-01T12:00:00Z')],
      [MACHINE_TIMEZONES.AmericaLosAngeles, 'summer', '2024-03-10', new Date('2024-01-01T12:00:00Z')],
      [MACHINE_TIMEZONES.AmericaLosAngeles, 'winter', '2024-11-03', new Date('2024-01-01T12:00:00Z')],
    ] as [MachineTimezonesType, string, string, Date][],
  }).forEach(({
    timeZone,
    currentView,
    location: [machineTimezone, caseName, currentDate, startDate],
  }) => {
    const dataSource = getAppointments(startDate, currentView);
    const firstDayOfWeek = getFirstDayOfWeek(currentView);
    const appointmentsCount = getAppointmentsCount(currentView);

    test(`Should correctly exclude appointment from recurrence (${currentView}, ${timeZone}, ${machineTimezone}, ${caseName})`, async ({ page }) => {
      const browserTimezone = await page.evaluate(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      test.skip(browserTimezone !== machineTimezone, `Skipping: machine timezone is ${browserTimezone}, expected ${machineTimezone}`);

      await createWidget(page, 'dxScheduler', {
        timeZone,
        dataSource,
        currentDate,
        currentView,
        firstDayOfWeek,
        recurrenceEditMode: 'occurrence',
      });

      const appointments = page.locator('.dx-scheduler-appointment');
      await expect(appointments).toHaveCount(appointmentsCount);

      for (let idx = 0; idx < appointmentsCount; idx += 1) {
        const firstAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TEXT }).first();
        await firstAppointment.click();

        const deleteButton = page.locator('.dx-tooltip-appointment-item-delete-button');
        await deleteButton.click();

        await expect(appointments).toHaveCount(appointmentsCount - (idx + 1));
      }

      await expect(appointments).toHaveCount(0);
    });
  });
});
