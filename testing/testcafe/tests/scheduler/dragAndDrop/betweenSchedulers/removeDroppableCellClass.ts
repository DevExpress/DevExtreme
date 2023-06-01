import { Selector } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import { setStyleAttribute, appendElementTo } from '../../../../helpers/domUtils';

fixture.disablePageReloads`Cancel drag-n-drop when dragging an appointment from one scheduler to another`
  .page(url(__dirname, '../../../container.html'));

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

const getSchedulerOptions = (dataSource, currentDate, cancelMethodName) => ({
  dataSource,
  currentDate,
  currentView: 'workWeek',
  width: 600,
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

METHODS_TO_CANCEL.forEach((methodName) => {
  test(`Should remove drag-n-drop classes if event was canceled in method ${methodName}`, async (t) => {
    const firstScheduler = new Scheduler(`#${FIRST_SCHEDULER_SELECTOR}`);
    const secondScheduler = new Scheduler(`#${SECOND_SCHEDULER_SELECTOR}`);

    const appointmentToMoveElement = firstScheduler
      .getAppointment(TEST_APPOINTMENT.text)
      .element();
    const cellToMoveElement = secondScheduler
      .getDateTableCell(0, 0);

    await t.dragToElement(appointmentToMoveElement, cellToMoveElement, { speed: 0.5 });

    const droppableCellExistsInFirstScheduler = await firstScheduler.getDroppableCell().exists;
    const droppableCellExistsInSecondScheduler = await secondScheduler.getDroppableCell().exists;

    await t.expect(droppableCellExistsInFirstScheduler).notOk('Droppable cell class was not removed from the first scheduler.');
    await t.expect(droppableCellExistsInSecondScheduler).notOk('Droppable cell class was not removed from the second scheduler.');
  }).before(async () => {
    await setStyleAttribute(Selector('#container'), 'display: flex;');
    await appendElementTo('#container', 'div', FIRST_SCHEDULER_SELECTOR);
    await appendElementTo('#container', 'div', SECOND_SCHEDULER_SELECTOR);

    await createWidget(
      'dxScheduler',
      getSchedulerOptions([TEST_APPOINTMENT], new Date(2021, 3, 26), methodName),
      `#${FIRST_SCHEDULER_SELECTOR}`,
    );

    await createWidget(
      'dxScheduler',
      getSchedulerOptions([], new Date(2021, 4, 26), methodName),
      `#${SECOND_SCHEDULER_SELECTOR}`,
    );
  });
});
