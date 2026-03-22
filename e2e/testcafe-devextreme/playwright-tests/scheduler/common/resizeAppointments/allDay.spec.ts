import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Resize appointments in All Day Panel', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Resize in the workWeek view between weeks', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 800,
      height: 600,
      views: [{
        type: 'workWeek',
        intervalCount: 2,
        startDate: new Date(2021, 5, 29),
      }],
      currentDate: new Date(2021, 5, 29),
      currentView: 'workWeek',
      maxAppointmentsPerCell: 'unlimited',
      startDayHour: 9,
      endDayHour: 13,
      dataSource: [
        { text: '1st', startDate: new Date(2021, 5, 29), allDay: true },
        { text: '2nd', startDate: new Date(2021, 6, 7), allDay: true },
        { text: '3rd', startDate: new Date(2021, 6, 1), endDate: new Date(2021, 6, 5), allDay: true },
      ],
    });

    const appointment1 = page.locator('.dx-scheduler-appointment').filter({ hasText: '1st' });
    const appointment2 = page.locator('.dx-scheduler-appointment').filter({ hasText: '2nd' });
    const appointment3 = page.locator('.dx-scheduler-appointment').filter({ hasText: '3rd' });

    await appointment1.locator('.dx-resizable-handle-right').dragTo(appointment1.locator('.dx-resizable-handle-right'), { targetPosition: { x: 400, y: 0 } });
    await appointment2.locator('.dx-resizable-handle-left').dragTo(appointment2.locator('.dx-resizable-handle-left'), { targetPosition: { x: -400, y: 0 } });
    await appointment3.locator('.dx-resizable-handle-right').dragTo(appointment3.locator('.dx-resizable-handle-right'), { targetPosition: { x: -140, y: 0 } });

    await testScreenshot(page, 'resize-all-day-workweek-weekend-0.png');

    await appointment1.locator('.dx-resizable-handle-right').dragTo(appointment1.locator('.dx-resizable-handle-right'), { targetPosition: { x: -400, y: 0 } });
    await appointment2.locator('.dx-resizable-handle-left').dragTo(appointment2.locator('.dx-resizable-handle-left'), { targetPosition: { x: 400, y: 0 } });
    await appointment3.locator('.dx-resizable-handle-right').dragTo(appointment3.locator('.dx-resizable-handle-right'), { targetPosition: { x: 140, y: 0 } });

    await testScreenshot(page, 'resize-all-day-workweek-weekend-1.png');
  });
});
