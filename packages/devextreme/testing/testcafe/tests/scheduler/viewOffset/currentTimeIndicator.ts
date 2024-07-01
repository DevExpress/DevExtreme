import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget, disposeWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Offset: Current time indicator`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';

const getScreenshotName = (
  view: string,
  indicatorTime: string,
  offset: number,
  startDayHour: number,
  endDayHour: number,
): string => `offset_time-indicator_view-${view}_now-${indicatorTime.replace(/:/g, '-')}_offset-${offset}_start-${startDayHour}_end-${endDayHour}.png`;

const TEST_CASES: [
  view: string,
  indicatorTime: string,
  cellDuration: number,
  offset: number,
  startDayHour: number,
  endDayHour: number,
][] = [
  ['day', '2023-12-04T00:00:00', 120, 720, 0, 24],
  ['day', '2023-12-04T00:00:00', 120, 720, 6, 18],
  ['day', '2023-12-04T12:00:00', 120, 1440, 0, 24],
  ['day', '2023-12-04T12:00:00', 120, 1440, 6, 18],
  ['day', '2023-12-03T00:00:00', 120, -720, 0, 24],
  ['day', '2023-12-03T00:00:00', 120, -720, 6, 18],
  ['day', '2023-12-02T12:00:00', 120, -1440, 0, 24],
  ['day', '2023-12-02T12:00:00', 120, -1440, 6, 18],

  ['week', '2023-12-06T00:00:00', 120, 720, 0, 24],
  ['week', '2023-12-06T00:00:00', 120, 720, 6, 18],
  ['week', '2023-12-06T12:00:00', 120, 1440, 0, 24],
  ['week', '2023-12-06T12:00:00', 120, 1440, 6, 18],
  ['week', '2023-12-05T00:00:00', 120, -720, 0, 24],
  ['week', '2023-12-05T00:00:00', 120, -720, 6, 18],
  ['week', '2023-12-04T12:00:00', 120, -1440, 0, 24],
  ['week', '2023-12-04T12:00:00', 120, -1440, 6, 18],

  ['timelineDay', '2023-12-04T00:00:00', 360, 720, 0, 24],
  ['timelineDay', '2023-12-04T00:00:00', 360, 720, 6, 18],
  ['timelineDay', '2023-12-04T12:00:00', 360, 1440, 0, 24],
  ['timelineDay', '2023-12-04T12:00:00', 360, 1440, 6, 18],
  ['timelineDay', '2023-12-03T00:00:00', 360, -720, 0, 24],
  ['timelineDay', '2023-12-03T00:00:00', 360, -720, 6, 18],
  ['timelineDay', '2023-12-02T12:00:00', 360, -1440, 0, 24],
  ['timelineDay', '2023-12-02T12:00:00', 360, -1440, 6, 18],

  ['timelineWeek', '2023-12-04T00:00:00', 360, 720, 0, 24],
  ['timelineWeek', '2023-12-04T00:00:00', 360, 720, 6, 18],
  ['timelineWeek', '2023-12-04T12:00:00', 360, 1440, 0, 24],
  ['timelineWeek', '2023-12-04T12:00:00', 360, 1440, 6, 18],
  ['timelineWeek', '2023-12-03T00:00:00', 360, -720, 0, 24],
  ['timelineWeek', '2023-12-03T00:00:00', 360, -720, 6, 18],
  ['timelineWeek', '2023-12-02T12:00:00', 360, -1440, 0, 24],
  ['timelineWeek', '2023-12-02T12:00:00', 360, -1440, 6, 18],

  ['timelineMonth', '2023-12-04T00:00:00', 120, 720, 0, 24],
  ['timelineMonth', '2023-12-04T00:00:00', 120, 720, 6, 18],
  ['timelineMonth', '2023-12-04T12:00:00', 120, 1440, 0, 24],
  ['timelineMonth', '2023-12-04T12:00:00', 120, 1440, 6, 18],
  ['timelineMonth', '2023-12-03T00:00:00', 120, -720, 0, 24],
  ['timelineMonth', '2023-12-03T00:00:00', 120, -720, 6, 18],
  ['timelineMonth', '2023-12-02T12:00:00', 120, -1440, 0, 24],
  ['timelineMonth', '2023-12-02T12:00:00', 120, -1440, 6, 18],
];

TEST_CASES.forEach(([
  view,
  indicatorTime,
  cellDuration,
  offset,
  startDayHour,
  endDayHour]) => {
  test(`
Should correctly render current time indicator (
${view},
now: ${indicatorTime},
offset: ${offset},
startDayHour: ${startDayHour},
endDayHour: ${endDayHour}
)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await takeScreenshot(getScreenshotName(
      view,
      indicatorTime,
      offset,
      startDayHour,
      endDayHour,
    ), scheduler.workSpace);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [],
      currentView: view,
      shadeUntilCurrentTime: true,
      currentDate: '2023-12-03',
      indicatorTime,
      cellDuration,
      offset,
      startDayHour,
      endDayHour,
    });
  }).after(async () => disposeWidget('dxScheduler'));
});
