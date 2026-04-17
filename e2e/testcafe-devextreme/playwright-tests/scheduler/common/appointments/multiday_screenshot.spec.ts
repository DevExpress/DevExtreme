import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Scheduler - Multiday appointments (screenshot)', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [
    'week',
    'month',
    'timelineMonth',
  ].forEach((currentView) => {
    test(`it should not cut multiday appointment in ${currentView} view`, async ({ page }) => {
      await createWidget(
        page,
        'dxScheduler',
        {
          width: 900,
          height: 400,
          dataSource: [{
            text: 'Website Re-Design Plan',
            startDate: new Date(2021, 2, 28, 8),
            endDate: new Date(2021, 3, 4, 8),
          }],
          views: ['week', 'month', 'timelineMonth'],
          currentView,
          currentDate: new Date(2021, 3, 4),
          startDayHour: 12,
        },
      );

      await testScreenshot(page, `multiday-appointment_${currentView}.png`, {
        element: page.locator('#container'),
      });
    });
  });
});
