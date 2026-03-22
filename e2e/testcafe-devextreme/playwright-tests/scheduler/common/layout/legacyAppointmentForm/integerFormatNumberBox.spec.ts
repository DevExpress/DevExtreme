import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:AppointmentForm:IntegerFormatNumberBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('dxNumberBox should not allow to enter not integer chars(T1002864)', async ({ page }) => {
  // Scheduler on '#container'
  const { legacyAppointmentPopup: appointmentPopup } = scheduler;

    await (page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' }).dblclick().element);

  await t
    .typeText(appointmentPopup.repeatEveryElement, '.,2', { speed: 0.5 });

  await testScreenshot(page, 'dx-number-boxes-not-integer-chars.png', {
    element: appointmentPopup.content,
  });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 3, 26, 10),
    endDate: new Date(2021, 3, 26, 11),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;UNTIL=20220114T205959Z',
  }],
  editing: { legacyForm: true },
  views: ['day', 'week', 'workWeek', 'month'],
  currentView: 'week',
  currentDate: new Date(2021, 3, 29),
  startDayHour: 9,
  height: 600,
  recurrenceEditMode: 'series',
}));
});
