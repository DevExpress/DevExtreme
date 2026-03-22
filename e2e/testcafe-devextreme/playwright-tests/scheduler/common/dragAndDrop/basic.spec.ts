import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const dataSource = [
  {
    text: 'Brochure Design Review',
    startDate: new Date(2019, 3, 1, 9, 0),
    endDate: new Date(2019, 3, 1, 9, 30),
    resourceId: 0,
  },
  {
    text: 'Update NDA Agreement',
    startDate: new Date(2019, 3, 1, 9, 0),
    endDate: new Date(2019, 3, 1, 10, 0),
    resourceId: 1,
  },
  {
    text: 'Staff Productivity Report',
    startDate: new Date(2019, 3, 1, 9, 0),
    endDate: new Date(2019, 3, 1, 10, 30),
    resourceId: 2,
  },
];

const defaultSchedulerOptions = {
  views: ['day'],
  dataSource: [],
  resources: [
    {
      fieldExpr: 'resourceId',
      dataSource: [
        { id: 0, color: '#e01e38' },
        { id: 1, color: '#f98322' },
        { id: 2, color: '#1e65e8' },
      ],
      label: 'Color',
    },
  ],
  width: 1666,
  height: 833,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'day',
  currentDate: new Date(2019, 3, 1),
};

test.describe('Drag-and-drop appointments in the Scheduler basic views', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['day', 'week', 'workWeek'].forEach((view) => {
    test(`Drag-n-drop in the "${view}" view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        ...defaultSchedulerOptions,
        views: [view],
        currentView: view,
        dataSource,
      });

      const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
      const targetCell = page.locator('.dx-scheduler-date-table-row').nth(4).locator('.dx-scheduler-date-table-cell').nth(0);

      await draggableAppointment.dragTo(targetCell);

      const height = await draggableAppointment.evaluate((el) => getComputedStyle(el).height);
      expect(height).toBe('38px');

      const timeText = await draggableAppointment.locator('.dx-scheduler-appointment-content-date').textContent();
      expect(timeText).toContain('11:00 AM - 11:30 AM');
    });
  });

  test('Drag-n-drop in the "month" view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['month'],
      currentView: 'month',
      dataSource,
      height: 834,
    });

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(4);

    await draggableAppointment.dragTo(targetCell);

    const height = await draggableAppointment.evaluate((el) => getComputedStyle(el).height);
    expect(height).toBe('23.8281px');

    const timeText = await draggableAppointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain('9:00 AM - 9:30 AM');
  });

  test('Drag-n-drop when browser has horizontal scroll', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['week'],
      currentView: 'week',
      dataSource: [{
        text: 'Staff Productivity Report',
        startDate: new Date(2019, 3, 6, 9, 0),
        endDate: new Date(2019, 3, 6, 10, 30),
        resourceId: 2,
      }],
      width: 1800,
    });

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Staff Productivity Report' });
    const box = await draggableAppointment.boundingBox();

    await draggableAppointment.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 250, box!.y + box!.height / 2 - 50, { steps: 10 });
    await page.mouse.up();

    const isAllDay = await draggableAppointment.evaluate((el) => {
      return el.closest('.dx-scheduler-all-day-appointments') !== null;
    });
    expect(isAllDay).toBe(true);
  });

  test('Drag-n-drop when browser has vertical scroll', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['week'],
      currentView: 'week',
      dataSource: [{
        text: 'Staff Productivity Report',
        startDate: new Date(2019, 3, 1, 21, 0),
        endDate: new Date(2019, 3, 1, 21, 30),
        resourceId: 2,
      }],
      height: 1800,
    });

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Staff Productivity Report' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(25).locator('.dx-scheduler-date-table-cell').nth(0);

    await draggableAppointment.dragTo(targetCell);

    const timeText = await draggableAppointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain('9:30 PM - 10:00 PM');
  });

  test('Drag recurrent appointment occurrence from collector (T832887)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['week'],
      currentView: 'week',
      firstDayOfWeek: 2,
      startDayHour: 4,
      maxAppointmentsPerCell: 1,
      dataSource: [{
        text: 'Recurrence one',
        startDate: new Date(2019, 2, 26, 8, 0),
        endDate: new Date(2019, 2, 26, 10, 0),
        recurrenceException: '',
        recurrenceRule: 'FREQ=DAILY',
      }, {
        text: 'Non-recurrent appointment',
        startDate: new Date(2019, 2, 26, 7, 0),
        endDate: new Date(2019, 2, 26, 11, 0),
      }, {
        text: 'Recurrence two',
        startDate: new Date(2019, 2, 26, 8, 0),
        endDate: new Date(2019, 2, 26, 10, 0),
        recurrenceException: '',
        recurrenceRule: 'FREQ=DAILY',
      }],
      currentDate: new Date(2019, 2, 26),
    });

    const collector = page.locator('.dx-scheduler-appointment-collector').filter({ hasText: '2' });
    const tooltipItem = page.locator('.dx-tooltip-appointment-item').filter({ hasText: 'Recurrence two' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(2);
    const popup = page.locator('.dx-dialog');

    await collector.click();
    await expect(page.locator('.dx-scheduler-appointment-tooltip-wrapper')).toBeVisible();

    await tooltipItem.dragTo(targetCell);
    await expect(tooltipItem).not.toBeVisible();

    await popup.locator('.dx-dialog-button').first().click();

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Recurrence two' });
    await expect(appointment).toBeVisible();

    const timeText = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain('4:00 AM - 6:00 AM');

    await expect(collector).not.toBeVisible();
  });

  test('Drag-n-drop the appointment to the left column to the cell that has the same time', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      timeZone: 'Etc/GMT',
      dataSource: [{
        text: 'Test appointment',
        startDate: new Date('2022-09-08T10:00:00.000Z'),
        endDate: new Date('2022-09-08T10:30:00.000Z'),
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date('2022-09-09T10:00:00.000Z'),
      startDayHour: 9,
      width: 600,
      height: 600,
    });

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test appointment' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(2);

    await draggableAppointment.dragTo(targetCell);

    await testScreenshot(page, 'drag-n-drop-appointment-to-left-column.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });
});
