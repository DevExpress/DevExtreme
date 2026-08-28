import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

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
  endDayHour,
]) => {
  test(`Should correctly render current time indicator (${view}, now: ${indicatorTime}, offset: ${offset}, startDayHour: ${startDayHour}, endDayHour: ${endDayHour})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await testScreenshot(
      page,
      getScreenshotName(view, indicatorTime, offset, startDayHour, endDayHour),
      { element: scheduler.workSpace },
    );
  });
});
