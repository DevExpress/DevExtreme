import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - dropDownButton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxDropDownButton', { dataSource: ['Item_1', 'Item_2'], text: 'Download', splitButton: true });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownButton without splitButton', async ({ page }) => {
    await createWidget(page, 'dxDropDownButton', { dataSource: ['Item_1', 'Item_2'], text: 'Download Trial', splitButton: false, showArrowIcon: true });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownButton without splitButton and arrow icon', async ({ page }) => {
    await createWidget(page, 'dxDropDownButton', { dataSource: ['Item_1', 'Item_2'], text: 'Download Trial', splitButton: false, showArrowIcon: false });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownButton disabled', async ({ page }) => {
    await createWidget(page, 'dxDropDownButton', { dataSource: ['Item_1', 'Item_2'], text: 'Download', splitButton: true, disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownButton with useSelectMode', async ({ page }) => {
    await createWidget(page, 'dxDropDownButton', { dataSource: ['Item_1', 'Item_2'], text: 'Download', splitButton: true, useSelectMode: true });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownButton with icon only', async ({ page }) => {
    await createWidget(page, 'dxDropDownButton', { dataSource: ['Item_1', 'Item_2'], icon: 'save', splitButton: false });
    await a11yCheck(page, {}, '#container');
  });
});
