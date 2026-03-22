import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Appointment Form: recurrence editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const SCHEDULER_SELECTOR = '#container';

const fillRecurrenceForm = async (
  t: TestController,
  popup: LegacyAppointmentPopup,
): Promise<void> => {
  await (popup.recurrenceTypeElement).click();
  await (popup.getRecurrenceTypeSelectItem(2).click());
  await await (popup.repeatEveryElement).fill('10');
  await (popup.getEndRepeatRadioButton(1).click());
  await await (popup.endRepeatDateElement).fill('01/01/2024');
};

test('Should not reset the recurrence editor value after the repeat toggling', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
    editing: {
      legacyForm: true,
    },
  // --- test ---
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.legacyAppointmentPopup;
  const cell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

  await (cell).dblclick();
  await (popup.recurrenceElement).click();
  await fillRecurrenceForm(t, popup);
  await (popup.recurrenceElement).click();
  await (popup.recurrenceElement).click();

  await testScreenshot(page, 'recurrence-editor_after-hide.png', { element: popup.content });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});

test('Should reset the recurrence editor value after the popup reopening', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
    editing: {
      legacyForm: true,
    },
  // --- test ---
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.legacyAppointmentPopup;
  const cell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

  await (cell).dblclick();
  await (popup.recurrenceElement).click();
  await fillRecurrenceForm(t, popup);
  await (popup.cancelButton).click();
  await (cell).dblclick();
  await (popup.recurrenceElement).click();

  await testScreenshot(page, 'recurrence-editor_after-popup-reopen.png', { element: popup.content });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});

test('Should correctly create usual appointment after repeat toggling', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
    editing: {
      legacyForm: true,
    },
  // --- test ---
const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.legacyAppointmentPopup;
  const cell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

  await (cell).dblclick();
  await (popup.recurrenceElement).click();
  await (popup.recurrenceElement).click();
  await (popup.doneButton).click();

  expect(page.locator('.dx-scheduler-appointment').count()).toBe(1);
});
});

test('Should correctly create recurrent appointment', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
    editing: {
      legacyForm: true,
    },
  // --- test ---
const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.legacyAppointmentPopup;
  const cell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

  await (cell).dblclick();
  await (popup.recurrenceElement).click();
  await (popup.doneButton).click();

  expect(page.locator('.dx-scheduler-appointment').count()).toBe(7);
});
});

test('Should correctly create recurrent appointment after repeat toggle', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: '2024-01-01T10:00:00',
    editing: {
      legacyForm: true,
    },
  // --- test ---
const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const popup = scheduler.legacyAppointmentPopup;
  const cell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

  await (cell).dblclick();
  await (popup.recurrenceElement).click();
  await (popup.recurrenceElement).click();
  await (popup.recurrenceElement).click();
  await (popup.doneButton).click();

  expect(page.locator('.dx-scheduler-appointment').count()).toBe(7);
});
});
});
