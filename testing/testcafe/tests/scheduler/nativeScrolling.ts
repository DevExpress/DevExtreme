import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../helpers/changeTheme';
import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture.disablePageReloads`Scheduler: NativeScrolling`
  .page(url(__dirname, '../container.html'));

const createScheduler = async (options): Promise<void> => createWidget('dxScheduler', options);

const scrollToTime = ClientFunction(() => {
  const date = new Date(2019, 5, 1, 9, 40);
  const instance = ($('#container') as any).dxScheduler('instance');

  instance.scrollToTime(date.getHours() - 1, 30, date);
});

test('ScrollToTime works correctly with timelineDay and timelineWeek view (T749957)', async (t) => {
  const scheduler = new Scheduler('#container');

  const views = [{
    name: 'timelineDay',
    initValue: 0,
    expectedValue: 1700,
  }, {
    name: 'timelineWeek',
    initValue: 0,
    expectedValue: 25700,
  }];

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    const { name, initValue, expectedValue } = view;

    await scheduler.option('currentView', name);
    await scheduler.option('useNative', true);

    await t
      .expect(scheduler.workSpaceScroll.left).eql(initValue, `Work space has init scroll position in ${name} view`)
      .expect(scheduler.headerSpaceScroll.left).eql(initValue, `Header space has init scroll position in ${name} view`);

    await scrollToTime();

    await t
      .expect(scheduler.workSpaceScroll.left).eql(expectedValue, `Work space is scrolled in ${name} view`)
      .expect(scheduler.headerSpaceScroll.left).eql(expectedValue, `Header space is scrolled in ${name} view`);
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

const resourcesData = [...Array(20).keys()].map((num: number) => ({
  text: `Name ${num}`,
  id: num,
}));

test('The group panel and date table stay in sync during scrolling on material themes (T1146448)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await scheduler.scrollTo(new Date(2021, 1, 2), { ownerId: 19 });

  await t
    .expect(await takeScreenshot('material-theme-scrolling-vertical', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['timelineWeek'],
    currentView: 'timelineWeek',
    groups: ['ownerId'],
    currentDate: new Date(2021, 1, 2),
    resources: [{ fieldExpr: 'ownerId', dataSource: resourcesData, label: 'Owner' }],
    height: 600,
  });
}).after(async () => {
  await changeTheme('generic.light');
});
