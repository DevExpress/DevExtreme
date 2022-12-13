import { compareScreenshot } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import Scheduler from '../../../../model/scheduler';

fixture.skip`Scheduler: View with first day of week`
  .page(url(__dirname, '../../../container.html'));

safeSizeTest('WorkWeek should generate correct start view date', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(
    await compareScreenshot(t, 'work-week-first-day-of-week.png', scheduler.element),
  ).ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    views: ['workWeek'],
    currentView: 'workWeek',
    firstDayOfWeek: 1,
    currentDate: new Date(2021, 11, 12),
    height: 600,
  }, true);
});
