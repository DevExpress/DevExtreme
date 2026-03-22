import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const buttons = Array.from({ length: 12 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

test.describe('Scheduler multiline header', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [true, false].forEach((multiline) => {
    test(`Scheduler [multiline=${multiline}] toolbar`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        views: ['day', 'week', 'workWeek', 'month'],
        currentView: 'workWeek',
        currentDate: new Date(2021, 3, 27),
        height: 200,
        toolbar: {
          multiline,
          items: [
            'dateNavigator',
            ...buttons,
            'viewSwitcher',
          ],
        },
      });

      await testScreenshot(
        page,
        `scheduler-multiline-${multiline}-toolbar.png`,
        { element: page.locator('.dx-scheduler-header') },
      );
    });
  });
});
