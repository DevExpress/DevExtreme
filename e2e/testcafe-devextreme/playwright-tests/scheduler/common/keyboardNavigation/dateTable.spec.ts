import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, appendElementTo } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const PARENT_SELECTOR = '#parentContainer';
const SCHEDULER_SELECTOR = '#container';
const BOTTOM_BTN_ID = 'bottom-btn';
const BOTTOM_BTN_SELECTOR = `#${BOTTOM_BTN_ID}`;

test.describe('KeyboardNavigation.DateTable', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['day', 'week'].forEach((currentView) => {
    test(`Should pass focus to the next elements after date table on Mac devices (view: ${currentView})`, async ({ page }) => {
      await appendElementTo(page, PARENT_SELECTOR, 'button', { id: BOTTOM_BTN_ID });

      await createWidget(page, 'dxScheduler', {
        dataSource: [
          {
            startDate: '2024-01-01T01:00:00',
            endDate: '2024-01-01T02:00:00',
            text: 'Usual',
          },
          {
            startDate: '2024-01-01T01:00:00',
            endDate: '2024-01-01T02:00:00',
            text: 'All-day',
            allDay: true,
          },
        ],
        height: 300,
        currentDate: '2024-01-01',
        currentView,
      });

      await page.evaluate((sel) => {
        ($(sel) as any)
          .dxScheduler('instance')
          .getWorkSpaceScrollable()
          .option('useNative', true);
      }, SCHEDULER_SELECTOR);

      const allDayAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'All-day' });
      await allDayAppointment.click();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const bottomBtn = page.locator(BOTTOM_BTN_SELECTOR);
      const isFocused = await bottomBtn.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);
    });
  });
});
