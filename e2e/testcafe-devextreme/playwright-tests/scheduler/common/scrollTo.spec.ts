import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Scheduler: ScrollTo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const createScheduler = async (options): Promise<void> => createWidget(page, 'dxScheduler', options);

async function scrollToDate(page: Page) {
  await page.evaluate(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());
  date.setHours(date.getHours() + 6, 30, 0, 0);
  instance.scrollTo(date);
}, );
}

async function scrollToDateWithGroups(page: Page) {
  await page.evaluate(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());
  date.setHours(date.getHours() + 6, 30, 0, 0);
  instance.scrollTo(date, { priority: 1 }, );
}
});

async function scrollToAllDay(page: Page) {
  await page.evaluate(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());
  date.setHours(date.getHours() + 6, 30, 0, 0);
  instance.scrollTo(date, undefined, true);
}, );
}

test('ScrollTo works correctly with week and day views', async ({ page }) => {
  // Scheduler on '#container'

  const views = [{ name: 'week', initValue: 0 }, { name: 'day', initValue: 0 }];

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    const { name, initValue } = view;

    await scheduler.option('currentView', name);
    await scheduler.option('useNative', true);
    await await page.waitForTimeout(1000);

    await scrollToDate();
    await await page.waitForTimeout(1000);

    expect(page.locator('.dx-scheduler-work-space')Scroll.top).toBeGreaterThan(initValue, `Work space is scrolled in ${name} view`);
  }
}).before(async () => createScheduler({
  dataSource: [],
  views: ['week', 'day'],
  currentView: 'week',
  currentDate: new Date(2019, 5, 1, 9, 40),
  firstDayOfWeek: 0,
  startDayHour: 0,
  endDayHour: 20,
  height: 580,
}));

test('ScrollTo works correctly with grouping in week view', async ({ page }) => {
  // Scheduler on '#container'

  await scheduler.option('currentView', 'week');
  await scheduler.option('useNative', true);
  await await page.waitForTimeout(1000);

  const initialTop = await page.locator('.dx-scheduler-work-space')Scroll.top;

  await scrollToDateWithGroups();
  await await page.waitForTimeout(1000);

  expect(page.locator('.dx-scheduler-work-space')Scroll.top).toBeGreaterThan(initialTop, 'Work space is scrolled with groups');
}).before(async () => createScheduler({
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
}));

test('ScrollTo works correctly with all-day panel', async ({ page }) => {
  // Scheduler on '#container'

  await scheduler.option('currentView', 'week');
  await scheduler.option('useNative', true);

  const initValue = 0;
  const expectedTopValue = 0;

  expect(page.locator('.dx-scheduler-work-space')Scroll.top).toBe(initValue, 'Work space has init scroll position');

  await scrollToAllDay();
  await await page.waitForTimeout(3000);

  expect(page.locator('.dx-scheduler-work-space')Scroll.top).toBe(expectedTopValue, 'Work space is scrolled to all-day panel');
}).before(async () => createScheduler({
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2019, 5, 1, 9, 40),
  firstDayOfWeek: 0,
  startDayHour: 0,
  endDayHour: 20,
  showAllDayPanel: true,
  height: 580,
}));

test('ScrollTo works correctly with RTL mode', async ({ page }) => {
  // Scheduler on '#container'

  await scheduler.option('currentView', 'week');
  await scheduler.option('useNative', true);
  await scheduler.option('rtlEnabled', true);
  await await page.waitForTimeout(1000);

  const initialBrowserTop = await page.locator('.dx-scheduler-work-space')Scroll.top;

  await scrollToDate();
  await await page.waitForTimeout(1000);

  const browserTop = await ClientFunction(() => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollTop())();

  expect(browserTop).toBeGreaterThan(initialBrowserTop, 'Work space is scrolled in RTL');
}).before(async () => createScheduler({
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2019, 5, 1, 9, 40),
  firstDayOfWeek: 0,
  startDayHour: 0,
  endDayHour: 20,
  height: 580,
}));

test('ScrollTo works correctly with timeline views (native, sync header/workspace) (T749957)', async (t) => {
  // Scheduler on '#container'

  const views = [{ name: 'timelineDay' }, { name: 'timelineWeek' }];

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    const { name } = view;

    await scheduler.option('currentView', name);
    await scheduler.option('useNative', true);
    await await page.waitForTimeout(200);

    async function getWSLeft(page: Page) {
  return page.evaluate(() => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollLeft(), );
}
    async function getHeaderLeft(page: Page) {
  return page.evaluate(() => $('.dx-scheduler-header-scrollable .dx-scrollable-container').scrollLeft(), );
}

    const initialLeft = await getWSLeft();
    const initialHeaderLeft = await getHeaderLeft();

    expect(initialLeft).toBe(initialHeaderLeft, `${name}: header/workspace initial sync`);

    await scrollToDate();
    await await page.waitForTimeout(300);

    const left = await getWSLeft();
    const headerLeft = await getHeaderLeft();

    expect(left).notEql(initialLeft, `${name}: workspace left changed`)
      .expect(headerLeft).toBe(left, `${name}: header synchronized with workspace`);
  }
}).before(async () => createScheduler({
  dataSource: [],
  views: ['timelineDay', 'timelineWeek'],
  currentView: 'timelineDay',
  currentDate: new Date(2019, 5, 1, 9, 40),
  firstDayOfWeek: 0,
  startDayHour: 0,
  endDayHour: 20,
  height: 580,
}));

test('ScrollTo works correctly in timeline RTL (native, sync header/workspace)', async (t) => {
  // Scheduler on '#container'

  await scheduler.option('currentView', 'timelineWeek');
  await scheduler.option('useNative', true);
  await scheduler.option('rtlEnabled', true);
  await await page.waitForTimeout(200);

  async function getWSLeft(page: Page) {
  return page.evaluate(() => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollLeft(), );
}
  async function getHeaderLeft(page: Page) {
  return page.evaluate(() => $('.dx-scheduler-header-scrollable .dx-scrollable-container').scrollLeft(), );
}

  const initialLeft = await getWSLeft();
  const initialHeaderLeft = await getHeaderLeft();

  expect(initialLeft).toBe(initialHeaderLeft, 'timeline RTL: initial sync');

  await scrollToDate();
  await await page.waitForTimeout(300);

  const left = await getWSLeft();
  const headerLeft = await getHeaderLeft();

  expect(left).notEql(initialLeft, 'timeline RTL: workspace left changed')
    .expect(headerLeft).toBe(left, 'timeline RTL: header synchronized');
}).before(async () => createScheduler({
  dataSource: [],
  views: ['timelineWeek'],
  currentView: 'timelineWeek',
  currentDate: new Date(2019, 5, 1, 9, 40),
  firstDayOfWeek: 0,
  startDayHour: 0,
  endDayHour: 20,
  height: 580,
  rtlEnabled: true,
}));

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
  test(`scrollTo should scroll to date with offset=${offset}, targetDate=${targetDate.toString()} (T1310544)`, async (t) => {
    // Scheduler on '#container'

    await page.evaluate((d) => $('#container').dxScheduler('instance').scrollTo(new Date(d)), (targetDate).toISOString());

    const cellData = await scheduler.getCellDataAtViewportCenter();

    expect(expectedDate.getTime()).toBeGreaterThanOrEqual(cellData.startDate.getTime())
      // eslint-disable-next-line spellcheck/spell-checker
      .expect(expectedDate.getTime()).toBeLessThanOrEqual(cellData.endDate.getTime());
  }).before(async () => createScheduler({
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
  }));
});
});
