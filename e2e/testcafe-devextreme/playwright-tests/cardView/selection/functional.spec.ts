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
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);

    await secondCard.click();
    await expect(firstCard).not.toHaveClass(/dx-cardview-card-selection/);
    await expect(secondCard).toHaveClass(/dx-cardview-card-selection/);

    await secondCard.click({ modifiers: ['Control'] });
    await expect(secondCard).not.toHaveClass(/dx-cardview-card-selection/);
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
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);

    await secondCheckbox.click();
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);
    await expect(secondCard).toHaveClass(/dx-cardview-card-selection/);

    await firstCheckbox.click();
    await expect(firstCard).not.toHaveClass(/dx-cardview-card-selection/);
    await expect(secondCard).toHaveClass(/dx-cardview-card-selection/);

    await secondCheckbox.click();
    await expect(secondCard).not.toHaveClass(/dx-cardview-card-selection/);
  });

  test("Multiple mode with showCheckBoxesMode='always': select cards with shift", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true },
    });

    const firstCheckbox = page.locator('.dx-cardview-card').nth(0).locator('.dx-checkbox');
    const thirdCheckbox = page.locator('.dx-cardview-card').nth(2).locator('.dx-checkbox');
    const firstCard = page.locator('.dx-cardview-card').nth(0);
    const secondCard = page.locator('.dx-cardview-card').nth(1);
    const thirdCard = page.locator('.dx-cardview-card').nth(2);

    await firstCheckbox.click();
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);

    await thirdCheckbox.click({ modifiers: ['Shift'] });
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);
    await expect(secondCard).toHaveClass(/dx-cardview-card-selection/);
    await expect(thirdCard).toHaveClass(/dx-cardview-card-selection/);

    await firstCheckbox.click({ modifiers: ['Shift'] });
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);
    await expect(secondCard).not.toHaveClass(/dx-cardview-card-selection/);
    await expect(thirdCard).not.toHaveClass(/dx-cardview-card-selection/);
  });

  test("Multiple mode with showCheckBoxesMode='onClick': select a first card by clicking a card -> deselect a first card by clicking a card", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'onClick', allowSelectAll: true },
    });

    const firstCard = page.locator('.dx-cardview-card').nth(0);

    await firstCard.click();
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);

    await firstCard.click({ modifiers: ['Control'] });
    await expect(firstCard).not.toHaveClass(/dx-cardview-card-selection/);
  });

  test("Multiple mode with showCheckBoxesMode='onClick': select first card -> select second card -> select first card with ctrl", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'onClick', allowSelectAll: true },
    });

    const firstCard = page.locator('.dx-cardview-card').nth(0);
    const secondCard = page.locator('.dx-cardview-card').nth(1);

    await firstCard.click();
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);

    await secondCard.click();
    await expect(firstCard).not.toHaveClass(/dx-cardview-card-selection/);
    await expect(secondCard).toHaveClass(/dx-cardview-card-selection/);

    await firstCard.click({ modifiers: ['Control'] });
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);
    await expect(secondCard).toHaveClass(/dx-cardview-card-selection/);
  });

  test("Select all when selectAllMode = 'allPages'", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true, selectAllMode: 'allPages' },
    });

    await page.locator('[aria-label="Select all"]').click();

    const selectedKeys = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').getSelectedCardKeys();
    });
    expect(selectedKeys).toEqual([0, 1, 2, 3, 4]);
  });

  test("Deselect all when selectAllMode = 'allPages'", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selectedCardKeys: [0, 1, 2, 3, 4],
      selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true, selectAllMode: 'allPages' },
    });

    await page.locator('[aria-label="Clear selection"]').click();

    const selectedKeys = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').getSelectedCardKeys();
    });
    expect(selectedKeys).toEqual([]);
  });

  test("Select all when selectAllMode = 'page'", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      paging: { pageSize: 3 },
      selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true, selectAllMode: 'page' },
    });

    await page.locator('[aria-label="Select all"]').click();

    const selectedKeys = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').getSelectedCardKeys();
    });
    expect(selectedKeys).toEqual([0, 1, 2]);
  });

  test("Deselect all when selectAllMode = 'page'", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      paging: { pageSize: 3 },
      selectedCardKeys: [0, 1, 2],
      selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true, selectAllMode: 'page' },
    });

    await page.locator('[aria-label="Clear selection"]').click();

    const selectedKeys = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').getSelectedCardKeys();
    });
    expect(selectedKeys).toEqual([]);
  });

  test("Switching the showCheckBoxesMode option from onClick to always at runtime should work correctly", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' },
    });

    const checkboxes = page.locator('.dx-cardview-card .dx-checkbox');
    await expect(checkboxes.first()).not.toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('selection.showCheckBoxesMode', 'always');
    });

    await expect(checkboxes.first()).toBeVisible();

    const firstCard = page.locator('.dx-cardview-card').nth(0);
    await firstCard.click();
    await expect(firstCard).not.toHaveClass(/dx-cardview-card-selection/);
  });

  test("Switching the showCheckBoxesMode option from always to onClick at runtime should work correctly", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: selectionData,
      cardHeader: { captionExpr: () => 'title' },
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
      selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
    });

    const checkboxes = page.locator('.dx-cardview-card .dx-checkbox');
    await expect(checkboxes.first()).toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('selection.showCheckBoxesMode', 'onClick');
    });

    await expect(checkboxes.first()).not.toBeVisible();

    const firstCard = page.locator('.dx-cardview-card').nth(0);
    await firstCard.click();
    await expect(firstCard).toHaveClass(/dx-cardview-card-selection/);

    const selectedKeys = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').getSelectedCardKeys();
    });
    expect(selectedKeys).toEqual([0]);
  });

  test('"Deselect all" should work after changing showCheckboxMode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
      keyExpr: 'a',
      selection: { mode: 'multiple' },
      selectedCardKeys: [1, 2],
    });

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('selection.showCheckBoxesMode', 'onClick');
    });

    await page.locator('[aria-label="Clear selection"]').click();

    for (let i = 0; i < 6; i++) {
      const isSelected = await page.locator('.dx-cardview-card').nth(i).evaluate(
        el => el.classList.contains('dx-cardview-card-selection')
      );
      expect(isSelected).toBe(false);
    }
  });
});
