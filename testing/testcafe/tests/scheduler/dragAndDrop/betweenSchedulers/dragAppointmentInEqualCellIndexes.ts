import { Selector } from 'testcafe';
import { setStyleAttribute, appendElementTo } from '../../../../helpers/domUtils';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';

fixture.disablePageReloads`Drag-n-drop appointments between two schedulers with equal cell indexes (T1094035)`
  .page(url(__dirname, '../../../container.html'));

const FIRST_SCHEDULER_SELECTOR = 'scheduler-first';
const SECOND_SCHEDULER_SELECTOR = 'scheduler-second';
const EXPECTED_APPOINTMENT_TIME = '1:00 AM - 2:00 AM';

const TEST_APPOINTMENT = {
  text: 'My appointment',
  startDate: new Date(2021, 3, 30, 1),
  endDate: new Date(2021, 3, 30, 2),
};

const getSchedulerOptions = (dataSource) => ({
  dataSource,
  currentView: 'workWeek',
  currentDate: new Date(2021, 3, 26),
  width: 600,
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

test('Should not lose drag-n-dropped appointment in the second scheduler', async (t) => {
  const firstScheduler = new Scheduler(`#${FIRST_SCHEDULER_SELECTOR}`);
  const secondScheduler = new Scheduler(`#${SECOND_SCHEDULER_SELECTOR}`);

  const appointmentToMoveElement = firstScheduler
    .getAppointment(TEST_APPOINTMENT.text)
    .element();
  const cellToMoveElement = secondScheduler
    .getDateTableCell(2, 0);

  await t.dragToElement(appointmentToMoveElement, cellToMoveElement, { speed: 0.5 });

  const movedAppointmentTime = await secondScheduler
    .getAppointment(TEST_APPOINTMENT.text)
    .date
    .time;

  await t.expect(movedAppointmentTime).eql(EXPECTED_APPOINTMENT_TIME);
}).before(async () => {
  await setStyleAttribute(Selector('#container'), 'display: flex;');
  await appendElementTo('#container', 'div', FIRST_SCHEDULER_SELECTOR);
  await appendElementTo('#container', 'div', SECOND_SCHEDULER_SELECTOR);

  await createWidget('dxScheduler', getSchedulerOptions([TEST_APPOINTMENT]), `#${FIRST_SCHEDULER_SELECTOR}`);
  await createWidget('dxScheduler', getSchedulerOptions([]), `#${SECOND_SCHEDULER_SELECTOR}`);
});
