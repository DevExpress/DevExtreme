import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const SCREENSHOT_BASE_NAME = 'timezone-monthly-recurrent';
const getScreenshotName = (baseName: string, suffix: string) => `${baseName}__${suffix}.png`;

const MINUTES_TO_MILLISECONDS = 60000;
const HOURS_TO_MILLISECONDS = MINUTES_TO_MILLISECONDS * 60;

const generateTimezoneOffsets = (): Record<string, number> => {
  const result: Record<string, number> = {};
  new Array(27).fill(0).forEach((_, idx) => {
    const timezoneIdx = idx - 14;
    if (timezoneIdx < 0) result[`Etc/GMT${timezoneIdx}`] = timezoneIdx * -1;
    else if (timezoneIdx > 0) result[`Etc/GMT+${timezoneIdx}`] = timezoneIdx * -1;
    else result['Etc/GMT'] = 0;
  });
  return result;
};

const TIMEZONE_OFFSETS = generateTimezoneOffsets();

const getAppointmentTime = (desiredDate: Date, timezone: string): Date => {
  const localOffset = desiredDate.getTimezoneOffset() * MINUTES_TO_MILLISECONDS;
  const timezoneOffset = TIMEZONE_OFFSETS[timezone] * HOURS_TO_MILLISECONDS;
  return new Date(desiredDate.getTime() - localOffset - timezoneOffset);
};

async function screenshotTest(page, screenshotName: string): Promise<void> {
  const workSpace = page.locator('.dx-scheduler-work-space');
  await testScreenshot(page, getScreenshotName(SCREENSHOT_BASE_NAME, screenshotName), { element: workSpace });
}

const schedulerOptions = (appointmentTimezone: string, schedulerTimezone: string, startDate: Date, endDate: Date, recurrenceRule: string, currentDate?: Date) => ({
  dataSource: [{
    allDay: false,
    startDate: getAppointmentTime(startDate, appointmentTimezone),
    startDateTimeZone: appointmentTimezone,
    endDate: getAppointmentTime(endDate, appointmentTimezone),
    endDateTimeZone: appointmentTimezone,
    recurrenceRule,
    text: 'Test',
  }],
  timeZone: schedulerTimezone,
  currentView: 'week',
  currentDate: currentDate ?? new Date(2021, 3, 28),
  startDayHour: 0,
  cellDuration: 180,
  width: 1000,
  height: 585,
});

test.describe('Monthly recurrent appointments with timezones', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', schedulerOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 12, 0, 0), 'FREQ=MONTHLY;BYMONTHDAY=28'));
    await screenshotTest(page, 'same-date__same-timezone');
  });

  test('greater timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', schedulerOptions('Etc/GMT+10', 'Etc/GMT-2', new Date(2021, 3, 28, 22, 0, 0), new Date(2021, 3, 29, 0, 0, 0), 'FREQ=MONTHLY;BYMONTHDAY=28'));
    await screenshotTest(page, 'same-date__greater-timezone');
  });

  test('lower timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', schedulerOptions('Etc/GMT-2', 'Etc/GMT+10', new Date(2021, 3, 28, 0, 0, 0), new Date(2021, 3, 28, 2, 0, 0), 'FREQ=MONTHLY;BYMONTHDAY=28'));
    await screenshotTest(page, 'same-date__lower-timezone');
  });

  test('lower date same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', schedulerOptions('Etc/GMT-2', 'Etc/GMT-2', new Date(2021, 3, 26, 10, 0, 0), new Date(2021, 3, 26, 12, 0, 0), 'FREQ=MONTHLY;BYMONTHDAY=28'));
    await screenshotTest(page, 'lower-date__same-timezone');
  });
});
