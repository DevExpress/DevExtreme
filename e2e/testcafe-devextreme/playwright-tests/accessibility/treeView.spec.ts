import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - treeView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const treeViewItems = [
    { id: 1, text: 'John Heart', expanded: true, items: [
      { id: 2, text: 'Samantha Bright', expanded: true, items: [
        { id: 3, text: 'Kevin Carter' },
        { id: 4, text: 'Brett Wade' },
      ] },
    ] },
    { id: 5, text: 'Robert Reagan', items: [
      { id: 6, text: 'Amelia Harper' },
    ] },
  ];

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxTreeView', { items: [{ text: 'Item 1', items: [{ text: 'Item 1.1' }] }, { text: 'Item 2' }] });
    await a11yCheck(page, {}, '#container');
  });

  test('empty treeView', async ({ page }) => {
    await createWidget(page, 'dxTreeView', { items: [] });
    await a11yCheck(page, {}, '#container');
  });

  test('treeView with search enabled', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      items: treeViewItems,
      searchEnabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('treeView with normal checkboxes', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      items: treeViewItems,
      showCheckBoxesMode: 'normal',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('treeView with selectAll checkboxes', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      items: treeViewItems,
      showCheckBoxesMode: 'selectAll',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('treeView with noDataText', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      items: [],
      noDataText: 'No items found',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('treeView search with checkboxes', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      items: treeViewItems,
      searchEnabled: true,
      showCheckBoxesMode: 'normal',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('treeView empty with search', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      items: [],
      searchEnabled: true,
      noDataText: 'no data text',
    });
    await a11yCheck(page, {}, '#container');
  });
});
