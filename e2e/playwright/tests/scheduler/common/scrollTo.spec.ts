import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Scheduler from '../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const createScheduler = async (page: Page, options): Promise<void> => createWidget(page, 'dxScheduler', options);

const scrollToDate = (page: Page): Promise<void> => page.evaluate(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());
  date.setHours(date.getHours() + 6, 30, 0, 0);
  instance.scrollTo(date);
});

const scrollToDateWithGroups = (page: Page): Promise<void> => page.evaluate(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());
  date.setHours(date.getHours() + 6, 30, 0, 0);
  instance.scrollTo(date, { priority: 1 });
});

const scrollToAllDay = (page: Page): Promise<void> => page.evaluate(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());
  date.setHours(date.getHours() + 6, 30, 0, 0);
  instance.scrollTo(date, undefined, true);
});

const getWorkSpaceScrollTop = async (scheduler: Scheduler): Promise<number> => (
  await scheduler.getWorkSpaceScroll()
).top;

const getWSLeft = (page: Page): Promise<number> => page.evaluate(() => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollLeft());
const getHeaderLeft = (page: Page): Promise<number> => page.evaluate(() => $('.dx-scheduler-header-scrollable .dx-scrollable-container').scrollLeft() as number);

test.describe('Scheduler: ScrollTo', () => {
  test('ScrollTo works correctly with week and day views', async ({ page }) => {
    await createScheduler(page, {
      dataSource: [],
      views: ['week', 'day'],
      currentView: 'week',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      height: 580,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    const views = [{ name: 'week', initValue: 0 }, { name: 'day', initValue: 0 }];

    for (const view of views) {
      const { name, initValue } = view;

      await scheduler.option('currentView', name);
      await scheduler.option('useNative', true);

      await scrollToDate(page);

      await expect
        .poll(() => getWorkSpaceScrollTop(scheduler), { message: `Work space is scrolled in ${name} view` })
        .toBeGreaterThan(initValue);
    }
  });

  test('ScrollTo works correctly with grouping in week view', async ({ page }) => {
    await createScheduler(page, {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      groups: ['priority'],
      resources: [{
        fieldExpr: 'priority',
        dataSource: [
          { id: 1, text: 'High Priority' },
          { id: 2, text: 'Low Priority' },
        ],
      }],
      height: 580,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('currentView', 'week');
    await scheduler.option('useNative', true);

    const initialTop = await getWorkSpaceScrollTop(scheduler);

    await scrollToDateWithGroups(page);

    await expect
      .poll(() => getWorkSpaceScrollTop(scheduler), { message: 'Work space is scrolled with groups' })
      .toBeGreaterThan(initialTop);
  });

  test('ScrollTo works correctly with all-day panel', async ({ page }) => {
    await createScheduler(page, {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      showAllDayPanel: true,
      height: 580,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('currentView', 'week');
    await scheduler.option('useNative', true);

    const initValue = 0;
    const expectedTopValue = 0;

    await expect
      .poll(() => getWorkSpaceScrollTop(scheduler), { message: 'Work space has init scroll position' })
      .toBe(initValue);

    await scrollToAllDay(page);

    await expect
      .poll(() => getWorkSpaceScrollTop(scheduler), { message: 'Work space is scrolled to all-day panel' })
      .toBe(expectedTopValue);
  });

  test('ScrollTo works correctly with RTL mode', async ({ page }) => {
    await createScheduler(page, {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      height: 580,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('currentView', 'week');
    await scheduler.option('useNative', true);
    await scheduler.option('rtlEnabled', true);

    const initialBrowserTop = await getWorkSpaceScrollTop(scheduler);

    await scrollToDate(page);

    await expect
      .poll(
        () => page.evaluate(() => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollTop()),
        { message: 'Work space is scrolled in RTL' },
      )
      .toBeGreaterThan(initialBrowserTop);
  });

  test('ScrollTo works correctly with timeline views (native, sync header/workspace) (T749957)', async ({ page }) => {
    await createScheduler(page, {
      dataSource: [],
      views: ['timelineDay', 'timelineWeek'],
      currentView: 'timelineDay',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      height: 580,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    const views = [{ name: 'timelineDay' }, { name: 'timelineWeek' }];

    for (const view of views) {
      const { name } = view;

      await scheduler.option('currentView', name);
      await scheduler.option('useNative', true);

      const initialLeft = await getWSLeft(page);

      await expect
        .poll(() => getHeaderLeft(page), { message: `${name}: header/workspace initial sync` })
        .toBe(initialLeft);

      await scrollToDate(page);

      await expect
        .poll(() => getWSLeft(page), { message: `${name}: workspace left changed` })
        .not.toBe(initialLeft);

      const left = await getWSLeft(page);

      await expect
        .poll(() => getHeaderLeft(page), { message: `${name}: header synchronized with workspace` })
        .toBe(left);
    }
  });

  test('ScrollTo works correctly in timeline RTL (native, sync header/workspace)', async ({ page }) => {
    await createScheduler(page, {
      dataSource: [],
      views: ['timelineWeek'],
      currentView: 'timelineWeek',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      height: 580,
      rtlEnabled: true,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('currentView', 'timelineWeek');
    await scheduler.option('useNative', true);
    await scheduler.option('rtlEnabled', true);

    const initialLeft = await getWSLeft(page);

    await expect
      .poll(() => getHeaderLeft(page), { message: 'timeline RTL: initial sync' })
      .toBe(initialLeft);

    await scrollToDate(page);

    await expect
      .poll(() => getWSLeft(page), { message: 'timeline RTL: workspace left changed' })
      .not.toBe(initialLeft);

    const left = await getWSLeft(page);

    await expect
      .poll(() => getHeaderLeft(page), { message: 'timeline RTL: header synchronized' })
      .toBe(left);
  });

  [
    // startDayHour: 6:00, endDayHour: 18:00
    {
      offset: 0,
      targetDate: new Date(2021, 1, 3, 4, 0),
      expectedDate: new Date(2021, 1, 3, 6, 0),
    },
    {
      offset: 0,
      targetDate: new Date(2021, 1, 3, 12, 0),
      expectedDate: new Date(2021, 1, 3, 12, 0),
    },
    {
      offset: 0,
      targetDate: new Date(2021, 1, 3, 20, 0),
      expectedDate: new Date(2021, 1, 3, 18, 0),
    },

    // startDayHour: 18:00, endDayHour: next day 6:00
    {
      offset: 720,
      targetDate: new Date(2021, 1, 3, 10, 0),
      expectedDate: new Date(2021, 1, 3, 6, 0),
    },
    {
      offset: 720,
      targetDate: new Date(2021, 1, 3, 20, 0),
      expectedDate: new Date(2021, 1, 3, 20, 0),
    },
    {
      offset: 720,
      targetDate: new Date(2021, 1, 4, 1, 0),
      expectedDate: new Date(2021, 1, 4, 1, 0),
    },
    {
      offset: 720,
      targetDate: new Date(2021, 1, 4, 7, 0),
      expectedDate: new Date(2021, 1, 4, 6, 0),
    },

    // startDayHour: prev day 18:00, endDayHour: 6:00
    {
      offset: -720,
      targetDate: new Date(2021, 1, 3, 16, 0),
      expectedDate: new Date(2021, 1, 3, 18, 0),
    },
    {
      offset: -720,
      targetDate: new Date(2021, 1, 3, 21, 0),
      expectedDate: new Date(2021, 1, 3, 21, 0),
    },
    {
      offset: -720,
      targetDate: new Date(2021, 1, 4, 3, 0),
      expectedDate: new Date(2021, 1, 4, 3, 0),
    },
    {
      offset: -720,
      targetDate: new Date(2021, 1, 3, 7, 0),
      expectedDate: new Date(2021, 1, 3, 6, 0),
    },
  ].forEach(({ offset, targetDate, expectedDate }) => {
    test(`scrollTo should scroll to date with offset=${offset}, targetDate=${targetDate.toString()} (T1310544)`, async ({ page }) => {
      await createScheduler(page, {
        dataSource: [],
        views: [{
          type: 'timelineWeek',
          offset,
          cellDuration: 60,
        }],
        currentView: 'timelineWeek',
        currentDate: new Date(2021, 1, 2),
        startDayHour: 6,
        endDayHour: 18,
        height: 580,
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

      await scheduler.scrollTo(targetDate);

      const getCellDate = async (name: 'startDate' | 'endDate'): Promise<number> => {
        const cellData = await scheduler.getCellDataAtViewportCenter();

        return (cellData[name] as Date).getTime();
      };

      await expect.poll(() => getCellDate('startDate')).toBeLessThanOrEqual(expectedDate.getTime());
      await expect.poll(() => getCellDate('endDate')).toBeGreaterThanOrEqual(expectedDate.getTime());
    });
  });
});
