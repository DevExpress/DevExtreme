import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { getScreenshotName } from '../timezoneTestingUtils';
import createWidget from '../../../../helpers/createWidget';
import SelectBox from '../../../../model/selectBox';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Recurrent appointments without timezone in scheduler with timezone`
  .page(url(__dirname, '../../../container.html'));

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
  await t.click(selectBox.element, TEST_CURSOR_OPTIONS);
  const timezonesList = await selectBox.getList();

  await t.click(timezonesList.getItem(timezoneIdx).element, TEST_CURSOR_OPTIONS);
};

test('Should correctly display the recurrent weekly appointment without timezone', async (t) => {
  const selectBox = new SelectBox(SELECT_SELECTOR);
  const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__same-timezone'), schedulerWorkspace);

  await selectTimezoneInUI(t, selectBox, 0);
  // expected date: 4/28/2021 9:00 PM - 11:00 PM
  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__greater-timezone'), schedulerWorkspace);

  await selectTimezoneInUI(t, selectBox, 2);
  // expected date: 4/28/2021 1:00 AM - 3:00 AM
  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__lower-timezone'), schedulerWorkspace);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const schedulerTimezone = TEST_TIMEZONES[1];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget('dxScheduler', {
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
});

test('Should correctly display the recurrent monthly appointment without timezone', async (t) => {
  const selectBox = new SelectBox(SELECT_SELECTOR);
  const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'monthly-appointment__same-timezone'), schedulerWorkspace);

  await selectTimezoneInUI(t, selectBox, 0);
  // expected date: 4/28/2021 9:00 PM - 11:00 PM
  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'monthly-appointment__greater-timezone'), schedulerWorkspace);

  await selectTimezoneInUI(t, selectBox, 2);
  // expected date: 4/28/2021 1:00 AM - 3:00 AM
  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'monthly-appointment__lower-timezone'), schedulerWorkspace);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const schedulerTimezone = TEST_TIMEZONES[1];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget('dxScheduler', {
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
});

test('Should correctly display the recurrent yearly appointment without timezone', async (t) => {
  const selectBox = new SelectBox(SELECT_SELECTOR);
  const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'yearly-appointment__same-timezone'), schedulerWorkspace);

  await selectTimezoneInUI(t, selectBox, 0);
  // expected date: 4/28/2021 9:00 PM - 11:00 PM
  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'yearly-appointment__greater-timezone'), schedulerWorkspace);

  await selectTimezoneInUI(t, selectBox, 2);
  // expected date: 4/28/2021 1:00 AM - 3:00 AM
  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'yearly-appointment__lower-timezone'), schedulerWorkspace);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const schedulerTimezone = TEST_TIMEZONES[1];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget('dxScheduler', {
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
});

test('Should correctly display morning weekly recurrent appointment in a greater timezone.', async (t) => {
  const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-morning-appointment__greater-timezone'), schedulerWorkspace);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const schedulerTimezone = TEST_TIMEZONES[0];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget('dxScheduler', {
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
});

test('Should correctly display \'corner\' weekly recurrent appointments in a greater timezone.', async (t) => {
  const schedulerWorkspace = new Scheduler(SCHEDULER_SELECTOR).workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot(getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-corner-appointments__greater-timezone'), schedulerWorkspace);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const schedulerTimezone = TEST_TIMEZONES[0];

  await createTimezoneSelect(SELECT_SELECTOR, TEST_TIMEZONES, SCHEDULER_SELECTOR);
  await createWidget('dxScheduler', {
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
});
