import { Selector } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import createScheduler from '../init/widget.setup';

const FIRST_SCHEDULER_SELECTOR = '#scheduler-first';
const SECOND_SCHEDULER_SELECTOR = '#scheduler-second';
const APPOINTMENT_SELECTOR = '.dx-scheduler-appointment-content';
const FIRST_CELL_SELECTOR = '.dx-scheduler-first-group-cell';

const TEST_APPOINTMENT = {
  text: 'My appointment',
  startDate: new Date(2021, 3, 30, 9),
  endDate: new Date(2021, 3, 30, 10),
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

fixture`Drag-n-drop appointments between two schedulers with equal cell indexes (T1094035)`
  .page(url(__dirname, '../pages/containerForTwoSchedulers.html'));

test('Should not lose drag-n-dropped appointment in the second scheduler', async (t) => {
  await t
    .dragToElement(
      Selector(`${FIRST_SCHEDULER_SELECTOR} ${APPOINTMENT_SELECTOR}`),
      Selector(`${SECOND_SCHEDULER_SELECTOR} ${FIRST_CELL_SELECTOR}`).nth(2),
    ).debug();

  const appointmentExistInSecondScheduler = await Selector(`${SECOND_SCHEDULER_SELECTOR} ${APPOINTMENT_SELECTOR}`).count > 0;
  await t.expect(appointmentExistInSecondScheduler).eql(true);
}).before(async () => {
  await createScheduler(getSchedulerOptions([TEST_APPOINTMENT]), false, FIRST_SCHEDULER_SELECTOR);
  await createScheduler(getSchedulerOptions([]), false, SECOND_SCHEDULER_SELECTOR);
});
