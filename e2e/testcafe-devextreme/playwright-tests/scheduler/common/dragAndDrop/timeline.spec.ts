import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const dataSource = [
  { text: 'Brochure Design Review', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 9, 30), resourceId: 0 },
  { text: 'Update NDA Agreement', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 10, 0), resourceId: 1 },
  { text: 'Staff Productivity Report', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 10, 30), resourceId: 2 },
];

const defaultSchedulerOptions = {
  views: ['day'], dataSource: [],
  resources: [{ fieldExpr: 'resourceId', dataSource: [{ id: 0, color: '#e01e38' }, { id: 1, color: '#f98322' }, { id: 2, color: '#1e65e8' }], label: 'Color' }],
  width: 1666, height: 833, startDayHour: 9, firstDayOfWeek: 1, maxAppointmentsPerCell: 5, currentView: 'day', currentDate: new Date(2019, 3, 1),
};

test.describe('Drag-and-drop appointments in the Scheduler timeline views', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach((view) => {
    test(`Drag-n-drop in the "${view}" view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', { ...defaultSchedulerOptions, views: [view], currentView: view, dataSource });

      const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
      const targetCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(4);

      await draggableAppointment.dragTo(targetCell);

      const width = await draggableAppointment.evaluate((el) => getComputedStyle(el).width);
      expect(width).toBe('200px');

      const timeText = await draggableAppointment.locator('.dx-scheduler-appointment-content-date').textContent();
      expect(timeText).toContain('11:00 AM - 11:30 AM');
    });
  });

  test('Drag-n-drop in the "timelineMonth" view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', { ...defaultSchedulerOptions, views: ['timelineMonth'], currentView: 'timelineMonth', dataSource });

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(4);

    await draggableAppointment.dragTo(targetCell);

    const height = await draggableAppointment.evaluate((el) => parseInt(getComputedStyle(el).height, 10));
    expect(height).toBeGreaterThanOrEqual(139);
    expect(height).toBeLessThanOrEqual(140);

    const width = await draggableAppointment.evaluate((el) => getComputedStyle(el).width);
    expect(width).toBe('200px');

    const timeText = await draggableAppointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain('9:00 AM - 9:30 AM');
  });
});
