import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';

import Scheduler from '../../../model/scheduler';

const generateTimezoneOffsets = (): Record<string, number> => {
  const result: Record<string, number> = {};

  new Array(27).fill(0).forEach((_, idx) => {
    const timezoneIdx = idx - 14;

    switch (true) {
      case timezoneIdx < 0:
        result[`Etc/GMT${timezoneIdx}`] = timezoneIdx * -1;
        break;
      case timezoneIdx > 0:
        result[`Etc/GMT+${timezoneIdx}`] = timezoneIdx * -1;
        break;
      default:
        result['Etc/GMT'] = 0;
        break;
    }
  });

  return result;
};

export const TIMEZONE_OFFSETS: Record<string, number> = generateTimezoneOffsets();
const MINUTES_TO_MILLISECONDS = 60000;
const HOURS_TO_MILLISECONDS = MINUTES_TO_MILLISECONDS * 60;
const DEFAULT_SCHEDULER_SELECTOR = '#container';

const getAppointmentTime = (desiredDate: Date, timezone: string): Date => {
  const localOffset = desiredDate.getTimezoneOffset() * MINUTES_TO_MILLISECONDS;
  const timezoneOffset = TIMEZONE_OFFSETS[timezone] * HOURS_TO_MILLISECONDS;

  return new Date(desiredDate.getTime() - localOffset - timezoneOffset);
};

const getScreenshotName = (testModuleName: string, screenshotName: string): string => `${testModuleName}__${screenshotName}.png`;

const screenshotTestFunc = async (
  t: TestController,
  testModuleName: string,
  screenshotName: string,
  schedulerSelector = DEFAULT_SCHEDULER_SELECTOR,
): Promise<void> => {
  const scheduler = new Scheduler(schedulerSelector);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot(
      getScreenshotName(testModuleName, screenshotName),
      scheduler.workSpace,
    ))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
};

export { getAppointmentTime, screenshotTestFunc, getScreenshotName };
