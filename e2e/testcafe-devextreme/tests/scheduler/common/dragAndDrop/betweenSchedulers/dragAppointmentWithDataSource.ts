import { ClientFunction, Selector } from 'testcafe';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import url from '../../../../../helpers/getPageUrl';
import { createWidget } from '../../../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../../../helpers/domUtils';

fixture`Drag-n-drop appointments between two schedulers with async DataSource (T1094033)`
  .page(url(__dirname, '../../../../container.html'));

interface TestAppointment {
  id: number;
  text: string;
  startDate: Date;
  endDate: Date;
}

const FIRST_SCHEDULER_SELECTOR = 'scheduler-first';
const SECOND_SCHEDULER_SELECTOR = 'scheduler-second';
const EXPECTED_APPOINTMENT_TIME = '12:00 AM - 1:00 AM';

const TEST_APPOINTMENT = {
  id: 10,
  text: 'My appointment',
  startDate: new Date(2021, 3, 28, 1),
  endDate: new Date(2021, 3, 28, 2),
};

const getBaseSchedulerOptions = (currentDate) => ({
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
  },
});

const createSchedulerWithRemoteDataSource = async (
  options: any,
  selector: string,
  appointments: TestAppointment[],
): Promise<void> => {
  await ClientFunction(() => {
    class DataSourceMock {
      key = 'id';

      private data: TestAppointment[];

      constructor(initialData: TestAppointment[] = []) {
        this.data = initialData;
      }

      load = () => Promise.resolve(this.data);

      insert = (value) => {
        this.data = [...this.data, value];
        return Promise.resolve();
      };

      update = (key, value) => {
        this.data = this.data.map((item) => {
          if (item.id === key) {
            return value;
          }
          return item;
        });
        return Promise.resolve();
      };

      remove = (id) => {
        this.data = this.data.filter((item) => item.id !== id);
        return Promise.resolve();
      };
    }

    ($(selector) as any).dxScheduler({
      ...options,
      dataSource: new DataSourceMock(appointments),
    });
  }, { dependencies: { selector, options, appointments } })();
};

test('Should set correct start and end dates in drag&dropped appointment', async (t) => {
  const firstScheduler = new Scheduler(`#${FIRST_SCHEDULER_SELECTOR}`);
  const secondScheduler = new Scheduler(`#${SECOND_SCHEDULER_SELECTOR}`);

  const appointmentToMoveElement = firstScheduler
    .getAppointment(TEST_APPOINTMENT.text)
    .element();
  const cellToMoveElement = secondScheduler
    .getDateTableCell(0, 0);

  // The first scheduler uses an async data source, so make sure its appointment is
  // actually rendered (and the layout has settled) before the drag starts. Otherwise
  // dragToElement may capture a stale position and the drop never reaches the target.
  await t.expect(firstScheduler.getAppointmentCount()).eql(1);

  await t.dragToElement(appointmentToMoveElement, cellToMoveElement, { speed: 0.5 });

  // The drop runs async onRemove/onAdd handlers. Wait for the appointment to actually
  // appear in the target scheduler via an auto-retrying assertion instead of a fixed
  // delay, then read its time the same way so the whole chain re-evaluates while the
  // DOM updates.
  await t.expect(secondScheduler.getAppointmentCount()).eql(1, { timeout: 3000 });

  await t
    .expect(secondScheduler.getAppointment(TEST_APPOINTMENT.text).date.time)
    .eql(EXPECTED_APPOINTMENT_TIME, { timeout: 3000 });
}).before(async () => {
  await setStyleAttribute(Selector('#container'), 'display: flex;');
  await appendElementTo('#container', 'div', FIRST_SCHEDULER_SELECTOR);
  await appendElementTo('#container', 'div', SECOND_SCHEDULER_SELECTOR);

  await createSchedulerWithRemoteDataSource(
    getBaseSchedulerOptions(new Date(2021, 3, 26)),
    `#${FIRST_SCHEDULER_SELECTOR}`,
    [TEST_APPOINTMENT],
  );

  await createWidget(
    'dxScheduler',
    {
      ...getBaseSchedulerOptions(new Date(2021, 4, 26)),
      dataSource: [],
    },
    `#${SECOND_SCHEDULER_SELECTOR}`,
  );
});
