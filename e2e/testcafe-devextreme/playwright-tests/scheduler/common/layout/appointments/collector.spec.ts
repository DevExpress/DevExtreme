import { test } from '@playwright/test';
import { createWidget, testScreenshot, generateOptionMatrix } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Appointments collector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Appointment collector has correct offset when adaptivityEnabled=true (T1024299)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      adaptivityEnabled: true, currentDate: new Date(2021, 7, 1),
      views: ['timelineMonth'], currentView: 'timelineMonth',
      dataSource: [{ text: 'text', startDate: new Date(2021, 7, 1), endDate: new Date(2021, 7, 2) }],
      height: 300,
    });
    await testScreenshot(page, 'appointment-collector-adaptability-timelineMonth.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });

  const getSchedulerBaseOptions = (view: string) => {
    const count = 20;
    const day = 1;
    const allDayAppointments = Array(Math.round(count / 4)).fill({
      allDay: true, text: 'text', startDate: new Date(2021, 7, day, 0), endDate: new Date(2021, 7, day, 2),
    });
    const regularAppointments = Array(Math.round((count * 3) / 4)).fill({
      text: 'text', startDate: new Date(2021, 7, day, 0), endDate: new Date(2021, 7, day, 2),
    });
    const width = ['month', 'week'].includes(view) ? 800 : 500;
    const height = ['month'].includes(view) ? 500 : 300;
    return { currentDate: new Date(2021, 7, day), views: [view], currentView: view, dataSource: [...allDayAppointments, ...regularAppointments], height, width };
  };

  generateOptionMatrix({ view: ['week', 'month', 'timelineWeek'], adaptivityEnabled: [true, false] })
    .forEach(({ view, adaptivityEnabled }) => {
      test(`Appointment collector has correct offset when view=${view} adaptivityEnabled=${adaptivityEnabled}`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', { adaptivityEnabled, ...getSchedulerBaseOptions(view) });
        await testScreenshot(page, `appointment-collector-${view}-adapt(${adaptivityEnabled}).png`, { element: page.locator('.dx-scheduler-work-space') });
      });
    });

  test('Appointment collector has correct offset when month view with double interval', async ({ page }) => {
    await createWidget(page, 'dxScheduler', { ...getSchedulerBaseOptions('month'), views: [{ type: 'month', intervalCount: 2 }] });
    await testScreenshot(page, 'appointment-collector-month-double-interval.png', { element: page.locator('.dx-scheduler-work-space') });
  });

  generateOptionMatrix({ view: ['week', 'month', 'timelineWeek'], rtlEnabled: [false, true] })
    .forEach(({ view, rtlEnabled }) => {
      test(`Appointment collector has correct offset when view=${view} rtlEnabled=${rtlEnabled}`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', { ...getSchedulerBaseOptions(view), rtlEnabled });
        await testScreenshot(page, `appointment-collector-${view}-rtl(${rtlEnabled}).png`, { element: page.locator('.dx-scheduler-work-space') });
      });
    });
});
