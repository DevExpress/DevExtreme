import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Rendering of the recurrence appointments in Scheduler', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Drag-n-drop recurrence appointment between dateTable and allDay panel', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Simple recurrence appointment',
        startDate: new Date(2019, 3, 1, 10, 0),
        endDate: new Date(2019, 3, 1, 11, 0),
        recurrenceRule: 'FREQ=DAILY;COUNT=7',
      }],
      startDayHour: 1,
      recurrenceEditMode: 'series',
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2019, 3, 1),
      height: 600,
      width: 800,
    });

    await testScreenshot(page, 'basic-recurrence-appointment-init.png');

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Simple recurrence appointment' }).first();
    const allDayCell = page.locator('.dx-scheduler-all-day-table-cell').nth(0);

    await appointment.dragTo(allDayCell);
    await page.waitForTimeout(300);

    const appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(7);

    await page.waitForTimeout(500);
    await testScreenshot(page, 'basic-recurrence-appointment-after-drag.png');
  });

  test('Appointments in DST should not have offset when recurring appointment timezoine not equal to scheduler timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/New_York',
      dataSource: [{
        text: 'Recurrence',
        startDate: new Date('2021-03-13T19:00:00.000Z'),
        endDate: new Date('2021-03-13T19:30:00.000Z'),
        recurrenceRule: 'FREQ=DAILY;COUNT=1000',
        startDateTimeZone: 'America/New_York',
        endDateTimeZone: 'America/New_York',
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 13),
      firstDayOfWeek: 1,
      height: 600,
      width: 800,
    });

    const appt0 = page.locator('.dx-scheduler-appointment').nth(0);
    const time0 = await appt0.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(time0).toContain('2:00 PM - 2:30 PM');

    const appt1 = page.locator('.dx-scheduler-appointment').nth(1);
    const time1 = await appt1.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(time1).toContain('2:00 PM - 2:30 PM');

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('instance').option('currentDate', new Date(2021, 10, 1));
    });

    const appt0b = page.locator('.dx-scheduler-appointment').nth(0);
    const time0b = await appt0b.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(time0b).toContain('2:00 PM - 2:30 PM');

    const appt1b = page.locator('.dx-scheduler-appointment').nth(1);
    const time1b = await appt1b.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(time1b).toContain('2:00 PM - 2:30 PM');
  });

  test('Appointments in end of DST should have correct offset', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Phoenix',
      dataSource: [{
        text: 'Recurrence',
        startDate: new Date('2021-03-13T19:00:00.000Z'),
        endDate: new Date('2021-03-13T19:30:00.000Z'),
        recurrenceRule: 'FREQ=DAILY;COUNT=1000',
        startDateTimeZone: 'America/New_York',
        endDateTimeZone: 'America/New_York',
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 10, 1),
      firstDayOfWeek: 1,
      height: 600,
      width: 800,
    });

    const appt5 = page.locator('.dx-scheduler-appointment').nth(5);
    const time5 = await appt5.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(time5).toContain('11:00 AM - 11:30 AM');

    const appt6 = page.locator('.dx-scheduler-appointment').nth(6);
    const time6 = await appt6.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(time6).toContain('12:00 PM - 12:30 PM');
  });

  test('Appointment displayed without errors if it was only one DST in year(T1037853)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [{
        text: 'Recurrence',
        startDate: new Date(1942, 3, 29, 0),
        endDate: new Date(1942, 3, 29, 1),
        recurrenceRule: 'FREQ=DAILY;COUNT=2',
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(1942, 3, 29),
      height: 600,
    });

    const appt = page.locator('.dx-scheduler-appointment').nth(0);
    await expect(appt).toBeVisible();
  });
});
