import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const selectionData = [
  { id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0' },
  { id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1' },
  { id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2' },
  { id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3' },
  { id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4' },
];

test.describe('Selection.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Single mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selectedCardKeys: [0],
      selection: { mode: 'single' },
    });

    await testScreenshot(page, 'card-view_single_selection.png', {
      element: page.locator('#container'),
    });
  });

  test("Multiple mode with showCheckBoxesMode = 'always'", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true },
    });

    await testScreenshot(page, 'card-view_miltiple_selection_with_showCheckBoxesMode_=_always.png', {
      element: page.locator('#container'),
    });
  });

  test('Multiple mode without Select All/Deselect All', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', allowSelectAll: false },
    });

    await testScreenshot(page, 'card-view_miltiple_selection_without_select-all.png', {
      element: page.locator('#container'),
    });
  });
});
