import { test, expect } from '@playwright/test';
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

  test('no data message is visible when datasource is empty', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      width: 1000,
      height: 600,
      columns: ['Customer', 'Order Date'],
      dataSource: [],
    });

    const noDataElement = page.locator('.dx-empty-message');
    await expect(noDataElement).toBeVisible();
  });

  test('custom no data text is rendered', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      width: 1000,
      height: 600,
      columns: ['Customer', 'Order Date'],
      dataSource: [],
      noDataText: 'Custom no data message',
    });

    const noDataElement = page.locator('.dx-empty-message');
    await expect(noDataElement).toHaveText('Custom no data message');
  });

  test('no cards rendered when datasource is empty', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      width: 1000,
      height: 600,
      columns: ['Customer', 'Order Date'],
      dataSource: [],
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(0);
  });

});
