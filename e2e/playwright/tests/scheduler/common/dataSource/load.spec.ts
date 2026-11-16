import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

interface TestOptions {
  startDate?: Date;
  endDate?: Date;
  loadCount?: number;
}

type TestWindow = Window & { testOptions?: TestOptions };

const getWindow = (page: Page): Promise<TestOptions | undefined> => page.evaluate(
  () => (window as TestWindow).testOptions,
);
const repaint = (page: Page): Promise<void> => page.evaluate(() => {
  (window as any).widget.repaint();
});

const pushDataToStore = async (
  page: Page,
  key: unknown,
  data: unknown,
): Promise<void> => page.evaluate(({ storeKey, storeData }) => {
  const store = (window as any).widget.getDataSource().store();
  store.push([{ type: 'update', key: storeKey, data: storeData }]);
}, { storeKey: key, storeData: data });

const createSchedulerWithLoadOptions = async (
  page: Page,
  groupByDate: boolean,
): Promise<void> => createWidget(page, 'dxScheduler', (groupByDateArg: boolean) => ({
  dataSource: {
    load: (loadOptions) => {
      const { startDate, endDate } = loadOptions;

      // added dates to global scope because there isn't another acceptable way to test them
      (window as TestWindow).testOptions = {
        startDate,
        endDate,
      };
    },
  },
  currentDate: new Date(2021, 4, 11),
  width: 700,
  height: 500,
  startDayHour: 0,
  endDayHour: 3,
  groupByDate: groupByDateArg,
  views: ['week'],
  currentView: 'week',
}), SCHEDULER_SELECTOR, { arg: groupByDate });

test.describe('Scheduler - DataSource loading', () => {
  test('it should correctly load items with post processing', async ({ page }) => {
    await createWidget(page, 'dxScheduler', () => ({
      dataSource: {
        store: [
          {
            text: 'appt-0',
            startDate: new Date(2021, 3, 26, 9, 30),
            endDate: new Date(2021, 3, 26, 11, 30),
          }, {
            text: 'appt-1',
            startDate: new Date(2021, 3, 27, 9, 30),
            endDate: new Date(2021, 3, 27, 11, 30),
          }, {
            text: 'appt-2',
            startDate: new Date(2021, 3, 28, 9, 30),
            endDate: new Date(2021, 3, 28, 11, 30),
          },
        ],
        postProcess: (items) => [items[0]],
      },
      views: ['workWeek'],
      currentView: 'workWeek',
      currentDate: new Date(2021, 3, 27),
      startDayHour: 9,
      endDayHour: 19,
      height: 600,
      width: 800,
    }));

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointment0 = scheduler.getAppointment('appt-0');

    await expect(scheduler.appointments).toHaveCount(1);
    await expect(appointment0.element).toBeAttached();
  });

  [true, false].forEach((groupByDate) => {
    test(`it should have start and end date in load options groupByDate=${groupByDate}`, async ({ page }) => {
      await createSchedulerWithLoadOptions(page, groupByDate);

      await expect.poll(async () => (await getWindow(page))?.startDate)
        .toEqual(new Date(2021, 4, 9));
      await expect.poll(async () => (await getWindow(page))?.endDate)
        .toEqual(new Date(2021, 4, 15, 2, 59));
    });

    test(`it should have dates in load options when view dates changing. groupByDate=${groupByDate}`, async ({ page }) => {
      await createSchedulerWithLoadOptions(page, groupByDate);

      const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

      await toolbar.navigator.nextButton.click();

      await expect.poll(async () => (await getWindow(page))?.startDate)
        .toEqual(new Date(2021, 4, 16));
      await expect.poll(async () => (await getWindow(page))?.endDate)
        .toEqual(new Date(2021, 4, 22, 2, 59));
    });
  });

  test('it should not call additional DataSource loads after repaint', async ({ page }) => {
    await page.evaluate(() => {
      (window as TestWindow).testOptions = {
        loadCount: 0,
      };
      (window as any).widget = ($('#container') as any)
        .dxScheduler({
          dataSource: {
            store: new (window as any).DevExpress.data.ArrayStore({
              data: [],
              onLoaded: () => { (window as TestWindow).testOptions!.loadCount! += 1; },
            }),
          },
        }).dxScheduler('instance');
    });

    await repaint(page);
    await repaint(page);
    await repaint(page);

    await pushDataToStore(page, 0, {});
    // No event marks that the store push is processed, and an extra load must have time to happen.
    await page.waitForTimeout(200);

    await expect.poll(async () => (await getWindow(page))?.loadCount).toBe(2);
  });
});
