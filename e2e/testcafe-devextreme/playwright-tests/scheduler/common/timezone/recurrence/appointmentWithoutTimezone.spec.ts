import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Recurrent appointments without timezone in scheduler with timezone', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const SELECT_SELECTOR = '#container';
const SCHEDULER_SELECTOR = '#otherContainer';
const SCREENSHOT_BASE_NAME = 'without-timezone-recurrent';
const TEST_TIMEZONES = ['Etc/GMT-10', 'Etc/GMT+1', 'Etc/GMT+10'];
const TEST_CURSOR_OPTIONS = { speed: 0.5 };

const createTimezoneSelect = async (
  selector: string,
  items: string[],
  schedulerSelector: string,
): Promise<void> => {
  await ClientFunction(() => {
    ($(selector) as any).dxSelectBox({
      items,
      width: 240,
      value: items[1],
      onValueChanged(data) {
        const scheduler = ($(schedulerSelector) as any).dxScheduler('instance');
        scheduler.option('timeZone', data.value);
      },
    });
  }, {
    dependencies: { selector, schedulerSelector, items },
  })();
};

const selectTimezoneInUI = async (t: TestController, selectBox: SelectBox, timezoneIdx: number) => {
  await (selectBox.element, TEST_CURSOR_OPTIONS).click();
  const timezonesList = await selectBox.getList();

  await (timezonesList.getItem(timezoneIdx).click().element, TEST_CURSOR_OPTIONS);
};

test('Should correctly display the recurrent weekly appointment without timezone', async ({ page }) => {
  // --- setup ---
const schedulerTimezone = TEST_TIMEZONES[1];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: new Date('2021-04-28T11:00:00.000Z'),
      endDate: new Date('2021-04-28T13:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  }, SCHEDULER_SELECTOR);
  // --- test ---
const selectBox = new SelectBox(SELECT_SELECTOR);
  const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).page.locator('.dx-scheduler-work-space');
    // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__same-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(t, selectBox, 0);
  // expected date: 4/28/2021 9:00 PM - 11:00 PM
  await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__greater-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(t, selectBox, 2);
  // expected date: 4/28/2021 1:00 AM - 3:00 AM
  await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__lower-timezone'),
    { element: schedulerWorkspace },
  );

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

test('Should correctly display the recurrent monthly appointment without timezone', async ({ page }) => {
  // --- setup ---
const schedulerTimezone = TEST_TIMEZONES[1];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: new Date('2021-04-28T11:00:00.000Z'),
      endDate: new Date('2021-04-28T13:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  }, SCHEDULER_SELECTOR);
  // --- test ---
const selectBox = new SelectBox(SELECT_SELECTOR);
  const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).page.locator('.dx-scheduler-work-space');
    // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'monthly-appointment__same-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(t, selectBox, 0);
  // expected date: 4/28/2021 9:00 PM - 11:00 PM
  await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'monthly-appointment__greater-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(t, selectBox, 2);
  // expected date: 4/28/2021 1:00 AM - 3:00 AM
  await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'monthly-appointment__lower-timezone'),
    { element: schedulerWorkspace },
  );

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

test('Should correctly display the recurrent yearly appointment without timezone', async ({ page }) => {
  // --- setup ---
const schedulerTimezone = TEST_TIMEZONES[1];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: new Date('2021-04-28T11:00:00.000Z'),
      endDate: new Date('2021-04-28T13:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  }, SCHEDULER_SELECTOR);
  // --- test ---
const selectBox = new SelectBox(SELECT_SELECTOR);
  const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).page.locator('.dx-scheduler-work-space');
    // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'yearly-appointment__same-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(t, selectBox, 0);
  // expected date: 4/28/2021 9:00 PM - 11:00 PM
  await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'yearly-appointment__greater-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(t, selectBox, 2);
  // expected date: 4/28/2021 1:00 AM - 3:00 AM
  await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'yearly-appointment__lower-timezone'),
    { element: schedulerWorkspace },
  );

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

test('Should correctly display morning weekly recurrent appointment in a greater timezone.', async ({ page }) => {
  // --- setup ---
const schedulerTimezone = TEST_TIMEZONES[0];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'test',
      startDate: new Date('2021-04-29T15:00:00.000Z'),
      endDate: new Date('2021-04-29T17:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=FR',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  }, SCHEDULER_SELECTOR);
  // --- test ---
const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).page.locator('.dx-scheduler-work-space');
    await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-morning-appointment__greater-timezone'),
    { element: schedulerWorkspace },
  );

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

test('Should correctly display \'corner\' weekly recurrent appointments in a greater timezone.', async ({ page }) => {
  // --- setup ---
const schedulerTimezone = TEST_TIMEZONES[0];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'test 1',
      startDate: new Date('2021-04-24T14:00:00.000Z'),
      endDate: new Date('2021-04-24T16:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU',
    }, {
      text: 'test 2',
      startDate: new Date('2021-05-01T12:00:00.000Z'),
      endDate: new Date('2021-05-01T14:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SA',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  }, SCHEDULER_SELECTOR);
  // --- test ---
const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).page.locator('.dx-scheduler-work-space');
    await testScreenshot(page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-corner-appointments__greater-timezone'),
    { element: schedulerWorkspace },
  );

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
