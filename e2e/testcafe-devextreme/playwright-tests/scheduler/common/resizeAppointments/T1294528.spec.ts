import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Resize all day panel appointments', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [true, false].forEach((rtlEnabled) => {
    test(`Resize all day appointment rtlEnabled=${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        currentDate: new Date(2015, 1, 9),
        currentView: 'week',
        firstDayOfWeek: 0,
        rtlEnabled,
        height: 400,
        dataSource: [{
          text: 'Appointment',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 10),
          allDay: true,
        }],
        width: 800,
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
      const { right, left } = {
        right: appointment.locator('.dx-resizable-handle-right'),
        left: appointment.locator('.dx-resizable-handle-left'),
      };
      const text = 'Appointment: February 9, 2015, All day';
      const startDateExtendedText = 'Appointment: February 8, 2015 - February 9, 2015, All day';
      const endDateExtendedText = 'Appointment: February 9, 2015 - February 10, 2015, All day';

      await right.hover();
      await page.mouse.down();
      await page.mouse.move(100, 0, { steps: 5 });
      await page.mouse.up();

      const ariaLabel1 = await appointment.getAttribute('aria-label');
      expect(ariaLabel1).toBe(rtlEnabled ? startDateExtendedText : endDateExtendedText);

      await right.hover();
      await page.mouse.down();
      await page.mouse.move(-100, 0, { steps: 5 });
      await page.mouse.up();

      const ariaLabel2 = await appointment.getAttribute('aria-label');
      expect(ariaLabel2).toBe(text);

      await left.hover();
      await page.mouse.down();
      await page.mouse.move(-100, 0, { steps: 5 });
      await page.mouse.up();

      const ariaLabel3 = await appointment.getAttribute('aria-label');
      expect(ariaLabel3).toBe(rtlEnabled ? endDateExtendedText : startDateExtendedText);

      await left.hover();
      await page.mouse.down();
      await page.mouse.move(100, 0, { steps: 5 });
      await page.mouse.up();

      const ariaLabel4 = await appointment.getAttribute('aria-label');
      expect(ariaLabel4).toBe(text);
    });
  });

  test('Resize long appointment rtlEnabled=true', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2015, 1, 9),
      currentView: 'week',
      firstDayOfWeek: 0,
      rtlEnabled: true,
      height: 400,
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 10, 10),
      }],
      width: 800,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
    const right = appointment.locator('.dx-resizable-handle-right');
    const left = appointment.locator('.dx-resizable-handle-left');

    await right.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0, { steps: 5 });
    await page.mouse.up();

    const ariaLabel1 = await appointment.getAttribute('aria-label');
    expect(ariaLabel1).toBe('Appointment: February 8, 2015, 12:00 AM - February 10, 2015, 10:00 AM');

    await right.hover();
    await page.mouse.down();
    await page.mouse.move(-100, 0, { steps: 5 });
    await page.mouse.up();

    const ariaLabel2 = await appointment.getAttribute('aria-label');
    expect(ariaLabel2).toBe('Appointment: February 9, 2015, 12:00 AM - February 10, 2015, 10:00 AM');

    await left.hover();
    await page.mouse.down();
    await page.mouse.move(-100, 0, { steps: 5 });
    await page.mouse.up();

    const ariaLabel3 = await appointment.getAttribute('aria-label');
    expect(ariaLabel3).toBe('Appointment: February 9, 2015, 12:00 AM - February 12, 2015, 12:00 AM');

    await left.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0, { steps: 5 });
    await page.mouse.up();

    const ariaLabel4 = await appointment.getAttribute('aria-label');
    expect(ariaLabel4).toBe('Appointment: February 9, 2015, 12:00 AM - February 11, 2015, 12:00 AM');
  });

  test('Resize long appointment rtlEnabled=false', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2015, 1, 9),
      currentView: 'week',
      firstDayOfWeek: 0,
      rtlEnabled: false,
      height: 400,
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 10, 10),
      }],
      width: 800,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
    const right = appointment.locator('.dx-resizable-handle-right');
    const left = appointment.locator('.dx-resizable-handle-left');

    await right.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0, { steps: 5 });
    await page.mouse.up();

    const ariaLabel1 = await appointment.getAttribute('aria-label');
    expect(ariaLabel1).toBe('Appointment: February 9, 2015, 8:00 AM - February 12, 2015, 12:00 AM');

    await right.hover();
    await page.mouse.down();
    await page.mouse.move(-100, 0, { steps: 5 });
    await page.mouse.up();

    const ariaLabel2 = await appointment.getAttribute('aria-label');
    expect(ariaLabel2).toBe('Appointment: February 9, 2015, 8:00 AM - February 11, 2015, 12:00 AM');

    await left.hover();
    await page.mouse.down();
    await page.mouse.move(-100, 0, { steps: 5 });
    await page.mouse.up();

    const ariaLabel3 = await appointment.getAttribute('aria-label');
    expect(ariaLabel3).toBe('Appointment: February 8, 2015, 12:00 AM - February 11, 2015, 12:00 AM');

    await left.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0, { steps: 5 });
    await page.mouse.up();

    const ariaLabel4 = await appointment.getAttribute('aria-label');
    expect(ariaLabel4).toBe('Appointment: February 9, 2015, 12:00 AM - February 11, 2015, 12:00 AM');
  });
});
