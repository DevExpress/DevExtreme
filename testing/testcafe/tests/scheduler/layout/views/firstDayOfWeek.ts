import { compareScreenshot } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture`Scheduler: View with first day of week`
  .page(url(__dirname, '../../../container.html'));

test('WorkWeek should generate correct start view date', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentDate', new Date(2021, 4, 5));
  await scheduler.scrollTo(new Date(2021, 4, 15), { priorityId: 2 });

  await t.expect(
    await compareScreenshot(t, 'work-week-first-day-of-week.png', scheduler.workSpace),
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
