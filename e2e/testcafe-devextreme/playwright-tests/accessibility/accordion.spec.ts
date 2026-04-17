import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe.skip('Accessibility - accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: ['Item_1', 'Item_2', 'Item_3'], focusStateEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('disabled accordion', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: ['Item_1', 'Item_2', 'Item_3'], disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('accordion with multiple mode and expanded items', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: ['Item_1', 'Item_2', 'Item_3'], multiple: true, focusStateEnabled: true });
    await page.locator('.dx-accordion-item-title').nth(0).click();
    await page.locator('.dx-accordion-item-title').nth(1).click();
    await a11yCheck(page, {}, '#container');
  });

  test('accordion without deferRendering', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: ['Item_1', 'Item_2', 'Item_3'], deferRendering: false });
    await a11yCheck(page, {}, '#container');
  });

  test('accordion disabled with multiple', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: ['Item_1', 'Item_2', 'Item_3'], disabled: true, multiple: true });
    await a11yCheck(page, {}, '#container');
  });

  test('accordion with deferRendering false and multiple', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: ['Item_1', 'Item_2', 'Item_3'], deferRendering: false, multiple: true, focusStateEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('accordion with single item', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: ['Only Item'], focusStateEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('accordion with collapsible false', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: ['Item_1', 'Item_2', 'Item_3'], collapsible: false, focusStateEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('accordion empty datasource', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: [] });
    await a11yCheck(page, {}, '#container');
  });

  test('accordion with selected index', async ({ page }) => {
    await createWidget(page, 'dxAccordion', { dataSource: ['Item_1', 'Item_2', 'Item_3'], selectedIndex: 1, focusStateEnabled: true });
    await a11yCheck(page, {}, '#container');
  });
});
