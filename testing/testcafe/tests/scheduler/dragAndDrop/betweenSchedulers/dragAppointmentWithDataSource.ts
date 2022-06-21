import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';

interface TestAppointment {
  id: number;
  text: string;
  startDate: Date;
  endDate: Date;
}

const FIRST_SCHEDULER_SELECTOR = '#scheduler-first';
const SECOND_SCHEDULER_SELECTOR = '#scheduler-second';
const EXPECTED_APPOINTMENT_TIME = '12:00 AM - 1:00 AM';

const TEST_APPOINTMENT = {
  id: 10,
  text: 'My appointment',
  startDate: new Date(2021, 3, 28, 1),
  endDate: new Date(2021, 3, 28, 2),
};

const getBaseSchedulerOptions = (currentDate): any => ({
  currentDate,
  currentView: 'workWeek',
  width: 600,
  appointmentDragging: {
    group: 'testDragGroup',
    onRemove(e): void {
      e.component.deleteAppointment(e.itemData);
    },
    onAdd(e): void {
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

      load = (): Promise<TestAppointment[]> => Promise.resolve(this.data);

      insert = (value): Promise<void> => {
        this.data = [...this.data, value];
        return Promise.resolve();
      };

      update = (key, value): Promise<void> => {
        this.data = this.data.map((item) => {
          if (item.id === key) {
            return value;
          }
          return item;
        });
        return Promise.resolve();
      };

      remove = (id): Promise<void> => {
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

fixture`Drag-n-drop appointments between two schedulers with async DataSource (T1094033)`
  .page(url(__dirname, '../pages/containerForTwoSchedulers.html'));

test('Should set correct start and end dates in drag&dropped appointment', async (t) => {
  const firstScheduler = new Scheduler(FIRST_SCHEDULER_SELECTOR);
  const secondScheduler = new Scheduler(SECOND_SCHEDULER_SELECTOR);

  const appointmentToMoveElement = firstScheduler
    .getAppointment(TEST_APPOINTMENT.text)
    .element();
  const cellToMoveElement = secondScheduler
    .getDateTableCell(0, 0);

  await t.dragToElement(appointmentToMoveElement, cellToMoveElement, { speed: 0.1 });

  const movedAppointmentTime = await secondScheduler
    .getAppointment(TEST_APPOINTMENT.text)
    .date
    .time;

  await t.expect(movedAppointmentTime).eql(EXPECTED_APPOINTMENT_TIME);
}).before(async () => {
  await createSchedulerWithRemoteDataSource(
    getBaseSchedulerOptions(new Date(2021, 3, 26)),
    FIRST_SCHEDULER_SELECTOR,
    [TEST_APPOINTMENT],
  );

  await createWidget(
    'dxScheduler',
    {
      ...getBaseSchedulerOptions(new Date(2021, 4, 26)),
      dataSource: [],
    },
    false,
    SECOND_SCHEDULER_SELECTOR,
  );
});
