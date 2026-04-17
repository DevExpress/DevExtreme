import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const selectionData = [
    { id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0' },
    { id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1' },
    { id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2' },
    { id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3' },
    { id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4' },
  ];

  test('single mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selectedCardKeys: [0],
      selection: { mode: 'single' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('multiple mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('multiple mode with showCheckBoxesMode none', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'none', allowSelectAll: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('multiple mode with showCheckBoxesMode onClick', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'onClick', allowSelectAll: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('multiple mode with selected card and showCheckBoxesMode onClick', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      selectedCardKeys: [0],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'onClick', allowSelectAll: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('multiple mode with selected cards and showCheckBoxesMode onClick', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      selectedCardKeys: [0, 1],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'onClick', allowSelectAll: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('multiple mode without allowSelectAll', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', allowSelectAll: false },
    });
    await a11yCheck(page, {}, '#container');
  });
});
