import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Appointment Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

async function showAppointmentPopup(page: Page) {
  await page.evaluate(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  instance.showAppointmentPopup();
}, );
}

test('Invoke showAppointmentPopup method shouldn\'t raise error if value of currentDate property as a string', async ({ page }) => {
  // --- setup ---
await ClientFunction(() => {
    (window as any).DevExpress.ui.dxPopup.defaultOptions({
      options: {
        deferRendering: false,
      },
  // --- test ---
// Scheduler on '#container'

  await showAppointmentPopup();

  expect(scheduler.legacyAppointmentPopup.startDateElement.value)
    .eql('3/25/2021, 12:00 AM');

  expect(scheduler.legacyAppointmentPopup.endDateElement.value)
    .eql('3/25/2021, 12:30 AM');
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 25).toISOString(),
  height: 600,
  editing: {
    legacyForm: true,
  },
}));

test('Show appointment popup if deffereRendering is false (T1069753)', async ({ page }) => {
  // Scheduler on '#container'
  const appointment = page.locator('.dx-scheduler-appointment').nth(0);

  await (appointment.element).dblclick()
    .expect(scheduler.legacyAppointmentPopup.isVisible)
    .ok();
});
  })();

  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Test',
      startDate: new Date(2021, 2, 29, 10),
      endDate: new Date(2021, 2, 29, 11),
    }],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 29),
    startDayHour: 9,
    endDayHour: 12,
    width: 400,
    editing: {
      legacyForm: true,
    },
  });
});
});
