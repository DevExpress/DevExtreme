import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Scheduler: different intervalCount option's values`
  .page(url(__dirname, '../../container.html'));

test('Interval count: 1, February of 2021', async (t) => {
  const scheduler = new Scheduler('#container');
  await t.expect(await compareScreenshot(t, 'month-february-2021.png', scheduler.workSpace)).ok();
}).before(async () => createWidget('dxScheduler', {
  views: [{
    type: 'month',
    intervalCount: 1,
  }],
  currentView: 'month',
  firstDayOfWeek: 1,
  currentDate: new Date(2021, 1, 1),
}));

test('Interval count: 12', async (t) => {
  const scheduler = new Scheduler('#container');
  await scheduler.scrollTo(new Date(2024, 6, 1)); // scroll to last row

  await t.expect(await compareScreenshot(t, 'month-interval-count-12.png', scheduler.workSpace)).ok();
}).before(async () => createWidget('dxScheduler', {
  views: [{
    type: 'month',
    intervalCount: 12,
  }],
  height: 600,
  currentView: 'month',
  currentDate: new Date(2023, 6, 1),
}));
