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

const getWSScrollLeft = ClientFunction(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  return instance.getWorkSpaceScrollable().scrollLeft();
});

const getHeaderScrollLeft = ClientFunction(() => $('.dx-scheduler-header-scrollable .dx-scrollable-container').scrollLeft());

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

test('T1310544: ScrollTo should scroll to date with offset: 720 (12 hours)', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentView', 'timelineDay');
  await scheduler.option('useNative', true);
  await t.wait(200);

  const getExpectedScrollLeft = ClientFunction(() => {
    const instance = ($('#container') as any).dxScheduler('instance');
    const workspace = instance.getWorkSpace();
    const scrollable = workspace.getScrollable();
    const $scrollable = scrollable.$element();
    const scrollableWidth = $scrollable.width();

    const targetDateValue = new Date(2021, 1, 2, 22, 0);

    const cell = workspace.viewDataProvider.findGlobalCellPosition(
      targetDateValue,
      0,
      false,
      true,
    );
    const { startDate: cellStartDate, endDate: cellEndDate } = cell.cellData;

    const isDateValid = targetDateValue.getTime() >= cellStartDate.getTime()
      && targetDateValue.getTime() < cellEndDate.getTime();

    // eslint-disable-next-line no-underscore-dangle
    const cellCoordinates = workspace._getScrollCoordinates(targetDateValue, 0, false);
    const cellWidth = workspace.getCellWidth();
    const expectedScrollLeft = cellCoordinates.left - (scrollableWidth - cellWidth) / 2;

    return {
      expectedScrollLeft,
      isDateValid,
      cellStartDate: cellStartDate.getTime(),
      cellEndDate: cellEndDate.getTime(),
      targetDate: targetDateValue.getTime(),
    };
  });

  const initialLeft = await getWSScrollLeft();
  const initialHeaderLeft = await getHeaderScrollLeft();

  await t.expect(initialLeft).eql(initialHeaderLeft, 'Initial header/workspace sync');

  const cellData = await getExpectedScrollLeft();

  await t
    .expect(cellData.isDateValid)
    .ok('Target date should be within cell range');

  const scrollToTargetDate = ClientFunction((targetDate: Date) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.scrollTo(targetDate, undefined, false);
  });

  await scrollToTargetDate(new Date(2021, 1, 2, 22, 0));
  await t.wait(300);

  const actualLeft = await getWSScrollLeft();
  const headerLeft = await getHeaderScrollLeft();

  await t
    .expect(actualLeft).notEql(initialLeft, 'Workspace should be scrolled')
    .expect(headerLeft).eql(actualLeft, 'Header should be synchronized with workspace')
    .expect(actualLeft)
    .eql(cellData.expectedScrollLeft, 'Scroll position should match expected');
}).before(async () => createScheduler({
  dataSource: [],
  views: ['timelineDay'],
  currentView: 'timelineDay',
  currentDate: new Date(2021, 1, 2),
  firstDayOfWeek: 0,
  startDayHour: 6,
  endDayHour: 18,
  offset: 720,
  cellDuration: 60,
  height: 580,
}));

[
  {
    startDayHour: 6,
    endDayHour: 18,
    offset: 0,
    hours: [4, 12, 20],
  },
  {
    startDayHour: 6,
    endDayHour: 18,
    offset: 360,
    hours: [10, 15, 22],
  },
  {
    startDayHour: 6,
    endDayHour: 18,
    offset: -120,
    hours: [3, 10, 20],
  },
  {
    startDayHour: 6,
    endDayHour: 18,
    offset: 720,
    hours: [10, 22, 3],
  },
  {
    startDayHour: 0,
    endDayHour: 12,
    offset: 0,
    hours: [0, 6, 13],
  },
  {
    startDayHour: 12,
    endDayHour: 24,
    offset: 0,
    hours: [11, 18, 23],
  },
].forEach(({
  startDayHour,
  endDayHour,
  offset,
  hours,
}) => {
  hours.forEach((hour) => {
    const getExpectedScrollPosition = ClientFunction((targetHour: number) => {
      const instance = ($('#container') as any).dxScheduler('instance');
      const workspace = instance.getWorkSpace();
      const scrollable = workspace.getScrollable();
      const $scrollable = scrollable.$element();
      const scrollableWidth = $scrollable.width();
      const targetDate = new Date(2021, 1, 2, targetHour, 0);

      // eslint-disable-next-line no-underscore-dangle
      const isValidDate = workspace._isValidScrollDate(targetDate, false);

      // eslint-disable-next-line no-underscore-dangle
      const cellCoordinates = workspace._getScrollCoordinates(targetDate, 0, false);
      const cellWidth = workspace.getCellWidth();
      const expectedScrollLeft = cellCoordinates.left - (scrollableWidth - cellWidth) / 2;

      return {
        expectedScrollLeft,
        isValidDate,
      };
    });

    const scrollToHour = ClientFunction((targetHour: number) => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.scrollTo(new Date(2021, 1, 2, targetHour, 0), undefined, false);
    });

    test(`Hour normalization: startDayHour: ${startDayHour}, endDayHour: ${endDayHour}, offset: ${offset}, hour: ${hour}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await scheduler.option('currentView', 'timelineWeek');
      await scheduler.option('useNative', true);
      await t.wait(200);

      const initialLeft = await getWSScrollLeft();
      const initialHeaderLeft = await getHeaderScrollLeft();

      await t.expect(initialLeft).eql(initialHeaderLeft, 'Initial header/workspace sync');

      const { expectedScrollLeft, isValidDate } = await getExpectedScrollPosition(hour);

      await t
        .expect(isValidDate)
        .ok(`Target date (hour: ${hour}) should be within valid scroll range`);

      await scrollToHour(hour);
      await t.wait(300);

      const actualLeft = await getWSScrollLeft();
      const headerLeft = await getHeaderScrollLeft();

      await t
        .expect(actualLeft).notEql(initialLeft, 'Workspace should be scrolled')
        .expect(headerLeft).eql(actualLeft, 'Header should be synchronized with workspace')
        .expect(actualLeft)
        .eql(expectedScrollLeft, 'Scroll position should match expected');
    }).before(async () => createScheduler({
      dataSource: [],
      views: [{
        type: 'timelineWeek',
        offset,
        cellDuration: 60,
      }],
      currentView: 'timelineWeek',
      currentDate: new Date(2021, 1, 2),
      startDayHour,
      endDayHour,
      height: 580,
    }));
  });
});
