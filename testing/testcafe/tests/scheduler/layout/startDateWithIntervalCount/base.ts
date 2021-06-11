import Scheduler from '../../../../model/scheduler';
import { createScreenshotsComparer } from '../../../../helpers/screenshot-comparer';
import createWidget, { disposeWidgets } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Layout:IntervalCount with StartDate`
  .page(url(__dirname, '../../../container.html'))
  .afterEach(async () => disposeWidgets());

[{
  view: 'timelineDay',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 4, 8),
  intervalCount: 6,
}, {
  view: 'week',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'timelineWeek',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'workWeek',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'timelineWorkWeek',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'month',
  currentDate: new Date(2020, 5, 11),
  startDate: new Date(2020, 3, 8),
  intervalCount: 6,
}, {
  view: 'timelineMonth',
  currentDate: new Date(2020, 5, 11),
  startDate: new Date(2020, 3, 8),
  intervalCount: 6,
}].forEach(({
  view, currentDate, startDate, intervalCount,
}) => {
  test(`startDate should work in ${view} view`, async (t) => {
    const scheduler = new Scheduler('#container');

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`start-date-in-${view}`))
      .ok()

      .doubleClick(scheduler.getDateTableCell(0, 0))

      .expect(await takeScreenshot(`start-date-in-${view}-with-appointment-form`))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxScheduler', {
    views: [{
      type: view,
      intervalCount,
      startDate,
    }],
    currentView: view,
    currentDate,
    dataSource: [],
    crossScrollingEnabled: true,
  }));
});
