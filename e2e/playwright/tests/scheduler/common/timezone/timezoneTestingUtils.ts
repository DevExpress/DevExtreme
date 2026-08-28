import type { Page } from '@playwright/test';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

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

const getScreenshotName = (
  testModuleName: string,
  screenshotName: string,
): string => `${testModuleName}__${screenshotName}.png`;

const screenshotTestFunc = async (
  page: Page,
  testModuleName: string,
  screenshotName: string,
  schedulerSelector = DEFAULT_SCHEDULER_SELECTOR,
): Promise<void> => {
  const scheduler = new Scheduler(page, schedulerSelector);

  await testScreenshot(
    page,
    getScreenshotName(testModuleName, screenshotName),
    { element: scheduler.workSpace },
  );
};

export { getAppointmentTime, screenshotTestFunc, getScreenshotName };
