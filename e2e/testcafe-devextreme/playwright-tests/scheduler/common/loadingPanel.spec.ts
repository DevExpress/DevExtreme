import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Scheduler loading panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

const SCHEDULER_SELECTOR = '#container';
const INITIAL_APPOINTMENT_TITLE = 'appointment';
const ADDITIONAL_TITLE_TEXT = '-updated';

);

test('Save appointment loading panel screenshot', async ({ page }) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);
  const { appointmentPopup } = scheduler;

  await (appointment.element).dblclick()
    .click(appointmentPopup.textEditor.element)
    .typeText(appointmentPopup.textEditor.element, ADDITIONAL_TITLE_TEXT)
    .click(appointmentPopup.saveButton.element);

  await testScreenshot(page, 'save-appointment-loading-panel-screenshot.png', { element: page.locator('.dx-scheduler') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    id: 1,
    text: INITIAL_APPOINTMENT_TITLE,
    startDate: new Date(2021, 2, 29, 9, 30),
    endDate: new Date(2021, 2, 29, 11, 30),
  }],
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 2, 29),
  startDayHour: 9,
  endDayHour: 14,
  height: 600,
  onAppointmentUpdating: (e) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e.cancel = new Promise((resolve, reject) => {});
  },
}));
});
