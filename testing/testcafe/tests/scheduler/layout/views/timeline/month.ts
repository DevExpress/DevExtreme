import { compareScreenshot } from '../../../../../helpers/screenshot-comparer';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import Scheduler from '../../../../../model/scheduler';

fixture`Scheduler: Layout Views: Timeline Month`
  .page(url(__dirname, '../../container.html'));

test('Header cells should be aligned with date-table cells in timeline-month when current date changes', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentDate', new Date(2020, 11, 1));

  await t.expect(
    await compareScreenshot(t, 'timeline-month-change-current-date.png'),
  ).ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    currentDate: new Date(2020, 10, 1),
    currentView: 'timelineMonth',
    height: 600,
    views: ['timelineMonth'],
    crossScrollingEnabled: true,
  }, true);
});
