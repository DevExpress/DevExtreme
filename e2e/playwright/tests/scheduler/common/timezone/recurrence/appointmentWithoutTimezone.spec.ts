import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';
import { getScreenshotName } from '../timezoneTestingUtils';

const SELECT_SELECTOR = '#container';
const SCHEDULER_SELECTOR = '#otherContainer';
const SCREENSHOT_BASE_NAME = 'without-timezone-recurrent';
const TEST_TIMEZONES = ['Etc/GMT-10', 'Etc/GMT+1', 'Etc/GMT+10'];

const createTimezoneSelect = async (
  page: Page,
  selector: string,
  items: string[],
  schedulerSelector: string,
): Promise<void> => {
  await page.evaluate(({ selectBoxSelector, selectBoxItems, targetSchedulerSelector }) => {
    ($(selectBoxSelector) as any).dxSelectBox({
      items: selectBoxItems,
      width: 240,
      value: selectBoxItems[1],
      onValueChanged(data) {
        const scheduler = ($(targetSchedulerSelector) as any).dxScheduler('instance');
        scheduler.option('timeZone', data.value);
      },
    });
  }, {
    selectBoxSelector: selector,
    selectBoxItems: items,
    targetSchedulerSelector: schedulerSelector,
  });
};

const getSelectBoxListItem = async (
  page: Page,
  selectBox: Locator,
  index: number,
): Promise<Locator> => {
  const input = selectBox.locator('.dx-texteditor-input');

  await expect(input).toHaveAttribute('aria-owns', /.+/);

  const popupId = await input.getAttribute('aria-owns');

  return page.locator(`#${popupId} .dx-list .dx-list-item`).nth(index);
};

const selectTimezoneInUI = async (page: Page, selectBox: Locator, timezoneIdx: number) => {
  await selectBox.click();
  const timezoneItem = await getSelectBoxListItem(page, selectBox, timezoneIdx);

  await timezoneItem.click();
};

test.describe('Recurrent appointments without timezone in scheduler with timezone', () => {
  test('Should correctly display the recurrent weekly appointment without timezone', async ({ page }) => {
    const schedulerTimezone = TEST_TIMEZONES[1];

    await createTimezoneSelect(page, SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
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

    const selectBox = page.locator(SELECT_SELECTOR);
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

    await createTimezoneSelect(page, SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
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

    const selectBox = page.locator(SELECT_SELECTOR);
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

    await createTimezoneSelect(page, SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
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

    const selectBox = page.locator(SELECT_SELECTOR);
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

    await createTimezoneSelect(page, SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
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

    await createTimezoneSelect(page, SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
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
});
