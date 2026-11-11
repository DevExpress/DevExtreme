import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../../../helpers/domUtils';
import { dragToElement } from '../../../../../helpers/dragUtils';
import Scheduler from '../../../../../models/scheduler';

const FIRST_SCHEDULER_SELECTOR = 'scheduler-first';
const SECOND_SCHEDULER_SELECTOR = 'scheduler-second';
const EXPECTED_APPOINTMENT_TIME = '1:00 AM - 2:00 AM';

const TEST_APPOINTMENT = {
  text: 'My appointment',
  startDate: new Date(2021, 3, 30, 1),
  endDate: new Date(2021, 3, 30, 2),
};

const getSchedulerOptions = (dataSource: unknown[]): Record<string, unknown> => ({
  dataSource,
  currentView: 'workWeek',
  currentDate: new Date(2021, 3, 26),
  width: 600,
});

const withAppointmentDragging = (options: Record<string, unknown>): Record<string, unknown> => ({
  ...options,
  appointmentDragging: {
    group: 'testDragGroup',
    onRemove(e) {
      e.component.deleteAppointment(e.itemData);
    },
    onAdd(e) {
      e.component.addAppointment(e.itemData);
    },
  },
});

test.describe('Drag-n-drop appointments between two schedulers with equal cell indexes (T1094035)', () => {
  test('Should not lose drag-n-dropped appointment in the second scheduler', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'display: flex;');
    await appendElementTo(page, '#container', 'div', FIRST_SCHEDULER_SELECTOR);
    await appendElementTo(page, '#container', 'div', SECOND_SCHEDULER_SELECTOR);

    await createWidget(page, 'dxScheduler', withAppointmentDragging, `#${FIRST_SCHEDULER_SELECTOR}`, { arg: getSchedulerOptions([TEST_APPOINTMENT]) });
    await createWidget(page, 'dxScheduler', withAppointmentDragging, `#${SECOND_SCHEDULER_SELECTOR}`, { arg: getSchedulerOptions([]) });

    const firstScheduler = new Scheduler(page, `#${FIRST_SCHEDULER_SELECTOR}`);
    const secondScheduler = new Scheduler(page, `#${SECOND_SCHEDULER_SELECTOR}`);

    const appointmentToMoveElement = firstScheduler
      .getAppointment(TEST_APPOINTMENT.text)
      .element;
    const cellToMoveElement = secondScheduler
      .getDateTableCell(2, 0);

    await dragToElement(page, appointmentToMoveElement, cellToMoveElement);

    await expect(secondScheduler.getAppointment(TEST_APPOINTMENT.text).date)
      .toHaveText(EXPECTED_APPOINTMENT_TIME);
  });
});
