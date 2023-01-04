import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../../model/scheduler';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.disablePageReloads.skip('Scheduler: Layout Views: Timeline Month');

test('Header cells should be aligned with date-table cells in timeline-month when current date changes', async (t, { platform, screenshotComparerOptions }) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const { navigator } = scheduler.toolbar;

  await updateComponentOptions(platform, { currentDate: new Date(2020, 11, 1) });

  await t
    .expect(navigator.caption.innerText)
    .eql('December 2020')
    .expect(await takeScreenshot('timeline-month-change-current-date.png', scheduler.workSpace, screenshotComparerOptions))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => {
  await createWidget(platform, 'dxScheduler', {
    currentDate: new Date(2020, 10, 1),
    currentView: 'timelineMonth',
    height: 600,
    views: ['timelineMonth'],
    crossScrollingEnabled: true,
  }, true);
});
