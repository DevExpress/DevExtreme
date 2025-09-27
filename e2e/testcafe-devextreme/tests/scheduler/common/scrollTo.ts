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
  const date = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  date.setHours(9, 40, 0, 0);

  instance.scrollTo(date);
});

const scrollToDateWithGroups = ClientFunction(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  date.setHours(9, 40, 0, 0);

  instance.scrollTo(date, { priority: 1 });
});

const scrollToAllDay = ClientFunction(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const currentDate = instance.option('currentDate');
  const date = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  date.setHours(9, 40, 0, 0);

  instance.scrollTo(date, undefined, true);
});

test('ScrollTo works correctly with week and day views', async (t) => {
  const scheduler = new Scheduler('#container');

  const views = [{
    name: 'week',
    initValue: 0,
  }, {
    name: 'day',
    initValue: 0,
  }];

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    const { name, initValue } = view;

    await scheduler.option('currentView', name);
    await scheduler.option('useNative', true);

    await t
      .expect(scheduler.workSpaceScroll.top).eql(initValue, `Work space has init scroll position in ${name} view`);

    await scrollToDate();

    const workSpaceScrollTop = await scheduler.workSpaceScroll.top;

    await t
      .expect(workSpaceScrollTop).notEql(initValue, `Work space is scrolled in ${name} view`);
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

  const initValue = 0;

  await t
    .expect(scheduler.workSpaceScroll.top).eql(initValue, 'Work space has init scroll position');

  await scrollToDateWithGroups();

  const workSpaceScrollTop = await scheduler.workSpaceScroll.top;

  await t
    .expect(workSpaceScrollTop).notEql(initValue, 'Work space is scrolled with groups');
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

  const initialWorkSpaceScrollTop = await scheduler.workSpaceScroll.top;

  await scrollToDate();

  const workSpaceScrollTop = await scheduler.workSpaceScroll.top;

  await t
    .expect(workSpaceScrollTop).notEql(initialWorkSpaceScrollTop, 'Work space is scrolled in RTL');
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
