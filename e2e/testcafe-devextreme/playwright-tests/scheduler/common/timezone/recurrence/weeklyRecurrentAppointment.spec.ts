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

  test('Should correctly display the recurrent (one day at week) appointment with the same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 12, 0, 0), 'FREQ=WEEKLY;BYDAY=WE'));
    await screenshotTest(page, 'one-appointment__same-timezone');
  });

  test('Should correctly display the recurrent (one day at week) morning appointment with the same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 0, 0, 0), new Date(2021, 3, 28, 2, 0, 0), 'FREQ=WEEKLY;BYDAY=WE'));
    await screenshotTest(page, 'one-morning-appointment__same-timezone');
  });

  test('Should correctly display the recurrent (one day at week) evening appointment with the same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 22, 0, 0), new Date(2021, 3, 29, 0, 0, 0), 'FREQ=WEEKLY;BYDAY=WE'));
    await screenshotTest(page, 'one-evening-appointment__same-timezone');
  });

  test('Should correctly display the recurrent (one day at week) appointment\nwith a greater time timezone and day shift to the next day', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+10', 'Etc/GMT-2', new Date(2021, 3, 28, 22, 0, 0), new Date(2021, 3, 29, 0, 0, 0), 'FREQ=WEEKLY;BYDAY=WE'));
    await screenshotTest(page, 'one-appointment__day-shift__greater-timezone');
  });

  test('Should correctly display the recurrent (one day at week) appointment with a lower timezone and day shift to the previous day', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-10', 'Etc/GMT+2', new Date(2021, 3, 28, 6, 0, 0), new Date(2021, 3, 28, 8, 0, 0), 'FREQ=WEEKLY;BYDAY=WE'));
    await screenshotTest(page, 'one-appointment__day-shift__lower-timezone');
  });

  test('Should correctly display the recurrent (one day at week) appointment with timezone week shift to the previous week', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-10', 'Etc/GMT+10', new Date(2021, 3, 26, 2, 0, 0), new Date(2021, 3, 26, 4, 0, 0), 'FREQ=WEEKLY;BYDAY=MO'));
    await screenshotTest(page, 'one-appointment__week-shift__lower-timezone');
  });

  test('Should correctly display the recurrent (one day at week) appointment with timezone week shift to the next week', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+10', 'Etc/GMT-10', new Date(2021, 3, 25, 20, 0, 0), new Date(2021, 3, 25, 22, 0, 0), 'FREQ=WEEKLY;BYDAY=SU'));
    await screenshotTest(page, 'one-appointment__week-shift__greater-timezone');
  });

  test('Should correctly display recurrent appointment with multiple day in week on the first week in same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 14, 0, 0), 'FREQ=WEEKLY;BYDAY=TU,WE,TH'));
    await screenshotTest(page, 'multiple-appointment__first-week__same-timezone');
  });

  test('Should correctly display recurrent appointment with multiple day in week on the second week in same timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+1', 'Etc/GMT+1', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 14, 0, 0), 'FREQ=WEEKLY;BYDAY=TU,WE,TH', new Date(2021, 4, 5)));
    await screenshotTest(page, 'multiple-appointment__second-week__same-timezone');
  });

  test('Should correctly display recurrent appointment with multiple day in week on the first week in a greater time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+10', 'Etc/GMT-5', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 14, 0, 0), 'FREQ=WEEKLY;BYDAY=TU,WE,TH'));
    await screenshotTest(page, 'multiple-appointment__first-week__greater-timezone');
  });

  test('Should correctly display recurrent appointment with multiple day in week on the second week in a greater time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+10', 'Etc/GMT-5', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 14, 0, 0), 'FREQ=WEEKLY;BYDAY=TU,WE,TH', new Date(2021, 4, 5)));
    await screenshotTest(page, 'multiple-appointment__second-week__greater-timezone');
  });

  test('Should correctly display recurrent appointment with multiple day in week on the first week in a lower time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-10', 'Etc/GMT+5', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 14, 0, 0), 'FREQ=WEEKLY;BYDAY=TU,WE,TH'));
    await screenshotTest(page, 'multiple-appointment__first-week__lower-timezone');
  });

  test('Should correctly display recurrent appointment with multiple day in week on the second week in a lower time timezone', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-10', 'Etc/GMT+5', new Date(2021, 3, 28, 10, 0, 0), new Date(2021, 3, 28, 14, 0, 0), 'FREQ=WEEKLY;BYDAY=TU,WE,TH', new Date(2021, 4, 5)));
    await screenshotTest(page, 'multiple-appointment__second-week__lower-timezone');
  });

  test('Should correctly display recurrent appointment with multiple day in week\n on the first week with maximum positive timezone offset (first week)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+12', 'Etc/GMT-14', new Date(2021, 3, 29, 22, 0, 0), new Date(2021, 3, 30, 0, 0, 0), 'FREQ=WEEKLY;BYDAY=WE,TH, FT'));
    await screenshotTest(page, 'one-appointment__first-week__max-positive-timezone-offset');
  });

  test('Should correctly display recurrent appointment with multiple day in week\n on the first week with maximum positive timezone offset (second week)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT+12', 'Etc/GMT-14', new Date(2021, 3, 29, 22, 0, 0), new Date(2021, 3, 30, 0, 0, 0), 'FREQ=WEEKLY;BYDAY=TU,WE,TH', new Date(2021, 4, 5)));
    await screenshotTest(page, 'one-appointment__second-week__max-positive-timezone-offset');
  });

  test('Should correctly display recurrent appointment with multiple day in week\n on the first week with maximum negative timezone offset (first week)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-14', 'Etc/GMT+12', new Date(2021, 3, 28, 0, 0, 0), new Date(2021, 3, 28, 2, 0, 0), 'FREQ=WEEKLY;BYDAY=MO,TU,WE'));
    await screenshotTest(page, 'one-appointment__first-week__max-negative-timezone-offset');
  });

  test('Should correctly display recurrent appointment with multiple day in week\n on the first week with maximum negative timezone offset (second week)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', makeOptions('Etc/GMT-14', 'Etc/GMT+12', new Date(2021, 3, 28, 0, 0, 0), new Date(2021, 3, 28, 2, 0, 0), 'FREQ=WEEKLY;BYDAY=MO,TU,WE', new Date(2021, 4, 5)));
    await screenshotTest(page, 'one-appointment__second-week__max-negative-timezone-offset');
  });
});
