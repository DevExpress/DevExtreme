import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Agenda:KeyField', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const hasWarningCode = (message) => message.startsWith('W1023');

['week', 'agenda'].forEach((currentView) => {
  test(`Warning should be thrown in console in case currentView='${currentView}'(T1100758)`, async ({ page }) => {
    const messages = await t.getBrowserConsoleMessages();

    const isWarningExist = !!messages.warn.find(hasWarningCode);
    expect(isWarningExist).toBeTruthy();
  });

// TODO: .before() block not converted - move to test setup
// {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week', 'agenda'],
      currentView,
      currentDate: new Date(2021, 2, 28),
      height: 600,
    });
  });
});

test('Warning should be thrown in console after set new views(T1100758)', async ({ page }) => {
  const messages = await t.getBrowserConsoleMessages();
  const isWarningExist = !!messages.warn.find(hasWarningCode);
  expect(isWarningExist).toBeFalsy();

  // Scheduler on '#container'
  await scheduler.option('views', ['week', 'agenda']);

  const messagesAfterChangeViews = await t.getBrowserConsoleMessages();
  const isWarningExistAfterChangeViews = !!messagesAfterChangeViews.warn.find(hasWarningCode);
  expect(isWarningExistAfterChangeViews).toBeTruthy();
});

// TODO: .before() block not converted - move to test setup
// {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
    height: 600,
  });
});

test('Warning shouldn\'t be thrown in console in case currentView=\'week\' if keyField exists(T1100758)', async ({ page }) => {
  const messages = await t.getBrowserConsoleMessages();

  const isWarningExist = !!messages.warn.find(hasWarningCode);
  expect(isWarningExist).toBeFalsy();
});

// TODO: .before() block not converted - move to test setup
// {
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
});

test('Warning shouldn\'t be thrown in console in case currentView=\'agenda\' if keyField exists(T1100758)', async ({ page }) => {
  const messages = await t.getBrowserConsoleMessages();

  const isWarningExist = !!messages.warn.find(hasWarningCode);
  expect(isWarningExist).toBeFalsy();
});

// TODO: .before() block not converted - move to test setup
// {
  await createWidget(page, 'dxScheduler', () => {
    const store = new (window as any).DevExpress.data.CustomStore({
      key: 'id',
      load: () => [],
    });

    return {
      dataSource: store,
      views: ['agenda'],
      currentView: 'agenda',
      currentDate: new Date(2021, 2, 28),
      height: 600,
    };
  });
});

['week', 'agenda'].forEach((currentView) => {
  test(`Warning should be thrown in console in case currentView='${currentView}' if keyField not set in Store(T1100758)`, async ({ page }) => {
    const messages = await t.getBrowserConsoleMessages();

    const isWarningExist = !!messages.warn.find(hasWarningCode);
    expect(isWarningExist).toBeTruthy();
  });

// TODO: .before() block not converted - move to test setup
// {
    await createWidget(page, 'dxScheduler', ClientFunction(() => ({
      dataSource: new (window as any).DevExpress.data.CustomStore({
        load: () => [],
      }),
      views: ['week', 'agenda'],
      currentView,
      currentDate: new Date(2021, 2, 28),
      height: 600,
    }), { dependencies: { currentView } }));
  });
});

test('Wrong behavior: editing recurrence appointment does not affect to appointment\'s data source(T1100758)', async ({ page }) => {
  // Scheduler on '#container'

  await (page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' }).dblclick().element);
  await t
    .typeText(scheduler.appointmentPopup.textEditor.element, 'Updated', { replace: true })
    .click(scheduler.appointmentPopup.saveButton.element);

  expect(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Updated' }).element.exists).toBeTruthy();
});

// TODO: .before() block not converted - move to test setup
// {
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
});
});
