import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:Appointments:longAppointments(T1086079)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const dataSource = [{ text: 'Website Re-Design Plan', startDate: new Date('2021-02-29T01:30:00.000Z'), endDate: new Date('2021-02-29T14:30:00.000Z'), recurrenceRule: 'FREQ=DAILY' }];
  const appointmentName = 'Website Re-Design Plan';

  test('Control should be render top part of recurrent long appointment in day view(T1086079)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', { timeZone: 'America/Los_Angeles', dataSource, cellDuration: 120, views: ['day'], currentView: 'day', currentDate: new Date(2021, 2, 30), startDayHour: 2, endDayHour: 22, height: 600 });
    await testScreenshot(page, 'long-appointment-day-view-T1086079.png', { element: page.locator('.dx-scheduler-work-space') });

    await page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentName }).nth(0).click();
    expect(await page.locator('.dx-tooltip-appointment-item-content-date').textContent()).toBe('March 29 5:30 PM - March 30 6:30 AM');

    await page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentName }).nth(1).click();
    expect(await page.locator('.dx-tooltip-appointment-item-content-date').textContent()).toBe('March 30 5:30 PM - March 31 6:30 AM');

    await page.locator('.dx-scheduler-navigator-next').click();

    await page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentName }).nth(0).click();
    expect(await page.locator('.dx-tooltip-appointment-item-content-date').textContent()).toBe('March 30 5:30 PM - March 31 6:30 AM');

    await page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentName }).nth(1).click();
    expect(await page.locator('.dx-tooltip-appointment-item-content-date').textContent()).toBe('March 31 5:30 PM - April 1 6:30 AM');
  });

  test('Control should be render top part of recurrent long appointment in week view(T1086079)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', { timeZone: 'America/Los_Angeles', dataSource, cellDuration: 120, views: ['week'], currentView: 'week', currentDate: new Date(2021, 2, 30), startDayHour: 2, endDayHour: 22, height: 600 });
    await testScreenshot(page, 'long-appointment-week-view-T1086079.png', { element: page.locator('.dx-scheduler-work-space') });

    await page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentName }).nth(0).click();
    expect(await page.locator('.dx-tooltip-appointment-item-content-date').textContent()).toBe('March 27 5:30 PM - March 28 6:30 AM');

    await page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentName }).nth(1).click();
    expect(await page.locator('.dx-tooltip-appointment-item-content-date').textContent()).toBe('March 28 5:30 PM - March 29 6:30 AM');

    await page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentName }).nth(2).click();
    expect(await page.locator('.dx-tooltip-appointment-item-content-date').textContent()).toBe('March 28 5:30 PM - March 29 6:30 AM');

    await page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentName }).nth(3).click();
    expect(await page.locator('.dx-tooltip-appointment-item-content-date').textContent()).toBe('March 29 5:30 PM - March 30 6:30 AM');
  });
});
