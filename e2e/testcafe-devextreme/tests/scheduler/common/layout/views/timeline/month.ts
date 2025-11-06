import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../../helpers/createWidget';
import url from '../../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler: Layout Views: Timeline Month`
  .page(url(__dirname, '../../../../../container.html'));

test('Header cells should be aligned with date-table cells in timeline-month when current date changes', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await scheduler.option('currentDate', new Date(2020, 11, 1));

  await testScreenshot(t, takeScreenshot, 'timeline-month-change-current-date.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    currentDate: new Date(2020, 10, 1),
    currentView: 'timelineMonth',
    height: 600,
    views: ['timelineMonth'],
    crossScrollingEnabled: true,
  });
});
