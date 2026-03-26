import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../tests/container.html');

const UNSAFE_TEXT = '<script>console.log("XSS!")</script>';

test.describe('CardView - Security', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Script inside cell text should not be executed after opening header filter', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: ['caption'],
      headerFilter: { visible: true },
      dataSource: [{ id: 1, caption: UNSAFE_TEXT }],
    });

    await page.locator('.dx-cardview-headers .dx-header-filter-icon').first().click();

    const itemText = await page.locator('.dx-list-item').first().textContent();
    expect(itemText).toBe(UNSAFE_TEXT);
  });
});
