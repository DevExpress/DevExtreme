import type { Page } from '@playwright/test';
import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../../../helpers/domUtils';
import { dragToElement } from '../../../../../helpers/dragUtils';
import Scheduler from '../../../../../models/scheduler';

interface TestAppointment {
  id: number;
  text: string;
  startDate: Date;
  endDate: Date;
}

const FIRST_SCHEDULER_SELECTOR = 'scheduler-first';
const SECOND_SCHEDULER_SELECTOR = 'scheduler-second';
const EXPECTED_APPOINTMENT_TIME = '12:00 AM - 1:00 AM';

const TEST_APPOINTMENT: TestAppointment = {
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

// The store lives in the page, so it is built there: the whole configuration is assembled inside
// "evaluate", the way the TestCafe client function assembled it.
const createSchedulerWithRemoteDataSource = async (
  page: Page,
  selector: string,
  currentDate: Date,
  appointments: TestAppointment[],
): Promise<void> => page.evaluate(({ elementSelector, date, data }) => {
  class DataSourceMock {
    key = 'id';

    private data: any[];

    constructor(initialData: any[] = []) {
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

  ($(elementSelector) as any).dxScheduler({
    currentDate: new Date(date),
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
    dataSource: new DataSourceMock(data.map((item) => ({
      ...item,
      startDate: new Date(item.startDate),
      endDate: new Date(item.endDate),
    }))),
  });
}, {
  elementSelector: selector,
  date: currentDate.getTime(),
  data: appointments.map((item) => ({
    ...item,
    startDate: item.startDate.getTime(),
    endDate: item.endDate.getTime(),
  })),
});

test('Should set correct start and end dates in drag&dropped appointment', async ({ page }) => {
  await setStyleAttribute(page, '#container', 'display: flex;');
  await appendElementTo(page, '#container', 'div', FIRST_SCHEDULER_SELECTOR);
  await appendElementTo(page, '#container', 'div', SECOND_SCHEDULER_SELECTOR);

  await createSchedulerWithRemoteDataSource(
    page,
    `#${FIRST_SCHEDULER_SELECTOR}`,
    new Date(2021, 3, 26),
    [TEST_APPOINTMENT],
  );

  await createWidget(
    page,
    'dxScheduler',
    {
      ...getBaseSchedulerOptions(new Date(2021, 4, 26)),
      dataSource: [],
    },
    `#${SECOND_SCHEDULER_SELECTOR}`,
  );

  const firstScheduler = new Scheduler(page, `#${FIRST_SCHEDULER_SELECTOR}`);
  const secondScheduler = new Scheduler(page, `#${SECOND_SCHEDULER_SELECTOR}`);

  const appointmentToMoveElement = firstScheduler
    .getAppointment(TEST_APPOINTMENT.text)
    .element;
  const cellToMoveElement = secondScheduler
    .getDateTableCell(0, 0);

  await dragToElement(page, appointmentToMoveElement, cellToMoveElement);

  await expect(secondScheduler.getAppointment(TEST_APPOINTMENT.text).date.time)
    .toHaveText(EXPECTED_APPOINTMENT_TIME);
});
