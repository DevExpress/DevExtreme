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

const TEST_APPOINTMENT = {
  id: 10,
  text: 'My appointment',
  startDate: new Date(2021, 3, 28, 1),
  endDate: new Date(2021, 3, 28, 2),
};

const getBaseSchedulerOptions = (currentDate: Date): Record<string, unknown> => ({
  currentDate,
  currentView: 'workWeek',
  width: 600,
});

const createSchedulerWithRemoteDataSource = async (
  page: Page,
  options: Record<string, unknown>,
  selector: string,
  appointments: TestAppointment[],
): Promise<void> => {
  await page.evaluate(({ widgetOptions, elementSelector, initialAppointments }) => {
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

    ($(elementSelector) as any).dxScheduler({
      ...widgetOptions,
      appointmentDragging: {
        group: 'testDragGroup',
        onRemove(e) {
          e.component.deleteAppointment(e.itemData);
        },
        onAdd(e) {
          e.component.addAppointment(e.itemData);
        },
      },
      dataSource: new DataSourceMock(initialAppointments),
    });
  }, { widgetOptions: options, elementSelector: selector, initialAppointments: appointments });
};

test.describe('Drag-n-drop appointments between two schedulers with async DataSource (T1094033)', () => {
  test('Should set correct start and end dates in drag&dropped appointment', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'display: flex;');
    await appendElementTo(page, '#container', 'div', FIRST_SCHEDULER_SELECTOR);
    await appendElementTo(page, '#container', 'div', SECOND_SCHEDULER_SELECTOR);

    await createSchedulerWithRemoteDataSource(
      page,
      getBaseSchedulerOptions(new Date(2021, 3, 26)),
      `#${FIRST_SCHEDULER_SELECTOR}`,
      [TEST_APPOINTMENT],
    );

    await createWidget(
      page,
      'dxScheduler',
      (options: Record<string, unknown>) => ({
        ...options,
        appointmentDragging: {
          group: 'testDragGroup',
          onRemove(e) {
            e.component.deleteAppointment(e.itemData);
          },
          onAdd(e) {
            e.component.addAppointment(e.itemData);
          },
        },
        dataSource: [],
      }),
      `#${SECOND_SCHEDULER_SELECTOR}`,
      { arg: getBaseSchedulerOptions(new Date(2021, 4, 26)) },
    );

    const firstScheduler = new Scheduler(page, `#${FIRST_SCHEDULER_SELECTOR}`);
    const secondScheduler = new Scheduler(page, `#${SECOND_SCHEDULER_SELECTOR}`);

    const appointmentToMoveElement = firstScheduler
      .getAppointment(TEST_APPOINTMENT.text)
      .element;
    const cellToMoveElement = secondScheduler
      .getDateTableCell(0, 0);

    await dragToElement(page, appointmentToMoveElement, cellToMoveElement);

    await expect(secondScheduler.getAppointment(TEST_APPOINTMENT.text).date)
      .toHaveText(EXPECTED_APPOINTMENT_TIME);
  });
});
