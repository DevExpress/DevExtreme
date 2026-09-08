import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Scheduler from '../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const createScheduler = async (page: Page, options: object): Promise<void> => createWidget(page, 'dxScheduler', options);

// The three scrollTo calls the TestCafe file made through ClientFunction: the widget is asked to
// scroll to a date six and a half hours into the current one.
const scrollToCurrentDate = async (
  page: Page,
  args?: { groups?: object; allDay?: boolean },
): Promise<void> => page.evaluate((options) => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());

  date.setHours(date.getHours() + 6, 30, 0, 0);

  instance.scrollTo(date, options?.groups, options?.allDay);
}, args);

const getWorkSpaceScrollLeft = async (page: Page): Promise<number> => page.evaluate(
  () => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollLeft(),
);

const getHeaderScrollLeft = async (page: Page): Promise<number> => page.evaluate(
  () => $('.dx-scheduler-header-scrollable .dx-scrollable-container').scrollLeft() ?? 0,
);

const getWorkSpaceScrollTop = async (page: Page): Promise<number> => page.evaluate(
  () => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollTop(),
);

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

  for (const name of ['week', 'day']) {
    await scheduler.option('currentView', name);
    await scheduler.option('useNative', true);

    await scrollToCurrentDate(page);

    await expect
      .poll(async () => (await scheduler.getWorkSpaceScroll()).top, { message: `Work space is scrolled in ${name} view` })
      .toBeGreaterThan(0);
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

  const initialTop = (await scheduler.getWorkSpaceScroll()).top;

  await scrollToCurrentDate(page, { groups: { priority: 1 } });

  await expect
    .poll(async () => (await scheduler.getWorkSpaceScroll()).top, { message: 'Work space is scrolled with groups' })
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

  expect((await scheduler.getWorkSpaceScroll()).top).toBe(0);

  await scrollToCurrentDate(page, { allDay: true });

  // The all-day panel sits at the very top, so the scroll must stay where it is.
  await expect
    .poll(async () => (await scheduler.getWorkSpaceScroll()).top, { message: 'Work space is scrolled to all-day panel' })
    .toBe(0);
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

  const initialBrowserTop = (await scheduler.getWorkSpaceScroll()).top;

  await scrollToCurrentDate(page);

  await expect
    .poll(() => getWorkSpaceScrollTop(page), { message: 'Work space is scrolled in RTL' })
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

  for (const name of ['timelineDay', 'timelineWeek']) {
    await scheduler.option('currentView', name);
    await scheduler.option('useNative', true);

    const initialLeft = await getWorkSpaceScrollLeft(page);

    // toBeCloseTo, not toBe: an unscrolled container reports -0 on one side and 0 on the other.
    expect(await getHeaderScrollLeft(page), `${name}: header/workspace initial sync`).toBeCloseTo(initialLeft, 5);

    await scrollToCurrentDate(page);

    await expect
      .poll(() => getWorkSpaceScrollLeft(page), { message: `${name}: workspace left changed` })
      .not.toBe(initialLeft);

    const left = await getWorkSpaceScrollLeft(page);

    expect(await getHeaderScrollLeft(page), `${name}: header synchronized with workspace`).toBeCloseTo(left, 5);
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

  const initialLeft = await getWorkSpaceScrollLeft(page);

  expect(await getHeaderScrollLeft(page), 'timeline RTL: initial sync').toBeCloseTo(initialLeft, 5);

  await scrollToCurrentDate(page);

  await expect
    .poll(() => getWorkSpaceScrollLeft(page), { message: 'timeline RTL: workspace left changed' })
    .not.toBe(initialLeft);

  const left = await getWorkSpaceScrollLeft(page);

  expect(await getHeaderScrollLeft(page), 'timeline RTL: header synchronized').toBeCloseTo(left, 5);
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

    const cellData = await scheduler.getCellDataAtViewportCenter();

    expect(expectedDate.getTime()).toBeGreaterThanOrEqual(new Date(cellData.startDate).getTime());
    expect(expectedDate.getTime()).toBeLessThanOrEqual(new Date(cellData.endDate).getTime());
  });
});
