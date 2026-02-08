import { ClientFunction } from 'testcafe';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler: ScrollTo`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (options): Promise<void> => createWidget('dxScheduler', options);

const scrollToDate = ClientFunction(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());
  date.setHours(date.getHours() + 6, 30, 0, 0);
  instance.scrollTo(date);
});

const scrollToDateWithGroups = ClientFunction(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());
  date.setHours(date.getHours() + 6, 30, 0, 0);
  instance.scrollTo(date, { priority: 1 });
});

const scrollToAllDay = ClientFunction(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime());
  date.setHours(date.getHours() + 6, 30, 0, 0);
  instance.scrollTo(date, undefined, true);
});

test('ScrollTo works correctly with week and day views', async (t) => {
  const scheduler = new Scheduler('#container');

  const views = [{ name: 'week', initValue: 0 }, { name: 'day', initValue: 0 }];

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    const { name, initValue } = view;

    await scheduler.option('currentView', name);
    await scheduler.option('useNative', true);
    await t.wait(1000);

    await scrollToDate();
    await t.wait(1000);

    await t
      .expect(scheduler.workSpaceScroll.top).gt(initValue, `Work space is scrolled in ${name} view`);
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

test('ScrollTo works correctly with grouping in week view', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentView', 'week');
  await scheduler.option('useNative', true);
  await t.wait(1000);

  const initialTop = await scheduler.workSpaceScroll.top;

  await scrollToDateWithGroups();
  await t.wait(1000);

  await t
    .expect(scheduler.workSpaceScroll.top).gt(initialTop, 'Work space is scrolled with groups');
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

test('ScrollTo works correctly with all-day panel', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentView', 'week');
  await scheduler.option('useNative', true);

  const initValue = 0;
  const expectedTopValue = 0;

  await t
    .expect(scheduler.workSpaceScroll.top).eql(initValue, 'Work space has init scroll position');

  await scrollToAllDay();
  await t.wait(3000);

  await t
    .expect(scheduler.workSpaceScroll.top).eql(expectedTopValue, 'Work space is scrolled to all-day panel');
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

test('ScrollTo works correctly with RTL mode', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentView', 'week');
  await scheduler.option('useNative', true);
  await scheduler.option('rtlEnabled', true);
  await t.wait(1000);

  const initialBrowserTop = await scheduler.workSpaceScroll.top;

  await scrollToDate();
  await t.wait(1000);

  const browserTop = await ClientFunction(() => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollTop())();

  await t
    .expect(browserTop).gt(initialBrowserTop, 'Work space is scrolled in RTL');
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
  const scheduler = new Scheduler('#container');

  const views = [{ name: 'timelineDay' }, { name: 'timelineWeek' }];

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    const { name } = view;

    await scheduler.option('currentView', name);
    await scheduler.option('useNative', true);
    await t.wait(200);

    const getWSLeft = ClientFunction(() => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollLeft());
    const getHeaderLeft = ClientFunction(() => $('.dx-scheduler-header-scrollable .dx-scrollable-container').scrollLeft());

    const initialLeft = await getWSLeft();
    const initialHeaderLeft = await getHeaderLeft();

    await t.expect(initialLeft).eql(initialHeaderLeft, `${name}: header/workspace initial sync`);

    await scrollToDate();
    await t.wait(300);

    const left = await getWSLeft();
    const headerLeft = await getHeaderLeft();

    await t
      .expect(left).notEql(initialLeft, `${name}: workspace left changed`)
      .expect(headerLeft).eql(left, `${name}: header synchronized with workspace`);
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
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentView', 'timelineWeek');
  await scheduler.option('useNative', true);
  await scheduler.option('rtlEnabled', true);
  await t.wait(200);

  const getWSLeft = ClientFunction(() => ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable().scrollLeft());
  const getHeaderLeft = ClientFunction(() => $('.dx-scheduler-header-scrollable .dx-scrollable-container').scrollLeft());

  const initialLeft = await getWSLeft();
  const initialHeaderLeft = await getHeaderLeft();

  await t.expect(initialLeft).eql(initialHeaderLeft, 'timeline RTL: initial sync');

  await scrollToDate();
  await t.wait(300);

  const left = await getWSLeft();
  const headerLeft = await getHeaderLeft();

  await t
    .expect(left).notEql(initialLeft, 'timeline RTL: workspace left changed')
    .expect(headerLeft).eql(left, 'timeline RTL: header synchronized');
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
    const scheduler = new Scheduler('#container');

    await scheduler.scrollTo(targetDate);

    const cellData = await scheduler.getCellDataAtViewportCenter();

    await t
      .expect(expectedDate.getTime()).gte(cellData.startDate.getTime())
      // eslint-disable-next-line spellcheck/spell-checker
      .expect(expectedDate.getTime()).lte(cellData.endDate.getTime());
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
