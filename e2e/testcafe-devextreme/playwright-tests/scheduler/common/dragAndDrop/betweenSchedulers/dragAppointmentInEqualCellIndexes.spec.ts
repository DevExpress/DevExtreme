import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, setStyleAttribute, appendElementTo } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const FIRST_SCHEDULER_SELECTOR = 'scheduler-first';
const SECOND_SCHEDULER_SELECTOR = 'scheduler-second';
const EXPECTED_APPOINTMENT_TIME = '1:00 AM - 2:00 AM';

const TEST_APPOINTMENT = {
  text: 'My appointment',
  startDate: new Date(2021, 3, 30, 1),
  endDate: new Date(2021, 3, 30, 2),
};

const getSchedulerOptions = (dataSource: any[]) => ({
  dataSource,
  currentView: 'workWeek',
  currentDate: new Date(2021, 3, 26),
  width: 600,
  appointmentDragging: {
    group: 'testDragGroup',
    onRemove: new Function('e', 'e.component.deleteAppointment(e.itemData);') as any,
    onAdd: new Function('e', 'e.component.addAppointment(e.itemData);') as any,
  },
});

test.describe('Drag-n-drop appointments between two schedulers with equal cell indexes (T1094035)', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should not lose drag-n-dropped appointment in the second scheduler', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'display: flex;');
    await appendElementTo(page, '#container', 'div', { id: FIRST_SCHEDULER_SELECTOR });
    await appendElementTo(page, '#container', 'div', { id: SECOND_SCHEDULER_SELECTOR });

    await createWidget(page, 'dxScheduler', getSchedulerOptions([TEST_APPOINTMENT]), `#${FIRST_SCHEDULER_SELECTOR}`);
    await createWidget(page, 'dxScheduler', getSchedulerOptions([]), `#${SECOND_SCHEDULER_SELECTOR}`);

    const appointmentToMove = page.locator(`#${FIRST_SCHEDULER_SELECTOR} .dx-scheduler-appointment`).filter({ hasText: TEST_APPOINTMENT.text });
    const cellToMove = page.locator(`#${SECOND_SCHEDULER_SELECTOR} .dx-scheduler-date-table-row`).nth(2).locator('.dx-scheduler-date-table-cell').nth(0);

    await appointmentToMove.dragTo(cellToMove);

    const movedAppointment = page.locator(`#${SECOND_SCHEDULER_SELECTOR} .dx-scheduler-appointment`).filter({ hasText: TEST_APPOINTMENT.text });
    const timeText = await movedAppointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain(EXPECTED_APPOINTMENT_TIME);
  });
});
