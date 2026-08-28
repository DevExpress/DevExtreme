import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

declare global {
  interface Window {
    testOptions: {
      startDate?: Date;
      endDate?: Date;
      loadCount?: number;
    };
  }
}

// The load options carry dates the page built in its own timezone, which is not the one this
// process runs in, so they are compared by their parts rather than by their instant.
const readLoadOptionsDates = async (page: Page): Promise<{
  startDate: number[] | null;
  endDate: number[] | null;
}> => page.evaluate(() => {
  const parts = (date?: Date): number[] | null => (date
    ? [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()]
    : null);

  return {
    startDate: parts(window.testOptions.startDate),
    endDate: parts(window.testOptions.endDate),
  };
});

const createLoadOptionsScheduler = async (
  page: Page,
  groupByDate: boolean,
): Promise<void> => createWidget(page, 'dxScheduler', {
  dataSource: {
    load: (loadOptions: any) => {
      const { startDate, endDate } = loadOptions;

      // added dates to global scope because there isn't another acceptable way to test them
      window.testOptions = {
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
  groupByDate,
  views: ['week'],
  currentView: 'week',
});

test('it should correctly load items with post processing', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
      postProcess: (items: unknown[]) => [items[0]],
    },
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 9,
    endDayHour: 19,
    height: 600,
    width: 800,
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment0 = scheduler.getAppointment('appt-0');

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(1);
  await expect(appointment0.element).toBeAttached();
});

[true, false].forEach((groupByDate) => {
  test(`it should have start and end date in load options groupByDate=${groupByDate}`, async ({ page }) => {
    await createLoadOptionsScheduler(page, groupByDate);

    const win = await readLoadOptionsDates(page);

    expect(win.startDate).toEqual([2021, 4, 9, 0, 0]);
    expect(win.endDate).toEqual([2021, 4, 15, 2, 59]);
  });

  test(`it should have dates in load options when view dates changing. groupByDate=${groupByDate}`, async ({ page }) => {
    await createLoadOptionsScheduler(page, groupByDate);

    const { toolbar } = new Scheduler(page, '#container');

    await toolbar.navigator.nextButton.click();

    await expect
      .poll(async () => (await readLoadOptionsDates(page)).startDate)
      .toEqual([2021, 4, 16, 0, 0]);

    const win = await readLoadOptionsDates(page);

    expect(win.startDate).toEqual([2021, 4, 16, 0, 0]);
    expect(win.endDate).toEqual([2021, 4, 22, 2, 59]);
  });
});

test('it should not call additional DataSource loads after repaint', async ({ page }) => {
  await page.evaluate(() => {
    window.testOptions = { loadCount: 0 };
  });

  await createWidget(page, 'dxScheduler', () => ({
    dataSource: {
      store: new (window as any).DevExpress.data.ArrayStore({
        data: [],
        onLoaded: () => { window.testOptions.loadCount! += 1; },
      }),
    },
  }));

  const scheduler = new Scheduler(page, '#container');

  await scheduler.repaint();
  await scheduler.repaint();
  await scheduler.repaint();

  await page.evaluate(({ key, data }) => {
    const store = (window as any).widget.getDataSource().store();

    store.push([{ type: 'update', key, data }]);
  }, { key: 0, data: {} });

  const readLoadCount = async (): Promise<number | undefined> => page
    .evaluate(() => window.testOptions.loadCount);

  await expect.poll(readLoadCount).toBe(2);

  // Nothing renders on a load that should not have happened, so the only way to see one is to
  // give it the time to arrive.
  await page.waitForTimeout(200);

  expect(await readLoadCount()).toBe(2);
});
