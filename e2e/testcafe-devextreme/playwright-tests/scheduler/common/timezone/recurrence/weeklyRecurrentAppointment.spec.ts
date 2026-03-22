import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const SCREENSHOT_BASE_NAME = 'timezone-weekly-recurrent';
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

const makeOptions = (apptTz: string, schedTz: string, start: Date, end: Date, rule: string, currentDate?: Date) => ({
  dataSource: [{
    allDay: false,
    startDate: getAppointmentTime(start, apptTz),
    startDateTimeZone: apptTz,
    endDate: getAppointmentTime(end, apptTz),
    endDateTimeZone: apptTz,
    recurrenceRule: rule,
    text: 'Test',
  }],
  timeZone: schedTz,
  currentView: 'week',
  currentDate: currentDate ?? new Date(2021, 3, 28),
  startDayHour: 0,
  cellDuration: 180,
  width: 1000,
  height: 585,
});

test.describe('Weekly recurrent appointments with timezones', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('one day same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 12, 0, 0), 'FREQ=WEEKLY;BYDAY=WE'));
    await screenshotTest(page, 'one-appointment__same-timezone');
  });

  test('one day greater timezone with day shift', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+10', 'Etc/GMT-2', new Date(2021, 3, 28, 22, 0, 0), new Date(2021, 3, 29, 0, 0, 0), 'FREQ=WEEKLY;BYDAY=WE'));
    await screenshotTest(page, 'one-appointment__day-shift__greater-timezone');
  });

  test('one day lower timezone with day shift', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-10', 'Etc/GMT+2', new Date(2021, 3, 28, 6, 0, 0), new Date(2021, 3, 28, 8, 0, 0), 'FREQ=WEEKLY;BYDAY=WE'));
    await screenshotTest(page, 'one-appointment__day-shift__lower-timezone');
  });

  test('multiple day first week same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 14, 0, 0), 'FREQ=WEEKLY;BYDAY=TU,WE,TH'));
    await screenshotTest(page, 'multiple-appointment__first-week__same-timezone');
  });

  test('multiple day second week same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 14, 0, 0), 'FREQ=WEEKLY;BYDAY=TU,WE,TH', new Date(2021, 4, 5)));
    await screenshotTest(page, 'multiple-appointment__second-week__same-timezone');
  });
});
