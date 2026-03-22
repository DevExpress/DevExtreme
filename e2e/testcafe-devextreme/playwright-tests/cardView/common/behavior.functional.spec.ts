import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('CardView - Common Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('cardHeader.visibility property should change on contentReady', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ ID: 1 }],
      onContentReady(e) {
        e.component.option('cardHeader.visible', true);
      },
    });

    const headerVisible = await page.evaluate(() => {
      return ( as any).dxCardView('instance').option('cardHeader.visible');
    });
    expect(headerVisible).toBe(true);

    const cardHeader = page.locator('.dx-cardview-card .dx-cardview-card-header');
    await expect(cardHeader.first()).toBeVisible();
  });
});
