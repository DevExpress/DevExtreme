import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const METHODS_TO_CANCEL = ['onDragStart', 'onDragMove', 'onDragEnd'];

const TEST_APPOINTMENT = {
  id: 10,
  text: 'My appointment',
  startDate: new Date(2021, 3, 28, 1),
  endDate: new Date(2021, 3, 28, 2),
};

test.describe('Cancel drag-n-drop when dragging an appointment inside the scheduler', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  METHODS_TO_CANCEL.forEach((methodName) => {
    test(`Should remove drag-n-drop classes if event was canceled in method ${methodName}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [TEST_APPOINTMENT],
        currentDate: new Date(2021, 3, 28),
        currentView: 'workWeek',
        width: 600,
        appointmentDragging: {
          [methodName]: new Function('e', 'e.cancel = true;') as any,
        },
      });

      const appointmentToMove = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_APPOINTMENT.text });
      const cellToMove = page.locator('.dx-scheduler-date-table-row').nth(1).locator('.dx-scheduler-date-table-cell').nth(0);

      await appointmentToMove.dragTo(cellToMove);

      const droppableCellCount = await page.locator('.dx-scheduler-date-table-droppable-cell').count();
      expect(droppableCellCount).toBe(0);

      const isDraggableSource = await appointmentToMove.evaluate(
        (el) => el.classList.contains('dx-scheduler-appointment-drag-source'),
      );
      expect(isDraggableSource).toBe(false);
    });
  });
});
