import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const dataSource = [
  {
    text: 'Brochure Design Review',
    startDate: new Date(2019, 3, 1, 10, 0),
    endDate: new Date(2019, 3, 1, 11, 0),
    resourceId: 0,
  },
];

test.describe('Resize appointments in the Scheduler basic views', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['day', 'week', 'workWeek'].forEach((view) => {
    test(`Resize in the "${view}" view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        views: [view],
        currentView: view,
        dataSource,
        width: 800,
        height: 600,
        startDayHour: 9,
        currentDate: new Date(2019, 3, 1),
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
      const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');

      await bottomHandle.hover();
      await page.mouse.down();
      await page.mouse.move(0, 100, { steps: 5 });
      await page.mouse.up();

      const height1 = await appointment.evaluate((el) => getComputedStyle(el).height);
      expect(height1).toBe('190px');

      const timeText1 = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
      expect(timeText1).toContain('10:00 AM - 12:30 PM');

      const topHandle = appointment.locator('.dx-resizable-handle-top');
      await topHandle.hover();
      await page.mouse.down();
      await page.mouse.move(0, 100, { steps: 5 });
      await page.mouse.up();

      const height2 = await appointment.evaluate((el) => getComputedStyle(el).height);
      expect(height2).toBe('76px');

      const timeText2 = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
      expect(timeText2).toContain('11:30 AM - 12:30 PM');
    });
  });

  test('Resize in the "month" view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['month'],
      currentView: 'month',
      dataSource,
      width: 800,
      height: 600,
      startDayHour: 9,
      currentDate: new Date(2019, 3, 1),
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0, { steps: 5 });
    await page.mouse.up();

    const width = await appointment.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('400px');
  });

  test('Resize should work correctly with startDateExpr (T944693)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['week'],
      currentView: 'week',
      startDateExpr: 'start',
      dataSource: dataSource.map(({ startDate, ...restProps }) => ({
        ...restProps,
        start: startDate,
      })),
      width: 800,
      height: 600,
      startDayHour: 9,
      currentDate: new Date(2019, 3, 1),
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
    const bottomHandle = appointment.locator('.dx-resizable-handle-bottom');

    await bottomHandle.hover();
    await page.mouse.down();
    await page.mouse.move(0, 100, { steps: 5 });
    await page.mouse.up();

    const height = await appointment.evaluate((el) => getComputedStyle(el).height);
    expect(height).toBe('190px');
  });
});
