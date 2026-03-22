import { test, expect } from '@playwright/test';
import { setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('ResourceCellTemplate', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('resourceCellTemplate layout should be rendered right in the agenda view', async ({ page }) => {
    const currentDate = new Date(2017, 4, 25);

    await page.evaluate(({ date }) => {
      const currentDateValue = new Date(date);
      (window as any).DevExpress.fx.off = true;
      ($('#container') as any).dxScheduler({
        dataSource: [{
          text: 'appointment',
          startDate: currentDateValue,
          endDate: currentDateValue,
          resource: 1,
        }],
        views: ['agenda'],
        currentView: 'agenda',
        currentDate: currentDateValue,
        resourceCellTemplate() {
          return 'Custom resource text';
        },
        groups: ['resource'],
        resources: [{
          fieldExpr: 'resource',
          dataSource: [{
            text: 'Resource text',
            id: 1,
          }],
          label: 'Resource',
        }],
        height: 600,
      });
    }, { date: currentDate.toISOString() });

    const groupHeader = page.locator('.dx-scheduler-group-header').first();
    await expect(groupHeader).toHaveText('Custom resource text');
  });
});
