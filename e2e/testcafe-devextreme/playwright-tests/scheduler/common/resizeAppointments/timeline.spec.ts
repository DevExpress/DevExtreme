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

const defaultOptions = {
  width: 800,
  height: 600,
  startDayHour: 9,
  currentDate: new Date(2019, 3, 1),
};

test.describe.skip('Resize appointments in the Scheduler timeline views', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 800 });
    await setupTestPage(page, containerUrl);
  });

  ['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach((view) => {
    test(`Resize in the "${view}" view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        ...defaultOptions,
        views: [view],
        currentView: view,
        dataSource,
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
      const rightHandle = appointment.locator('.dx-resizable-handle-right');

      await rightHandle.hover();
      await page.mouse.down();
      await page.mouse.move(400, 0, { steps: 10 });
      await page.mouse.up();

      const width1 = await appointment.evaluate((el) => getComputedStyle(el).width);
      expect(width1).toBe('800px');
    });
  });

  test('Resize in the "timelineMonth" view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultOptions,
      views: ['timelineMonth'],
      currentView: 'timelineMonth',
      dataSource,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(400, 0, { steps: 10 });
    await page.mouse.up();

    const width = await appointment.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('600px');
  });

  test('Resize appointment on timelineWeek view with custom startDayHour & endDayHour (T804779)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultOptions,
      views: [{
        type: 'timelineWeek', startDayHour: 10, endDayHour: 16, cellDuration: 60,
      }],
      currentView: 'timelineWeek',
      currentDate: new Date(2019, 8, 1),
      firstDayOfWeek: 0,
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2019, 8, 1, 14),
        endDate: new Date(2019, 8, 2, 11),
      }],
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(-400, 0, { steps: 10 });
    await page.mouse.up();

    const width = await appointment.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('200px');
  });

  test("Resize should work correctly when cell's width is not an integer", async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: [{ type: 'timelineDay', cellDuration: 120 }],
      currentView: 'timelineDay',
      currentDate: new Date(2020, 10, 13),
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2020, 10, 13, 0, 0),
        endDate: new Date(2020, 10, 13, 2, 0),
      }],
      width: 2999,
      startDayHour: 0,
      endDayHour: 24,
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0, { steps: 5 });
    await page.mouse.up();

    const timeText = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain('12:00 AM - 4:00 AM');
  });

  test('Resize in the "timelineDay" view with start and end day hour (T1134583)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2024, 0, 3, 9, 30),
        endDate: new Date(2024, 0, 3, 12, 30),
      }],
      views: [{ type: 'timelineDay', intervalCount: 3 }],
      currentView: 'timelineDay',
      currentDate: new Date(2024, 0, 2),
      cellDuration: 60,
      startDayHour: 10,
      endDayHour: 12,
      width: 1200,
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(200, 0, { steps: 5 });
    await page.mouse.up();

    const width1 = await appointment.evaluate((el) => getComputedStyle(el).width);
    expect(width1).toBe('600px');
  });

  test('Resize in the "timelineMonth" view with start and end day hour (T1134583)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2024, 0, 3, 9, 30),
        endDate: new Date(2024, 0, 3, 12, 30),
      }],
      views: ['timelineMonth'],
      currentView: 'timelineMonth',
      currentDate: new Date(2024, 0, 2),
      cellDuration: 60,
      startDayHour: 10,
      endDayHour: 12,
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
    const rightHandle = appointment.locator('.dx-resizable-handle-right');

    await rightHandle.hover();
    await page.mouse.down();
    await page.mouse.move(200, 0, { steps: 5 });
    await page.mouse.up();

    const width = await appointment.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('400px');
  });

  ['timelineWeek', 'timelineWorkWeek'].forEach((view) => {
    test(`Resize in the "${view}" view with start and end day hour (T1134583)`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [{
          text: 'Appointment',
          startDate: new Date(2024, 0, 3, 9, 30),
          endDate: new Date(2024, 0, 3, 12, 30),
        }],
        views: [view],
        currentView: view,
        currentDate: new Date(2024, 0, 2),
        cellDuration: 60,
        startDayHour: 10,
        endDayHour: 12,
        height: 600,
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
      const rightHandle = appointment.locator('.dx-resizable-handle-right');

      await rightHandle.hover();
      await page.mouse.down();
      await page.mouse.move(200, 0, { steps: 5 });
      await page.mouse.up();

      const width = await appointment.evaluate((el) => getComputedStyle(el).width);
      expect(parseInt(width, 10)).toBeGreaterThan(0);
    });
  });
});
