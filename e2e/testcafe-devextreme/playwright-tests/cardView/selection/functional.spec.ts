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

test.describe('Selection.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Single mode: select a first card -> select a second card -> deselect a second card', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'single' },
    });

    const firstCard = page.locator('.dx-cardview-card').nth(0);
    const secondCard = page.locator('.dx-cardview-card').nth(1);

    await firstCard.click();
    await expect(firstCard).toHaveClass(/dx-selection/);

    await secondCard.click();
    await expect(firstCard).not.toHaveClass(/dx-selection/);
    await expect(secondCard).toHaveClass(/dx-selection/);

    await secondCard.click({ modifiers: ['Control'] });
    await expect(secondCard).not.toHaveClass(/dx-selection/);
  });

  test("Multiple mode with showCheckBoxesMode='always': select cards with checkboxes", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true },
    });

    const firstCheckbox = page.locator('.dx-cardview-card').nth(0).locator('.dx-checkbox');
    const secondCheckbox = page.locator('.dx-cardview-card').nth(1).locator('.dx-checkbox');
    const firstCard = page.locator('.dx-cardview-card').nth(0);
    const secondCard = page.locator('.dx-cardview-card').nth(1);

    await firstCheckbox.click();
    await expect(firstCard).toHaveClass(/dx-selection/);

    await secondCheckbox.click();
    await expect(firstCard).toHaveClass(/dx-selection/);
    await expect(secondCard).toHaveClass(/dx-selection/);

    await firstCheckbox.click();
    await expect(firstCard).not.toHaveClass(/dx-selection/);
    await expect(secondCard).toHaveClass(/dx-selection/);

    await secondCheckbox.click();
    await expect(secondCard).not.toHaveClass(/dx-selection/);
  });

  test('Select all when selectAllMode = allPages', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true, selectAllMode: 'allPages' },
    });

    await page.locator('.dx-cardview-select-all-button').click();

    const selectedKeys = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').getSelectedCardKeys();
    });
    expect(selectedKeys).toEqual([0, 1, 2, 3, 4]);
  });
});
