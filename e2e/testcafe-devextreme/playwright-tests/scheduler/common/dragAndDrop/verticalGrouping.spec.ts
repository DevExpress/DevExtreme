import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe.skip('Drag-and-drop appointments in the Scheduler with vertical grouping', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should drag appoinment to the previous day`s cell (T1025952)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'appointment',
        startDate: new Date(2021, 3, 21, 9, 30),
        endDate: new Date(2021, 3, 21, 10),
        priorityId: 1,
      }],
      views: [{ type: 'week', groupOrientation: 'vertical' }],
      currentView: 'week',
      currentDate: new Date(2021, 3, 21),
      groups: ['priorityId'],
      resources: [{
        dataSource: [{ text: 'Low Priority', id: 1 }, { text: 'High Priority', id: 2 }],
        fieldExpr: 'priorityId',
        displayExpr: 'name',
        allowMultiple: false,
      }],
      startDayHour: 9,
      endDayHour: 12,
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'appointment' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(1).locator('.dx-scheduler-date-table-cell').nth(1);

    await appointment.dragTo(targetCell);

    await testScreenshot(page, 'drag-n-drop-previous-day-cell.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });
});
