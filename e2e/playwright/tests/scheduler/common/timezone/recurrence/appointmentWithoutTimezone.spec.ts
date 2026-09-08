import type { Page } from '@playwright/test';
import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';
import SelectBox from '../../../../../models/selectBox';
import { getScreenshotName } from '../timezoneTestingUtils';

const SELECT_SELECTOR = '#container';
const SCHEDULER_SELECTOR = '#otherContainer';
const SCREENSHOT_BASE_NAME = 'without-timezone-recurrent';
const TEST_TIMEZONES = ['Etc/GMT-10', 'Etc/GMT+1', 'Etc/GMT+10'];
const SELECT_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';

const createTimezoneSelect = async (page: Page): Promise<void> => {
  await createWidget(page, 'dxSelectBox', {
    items: TEST_TIMEZONES,
    width: 240,
    value: TEST_TIMEZONES[1],
    // The handler travels to the page as its own source, so the scheduler selector is spelled out
    // here — anything it closed over on this side would not exist there.
    onValueChanged(data: { value: string }) {
      ($('#otherContainer') as any).dxScheduler('instance').option('timeZone', data.value);
    },
  }, SELECT_SELECTOR);
};

const selectTimezoneInUI = async (
  page: Page,
  selectBox: SelectBox,
  timezoneIdx: number,
): Promise<void> => {
  const popupWrapper = page.locator(`.${SELECT_POPUP_WRAPPER_CLASS}`);

  await selectBox.element.click();
  // The overlay only enters the document when the list opens for the first time, and the model
  // reads it without a deadline — waiting for it here keeps that read from hanging.
  await expect(popupWrapper).toBeVisible();

  const timezonesList = await selectBox.getList();

  await timezonesList.getItem(timezoneIdx).element.click();

  await expect(popupWrapper).toBeHidden();
};

test('Should correctly display the recurrent weekly appointment without timezone', async ({ page }) => {
  const schedulerTimezone = TEST_TIMEZONES[1];

  await createTimezoneSelect(page);
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

  const selectBox = new SelectBox(page, SELECT_SELECTOR);
  const schedulerWorkspace = new Scheduler(page, SCHEDULER_SELECTOR).workSpace;

  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__same-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(page, selectBox, 0);

  // expected date: 4/28/2021 9:00 PM - 11:00 PM
  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__greater-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(page, selectBox, 2);

  // expected date: 4/28/2021 1:00 AM - 3:00 AM
  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__lower-timezone'),
    { element: schedulerWorkspace },
  );
});

test('Should correctly display the recurrent monthly appointment without timezone', async ({ page }) => {
  const schedulerTimezone = TEST_TIMEZONES[1];

  await createTimezoneSelect(page);
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

  const selectBox = new SelectBox(page, SELECT_SELECTOR);
  const schedulerWorkspace = new Scheduler(page, SCHEDULER_SELECTOR).workSpace;

  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'monthly-appointment__same-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(page, selectBox, 0);

  // expected date: 4/28/2021 9:00 PM - 11:00 PM
  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'monthly-appointment__greater-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(page, selectBox, 2);

  // expected date: 4/28/2021 1:00 AM - 3:00 AM
  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'monthly-appointment__lower-timezone'),
    { element: schedulerWorkspace },
  );
});

test('Should correctly display the recurrent yearly appointment without timezone', async ({ page }) => {
  const schedulerTimezone = TEST_TIMEZONES[1];

  await createTimezoneSelect(page);
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

  const selectBox = new SelectBox(page, SELECT_SELECTOR);
  const schedulerWorkspace = new Scheduler(page, SCHEDULER_SELECTOR).workSpace;

  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'yearly-appointment__same-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(page, selectBox, 0);

  // expected date: 4/28/2021 9:00 PM - 11:00 PM
  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'yearly-appointment__greater-timezone'),
    { element: schedulerWorkspace },
  );

  await selectTimezoneInUI(page, selectBox, 2);

  // expected date: 4/28/2021 1:00 AM - 3:00 AM
  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'yearly-appointment__lower-timezone'),
    { element: schedulerWorkspace },
  );
});

test('Should correctly display morning weekly recurrent appointment in a greater timezone.', async ({ page }) => {
  const schedulerTimezone = TEST_TIMEZONES[0];

  await createTimezoneSelect(page);
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

  const schedulerWorkspace = new Scheduler(page, SCHEDULER_SELECTOR).workSpace;

  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-morning-appointment__greater-timezone'),
    { element: schedulerWorkspace },
  );
});

test('Should correctly display \'corner\' weekly recurrent appointments in a greater timezone.', async ({ page }) => {
  const schedulerTimezone = TEST_TIMEZONES[0];

  await createTimezoneSelect(page);
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

  const schedulerWorkspace = new Scheduler(page, SCHEDULER_SELECTOR).workSpace;

  await testScreenshot(
    page,
    getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-corner-appointments__greater-timezone'),
    { element: schedulerWorkspace },
  );
});
