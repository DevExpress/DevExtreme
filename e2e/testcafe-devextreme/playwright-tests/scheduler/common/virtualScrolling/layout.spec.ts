import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Scheduler: Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  // TODO: needs Scheduler page object (scheduler.option, scrollToDate, imported utils: resources, views, scrollConfig, etc.)
  test.skip('Virtual scrolling layout in scheduler views', async ({ page }) => {
    // Uses scheduler.option(), scrollToDate(), and imported config from ./utils
  });

  // TODO: needs Scheduler page object (scheduler.option, scrollToDate)
  test.skip('Virtual scrolling layout in scheduler views when horizontal grouping is enabled', async ({ page }) => {
    // Uses scheduler.option(), scrollToDate(), and imported config from ./utils
  });

  // TODO: needs Scheduler page object (scheduler.option, scrollToDate)
  test.skip('Virtual scrolling layout in scheduler views when grouping by date is enabled', async ({ page }) => {
    // Uses scheduler.option(), scrollToDate(), and imported config from ./utils
  });

  // TODO: needs Scheduler page object (scheduler.option)
  test.skip('Header cells should be aligned with date-table cells in timeline-month when current date changes and virtual scrolling is used', async ({ page }) => {
    // Uses scheduler.option() to change currentDate
  });
});
