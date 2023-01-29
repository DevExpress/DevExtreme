import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture.disablePageReloads.skip('Layout: Views: IntervalCount with StartDate'); // TODO unskip after editing implementation

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
  test(`startDate should work in ${view} view`, async (t, { screenshotComparerOptions }) => {
    const scheduler = new Scheduler('#container');

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`start-date-in-${view}.png`, scheduler.workSpace, screenshotComparerOptions))
      .ok()

      .doubleClick(scheduler.getDateTableCell(0, 0))

      .expect(await takeScreenshot(`start-date-in-${view}-with-form.png`, scheduler.workSpace, screenshotComparerOptions))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (_, { platform }) => createWidget(platform, 'dxScheduler', {
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

[{
  view: 'week',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}, {
  view: 'timelineWeek',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}, {
  view: 'workWeek',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}, {
  view: 'timelineWorkWeek',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}].forEach(({
  view, currentDate, startDate, intervalCount,
}) => {
  test(`startDate should work in ${view} view when it indicates the same week as the start as currentDate`, async (t, { screenshotComparerOptions }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`complex-start-date-in-${view}.png`, scheduler.workSpace, screenshotComparerOptions))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (_, { platform }) => createWidget(platform, 'dxScheduler', {
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
