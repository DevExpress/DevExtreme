import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { scrollTo } from '../../helpers/utils';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler: Virtual scrolling`
  .page(url(__dirname, '../../../container.html'));

test('it should render recurrence appointment with correct width in month timeline view for virtual scrolling', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler('#container');

  await scrollTo(3000, 0);
  await testScreenshot(t, takeScreenshot, 'virtual_scroll_timeline_3000.png', { element: scheduler.workSpace });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget(
    'dxScheduler',
    {
      height: 300,
      currentView: 'timelineMonth',
      views: ['timelineMonth'],
      currentDate: new Date(2024, 9, 1),
      dataSource: [{
        text: 'appointment',
        startDate: new Date(2024, 9, 1),
        endDate: new Date(2024, 9, 2),
        recurrenceRule: 'FREQ=DAILY',
      }],
      scrolling: { mode: 'virtual' },
    },
  );
});
