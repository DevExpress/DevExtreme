import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.disablePageReloads.skip('Timeline Appointments');

const ignore = true;
if (!ignore) {
  test('all-day and ordinary appointments should overlap each other correctly in timeline views (T1017889)', async (t, { screenshotComparerOptions }) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot('timeline-overlapping-appointments.png', undefined, screenshotComparerOptions))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (_, { platform }) => createWidget(
    platform,
    'dxScheduler',
    {
      dataSource: [{
        text: 'Google AdWords Strategy',
        startDate: new Date(2021, 1, 1, 10),
        endDate: new Date(2021, 1, 1, 11),
        allDay: true,
      }, {
        text: 'Brochure Design Review',
        startDate: new Date(2021, 1, 1, 11, 30),
        endDate: new Date(2021, 1, 1, 12, 30),
      }],
      views: ['timelineWeek'],
      currentView: 'timelineWeek',
      currentDate: new Date(2021, 1, 1),
      firstDayOfWeek: 1,
      startDayHour: 10,
      endDayHour: 20,
      cellDuration: 60,
      height: 580,
    },
  ));
}
