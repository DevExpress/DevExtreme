import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Scheduler: Generic theme layout', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should correctly render view if virtual scrolling and groupByDate', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      height: 600,
      width: 200,
      dataSource: [{
        userId: 1,
        startDate: new Date(2022, 0, 16, 14, 30),
        endDate: new Date(2022, 0, 16, 15),
      }],
      currentDate: new Date(2022, 0, 15),
      views: ['month'],
      currentView: 'month',
      groupByDate: true,
      groups: ['userId'],
      resources: [{
        fieldExpr: 'userId',
        allowMultiple: false,
        dataSource: [
          { id: 1, text: 'User 1' },
          { id: 2, text: 'User 2' },
          { id: 3, text: 'User 3' },
          { id: 4, text: 'User 4' },
          { id: 5, text: 'User 5' },
        ],
        label: 'User',
      }],
      scrolling: {
        mode: 'virtual',
      },
    });

    const appointment = page.locator('.dx-scheduler-appointment').nth(0);
    await expect(appointment).toBeVisible();
  });
});
