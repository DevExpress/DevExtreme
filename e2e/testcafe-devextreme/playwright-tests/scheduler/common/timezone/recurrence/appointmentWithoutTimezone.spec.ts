import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const SCREENSHOT_BASE_NAME = 'without-timezone-recurrent';
const TEST_TIMEZONES = ['Etc/GMT-10', 'Etc/GMT+1', 'Etc/GMT+10'];

const getScreenshotName = (baseName: string, suffix: string) => `${baseName}__${suffix}.png`;

async function createTimezoneSelect(page, items: string[]): Promise<void> {
  await page.evaluate(({ tzItems }) => {
    ($('#container') as any).dxSelectBox({
      items: tzItems,
      width: 240,
      value: tzItems[1],
      onValueChanged(data: any) {
        const scheduler = ($('#otherContainer') as any).dxScheduler('instance');
        scheduler.option('timeZone', data.value);
      },
    });
  }, { tzItems: items });
}

async function selectTimezoneInUI(page, timezoneIdx: number): Promise<void> {
  await page.locator('#container').click();
  const listItems = page.locator('.dx-list-item');
  await listItems.nth(timezoneIdx).click();
}

test.describe('Recurrent appointments without timezone in scheduler with timezone', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should correctly display the recurrent weekly appointment without timezone', async ({ page }) => {
    await createTimezoneSelect(page, TEST_TIMEZONES);
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        allDay: false,
        startDate: new Date('2021-04-28T11:00:00.000Z'),
        endDate: new Date('2021-04-28T13:00:00.000Z'),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
        text: 'Test',
      }],
      timeZone: TEST_TIMEZONES[1],
      currentView: 'week',
      currentDate: new Date(2021, 3, 28),
      startDayHour: 0,
      cellDuration: 180,
      width: 1000,
      height: 585,
    }, '#otherContainer');

    const schedulerWorkspace = page.locator('#otherContainer .dx-scheduler-work-space');

    await testScreenshot(page, getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__same-timezone'), { element: schedulerWorkspace });

    await selectTimezoneInUI(page, 0);
    await testScreenshot(page, getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__greater-timezone'), { element: schedulerWorkspace });

    await selectTimezoneInUI(page, 2);
    await testScreenshot(page, getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-appointment__lower-timezone'), { element: schedulerWorkspace });
  });

  test('Should correctly display morning weekly recurrent appointment in a greater timezone', async ({ page }) => {
    await createTimezoneSelect(page, TEST_TIMEZONES);
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'test',
        startDate: new Date('2021-04-29T15:00:00.000Z'),
        endDate: new Date('2021-04-29T17:00:00.000Z'),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=FR',
      }],
      timeZone: TEST_TIMEZONES[0],
      currentView: 'week',
      currentDate: new Date(2021, 3, 28),
      startDayHour: 0,
      cellDuration: 180,
      width: 1000,
      height: 585,
    }, '#otherContainer');

    const schedulerWorkspace = page.locator('#otherContainer .dx-scheduler-work-space');
    await testScreenshot(page, getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-morning-appointment__greater-timezone'), { element: schedulerWorkspace });
  });

  test('Should correctly display corner weekly recurrent appointments in a greater timezone', async ({ page }) => {
    await createTimezoneSelect(page, TEST_TIMEZONES);
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        { text: 'test 1', startDate: new Date('2021-04-24T14:00:00.000Z'), endDate: new Date('2021-04-24T16:00:00.000Z'), recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU' },
        { text: 'test 2', startDate: new Date('2021-05-01T12:00:00.000Z'), endDate: new Date('2021-05-01T14:00:00.000Z'), recurrenceRule: 'FREQ=WEEKLY;BYDAY=SA' },
      ],
      timeZone: TEST_TIMEZONES[0],
      currentView: 'week',
      currentDate: new Date(2021, 3, 28),
      startDayHour: 0,
      cellDuration: 180,
      width: 1000,
      height: 585,
    }, '#otherContainer');

    const schedulerWorkspace = page.locator('#otherContainer .dx-scheduler-work-space');
    await testScreenshot(page, getScreenshotName(SCREENSHOT_BASE_NAME, 'weekly-corner-appointments__greater-timezone'), { element: schedulerWorkspace });
  });
});
