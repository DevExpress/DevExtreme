import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxList', { dataSource: ['Item_1', 'Item_2', 'Item_3'], height: 400 });
    await a11yCheck(page, {}, '#container');
  });

  test('empty list', async ({ page }) => {
    await createWidget(page, 'dxList', { dataSource: [], height: 400 });
    await a11yCheck(page, {}, '#container');
  });

  test('list with search enabled', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      height: 400,
      searchEnabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('list with multiple selection', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      height: 400,
      selectionMode: 'multiple',
      showSelectionControls: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('list with single selection', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      height: 400,
      selectionMode: 'single',
      showSelectionControls: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('list with item deleting toggle mode', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      height: 400,
      allowItemDeleting: true,
      itemDeleteMode: 'toggle',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('list with item deleting static mode', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      height: 400,
      allowItemDeleting: true,
      itemDeleteMode: 'static',
    });
    await a11yCheck(page, {}, '#container');
  });

  const groupedItems = [
    { key: 'Group A', items: ['Item A1', 'Item A2', 'Item A3'] },
    { key: 'Group B', items: ['Item B1', 'Item B2'] },
  ];

  test('grouped list', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: groupedItems,
      height: 400,
      grouped: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('grouped list with collapsible groups', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: groupedItems,
      height: 400,
      grouped: true,
      collapsibleGroups: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('grouped list with search', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: groupedItems,
      height: 400,
      grouped: true,
      searchEnabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('list with item deleting context mode', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      height: 400,
      allowItemDeleting: true,
      itemDeleteMode: 'context',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('list with item deleting slideButton mode', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      height: 400,
      allowItemDeleting: true,
      itemDeleteMode: 'slideButton',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('list with all selection mode', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      height: 400,
      selectionMode: 'all',
      showSelectionControls: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('grouped list with multiple selection', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: groupedItems,
      height: 400,
      grouped: true,
      collapsibleGroups: true,
      selectionMode: 'multiple',
      showSelectionControls: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('list with noDataText', async ({ page }) => {
    await createWidget(page, 'dxList', { dataSource: [], height: 400, noDataText: 'No items available' });
    await a11yCheck(page, {}, '#container');
  });

  test('list disabled', async ({ page }) => {
    await createWidget(page, 'dxList', { dataSource: ['Item_1', 'Item_2', 'Item_3'], height: 400, disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('list with pullingDownText', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      height: 400,
      pullingDownText: 'Pull to refresh',
      pulledDownText: 'Release to refresh',
      refreshingText: 'Refreshing...',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('list with single item', async ({ page }) => {
    await createWidget(page, 'dxList', { dataSource: ['Only Item'], height: 400 });
    await a11yCheck(page, {}, '#container');
  });
});
