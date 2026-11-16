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

const getSchedulerOptions = (): Record<string, unknown> => ({
  dataSource: [TEST_APPOINTMENT],
  currentDate: new Date(2021, 3, 28),
  currentView: 'workWeek',
  width: 600,
});

interface WidgetArg {
  options: Record<string, unknown>;
  methodName: string;
}

test.describe('Cancel drag-n-drop when dragging an appointment inside the scheduler', () => {
  METHODS_TO_CANCEL.forEach((methodName) => {
    test(`Should remove drag-n-drop classes if event was canceled in method ${methodName}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', ({ options, methodName: cancelMethodName }: WidgetArg) => ({
        ...options,
        appointmentDragging: {
          [cancelMethodName]: (e) => {
            e.cancel = true;
          },
        },
      }), SCHEDULER_SELECTOR, { arg: { options: getSchedulerOptions(), methodName } });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

      const appointmentToMoveElement = scheduler
        .getAppointment(TEST_APPOINTMENT.text)
        .element;
      const cellToMoveElement = scheduler
        .getDateTableCell(1, 0);

      await dragToElement(page, appointmentToMoveElement, cellToMoveElement);

      await expect(scheduler.getDroppableCell(), 'Droppable cell class was not removed.').toHaveCount(0);
      await scheduler.getAppointment(TEST_APPOINTMENT.text).expectState('draggableSource', false);
    });
  });
});
