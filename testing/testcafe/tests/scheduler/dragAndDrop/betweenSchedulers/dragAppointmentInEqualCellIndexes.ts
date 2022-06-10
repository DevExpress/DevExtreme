import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

const FIRST_SCHEDULER_SELECTOR = '#scheduler-first';
const SECOND_SCHEDULER_SELECTOR = '#scheduler-second';

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

const createSchedulerOnClientSide = async (selector: string, options: unknown): Promise<void> => {
  await ClientFunction(() => {
    ($(selector) as any).dxScheduler(options);
  }, {
    dependencies: { selector, options },
  })();
};

fixture`Drag-n-drop appointments between two schedulers with equal cell indexes (T1094035)`
  .page(url(__dirname, '../pages/containerForTwoSchedulers.html'));

test('Should not lose drag-n-dropped appointment in the second scheduler', async (t) => {
  const firstScheduler = new Scheduler(FIRST_SCHEDULER_SELECTOR);
  const secondScheduler = new Scheduler(SECOND_SCHEDULER_SELECTOR);

  const appointmentToMoveElement = firstScheduler
    .getAppointment(TEST_APPOINTMENT.text)
    .element();
  const cellToMoveElement = secondScheduler
    .getDateTableCell(2, 0);

  await t.dragToElement(appointmentToMoveElement, cellToMoveElement).wait(100);

  const movedAppointmentElement = await secondScheduler
    .getAppointment(TEST_APPOINTMENT.text)
    .element();
  await t.expect(movedAppointmentElement).ok('Cannot find drag&dropped appointment in the second scheduler');
}).before(async () => {
  await createSchedulerOnClientSide(
    FIRST_SCHEDULER_SELECTOR,
    getSchedulerOptions([TEST_APPOINTMENT]),
  );
  await createSchedulerOnClientSide(
    SECOND_SCHEDULER_SELECTOR,
    getSchedulerOptions([]),
  );
});
