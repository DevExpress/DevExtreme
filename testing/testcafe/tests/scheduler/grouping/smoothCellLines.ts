import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Scheduler: SmoothCellLines`
  .page(url(__dirname, '../../container.html'));

const resourcesData = [...Array(20).keys()].map((num: number) => ({
  text: `Name ${num}`,
  id: num,
}));

test('The group panel and date table stay in sync during scrolling on material themes (T1146448)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.scroll(scheduler.workspaceScrollable, 0, 1100);

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
