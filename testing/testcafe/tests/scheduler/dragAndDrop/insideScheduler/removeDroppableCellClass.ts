import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Cancel drag-n-drop when dragging an appointment inside the scheduler`
  .page(url(__dirname, '../../../container.html'));

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
  test(`Should remove drag-n-drop classes if event was canceled in method ${methodName}`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    const appointmentToMoveElement = scheduler
      .getAppointment(TEST_APPOINTMENT.text)
      .element();
    const cellToMoveElement = scheduler
      .getDateTableCell(1, 0);

    await t.dragToElement(appointmentToMoveElement, cellToMoveElement, { speed: 0.5 });

    const droppableCellExists = await scheduler
      .getDroppableCell()
      .exists;
    const appointmentIsDraggableSource = await scheduler
      .getAppointment(TEST_APPOINTMENT.text)
      .isDraggableSource;

    await t.expect(droppableCellExists).notOk('Droppable cell class was not removed.');
    await t.expect(appointmentIsDraggableSource).notOk('Draggable source class was not removed from appointment.');
  }).before(async () => {
    await createWidget('dxScheduler', {
      ...getSchedulerOptions(),
      appointmentDragging: {
        [methodName]: (e) => {
          e.cancel = true;
        },
      },
    });
  });
});
