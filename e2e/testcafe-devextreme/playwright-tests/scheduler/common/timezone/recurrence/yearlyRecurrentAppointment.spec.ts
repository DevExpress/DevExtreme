import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const SCREENSHOT_BASE_NAME = 'timezone-yearly-recurrent';
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

const makeOptions = (apptTz: string, schedTz: string, start: Date, end: Date, currentDate?: Date) => ({
  dataSource: [{
    allDay: false,
    startDate: getAppointmentTime(start, apptTz),
    startDateTimeZone: apptTz,
    endDate: getAppointmentTime(end, apptTz),
    endDateTimeZone: apptTz,
    recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test.describe('Yearly recurrent appointments with timezones', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should correctly display the recurrent yearly appointment with the same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 12, 0, 0)));
    await screenshotTest(page, 'same-date__same-timezone');
  });

  test('Should correctly display the recurrent yearly appointment with a greater time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+10', 'Etc/GMT-2', new Date(2021, 3, 28, 14, 0, 0), new Date(2021, 3, 28, 16, 0, 0)));
    await screenshotTest(page, 'same-date__greater-timezone');
  });

  test('Should correctly display the recurrent yearly appointment with a lower time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-2', 'Etc/GMT+10', new Date(2021, 3, 28, 4, 0, 0), new Date(2021, 3, 28, 6, 0, 0)));
    await screenshotTest(page, 'same-date__lower-timezone');
  });

  test('Should correctly display the recurrent yearly appointment if start date\nlower than recurrent date with the same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 26, 10, 0, 0), new Date(2021, 3, 26, 12, 0, 0)));
    await screenshotTest(page, 'lower-date__same-timezone');
  });

  test('Should correctly display the recurrent yearly appointment if start date\nlower than recurrent date with a greater time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+10', 'Etc/GMT-2', new Date(2021, 3, 26, 14, 0, 0), new Date(2021, 3, 26, 16, 0, 0)));
    await screenshotTest(page, 'lower-date__greater-timezone');
  });

  test('Should correctly display the recurrent yearly appointment if start date\nlower than recurrent date with a lower time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-2', 'Etc/GMT+10', new Date(2021, 3, 26, 4, 0, 0), new Date(2021, 3, 26, 6, 0, 0)));
    await screenshotTest(page, 'lower-date__lower-timezone');
  });

  test('Should correctly display the recurrent yearly appointment at first date if start date\ngreater than recurrent date with the same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 29, 10, 0, 0), new Date(2021, 3, 29, 12, 0, 0)));
    await screenshotTest(page, 'greater-date__same-timezone__same-view-date');
  });

  test('Should correctly display the recurrent yearly appointment at next date if start date\ngreater than recurrent date with the same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 29, 10, 0, 0), new Date(2021, 3, 29, 12, 0, 0), new Date(2022, 3, 28)));
    await screenshotTest(page, 'greater-date__same-timezone__next-view-date');
  });

  test('Should correctly display the recurrent yearly appointment at first date if start date\ngreater than recurrent date with a greater time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+10', 'Etc/GMT-2', new Date(2021, 3, 29, 14, 0, 0), new Date(2021, 3, 29, 16, 0, 0)));
    await screenshotTest(page, 'greater-date__greater-timezone__same-view-date');
  });

  test('Should correctly display the recurrent yearly appointment at next date if start date\ngreater than recurrent date with a greater time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+10', 'Etc/GMT-2', new Date(2021, 3, 29, 14, 0, 0), new Date(2021, 3, 29, 16, 0, 0), new Date(2022, 3, 28)));
    await screenshotTest(page, 'greater-date__greater-timezone__next-view-date');
  });

  test('Should correctly display the recurrent yearly appointment at first date if start date\ngreater than recurrent date with a lower time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-2', 'Etc/GMT+10', new Date(2021, 3, 29, 4, 0, 0), new Date(2021, 3, 29, 6, 0, 0)));
    await screenshotTest(page, 'greater-date__lower-timezone__same-view-date');
  });

  test('Should correctly display the recurrent yearly appointment at next date if start date\ngreater than recurrent date with a lower time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-2', 'Etc/GMT+10', new Date(2021, 3, 29, 4, 0, 0), new Date(2021, 3, 29, 6, 0, 0), new Date(2022, 3, 28)));
    await screenshotTest(page, 'greater-date__lower-timezone__next-view-date');
  });
});
