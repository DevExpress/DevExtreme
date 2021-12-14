import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/schedulerMaterial',
  platforms: ['jquery', 'react'],
});

fixture('Scheduler: Material theme and all-day panel');

[true, false].forEach((showAllDayPanel) => {
  test(`Week view should be rendered correctly if showAllDayPanel=${showAllDayPanel}`, async (t, { screenshotComparerOptions }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`material-week-all-day-panel-${showAllDayPanel}.png`, scheduler.workSpace, screenshotComparerOptions))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (_, { platform }) => createWidget(platform, 'dxScheduler', {
    dataSource: [],
    currentDate: new Date(2020, 6, 15),
    showAllDayPanel,
    views: ['week'],
    currentView: 'week',
    height: 500,
  }, true));
});
