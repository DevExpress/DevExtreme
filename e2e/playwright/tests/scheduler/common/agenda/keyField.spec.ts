import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const WARNING_CODE = 'W1023';

// TestCafe read the console after the fact; a Playwright page has to be listened to from the
// start, so every test collects the warnings it produces into an array of its own.
const collectWarnings = (page: Page): string[] => {
  const warnings: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'warning') {
      warnings.push(message.text());
    }
  });

  return warnings;
};

const hasWarningCode = (warnings: string[]): boolean => warnings
  .some((message) => message.startsWith(WARNING_CODE));

['week', 'agenda'].forEach((currentView) => {
  test(`Warning should be thrown in console in case currentView='${currentView}'(T1100758)`, async ({ page }) => {
    const warnings = collectWarnings(page);

    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week', 'agenda'],
      currentView,
      currentDate: new Date(2021, 2, 28),
      height: 600,
    });

    await expect.poll(() => hasWarningCode(warnings)).toBe(true);
  });
});

test('Warning should be thrown in console after set new views(T1100758)', async ({ page }) => {
  const warnings = collectWarnings(page);

  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
    height: 600,
  });

  expect(hasWarningCode(warnings)).toBe(false);

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('views', ['week', 'agenda']);

  await expect.poll(() => hasWarningCode(warnings)).toBe(true);
});

test('Warning shouldn\'t be thrown in console in case currentView=\'week\' if keyField exists(T1100758)', async ({ page }) => {
  const warnings = collectWarnings(page);

  await createWidget(page, 'dxScheduler', () => {
    const store = new (window as any).DevExpress.data.CustomStore({
      key: 'id',
      load: () => [],
    });

    return {
      dataSource: store,
      views: ['week', 'agenda'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      height: 600,
    };
  });

  expect(hasWarningCode(warnings)).toBe(false);
});

test('Warning shouldn\'t be thrown in console in case currentView=\'agenda\' if keyField exists(T1100758)', async ({ page }) => {
  const warnings = collectWarnings(page);

  await createWidget(page, 'dxScheduler', () => {
    const store = new (window as any).DevExpress.data.CustomStore({
      key: 'id',
      load: () => [],
    });

    return {
      dataSource: store,
      views: ['week', 'agenda'],
      currentView: 'agenda',
      currentDate: new Date(2021, 2, 28),
      height: 600,
    };
  });

  expect(hasWarningCode(warnings)).toBe(false);
});

['week', 'agenda'].forEach((currentView) => {
  test(`Warning should be thrown in console in case currentView='${currentView}' if keyField not set in Store(T1100758)`, async ({ page }) => {
    const warnings = collectWarnings(page);

    // The configuration is built in the page, so the view it is parametrized with is handed over
    // beforehand — the counterpart of the TestCafe client function "dependencies".
    await page.evaluate((view) => { (window as any).testCurrentView = view; }, currentView);

    await createWidget(page, 'dxScheduler', () => ({
      dataSource: new (window as any).DevExpress.data.CustomStore({
        load: () => [],
      }),
      views: ['week', 'agenda'],
      currentView: (window as any).testCurrentView,
      currentDate: new Date(2021, 2, 28),
      height: 600,
    }));

    await expect.poll(() => hasWarningCode(warnings)).toBe(true);
  });
});

test('Wrong behavior: editing recurrence appointment does not affect to appointment\'s data source(T1100758)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Test',
      startDate: new Date('2021-03-29T16:30:00.000Z'),
      endDate: new Date('2021-03-29T18:30:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY',
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 2, 28),
    recurrenceEditMode: 'series',
    height: 600,
  }, '#container');

  const scheduler = new Scheduler(page, '#container');

  await scheduler.getAppointment('Test').element.dblclick();

  await scheduler.appointmentPopup.textEditor.input.fill('Updated');
  await scheduler.appointmentPopup.saveButton.element.click();

  await expect(scheduler.getAppointment('Updated').element).toBeAttached();
});
