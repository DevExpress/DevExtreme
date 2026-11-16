import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../../../helpers/domUtils';
import { dragToElement } from '../../../../../helpers/dragUtils';
import Scheduler from '../../../../../models/scheduler';

const FIRST_SCHEDULER_SELECTOR = 'scheduler-first';
const SECOND_SCHEDULER_SELECTOR = 'scheduler-second';
const METHODS_TO_CANCEL = [
  'onDragStart',
  'onDragMove',
  'onDragEnd',
  'onRemove',
  'onAdd',
];

const TEST_APPOINTMENT = {
  id: 10,
  text: 'My appointment',
  startDate: new Date(2021, 3, 28, 1),
  endDate: new Date(2021, 3, 28, 2),
};

interface WidgetArg {
  options: Record<string, unknown>;
  cancelMethodName: string;
}

const getSchedulerOptions = (
  dataSource: unknown[],
  currentDate: Date,
): Record<string, unknown> => ({
  dataSource,
  currentDate,
  currentView: 'workWeek',
  width: 600,
});

const withAppointmentDragging = ({
  options,
  cancelMethodName,
}: WidgetArg): Record<string, unknown> => ({
  ...options,
  appointmentDragging: {
    group: 'testDragGroup',
    onRemove(e) {
      e.component.deleteAppointment(e.itemData);
    },
    onAdd(e) {
      e.component.addAppointment(e.itemData);
    },
    [cancelMethodName]: (e) => {
      e.cancel = true;
    },
  },
});

test.describe('Cancel drag-n-drop when dragging an appointment from one scheduler to another', () => {
  METHODS_TO_CANCEL.forEach((methodName) => {
    test(`Should remove drag-n-drop classes if event was canceled in method ${methodName}`, async ({ page }) => {
      await setStyleAttribute(page, '#container', 'display: flex;');
      await appendElementTo(page, '#container', 'div', FIRST_SCHEDULER_SELECTOR);
      await appendElementTo(page, '#container', 'div', SECOND_SCHEDULER_SELECTOR);

      await createWidget(
        page,
        'dxScheduler',
        withAppointmentDragging,
        `#${FIRST_SCHEDULER_SELECTOR}`,
        {
          arg: {
            options: getSchedulerOptions([TEST_APPOINTMENT], new Date(2021, 3, 26)),
            cancelMethodName: methodName,
          },
        },
      );

      await createWidget(
        page,
        'dxScheduler',
        withAppointmentDragging,
        `#${SECOND_SCHEDULER_SELECTOR}`,
        {
          arg: {
            options: getSchedulerOptions([], new Date(2021, 4, 26)),
            cancelMethodName: methodName,
          },
        },
      );

      const firstScheduler = new Scheduler(page, `#${FIRST_SCHEDULER_SELECTOR}`);
      const secondScheduler = new Scheduler(page, `#${SECOND_SCHEDULER_SELECTOR}`);

      const appointmentToMoveElement = firstScheduler
        .getAppointment(TEST_APPOINTMENT.text)
        .element;
      const cellToMoveElement = secondScheduler
        .getDateTableCell(0, 0);

      await dragToElement(page, appointmentToMoveElement, cellToMoveElement);

      await expect(firstScheduler.getDroppableCell(), 'Droppable cell class was not removed from the first scheduler.').toHaveCount(0);
      await expect(secondScheduler.getDroppableCell(), 'Droppable cell class was not removed from the second scheduler.').toHaveCount(0);
    });
  });
});
