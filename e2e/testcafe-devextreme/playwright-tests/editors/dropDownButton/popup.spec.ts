import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Drop Down Button\'s Popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Popup should have correct position when DropDownButton is placed in the right bottom(T1034931)', async ({ page }) => {
    await createWidget(page, 'dxDropDownButton', {
      items: [1, 2, 3, 4, 5, 6, 7],
      elementAttr: { style: 'position: absolute; right: 10px; bottom: 10px;' },
      opened: true,
    });

    const dropDownButton = page.locator('#container');
    const dropDownButtonLeft = await dropDownButton.evaluate((el) => el.getBoundingClientRect().left);

    const popupContent = page.locator('.dx-overlay-content[role="dialog"]');
    const popupContentLeft = await popupContent.evaluate((el) => el.getBoundingClientRect().left);

    expect(Math.abs(dropDownButtonLeft - popupContentLeft)).toBeLessThan(1);
  });
});
