import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, setStyleAttribute, appendElementTo } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const FIRST_SCHEDULER_SELECTOR = 'scheduler-first';
const SECOND_SCHEDULER_SELECTOR = 'scheduler-second';
const METHODS_TO_CANCEL = ['onDragStart', 'onDragMove', 'onDragEnd', 'onRemove', 'onAdd'];

const TEST_APPOINTMENT = {
  id: 10,
  text: 'My appointment',
  startDate: new Date(2021, 3, 28, 1),
  endDate: new Date(2021, 3, 28, 2),
};

const getSchedulerOptions = (dataSource: any[], currentDate: Date, cancelMethodName: string) => ({
  dataSource,
  currentDate,
  currentView: 'workWeek',
  width: 600,
  appointmentDragging: {
    group: 'testDragGroup',
    onRemove: new Function('e', 'e.component.deleteAppointment(e.itemData);') as any,
    onAdd: new Function('e', 'e.component.addAppointment(e.itemData);') as any,
    [cancelMethodName]: new Function('e', 'e.cancel = true;') as any,
  },
});

test.describe('Cancel drag-n-drop when dragging an appointment from one scheduler to another', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  METHODS_TO_CANCEL.forEach((methodName) => {
    test(`Should remove drag-n-drop classes if event was canceled in method ${methodName}`, async ({ page }) => {
      await setStyleAttribute(page, '#container', 'display: flex;');
      await appendElementTo(page, '#container', 'div', { id: FIRST_SCHEDULER_SELECTOR });
      await appendElementTo(page, '#container', 'div', { id: SECOND_SCHEDULER_SELECTOR });

      await createWidget(page, 'dxScheduler', getSchedulerOptions([TEST_APPOINTMENT], new Date(2021, 3, 26), methodName), `#${FIRST_SCHEDULER_SELECTOR}`);
      await createWidget(page, 'dxScheduler', getSchedulerOptions([], new Date(2021, 4, 26), methodName), `#${SECOND_SCHEDULER_SELECTOR}`);

      const appointmentToMove = page.locator(`#${FIRST_SCHEDULER_SELECTOR} .dx-scheduler-appointment`).filter({ hasText: TEST_APPOINTMENT.text });
      const cellToMove = page.locator(`#${SECOND_SCHEDULER_SELECTOR} .dx-scheduler-date-table-row`).nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

      await appointmentToMove.dragTo(cellToMove);

      const droppableCellFirst = await page.locator(`#${FIRST_SCHEDULER_SELECTOR} .dx-scheduler-date-table-droppable-cell`).count();
      const droppableCellSecond = await page.locator(`#${SECOND_SCHEDULER_SELECTOR} .dx-scheduler-date-table-droppable-cell`).count();

      expect(droppableCellFirst).toBe(0);
      expect(droppableCellSecond).toBe(0);
    });
  });
});
