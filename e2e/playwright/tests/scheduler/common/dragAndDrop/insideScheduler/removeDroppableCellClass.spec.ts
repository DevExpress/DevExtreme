import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { dragToElement } from '../../../../../helpers/dragUtils';
import Scheduler from '../../../../../models/scheduler';

const METHODS_TO_CANCEL = [
  'onDragStart',
  'onDragMove',
  'onDragEnd',
];
const SCHEDULER_SELECTOR = '#container';

const TEST_APPOINTMENT = {
  id: 10,
  text: 'My appointment',
  startDate: new Date(2021, 3, 28, 1),
  endDate: new Date(2021, 3, 28, 2),
};

const getSchedulerOptions = () => ({
  dataSource: [TEST_APPOINTMENT],
  currentDate: new Date(2021, 3, 28),
  currentView: 'workWeek',
  width: 600,
});

METHODS_TO_CANCEL.forEach((methodName) => {
  test(`Should remove drag-n-drop classes if event was canceled in method ${methodName}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...getSchedulerOptions(),
      appointmentDragging: {
        [methodName]: (e) => {
          e.cancel = true;
        },
      },
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    const appointmentToMoveElement = scheduler
      .getAppointment(TEST_APPOINTMENT.text)
      .element;
    const cellToMoveElement = scheduler
      .getDateTableCell(1, 0);

    await dragToElement(page, appointmentToMoveElement, cellToMoveElement);

    await expect(
      scheduler.getDroppableCell(),
      'Droppable cell class was not removed.',
    ).toHaveCount(0);
    await expect
      .poll(
        async () => scheduler.getAppointment(TEST_APPOINTMENT.text).isDraggableSource(),
        { message: 'Draggable source class was not removed from appointment.' },
      )
      .toBe(false);
  });
});
