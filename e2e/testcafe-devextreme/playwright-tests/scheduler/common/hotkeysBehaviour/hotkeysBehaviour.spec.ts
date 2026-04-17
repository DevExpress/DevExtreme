import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const hotkeyDataSource = [
  { text: 'Website Re-Design Plan', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 11, 30) },
  { text: 'Book Flights to San Fran for Sales Trip', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 11, 30) },
  { text: 'Install New Router in Dev Room', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 11, 30) },
  { text: 'Approve Personal Computer Upgrade Plan', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 11, 30) },
  { text: 'Final Budget Review', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 11, 30) },
  { text: 'New Brochures', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 11, 30) },
  { text: 'Install New Database', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 11, 30) },
  { text: 'Approve New Online Marketing Strategy', startDate: new Date(2019, 3, 1, 9, 0), endDate: new Date(2019, 3, 1, 11, 30) },
];

const defaultSchedulerOptions = {
  views: ['month'],
  dataSource: [],
  width: 1402,
  height: 833,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'month',
  currentDate: new Date(2019, 3, 1),
};

test.describe('Hotkeys for appointments update and navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['week', 'month'].forEach((view) => {
    test(`Navigate between appointments in the "${view}" view (Tab/Shift+Tab)`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        ...defaultSchedulerOptions,
        views: [view],
        currentView: view,
        dataSource: hotkeyDataSource,
      });

      const firstAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
      const secondAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Book Flights to San Fran for Sales Trip' });

      await firstAppointment.click();
      let isFocused = await firstAppointment.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(true);

      await page.keyboard.press('Tab');
      isFocused = await firstAppointment.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(false);
      isFocused = await secondAppointment.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(true);

      await page.keyboard.press('Shift+Tab');
      isFocused = await secondAppointment.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(false);
      isFocused = await firstAppointment.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(true);
    });

    test(`Remove appointment in the "${view}" view (Del)`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        ...defaultSchedulerOptions,
        views: [view],
        currentView: view,
        dataSource: hotkeyDataSource,
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
      await appointment.click();
      await page.keyboard.press('Delete');
      await expect(appointment).not.toBeVisible();
    });

    test(`Show appointment popup in the "${view}" view (Enter)`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        ...defaultSchedulerOptions,
        views: [view],
        currentView: view,
        dataSource: hotkeyDataSource,
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
      await appointment.click();
      await page.keyboard.press('Enter');
      await expect(page.locator('.dx-scheduler-appointment-popup')).toBeVisible();
    });

    test(`Navigate between tooltip appointments in the "${view}" view (Up/Down)`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        ...defaultSchedulerOptions,
        views: [view],
        currentView: view,
        dataSource: hotkeyDataSource,
      });

      const collector = page.locator('.dx-scheduler-appointment-collector').filter({ hasText: '3' });
      await collector.click();
      await expect(page.locator('.dx-scheduler-appointment-tooltip-wrapper')).toBeVisible();

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('Enter');

      await expect(page.locator('.dx-scheduler-appointment-tooltip-wrapper')).not.toBeVisible();
      await expect(page.locator('.dx-scheduler-appointment-popup')).toBeVisible();
    });
  });

  test('Navigate between toolbar items', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['day', 'week'],
      currentView: 'day',
    });

    const toolbar = page.locator('.dx-scheduler-header');
    await toolbar.click();
    await page.keyboard.press('Tab');

    const prevButton = page.locator('.dx-scheduler-navigator-previous');
    const isFocused = await prevButton.evaluate((el) => el.classList.contains('dx-state-focused'));
    expect(isFocused).toBe(true);
  });

  test('Navigate between custom toolbar items', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['day', 'week'],
      currentView: 'day',
      toolbar: {
        items: [
          { location: 'before', name: 'viewSwitcher' },
          { location: 'before', widget: 'dxButton', options: { text: 'Today' } },
          { location: 'after', name: 'dateNavigator' },
        ],
      },
    });

    const toolbar = page.locator('.dx-scheduler-header');
    await toolbar.click();
    await page.keyboard.press('Tab');

    const viewSwitcherDayButton = page.locator('.dx-scheduler-view-switcher .dx-button').filter({ hasText: 'Day' });
    const isFocused = await viewSwitcherDayButton.evaluate((el) => el.classList.contains('dx-state-focused'));
    expect(isFocused).toBe(true);
  });
});
