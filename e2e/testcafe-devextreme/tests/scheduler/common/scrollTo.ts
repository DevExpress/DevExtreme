import { ClientFunction } from 'testcafe';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler: ScrollTo`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (options): Promise<void> => createWidget('dxScheduler', options);

const scrollToDate = ClientFunction(() => {
  const date = new Date(2019, 5, 1, 9, 40);
  const instance = ($('#container') as any).dxScheduler('instance');

  instance.scrollTo(date);
});

const scrollToDateWithGroups = ClientFunction(() => {
  const date = new Date(2019, 5, 1, 9, 40);
  const instance = ($('#container') as any).dxScheduler('instance');

  instance.scrollTo(date, { priority: 1 });
});

const scrollToAllDay = ClientFunction(() => {
  const date = new Date(2019, 5, 1, 9, 40);
  const instance = ($('#container') as any).dxScheduler('instance');

  instance.scrollTo(date, undefined, true);
});

test('ScrollTo works correctly with timelineDay and timelineWeek view', async (t) => {
  const scheduler = new Scheduler('#container');

  const views = [{
    name: 'timelineDay',
    initValue: 0,
  }, {
    name: 'timelineWeek',
    initValue: 0,
  }];

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    const { name, initValue } = view;

    await scheduler.option('currentView', name);
    await scheduler.option('useNative', true);

    await t
      .expect(scheduler.workSpaceScroll.left).eql(initValue, `Work space has init scroll position in ${name} view`)
      .expect(scheduler.headerSpaceScroll.left).eql(initValue, `Header space has init scroll position in ${name} view`);

    await scrollToDate();

    const workSpaceScrollLeft = await scheduler.workSpaceScroll.left;
    const headerSpaceScrollLeft = await scheduler.headerSpaceScroll.left;

    await t
      .expect(workSpaceScrollLeft).notEql(initValue, `Work space is scrolled in ${name} view`)
      .expect(headerSpaceScrollLeft).notEql(initValue, `Header space is scrolled in ${name} view`)
      .expect(workSpaceScrollLeft)
      .eql(headerSpaceScrollLeft, `Work space and header space are synchronized in ${name} view`);
  }
}).before(async () => createScheduler({
  dataSource: [],
  views: ['timelineDay', 'timelineWeek'],
  currentView: 'timelineDay',
  currentDate: new Date(2019, 5, 1, 9, 40),
  firstDayOfWeek: 0,
  startDayHour: 0,
  endDayHour: 20,
  cellDuration: 60,
  groups: ['priority'],
  height: 580,
}));

test('ScrollTo works correctly with grouping in timeline views', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentView', 'timelineWeek');
  await scheduler.option('useNative', true);

  const initValue = 0;

  await t
    .expect(scheduler.workSpaceScroll.left).eql(initValue, 'Work space has init scroll position')
    .expect(scheduler.headerSpaceScroll.left).eql(initValue, 'Header space has init scroll position');

  await scrollToDateWithGroups();

  const workSpaceScrollLeft = await scheduler.workSpaceScroll.left;
  const headerSpaceScrollLeft = await scheduler.headerSpaceScroll.left;

  await t
    .expect(workSpaceScrollLeft).notEql(initValue, 'Work space is scrolled with groups')
    .expect(headerSpaceScrollLeft).notEql(initValue, 'Header space is scrolled with groups')
    .expect(workSpaceScrollLeft)
    .eql(headerSpaceScrollLeft, 'Work space and header space are synchronized with groups');
}).before(async () => createScheduler({
  dataSource: [],
  views: ['timelineWeek'],
  currentView: 'timelineWeek',
  currentDate: new Date(2019, 5, 1, 9, 40),
  firstDayOfWeek: 0,
  startDayHour: 0,
  endDayHour: 20,
  cellDuration: 60,
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

  await scheduler.option('currentView', 'timelineWeek');
  await scheduler.option('useNative', true);
  await scheduler.option('rtlEnabled', true);

  const initialWorkSpaceScrollLeft = await scheduler.workSpaceScroll.left;
  const initialHeaderSpaceScrollLeft = await scheduler.headerSpaceScroll.left;

  await t
    .expect(initialWorkSpaceScrollLeft).eql(initialHeaderSpaceScrollLeft, 'Work space and header space have same initial scroll position in RTL');

  await scrollToDate();

  const workSpaceScrollLeft = await scheduler.workSpaceScroll.left;
  const headerSpaceScrollLeft = await scheduler.headerSpaceScroll.left;

  await t
    .expect(workSpaceScrollLeft).notEql(initialWorkSpaceScrollLeft, 'Work space is scrolled in RTL')
    .expect(headerSpaceScrollLeft).notEql(initialHeaderSpaceScrollLeft, 'Header space is scrolled in RTL')
    .expect(workSpaceScrollLeft)
    .eql(headerSpaceScrollLeft, 'Work space and header space are synchronized in RTL');
}).before(async () => createScheduler({
  dataSource: [],
  views: ['timelineWeek'],
  currentView: 'timelineWeek',
  currentDate: new Date(2019, 5, 1, 9, 40),
  firstDayOfWeek: 0,
  startDayHour: 0,
  endDayHour: 20,
  cellDuration: 60,
  rtlEnabled: true,
  height: 580,
}));
