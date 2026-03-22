import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../tests/container.html');

test.describe('CardView - NoData', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('default render', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      width: 1000,
      height: 600,
      columns: ['Customer', 'Order Date'],
      dataSource: [],
    });

    await testScreenshot(page, 'content-no-data.png', {
      element: page.locator('#container'),
    });
  });
});
